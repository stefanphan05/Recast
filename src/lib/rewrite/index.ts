import { resolveProviderOrder } from "./providers";
import type { RewriteInput } from "./prompts";
import { ProviderError, type RewriteResult } from "./types";

export type { RewriteInput, RewriteStyle } from "./prompts";
export { ALLOWED_STYLES } from "./prompts";
export {
  LANGUAGES,
  SOURCE_LANGUAGE_AUTO,
  TARGET_LANGUAGE_SAME,
  isCrossLanguageRewrite,
  isLanguageCode,
  isValidRewriteTarget,
  isValidSourceLanguage,
  languageLabel,
  type LanguageCode,
} from "./languages";

export async function rewriteWithFallback(
  input: RewriteInput,
): Promise<RewriteResult> {
  const providers = resolveProviderOrder().filter((p) => p.isConfigured());

  if (providers.length === 0) {
    throw new Error(
      "No AI providers configured. Set at least one of: GEMINI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY, CEREBRAS_API_KEY.",
    );
  }

  const failures: string[] = [];

  for (const provider of providers) {
    try {
      const result = await provider.rewrite(input);
      console.info(`Rewrite succeeded via ${provider.id}.`);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown provider error.";
      failures.push(`${provider.id}: ${message}`);

      const retryable =
        error instanceof ProviderError ? error.retryable : true;

      console.warn(
        `Rewrite failed via ${provider.id} (retryable=${retryable}):`,
        error,
      );
    }
  }

  throw new Error(
    `All configured providers failed.\n${failures.join("\n")}`,
  );
}
