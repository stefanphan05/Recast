import { GoogleGenAI } from "@google/genai";
import {
  buildUserPrompt,
  maxOutputTokens,
  SYSTEM_INSTRUCTION,
  type RewriteInput,
} from "../prompts";
import { sanitizeRewriteOutput } from "../sanitize-output";
import { ProviderError, type RewriteProvider } from "../types";

const DEFAULT_MODEL = "gemini-2.5-flash";

function getModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new ProviderError("gemini", "GEMINI_API_KEY is missing.", {
      retryable: false,
    });
  }
  return new GoogleGenAI({ apiKey });
}

function isRetryableGeminiError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error);

  return (
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("rate") ||
    message.includes("resource_exhausted") ||
    message.includes("unavailable") ||
    message.includes("overloaded") ||
    message.includes("503") ||
    message.includes("500")
  );
}

export const geminiProvider: RewriteProvider = {
  id: "gemini",
  isConfigured() {
    return Boolean(process.env.GEMINI_API_KEY?.trim());
  },
  async rewrite(input: RewriteInput) {
    try {
      const ai = getClient();
      const response = await ai.models.generateContent({
        model: getModel(),
        contents: buildUserPrompt(input),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingBudget: 0 },
          temperature: 0.2,
          maxOutputTokens: maxOutputTokens(input.text.length),
        },
      });

      const raw = response.text?.trim();
      if (!raw) {
        throw new ProviderError("gemini", "Model returned empty rewrite.", {
          retryable: true,
        });
      }

      const rewritten = sanitizeRewriteOutput(raw, input.text);
      if (!rewritten) {
        throw new ProviderError("gemini", "Model returned empty rewrite.", {
          retryable: true,
        });
      }

      return { text: rewritten };
    } catch (error) {
      if (error instanceof ProviderError) {
        throw error;
      }

      throw new ProviderError(
        "gemini",
        error instanceof Error ? error.message : "Gemini request failed.",
        { retryable: isRetryableGeminiError(error), cause: error },
      );
    }
  },
};
