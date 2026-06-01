import { cerebrasProvider } from "../../src/lib/rewrite/providers/index";
import { testProvider } from "../lib/test-provider";

testProvider(cerebrasProvider).catch((error) => {
  console.error(error);
  process.exit(1);
});
