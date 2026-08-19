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

export type BuiltInStyle = (typeof STYLE_OPTIONS)[number]["value"];

/** Custom mode ids are namespaced so they can never collide with a built-in. */
export const CUSTOM_STYLE_PREFIX = "custom:";

export type CustomStyleId = `${typeof CUSTOM_STYLE_PREFIX}${string}`;

export type RewriteStyle = BuiltInStyle | CustomStyleId;

export const MAX_CUSTOM_MODES = 24;
export const MAX_CUSTOM_MODE_LABEL_LENGTH = 40;
export const MAX_CUSTOM_MODE_PROMPT_LENGTH = 1000;

/** A user-defined mode. Its prompt replaces the built-in style instruction. */
export type CustomRewriteMode = {
  id: CustomStyleId;
  label: string;
  prompt: string;
};

/** A custom mode carries its own prompt; built-ins resolve theirs in prompts.ts. */
export type StyleOption = {
  value: RewriteStyle;
  label: string;
  prompt?: string;
};

export function isBuiltInStyle(value: string): value is BuiltInStyle {
  return (ALLOWED_STYLES as readonly string[]).includes(value);
}

export function isCustomStyleId(value: string): value is CustomStyleId {
  return value.startsWith(CUSTOM_STYLE_PREFIX);
}

/** `crypto.randomUUID` needs a secure context, which the `app://` renderer is not. */
export function createCustomModeId(): CustomStyleId {
  const random = Math.random().toString(36).slice(2, 8);
  return `${CUSTOM_STYLE_PREFIX}${Date.now().toString(36)}${random}`;
}

/** All styles, ordered by the user's `styleOrder`. Ids matching no known style are
 *  dropped and styles missing from it keep their declaration order at the end, so a
 *  style added to STYLE_OPTIONS later shows up without migrating stored settings. */
export function orderStyleOptions(
  styleOrder: string[] = [],
  customModes: CustomRewriteMode[] = [],
): StyleOption[] {
  const pool: StyleOption[] = [
    ...STYLE_OPTIONS.map((option) => ({
      value: option.value,
      label: option.label,
    })),
    ...customModes.map((mode) => ({
      value: mode.id,
      label: mode.label,
      prompt: mode.prompt,
    })),
  ];

  const ordered: StyleOption[] = [];
  for (const value of styleOrder) {
    if (ordered.some((o) => o.value === value)) continue;
    const option = pool.find((o) => o.value === value);
    if (option) ordered.push(option);
  }
  for (const option of pool) {
    if (ordered.some((o) => o.value === option.value)) continue;
    ordered.push(option);
  }
  return ordered;
}

/** The styles shown in the rewrite bar: ordered, minus the hidden ones. */
export function visibleStyleOptions(
  styleOrder: string[] = [],
  hiddenStyles: string[] = [],
  customModes: CustomRewriteMode[] = [],
): StyleOption[] {
  const all = orderStyleOptions(styleOrder, customModes);
  const visible = all.filter((option) => !hiddenStyles.includes(option.value));
  return visible.length > 0 ? visible : all;
}

/** Keeps the active style valid when it gets hidden while the window is open. */
export function resolveActiveStyle(
  style: RewriteStyle,
  visible: StyleOption[],
): RewriteStyle {
  if (visible.some((option) => option.value === style)) return style;
  return visible[0]?.value ?? STYLE_OPTIONS[0].value;
}
