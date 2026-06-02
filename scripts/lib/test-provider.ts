import type { RewriteInput } from "../../src/lib/rewrite/prompts";
import type { RewriteProvider } from "../../src/lib/rewrite/types";

const testInput: RewriteInput = {
  text: "i doesn't think this is gonna work lol",
  style: "grammar",
  genzIntensity: 5,
  flirtIntensity: 5,
};

export async function testProvider(provider: RewriteProvider): Promise<void> {
  console.log(`Testing ${provider.id} (grammar style)...\n`);

  if (!provider.isConfigured()) {
    console.log(`⏭  ${provider.id}: skipped (no API key)`);
    return;
  }

  const started = Date.now();
  try {
    const result = await provider.rewrite(testInput);
    const ms = Date.now() - started;
    console.log(`✅ ${provider.id}: OK (${ms}ms)`);
    console.log(`   → ${result.text}\n`);
  } catch (error) {
    const ms = Date.now() - started;
    const message = error instanceof Error ? error.message : String(error);
    const isQuota = /quota|rate.?limit|429|resource_exhausted/i.test(message);

    if (isQuota) {
      console.log(`⚠️  ${provider.id}: QUOTA/RATE LIMIT (${ms}ms)`);
      console.log(`   → ${message.slice(0, 200)}...\n`);
      return;
    }

    console.log(`❌ ${provider.id}: FAILED (${ms}ms)`);
    console.log(`   → ${message}\n`);
    process.exit(1);
  }
}
