const { app } = require("electron");
const fs = require("fs");
const path = require("path");

const DEFAULT_SETTINGS = {
  onboardingComplete: false,
  selectedModel: "gemma4:e2b",
  globalHotkey: "Alt+Tab",
  showMenuBarIcon: true,
  hideDockIcon: true,
  /** User-defined order of rewrite mode ids; empty = renderer's built-in order */
  styleOrder: [],
  /** Rewrite mode ids hidden from the rewrite bar */
  hiddenStyles: [],
};

/** Keys holding a list of rewrite mode ids. The ids themselves live in the
 *  renderer (src/lib/rewrite/styles.ts), so we only enforce the shape here. */
const STYLE_LIST_KEYS = ["styleOrder", "hiddenStyles"];
const MAX_STYLE_LIST_LENGTH = 64;

function sanitizeStyleList(value) {
  if (!Array.isArray(value)) return [];
  const unique = [];
  for (const entry of value) {
    if (typeof entry !== "string" || !entry) continue;
    if (unique.includes(entry)) continue;
    unique.push(entry);
    if (unique.length >= MAX_STYLE_LIST_LENGTH) break;
  }
  return unique;
}

function sanitizeSettings(settings) {
  const next = { ...settings };
  for (const key of STYLE_LIST_KEYS) {
    next[key] = sanitizeStyleList(next[key]);
  }
  return next;
}

function getSettingsPath() {
  return path.join(app.getPath("userData"), "settings.json");
}

function readSettings() {
  try {
    const raw = fs.readFileSync(getSettingsPath(), "utf8");
    return sanitizeSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function writeSettings(partial) {
  const current = readSettings();
  const next = sanitizeSettings({ ...current, ...partial });
  fs.mkdirSync(path.dirname(getSettingsPath()), { recursive: true });
  fs.writeFileSync(getSettingsPath(), JSON.stringify(next, null, 2));
  return next;
}

module.exports = {
  DEFAULT_SETTINGS,
  readSettings,
  writeSettings,
};
