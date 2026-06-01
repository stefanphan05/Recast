import { sanitizeRewriteOutput } from "./sanitize-output";

const sample = `Okay, the user wants me to rewrite their message with better English. Let me look at the original message: "i doesn't think this is gonna work lol". 

First, "i" should be capitalized to "I". Next, "doesn't" is incorrect because "I" is the subject, so it should be "don't think". 

Original: "i doesn't think this is gonna work lol"
Fixed: "I don't think this is going to work lol."`;

const result = sanitizeRewriteOutput(
  sample,
  "i doesn't think this is gonna work lol",
);

if (result !== "I don't think this is going to work lol.") {
  console.error("sanitize failed:", result);
  process.exit(1);
}

console.log("sanitize-output: OK");
