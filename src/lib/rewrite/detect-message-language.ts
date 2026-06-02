import { type LanguageCode } from "./languages";

type LanguageScores = Partial<Record<LanguageCode, number>>;

/** High-signal function words per language (lowercase matching). */
const MARKER_WORDS: Partial<Record<LanguageCode, readonly string[]>> = {
  en: [
    "the",
    "and",
    "you",
    "your",
    "what",
    "that",
    "this",
    "with",
    "have",
    "are",
    "was",
    "were",
    "not",
    "but",
    "for",
    "just",
    "about",
    "even",
    "means",
    "please",
    "thanks",
    "hello",
    "sorry",
  ],
  es: [
    "el",
    "la",
    "los",
    "las",
    "que",
    "qué",
    "por",
    "para",
    "con",
    "estás",
    "estoy",
    "eso",
    "esta",
    "este",
    "como",
    "cómo",
    "gracias",
    "hola",
    "pero",
    "muy",
    "también",
    "demonios",
    "significa",
    "serio",
  ],
  fr: [
    "le",
    "la",
    "les",
    "des",
    "une",
    "un",
    "que",
    "qui",
    "pour",
    "avec",
    "est",
    "suis",
    "merci",
    "bonjour",
    "mais",
    "très",
    "pas",
    "vous",
    "nous",
  ],
  de: [
    "der",
    "die",
    "das",
    "und",
    "ist",
    "nicht",
    "mit",
    "für",
    "auf",
    "ich",
    "sie",
    "wir",
    "danke",
    "hallo",
    "aber",
    "auch",
    "sehr",
  ],
  it: [
    "il",
    "lo",
    "la",
    "gli",
    "che",
    "per",
    "con",
    "non",
    "sono",
    "grazie",
    "ciao",
    "molto",
    "anche",
    "questo",
    "questa",
  ],
  pt: [
    "que",
    "não",
    "com",
    "para",
    "uma",
    "um",
    "você",
    "obrigado",
    "olá",
    "muito",
    "também",
    "isso",
    "esta",
    "este",
  ],
  vi: [
    "không",
    "của",
    "được",
    "trong",
    "này",
    "đó",
    "với",
    "cho",
    "là",
    "có",
    "xin",
    "cảm",
    "ơn",
    "bạn",
    "tôi",
    "mình",
  ],
};

const SCRIPT_HINTS: { pattern: RegExp; language: LanguageCode; weight: number }[] =
  [
    { pattern: /[\u0400-\u04FF]/, language: "ru", weight: 8 },
    { pattern: /[\u0600-\u06FF]/, language: "ar", weight: 8 },
    { pattern: /[\u3040-\u30FF]/, language: "ja", weight: 8 },
    { pattern: /[\uAC00-\uD7AF]/, language: "ko", weight: 8 },
    { pattern: /[\u4E00-\u9FFF]/, language: "zh", weight: 8 },
    { pattern: /[\u0E00-\u0E7F]/, language: "th", weight: 8 },
    { pattern: /[\u0900-\u097F]/, language: "hi", weight: 8 },
    {
      pattern:
        /[ăâđêôơưáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i,
      language: "vi",
      weight: 10,
    },
    { pattern: /[ñ¿¡]/i, language: "es", weight: 4 },
    { pattern: /[äöüß]/i, language: "de", weight: 4 },
    { pattern: /[ąćęłńóśźż]/i, language: "pl", weight: 6 },
    { pattern: /[åäö]/i, language: "sv", weight: 4 },
    { pattern: /[іїєґ]/i, language: "uk", weight: 6 },
  ];

const WORD_RE = /[\p{L}\p{M}']+/gu;

function addScore(scores: LanguageScores, language: LanguageCode, points: number) {
  scores[language] = (scores[language] ?? 0) + points;
}

function scoreMarkerWords(text: string): LanguageScores {
  const scores: LanguageScores = {};
  const lower = text.toLowerCase();
  const tokens = new Set(lower.match(WORD_RE) ?? []);

  for (const [language, words] of Object.entries(MARKER_WORDS) as [
    LanguageCode,
    readonly string[],
  ][]) {
    for (const word of words) {
      if (tokens.has(word)) {
        addScore(scores, language, 2);
      }
    }
  }

  return scores;
}

function scoreScripts(text: string): LanguageScores {
  const scores: LanguageScores = {};
  for (const { pattern, language, weight } of SCRIPT_HINTS) {
    if (pattern.test(text)) {
      addScore(scores, language, weight);
    }
  }
  return scores;
}

function isMostlyLatinAscii(text: string): boolean {
  const letters = text.match(/\p{L}/gu);
  if (!letters?.length) return false;
  const latinAscii = letters.filter((ch) => ch.charCodeAt(0) <= 0x7f).length;
  return latinAscii / letters.length >= 0.95;
}

function mergeScores(...parts: LanguageScores[]): LanguageScores {
  const merged: LanguageScores = {};
  for (const part of parts) {
    for (const [lang, score] of Object.entries(part) as [LanguageCode, number][]) {
      addScore(merged, lang, score);
    }
  }
  return merged;
}

/**
 * Best-effort language guess for same-language rewrites.
 * Returns null when confidence is too low (caller should use generic prompt).
 */
export function detectMessageLanguage(text: string): LanguageCode | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const scores = mergeScores(scoreScripts(trimmed), scoreMarkerWords(trimmed));
  const ranked = (Object.entries(scores) as [LanguageCode, number][])
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  if (ranked.length === 0) {
    return isMostlyLatinAscii(trimmed) ? "en" : null;
  }

  const [topLang, topScore] = ranked[0];
  const secondScore = ranked[1]?.[1] ?? 0;

  if (topScore >= secondScore + 2 || topScore >= secondScore * 1.4) {
    return topLang;
  }

  if (isMostlyLatinAscii(trimmed)) {
    return "en";
  }

  return topScore > 0 ? topLang : null;
}
