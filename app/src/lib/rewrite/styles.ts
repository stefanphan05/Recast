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

export type StyleOption = { value: RewriteStyle; label: string };

function isRewriteStyle(value: string): value is RewriteStyle {
  return (ALLOWED_STYLES as readonly string[]).includes(value);
}

/** All styles, ordered by the user's `styleOrder`. Unknown ids are dropped and
 *  styles missing from it keep their declaration order at the end, so a style
 *  added to STYLE_OPTIONS later shows up without migrating stored settings. */
export function orderStyleOptions(styleOrder: string[] = []): StyleOption[] {
  const ordered: StyleOption[] = [];
  for (const value of styleOrder) {
    if (!isRewriteStyle(value)) continue;
    if (ordered.some((o) => o.value === value)) continue;
    ordered.push(STYLE_OPTIONS.find((o) => o.value === value)!);
  }
  for (const option of STYLE_OPTIONS) {
    if (ordered.some((o) => o.value === option.value)) continue;
    ordered.push(option);
  }
  return ordered;
}

/** The styles shown in the rewrite bar: ordered, minus the hidden ones. */
export function visibleStyleOptions(
  styleOrder: string[] = [],
  hiddenStyles: string[] = [],
): StyleOption[] {
  const visible = orderStyleOptions(styleOrder).filter(
    (option) => !hiddenStyles.includes(option.value),
  );
  return visible.length > 0 ? visible : orderStyleOptions(styleOrder);
}

/** Keeps the active style valid when it gets hidden while the window is open. */
export function resolveActiveStyle(
  style: RewriteStyle,
  visible: StyleOption[],
): RewriteStyle {
  if (visible.some((option) => option.value === style)) return style;
  return visible[0]?.value ?? STYLE_OPTIONS[0].value;
}
