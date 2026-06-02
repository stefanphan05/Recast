import {
  languageLabel,
  SOURCE_LANGUAGE_AUTO,
  type LanguageCode,
} from "./languages";
import { type RewriteStyle } from "./styles";

export { ALLOWED_STYLES, type RewriteStyle } from "./styles";

export type RewriteInput = {
  text: string;
  style: RewriteStyle;
  genzIntensity: number;
  sourceLanguage?: typeof SOURCE_LANGUAGE_AUTO | LanguageCode;
  targetLanguage?: LanguageCode;
  /** Optional user guidance (e.g. email tone, audience). Omitted when empty. */
  instructions?: string;
};

export const REWRITE_SYSTEM_INSTRUCTION =
  "You rewrite short messages. Output ONLY the rewritten message text. No explanations, no reasoning, no labels, no quotes, no markdown, no 'Fixed:' or 'Original:' lines.";

/** @deprecated Use buildSystemInstruction */
export const SYSTEM_INSTRUCTION = REWRITE_SYSTEM_INSTRUCTION;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function buildGenzInstruction(
  genzIntensity: number,
  targetLanguage?: LanguageCode,
): string {
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

function buildStyleInstruction(
  style: RewriteStyle,
  genzIntensity: number,
  targetLanguage?: LanguageCode,
): string {
  const inLanguage = targetLanguage
    ? ` Write the result in ${languageLabel(targetLanguage)}.`
    : "";

  if (style === "genz") {
    return buildGenzInstruction(genzIntensity, targetLanguage);
  }

  const instructions: Record<Exclude<RewriteStyle, "genz">, string> = {
    grammar: `Fix grammar, spelling, and punctuation only. Keep the same tone, length, and wording as much as possible.${inLanguage}`,
    shorter: `Make the message shorter and more concise while preserving the full meaning and intent.${inLanguage}`,
    longer: `Expand the message with a bit more detail and clarity while keeping the same intent.${inLanguage}`,
    casual: `Use friendly, natural casual wording while staying respectful.${inLanguage}`,
    formal: `Use formal, professional wording that is clear and polite.${inLanguage}`,
    friendly: `Use warm, approachable wording that sounds genuinely friendly.${inLanguage}`,
    direct: `Be direct and to the point. Remove filler while staying respectful.${inLanguage}`,
    persuasive: `Make the message more compelling and convincing while staying honest.${inLanguage}`,
    polite: `Maximize politeness and courtesy while keeping the request clear.${inLanguage}`,
  };

  return instructions[style];
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

function buildInstructionsBlock(instructions: string | undefined): string | null {
  const trimmed = instructions?.trim();
  if (!trimmed) return null;
  return `Additional instructions (follow these while rewriting):\n${trimmed}`;
}

export function buildUserPrompt(input: RewriteInput): string {
  const languageBlock = buildLanguageInstruction(input);
  const instructionsBlock = buildInstructionsBlock(input.instructions);
  const styleBlock = `Style: ${input.style}\n${buildStyleInstruction(
    input.style,
    input.genzIntensity,
    input.targetLanguage,
  )}`;

  const blocks = [languageBlock, instructionsBlock, styleBlock].filter(
    (block): block is string => block !== null,
  );

  return `${blocks.join("\n\n")}\n\nMessage:\n${input.text}`;
}

export function maxOutputTokens(textLength: number): number {
  return Math.min(256, Math.max(48, textLength * 2 + 32));
}
