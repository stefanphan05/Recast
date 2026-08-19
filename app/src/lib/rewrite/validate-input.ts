import {
  isCrossLanguageRewrite,
  isValidRewriteTarget,
  isValidSourceLanguage,
  SOURCE_LANGUAGE_AUTO,
  TARGET_LANGUAGE_SAME,
  type LanguageCode,
} from "./languages";
import {
  MAX_CUSTOM_MODE_LABEL_LENGTH,
  MAX_CUSTOM_MODE_PROMPT_LENGTH,
  isBuiltInStyle,
  isCustomStyleId,
  type RewriteStyle,
} from "./styles";
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
  /** Present when `style` is a user-defined mode. */
  customStyle?: { label: string; prompt: string };
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
  const customStyle = params.customStyle
    ? {
        label: String(params.customStyle.label ?? "").trim(),
        prompt: String(params.customStyle.prompt ?? "").trim(),
      }
    : undefined;

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

  if (customStyle) {
    if (!style || !isCustomStyleId(style)) {
      throw new ValidationError("Invalid custom rewrite mode.");
    }

    if (!customStyle.label || !customStyle.prompt) {
      throw new ValidationError("A custom mode needs a title and a prompt.");
    }

    if (customStyle.label.length > MAX_CUSTOM_MODE_LABEL_LENGTH) {
      throw new ValidationError(
        `Custom mode titles must be ${MAX_CUSTOM_MODE_LABEL_LENGTH} characters or less.`,
      );
    }

    if (customStyle.prompt.length > MAX_CUSTOM_MODE_PROMPT_LENGTH) {
      throw new ValidationError(
        `Custom mode prompts must be ${MAX_CUSTOM_MODE_PROMPT_LENGTH} characters or less.`,
      );
    }
  } else if (!style || !isBuiltInStyle(style)) {
    throw new ValidationError("Unknown rewrite mode.");
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
    ...(customStyle ? { customStyle } : {}),
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
