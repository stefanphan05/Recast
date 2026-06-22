import {
  isCrossLanguageRewrite,
  isValidRewriteTarget,
  isValidSourceLanguage,
  SOURCE_LANGUAGE_AUTO,
  TARGET_LANGUAGE_SAME,
  type LanguageCode,
} from "./languages";
import { ALLOWED_STYLES, type RewriteStyle } from "./styles";
import type { RewriteInput } from "./prompts";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

const MAX_TEXT_LENGTH = 2000;
const MAX_INSTRUCTIONS_LENGTH = 500;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export type ValidateRewriteParams = {
  text: string;
  style: RewriteStyle;
  genzIntensity?: number;
  flirtIntensity?: number;
  sourceLanguage: string;
  targetLanguage: string;
  instructions?: string;
};

export function validateRewriteParams(
  params: ValidateRewriteParams,
): RewriteInput {
  const text = String(params.text ?? "").trim();
  const style = params.style;
  const genzIntensity = clamp(Number(params.genzIntensity ?? 5), 0, 10);
  const flirtIntensity = clamp(Number(params.flirtIntensity ?? 5), 0, 10);
  const sourceLanguage = String(
    params.sourceLanguage ?? SOURCE_LANGUAGE_AUTO,
  ).trim();
  const targetLanguage = String(
    params.targetLanguage ?? TARGET_LANGUAGE_SAME,
  ).trim();
  const instructions = String(params.instructions ?? "").trim();

  if (text.length === 0) {
    throw new ValidationError("Text is required.");
  }

  if (text.length > MAX_TEXT_LENGTH) {
    throw new ValidationError(
      `Text must be ${MAX_TEXT_LENGTH} characters or less.`,
    );
  }

  if (instructions.length > MAX_INSTRUCTIONS_LENGTH) {
    throw new ValidationError(
      `Instructions must be ${MAX_INSTRUCTIONS_LENGTH} characters or less.`,
    );
  }

  if (!style || !ALLOWED_STYLES.includes(style)) {
    throw new ValidationError(
      `Style must be one of: ${ALLOWED_STYLES.join(", ")}.`,
    );
  }

  if (!isValidRewriteTarget(targetLanguage)) {
    throw new ValidationError("Invalid rewrite language.");
  }

  if (isCrossLanguageRewrite(targetLanguage)) {
    if (!isValidSourceLanguage(sourceLanguage)) {
      throw new ValidationError("Invalid input language.");
    }

    if (
      sourceLanguage !== SOURCE_LANGUAGE_AUTO &&
      sourceLanguage === targetLanguage
    ) {
      throw new ValidationError("Input and rewrite languages must differ.");
    }
  }

  return {
    text,
    style,
    genzIntensity,
    flirtIntensity,
    ...(instructions ? { instructions } : {}),
    ...(isCrossLanguageRewrite(targetLanguage)
      ? {
          sourceLanguage: sourceLanguage as
            | typeof SOURCE_LANGUAGE_AUTO
            | LanguageCode,
          targetLanguage: targetLanguage as LanguageCode,
        }
      : {}),
  };
}
