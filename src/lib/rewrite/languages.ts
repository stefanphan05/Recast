export const SOURCE_LANGUAGE_AUTO = "auto" as const;

/** Keep output in the same language as the input. */
export const TARGET_LANGUAGE_SAME = "same" as const;

/** Curated languages for cross-language rewrite. */
export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
  { code: "nl", label: "Dutch" },
  { code: "pl", label: "Polish" },
  { code: "ru", label: "Russian" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "zh", label: "Chinese" },
  { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" },
  { code: "tr", label: "Turkish" },
  { code: "vi", label: "Vietnamese" },
  { code: "th", label: "Thai" },
  { code: "id", label: "Indonesian" },
  { code: "sv", label: "Swedish" },
  { code: "uk", label: "Ukrainian" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

const LANGUAGE_CODES = new Set<string>(LANGUAGES.map((l) => l.code));

export function isLanguageCode(code: string): code is LanguageCode {
  return LANGUAGE_CODES.has(code);
}

export function languageLabel(code: LanguageCode): string {
  return LANGUAGES.find((l) => l.code === code)?.label ?? code;
}

export function isValidSourceLanguage(code: string): boolean {
  return code === SOURCE_LANGUAGE_AUTO || isLanguageCode(code);
}

export function isValidRewriteTarget(code: string): boolean {
  return code === TARGET_LANGUAGE_SAME || isLanguageCode(code);
}

export function isCrossLanguageRewrite(targetLanguage: string): boolean {
  return targetLanguage !== TARGET_LANGUAGE_SAME && isLanguageCode(targetLanguage);
}
