import { geminiProvider } from "../../src/lib/rewrite/providers/gemini";
import { testProvider } from "../lib/test-provider";

testProvider(geminiProvider).catch((error) => {
  console.error(error);
  process.exit(1);
});
