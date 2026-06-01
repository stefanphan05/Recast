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
};

export const SYSTEM_INSTRUCTION =
  "You rewrite short messages. Output ONLY the rewritten message text. No explanations, no reasoning, no labels, no quotes, no markdown, no 'Fixed:' or 'Original:' lines.";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function buildStyleInstruction(
  style: RewriteStyle,
  genzIntensity: number,
): string {
  if (style === "grammar") {
    return "Fix grammar, spelling, and punctuation only. Keep the same tone, length, and wording as much as possible.";
  }

  if (style === "shorter") {
    return "Make the message shorter and more concise while preserving the full meaning and intent.";
  }

  if (style === "formal") {
    return "Use formal, professional wording that is clear and polite.";
  }

  if (style === "casual") {
    return "Use friendly, natural casual wording while staying respectful.";
  }

  const intensity = clamp(genzIntensity, 0, 10);

  if (intensity <= 2) {
    return "Use mostly standard English with only a light modern vibe.";
  }

  if (intensity <= 5) {
    return "Use modern Gen Z-friendly tone with some slang, but keep it broadly understandable.";
  }

  if (intensity <= 8) {
    return "Use clearly Gen Z-style phrasing and slang while preserving clarity.";
  }

  return "Use strong Gen Z slang and internet-style vibe, but keep the sentence understandable.";
}

export function buildUserPrompt(input: RewriteInput): string {
  return `Style: ${input.style}\n${buildStyleInstruction(input.style, input.genzIntensity)}\n\nMessage:\n${input.text}`;
}

export function maxOutputTokens(textLength: number): number {
  return Math.min(256, Math.max(48, textLength * 2 + 32));
}
