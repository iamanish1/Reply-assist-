const clamp = (s, max) => (s.length <= max ? s : `${s.slice(0, max - 1).trim()}…`);

export function generateReplies({ pastedText, context }) {
  const rel = context?.relationship || 'Personal';
  const mood = context?.mood || 'Neutral';

  const base = [
    {
      tone: 'Calm',
      text: 'Sorry yaar, thoda busy tha. Tum important ho ❤️',
    },
    {
      tone: 'Honest',
      text: "I know I replied late, didn’t mean to ignore you.",
    },
    {
      tone: 'Short',
      text: 'Sorry 😔 won’t happen again.',
    },
  ];

  if (rel === 'Work') {
    return [
      { tone: 'Polite', text: 'Sorry for the delay. I’ll get back to you shortly.' },
      { tone: 'Clear', text: 'Noted. I’ll share an update by today EOD.' },
      { tone: 'Short', text: 'Apologies for the delay. On it.' },
    ];
  }

  if (mood === 'Angry') {
    return [
      { tone: 'Calm', text: 'I get it. You’re right to be upset. Sorry yaar.' },
      { tone: 'Honest', text: 'I messed up with the late reply. I’ll be better.' },
      { tone: 'Short', text: 'Sorry. I hear you.' },
    ];
  }

  // Light personalization: if message is very long, keep replies extra short.
  if ((pastedText || '').trim().length > 240) {
    return base.map((r) => ({ ...r, text: clamp(r.text, 55) }));
  }

  return base;
}

export function makeRepliesSofter(replies) {
  return (replies || []).map((r) => {
    if (r.tone === 'Short') return r;
    const softened = r.text
      .replace(/^sorry/i, "Sorry yaar,")
      .replace("didn’t mean to ignore you", "didn’t mean to ignore you, promise");
    return { ...r, text: clamp(softened, 90) };
  });
}

export function makeRepliesShorter(replies) {
  return (replies || []).map((r) => {
    const shorter = r.text
      .replace(/,?\s*thoda busy tha\.?/i, '')
      .replace(/promise/i, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    return { ...r, text: clamp(shorter, 55) };
  });
}


