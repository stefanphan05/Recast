import { groqProvider } from "../../src/lib/rewrite/providers/index";
import { testProvider } from "../lib/test-provider";

testProvider(groqProvider).catch((error) => {
  console.error(error);
  process.exit(1);
});
