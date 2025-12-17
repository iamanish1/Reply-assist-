const MIN_WORDS = 35;
const MAX_WORDS = 95;

const emojiRegex = /\p{Extended_Pictographic}/gu;

function stripCodeFences(text) {
  return text.replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, '')).trim();
}

function stripLeadingMarkers(line) {
  return line.replace(/^\s*(?:\d+[\.\)]|[-*•])\s*/g, '').trim();
}

function stripSurroundingQuotes(line) {
  return line
    .replace(/^\s*["'“”]+/g, '')
    .replace(/["'“”]+\s*$/g, '')
    .trim();
}

function countWords(s) {
  const words = s.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function countSentences(s) {
  const matches = s.match(/[.!?]+/g) || [];
  return matches.length;
}

function keepMaxOneEmoji(s) {
  const matches = s.match(emojiRegex) || [];
  if (matches.length <= 1) return s;
  let seen = 0;
  return s.replace(emojiRegex, (m) => {
    seen += 1;
    return seen === 1 ? m : '';
  }).replace(/\s{2,}/g, ' ').trim();
}

function isUnsafeOrUnhelpful(s) {
  const t = s.toLowerCase();
  const bad = [
    'as an ai',
    'as a language model',
    "i can't",
    'i cannot',
    'i can not',
    'i won’t',
    "i won't",
    'cannot help',
    'here are some options',
    'advice',
    'analysis:',
    'explanation:'
  ];
  return bad.some((b) => t.includes(b));
}

function normalizeForDedupe(s) {
  return s
    .toLowerCase()
    .replace(emojiRegex, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function toneFallbacks(toneRaw) {
  void toneRaw;
  return [
    // Best (balanced)
    'You’re right, I replied late and I’m sorry. I got caught up and didn’t mean to ignore you. I’ll be more mindful and respond sooner from now.',
    // Softer (gentle)
    'Sorry yaar, I know that must’ve felt bad. I got a bit overwhelmed and the reply got delayed, but you do matter to me. I’ll make sure I respond quicker.',
    // Firmer (direct, not rude)
    'I hear you. I wasn’t trying to ignore you, but I can’t always reply instantly. I’ll try to be faster, and I’d appreciate a little patience too.'
  ];
}

function tryParseJsonReplies(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    if (trimmed.startsWith('[')) {
      const arr = JSON.parse(trimmed);
      if (Array.isArray(arr)) return arr.filter((x) => typeof x === 'string');
    }
    if (trimmed.startsWith('{')) {
      const obj = JSON.parse(trimmed);
      if (Array.isArray(obj?.replies)) {
        return obj.replies.filter((x) => typeof x === 'string');
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function cleanReplies(rawText, { tone } = {}) {
  const safeText = stripCodeFences(String(rawText ?? '')).trim();

  const fromJson = tryParseJsonReplies(safeText);
  const candidates = fromJson ?? safeText.split(/\r?\n/);

  const seen = new Set();
  const cleaned = [];

  for (const item of candidates) {
    if (cleaned.length >= 3) break;

    let line = String(item ?? '').trim();
    if (!line) continue;

    line = stripLeadingMarkers(line);
    line = stripSurroundingQuotes(line);
    line = line.replace(/\s+/g, ' ').trim();
    if (!line) continue;

    line = keepMaxOneEmoji(line);
    if (!line) continue;

    if (isUnsafeOrUnhelpful(line)) continue;

    const words = countWords(line);
    if (words > MAX_WORDS) continue;
    if (words < MIN_WORDS) continue;

    // Prefer 2–4 sentences; allow missing punctuation but reject overly long walls.
    const sentences = countSentences(line);
    if (sentences > 5) continue;

    const key = normalizeForDedupe(line);
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);

    cleaned.push(line);
  }

  const fallbacks = toneFallbacks(tone);
  for (const fb of fallbacks) {
    if (cleaned.length >= 3) break;
    const key = normalizeForDedupe(fb);
    if (!seen.has(key)) {
      seen.add(key);
      cleaned.push(fb);
    }
  }

  return cleaned.slice(0, 3);
}


