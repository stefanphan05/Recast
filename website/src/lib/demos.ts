export type DemoId = "tones" | "hotkey" | "private" | "fast";

export type DemoConfig = {
  id: DemoId;
  label: string;
  title: string;
  description: string;
};

export const DEMOS: DemoConfig[] = [
  {
    id: "tones",
    label: "Tone presets",
    title: "Sound like you — or who you need to be.",
    description:
      "Switch between Correct, Formal, Casual, Gen Z, Flirty, and more. Dial intensity up or down for styles like Gen Z and Flirty.",
  },
  {
    id: "hotkey",
    label: "Global hotkey",
    title: "Summon Recast from anywhere.",
    description:
      "Press Option+Tab to show or hide Recast over any app — email, Slack, iMessage, Notion. Rewrite without breaking flow.",
  },
  {
    id: "private",
    label: "Local AI",
    title: "Your words never leave your Mac.",
    description:
      "Recast runs AI locally on your machine. No cloud uploads, no account, no training on your messages. Private by design.",
  },
  {
    id: "fast",
    label: "Instant rewrite",
    title: "Paste, pick, done.",
    description:
      "Drop in your draft, choose a style, and get a polished rewrite in seconds. Copy the result and move on with your day.",
  },
];
