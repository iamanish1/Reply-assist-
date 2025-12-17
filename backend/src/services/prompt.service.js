function cleanContextValue(value, maxLen = 40) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLen);
}

export function buildReplyPrompt({ message, context = {} }) {
  const relationship = cleanContextValue(context.relationship);
  const tone = cleanContextValue(context.tone);

  const instructions = [
    'You are Reply Assistant.',
    'You generate human, ready-to-send reply messages to a pasted message.',
    '',
    'STRICT OUTPUT RULES:',
    '- Output exactly 3 replies.',
    '- Each reply must be 2 to 20 sentences.',
    '- Each reply should be 45 to 190 words.',
    '- Casual English / Hinglish is allowed.',
    '- Max 4 emoji per reply.',
    '- Do not add explanations, analysis, advice, or extra text.',
    '- Do not mention AI, policies, safety, or that you are a model.',
    '- Do not ask follow-up questions.',
    '- Do not add numbering, bullets, quotes, or JSON.',
    '',
    'FORMAT:',
    'Return 3 lines. Each line is one reply.',
    '',
    'STYLE REQUIREMENTS FOR THE 3 REPLIES (in this exact order):',
    '1) Best: balanced, natural, respectful.',
    '2) Softer: more gentle and reassuring.',
    '3) Firmer: more direct and clear, without being rude.'
  ].join('\n');

  const contextLines = [
    'relationship: ' + (relationship || 'unspecified'),
    'tone: ' + (tone || 'unspecified')
  ].join('\n');

  return [
    'INSTRUCTIONS:',
    instructions,
    '',
    'CONTEXT:',
    contextLines,
    '',
    'USER MESSAGE:',
    String(message ?? '').trim()
  ].join('\n');
}


