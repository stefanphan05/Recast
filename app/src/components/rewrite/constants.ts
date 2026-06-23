export const MAX_CHARS = 2000;

export const TEXTAREA_MIN_LANDING_PX = 28;
export const TEXTAREA_MAX_LANDING_PX = 480;
/** Compact input when output is visible: 1 row min, up to 3 rows max */
export const TEXTAREA_MIN_COMPACT_PX = 24;
export const TEXTAREA_MAX_COMPACT_PX = 72;

/** Shared surface styling for composer + output panels */
export const PANEL_SURFACE_CLASS =
  "panel-surface app-panel-shadow rounded-[26px] backdrop-blur-xl";

/** Vertical rhythm between toolbar rows and panels in expanded mode */
export const EXPANDED_BLOCK_GAP_CLASS = "gap-2";

/** Electron window height cap — keep in sync with PROMPT_WINDOW_MAX_HEIGHT in electron/main.js */
export const WINDOW_MAX_HEIGHT_PX = 640;

/** Square icon action buttons (close, copy) */
export const ICON_ACTION_BTN_CLASS =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors focus-visible:outline-none";

export const ICON_ACTION_BTN_SECONDARY_CLASS = `${ICON_ACTION_BTN_CLASS} border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--muted)] hover:border-[rgba(244,201,120,0.24)] hover:bg-[rgba(244,201,120,0.08)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[rgba(244,201,120,0.2)]`;
