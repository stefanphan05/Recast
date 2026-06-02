export const STYLE_OPTIONS = [
  { value: "grammar", label: "Correct" },
  { value: "shorter", label: "Shorter" },
  { value: "longer", label: "Longer" },
  { value: "genz", label: "Gen Z" },
  { value: "flirt", label: "Flirty" },
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "direct", label: "Direct" },
  { value: "polite", label: "Polite" },
] as const;

export const ALLOWED_STYLES = STYLE_OPTIONS.map((o) => o.value);

export type RewriteStyle = (typeof STYLE_OPTIONS)[number]["value"];
