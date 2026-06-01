import type { RewriteInput } from "../prompts";
import { ProviderError, type RewriteProvider } from "../types";
import { createOpenAICompatibleProvider } from "./openai-compatible";

const OPENROUTER_MODELS = [
  process.env.OPENROUTER_MODEL?.trim(),
  "meta-llama/llama-3.2-3b-instruct:free",
  "qwen/qwen-2.5-7b-instruct:free",
  "openrouter/free",
].filter((model, index, list): model is string => {
  return Boolean(model) && list.indexOf(model) === index;
});

const sharedConfig = {
  id: "openrouter",
  apiKeyEnv: "OPENROUTER_API_KEY",
  baseUrl: "https://openrouter.ai/api/v1",
  modelEnv: "OPENROUTER_MODEL",
  defaultModel: OPENROUTER_MODELS[0] ?? "meta-llama/llama-3.2-3b-instruct:free",
  extraHeaders: {
    "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "https://localhost",
    "X-Title": process.env.OPENROUTER_APP_NAME ?? "Message Rewriter",
  },
  extraBody: {
    reasoning: { effort: "none", exclude: true },
  },
} as const;

function createProviderForModel(model: string): RewriteProvider {
  const inner = createOpenAICompatibleProvider({
    ...sharedConfig,
    id: `openrouter:${model}`,
    defaultModel: model,
  });

  return {
    id: "openrouter",
    isConfigured: inner.isConfigured,
    rewrite: inner.rewrite,
  };
}

export const openRouterProvider: RewriteProvider = {
  id: "openrouter",
  isConfigured() {
    return Boolean(process.env.OPENROUTER_API_KEY?.trim());
  },
  async rewrite(input: RewriteInput) {
    const failures: string[] = [];

    for (const model of OPENROUTER_MODELS) {
      try {
        return await createProviderForModel(model).rewrite(input);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        failures.push(`${model}: ${message}`);

        const retryable =
          error instanceof ProviderError ? error.retryable : true;
        if (!retryable) break;
      }
    }

    throw new ProviderError(
      "openrouter",
      failures.join(" | ") || "OpenRouter request failed.",
      { retryable: true },
    );
  },
};
