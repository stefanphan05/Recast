import {
  LANGUAGES,
  SOURCE_LANGUAGE_AUTO,
  TARGET_LANGUAGE_SAME,
} from "@/lib/rewrite";

export const MAX_CHARS = 2000;

/** ~8 lines at 15px / leading-relaxed */
export const TEXTAREA_MIN_HEIGHT_PX = 200;
/** ~16 lines before scrolling */
export const TEXTAREA_MAX_HEIGHT_PX = 400;
/** Compact input when output is visible */
export const TEXTAREA_MIN_COMPACT_PX = 72;
export const TEXTAREA_MAX_COMPACT_PX = 120;

/** Readable output area when input is compact (esp. mobile). */
export const OUTPUT_MIN_HEIGHT_PX = 144;
/** Cap in-viewport height; longer output scrolls inside the panel. */
export const OUTPUT_MAX_HEIGHT_PX = 280;

export const SERVER_ERROR_MESSAGE = "Server error. Please try again later.";
export const RATE_LIMIT_MESSAGE =
  "Too many requests. Please wait a moment and try again.";

export const targetLanguageOptions = [
  { value: TARGET_LANGUAGE_SAME, label: "Same as message" },
  ...LANGUAGES.map(({ code, label }) => ({ value: code, label })),
];

export const sourceLanguageOptions = [
  { value: SOURCE_LANGUAGE_AUTO, label: "Auto-detect" },
  ...LANGUAGES.map(({ code, label }) => ({ value: code, label })),
];
