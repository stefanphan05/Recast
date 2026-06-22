export const MAX_CHARS = 2000;

export const TEXTAREA_MIN_LANDING_PX = 28;
export const TEXTAREA_MAX_LANDING_PX = 480;
/** Compact input when output is visible: 1 row min, up to 3 rows max */
export const TEXTAREA_MIN_COMPACT_PX = 24;
export const TEXTAREA_MAX_COMPACT_PX = 72;

/** Shared surface styling for composer + output panels */
export const PANEL_SURFACE_CLASS =
  "panel-surface rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]";

/** Vertical rhythm between toolbar rows and panels in expanded mode */
export const EXPANDED_BLOCK_GAP_CLASS = "gap-2";

/** Max scrollable output height before the window hits its cap */
export const OUTPUT_CONTENT_MAX_PX = 440;

/** Square icon action buttons (close, copy) */
export const ICON_ACTION_BTN_CLASS =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors focus-visible:outline-none";

export const ICON_ACTION_BTN_SECONDARY_CLASS = `${ICON_ACTION_BTN_CLASS} border border-[var(--border)] bg-[var(--surface-elevated)] text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-400/40 dark:text-neutral-300 dark:hover:bg-neutral-400 dark:hover:text-neutral-900`;
