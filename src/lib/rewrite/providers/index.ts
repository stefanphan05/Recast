import { geminiProvider } from "./gemini";
import { createOpenAICompatibleProvider } from "./openai-compatible";
import { openRouterProvider } from "./openrouter";
import type { RewriteProvider } from "../types";

export const groqProvider = createOpenAICompatibleProvider({
  id: "groq",
  apiKeyEnv: "GROQ_API_KEY",
  baseUrl: "https://api.groq.com/openai/v1",
  modelEnv: "GROQ_MODEL",
  defaultModel: "llama-3.1-8b-instant",
});

export { openRouterProvider };

export const cerebrasProvider = createOpenAICompatibleProvider({
  id: "cerebras",
  apiKeyEnv: "CEREBRAS_API_KEY",
  baseUrl: "https://api.cerebras.ai/v1",
  modelEnv: "CEREBRAS_MODEL",
  defaultModel: "gpt-oss-120b",
  extraBody: {
    reasoning_effort: "low",
  },
});

const PROVIDERS_BY_ID: Record<string, RewriteProvider> = {
  gemini: geminiProvider,
  groq: groqProvider,
  openrouter: openRouterProvider,
  cerebras: cerebrasProvider,
};

export const ALL_PROVIDERS = Object.values(PROVIDERS_BY_ID);

export function resolveProviderOrder(): RewriteProvider[] {
  const orderEnv = process.env.REWRITE_PROVIDER_ORDER?.trim();
  const ids = orderEnv
    ? orderEnv.split(",").map((id) => id.trim().toLowerCase())
    : ["gemini", "groq", "openrouter"];

  const resolved: RewriteProvider[] = [];
  const seen = new Set<string>();

  for (const id of ids) {
    if (!id || seen.has(id)) continue;
    const provider = PROVIDERS_BY_ID[id];
    if (!provider) {
      console.warn(`Unknown rewrite provider "${id}" in REWRITE_PROVIDER_ORDER.`);
      continue;
    }
    seen.add(id);
    resolved.push(provider);
  }

  for (const provider of ALL_PROVIDERS) {
    if (!seen.has(provider.id)) {
      resolved.push(provider);
    }
  }

  return resolved;
}
