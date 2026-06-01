import {
  languageLabel,
  SOURCE_LANGUAGE_AUTO,
  type LanguageCode,
} from "./languages";

export const ALLOWED_STYLES = [
  "grammar",
  "shorter",
  "formal",
  "casual",
  "genz",
] as const;

export type RewriteStyle = (typeof ALLOWED_STYLES)[number];

export type RewriteInput = {
  text: string;
  style: RewriteStyle;
  genzIntensity: number;
  sourceLanguage?: typeof SOURCE_LANGUAGE_AUTO | LanguageCode;
  targetLanguage?: LanguageCode;
};

export const REWRITE_SYSTEM_INSTRUCTION =
  "You rewrite short messages. Output ONLY the rewritten message text. No explanations, no reasoning, no labels, no quotes, no markdown, no 'Fixed:' or 'Original:' lines.";

/** @deprecated Use buildSystemInstruction */
export const SYSTEM_INSTRUCTION = REWRITE_SYSTEM_INSTRUCTION;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function buildStyleInstruction(
  style: RewriteStyle,
  genzIntensity: number,
  targetLanguage?: LanguageCode,
): string {
  const inLanguage = targetLanguage
    ? ` Write the result in ${languageLabel(targetLanguage)}.`
    : "";

  if (style === "grammar") {
    return `Fix grammar, spelling, and punctuation only. Keep the same tone, length, and wording as much as possible.${inLanguage}`;
  }

  if (style === "shorter") {
    return `Make the message shorter and more concise while preserving the full meaning and intent.${inLanguage}`;
  }

  if (style === "formal") {
    return `Use formal, professional wording that is clear and polite.${inLanguage}`;
  }

  if (style === "casual") {
    return `Use friendly, natural casual wording while staying respectful.${inLanguage}`;
  }

  const intensity = clamp(genzIntensity, 0, 10);
  const lang = targetLanguage
    ? languageLabel(targetLanguage)
    : "the message language";

  if (intensity <= 2) {
    return `Use mostly standard ${lang} with only a light modern vibe.`;
  }

  if (intensity <= 5) {
    return `Use modern Gen Z-friendly ${lang} tone with some slang, but keep it broadly understandable.`;
  }

  if (intensity <= 8) {
    return `Use clearly Gen Z-style phrasing and slang in ${lang} while preserving clarity.`;
  }

  return `Use strong Gen Z slang and internet-style vibe in ${lang}, but keep the sentence understandable.`;
}

function buildLanguageInstruction(input: RewriteInput): string | null {
  if (!input.targetLanguage) return null;

  const source =
    input.sourceLanguage === SOURCE_LANGUAGE_AUTO || !input.sourceLanguage
      ? "Detect the input language from the message."
      : `Input language: ${languageLabel(input.sourceLanguage)}.`;
  const target = `Rewrite the message into ${languageLabel(input.targetLanguage)}.`;
  const note =
    "Apply the style below while rewriting—this is a message rewrite in the target language, not a literal word-for-word translation.";

  return `${source}\n${target}\n${note}`;
}

export function buildSystemInstruction(_input: RewriteInput): string {
  return REWRITE_SYSTEM_INSTRUCTION;
}

export function buildUserPrompt(input: RewriteInput): string {
  const languageBlock = buildLanguageInstruction(input);
  const styleBlock = `Style: ${input.style}\n${buildStyleInstruction(
    input.style,
    input.genzIntensity,
    input.targetLanguage,
  )}`;

  if (languageBlock) {
    return `${languageBlock}\n\n${styleBlock}\n\nMessage:\n${input.text}`;
  }

  return `${styleBlock}\n\nMessage:\n${input.text}`;
}

export function maxOutputTokens(textLength: number): number {
  return Math.min(256, Math.max(48, textLength * 2 + 32));
}
