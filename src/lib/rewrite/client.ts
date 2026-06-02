import type { RewriteStyle } from "./styles";

const SERVER_ERROR_MESSAGE = "Server error. Please try again later.";
const RATE_LIMIT_MESSAGE =
  "Too many requests. Please wait a moment and try again.";

export type RewriteRequest = {
  text: string;
  style: RewriteStyle;
  genzIntensity?: number;
  sourceLanguage: string;
  targetLanguage: string;
  instructions?: string;
};

export async function requestRewrite(
  params: RewriteRequest,
): Promise<string> {
  const response = await fetch("/api/rewrite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: params.text,
      style: params.style,
      ...(params.style === "genz" && params.genzIntensity != null
        ? { genzIntensity: params.genzIntensity }
        : {}),
      sourceLanguage: params.sourceLanguage,
      targetLanguage: params.targetLanguage,
      ...(params.instructions ? { instructions: params.instructions } : {}),
    }),
  });

  const data = (await response.json()) as {
    text?: string;
    message?: string;
  };

  if (!response.ok) {
    if (response.status === 400 && data.message) {
      const validationError = new Error(data.message);
      validationError.name = "ValidationError";
      throw validationError;
    }
    if (response.status === 429) {
      const rateLimitError = new Error(data.message ?? RATE_LIMIT_MESSAGE);
      rateLimitError.name = "RateLimitError";
      throw rateLimitError;
    }
    throw new Error(SERVER_ERROR_MESSAGE);
  }

  const rewritten = data.text?.trim();
  if (!rewritten) {
    throw new Error(SERVER_ERROR_MESSAGE);
  }

  return rewritten;
}

export function rewriteErrorMessage(error: unknown): string {
  const isKnownError =
    error instanceof Error &&
    (error.name === "ValidationError" || error.name === "RateLimitError");
  return isKnownError && error instanceof Error
    ? error.message
    : SERVER_ERROR_MESSAGE;
}
