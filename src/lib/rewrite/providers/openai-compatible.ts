import {
  buildUserPrompt,
  maxOutputTokens,
  SYSTEM_INSTRUCTION,
  type RewriteInput,
} from "../prompts";
import { sanitizeRewriteOutput } from "../sanitize-output";
import { ProviderError, type RewriteProvider } from "../types";

type OpenAICompatibleConfig = {
  id: string;
  apiKeyEnv: string;
  baseUrl: string;
  modelEnv: string;
  defaultModel: string;
  extraHeaders?: Record<string, string>;
  extraBody?: Record<string, unknown>;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
      reasoning?: string | null;
    };
  }>;
  error?: {
    message?: string;
    metadata?: { raw?: string };
  };
};

function formatApiError(
  payload: ChatCompletionResponse,
  status: number,
): string {
  const raw = payload.error?.metadata?.raw;
  const message = payload.error?.message;
  if (raw && message && raw !== message) {
    return `${message}: ${raw}`;
  }
  return raw ?? message ?? `Provider request failed (${status}).`;
}

function extractAssistantText(
  payload: ChatCompletionResponse,
): string | undefined {
  return payload.choices?.[0]?.message?.content?.trim() || undefined;
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 402 || status === 408 || status >= 500;
}

export function createOpenAICompatibleProvider(
  config: OpenAICompatibleConfig,
): RewriteProvider {
  return {
    id: config.id,
    isConfigured() {
      return Boolean(process.env[config.apiKeyEnv]?.trim());
    },
    async rewrite(input: RewriteInput) {
      const apiKey = process.env[config.apiKeyEnv]?.trim();
      if (!apiKey) {
        throw new ProviderError(config.id, `${config.apiKeyEnv} is missing.`, {
          retryable: false,
        });
      }

      const model =
        process.env[config.modelEnv]?.trim() || config.defaultModel;

      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          ...config.extraHeaders,
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: maxOutputTokens(input.text.length),
          messages: [
            { role: "system", content: SYSTEM_INSTRUCTION },
            { role: "user", content: buildUserPrompt(input) },
          ],
          ...config.extraBody,
        }),
      });

      let payload: ChatCompletionResponse;
      try {
        payload = (await response.json()) as ChatCompletionResponse;
      } catch (cause) {
        throw new ProviderError(
          config.id,
          "Invalid response from provider.",
          { retryable: true, status: response.status, cause },
        );
      }

      if (!response.ok) {
        const message = formatApiError(payload, response.status);
        throw new ProviderError(config.id, message, {
          retryable: isRetryableStatus(response.status),
          status: response.status,
        });
      }

      const raw = extractAssistantText(payload);
      if (!raw) {
        throw new ProviderError(config.id, "Model returned empty rewrite.", {
          retryable: true,
          status: response.status,
        });
      }

      const rewritten = sanitizeRewriteOutput(raw, input.text);
      if (!rewritten) {
        throw new ProviderError(config.id, "Model returned empty rewrite.", {
          retryable: true,
          status: response.status,
        });
      }

      return { text: rewritten };
    },
  };
}
