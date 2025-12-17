const containsAny = (text, words) => words.some((w) => text.includes(w));

export function inferContextFromText(raw) {
  const text = (raw || '').toLowerCase();

  const relationship = containsAny(text, ['sir', 'maam', 'manager', 'client', 'deadline'])
    ? 'Work'
    : 'Personal';

  const mood = containsAny(text, ['angry', 'pissed', 'ghussa', '😡'])
    ? 'Angry'
    : containsAny(text, ['late', 'reply', 'seen', 'ignore', 'ignored', 'upset', 'hurt', '😔'])
      ? 'Upset'
      : 'Neutral';

  const situation = 'Complaint';

  return { relationship, mood, situation };
}


