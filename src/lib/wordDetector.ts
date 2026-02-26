function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/['']/g, "'").replace(/[""]/g, '"').trim();
}

export function detectWords(
  transcript: string,
  cardWords: string[],
  alreadyFilled: Set<string>,
): string[] {
  const normalized = normalizeText(transcript);
  const detected: string[] = [];

  for (const word of cardWords) {
    if (alreadyFilled.has(word.toLowerCase())) continue;
    const nWord = normalizeText(word);
    if (nWord.includes(' ')) {
      if (normalized.includes(nWord)) detected.push(word);
    } else {
      if (new RegExp(`\\b${escapeRegex(nWord)}\\b`, 'i').test(normalized)) detected.push(word);
    }
  }

  return detected;
}

export const WORD_ALIASES: Record<string, string[]> = {
  'ci/cd': ['ci cd', 'cicd', 'continuous integration'],
  'mvp': ['minimum viable product', 'm.v.p.'],
  'roi': ['return on investment', 'r.o.i.'],
  'api': ['a.p.i.'],
  'devops': ['dev ops', 'dev-ops'],
  'a/b test': ['a b test', 'ab test', 'split test'],
};

export function detectWordsWithAliases(
  transcript: string,
  cardWords: string[],
  alreadyFilled: Set<string>,
): string[] {
  const detected = detectWords(transcript, cardWords, alreadyFilled);
  const normalized = normalizeText(transcript);

  for (const word of cardWords) {
    if (alreadyFilled.has(word.toLowerCase()) || detected.includes(word)) continue;
    const aliases = WORD_ALIASES[word.toLowerCase()];
    if (aliases?.some(alias => normalized.includes(alias))) {
      detected.push(word);
    }
  }

  return detected;
}
