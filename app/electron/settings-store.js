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
  /** User-defined rewrite modes: { id: "custom:...", label, prompt } */
  customModes: [],
};

/** Keys holding a list of rewrite mode ids. The ids themselves live in the
 *  renderer (src/lib/rewrite/styles.ts), so we only enforce the shape here. */
const STYLE_LIST_KEYS = ["styleOrder", "hiddenStyles"];
const MAX_STYLE_LIST_LENGTH = 64;

/** Storage bounds, deliberately looser than the user-facing caps the renderer
 *  enforces (src/lib/rewrite/styles.ts) — raising those must never make this
 *  file silently truncate a prompt the user just saved. */
const CUSTOM_STYLE_PREFIX = "custom:";
const MAX_CUSTOM_MODES = 64;
const MAX_CUSTOM_MODE_LABEL_BYTES = 200;
const MAX_CUSTOM_MODE_PROMPT_BYTES = 8000;

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

/** Keeps only well-formed custom modes so a hand-edited settings.json can never
 *  put a mode without a prompt (or a built-in id) into the rewrite bar. */
function sanitizeCustomModes(value) {
  if (!Array.isArray(value)) return [];
  const modes = [];
  const seen = new Set();
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const id = typeof entry.id === "string" ? entry.id.trim() : "";
    const label = typeof entry.label === "string" ? entry.label.trim() : "";
    const prompt = typeof entry.prompt === "string" ? entry.prompt.trim() : "";
    if (!id.startsWith(CUSTOM_STYLE_PREFIX) || !label || !prompt) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    modes.push({
      id,
      label: label.slice(0, MAX_CUSTOM_MODE_LABEL_BYTES),
      prompt: prompt.slice(0, MAX_CUSTOM_MODE_PROMPT_BYTES),
    });
    if (modes.length >= MAX_CUSTOM_MODES) break;
  }
  return modes;
}

function sanitizeSettings(settings) {
  const next = { ...settings };
  for (const key of STYLE_LIST_KEYS) {
    next[key] = sanitizeStyleList(next[key]);
  }
  next.customModes = sanitizeCustomModes(next.customModes);
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
