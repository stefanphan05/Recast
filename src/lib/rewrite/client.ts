import type { RewriteStyle } from "./styles";
import { DEFAULT_OLLAMA_MODEL, OllamaError, rewriteWithOllama } from "./ollama";
import {
  validateRewriteParams,
  ValidationError,
} from "./validate-input";

const SERVER_ERROR_MESSAGE = "Server error. Please try again later.";

export type RewriteRequest = {
  text: string;
  style: RewriteStyle;
  genzIntensity?: number;
  flirtIntensity?: number;
  sourceLanguage: string;
  targetLanguage: string;
  instructions?: string;
};

export async function requestRewrite(
  params: RewriteRequest,
  model: string = DEFAULT_OLLAMA_MODEL,
): Promise<string> {
  const input = validateRewriteParams(params);
  return rewriteWithOllama(input, model);
}

export function rewriteErrorMessage(error: unknown): string {
  if (error instanceof ValidationError || error instanceof OllamaError) {
    return error.message;
  }

  return SERVER_ERROR_MESSAGE;
}
