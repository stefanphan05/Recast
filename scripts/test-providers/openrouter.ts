import { openRouterProvider } from "../../src/lib/rewrite/providers/index";
import { testProvider } from "../lib/test-provider";

testProvider(openRouterProvider).catch((error) => {
  console.error(error);
  process.exit(1);
});
