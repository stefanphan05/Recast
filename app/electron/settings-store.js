const { app } = require("electron");
const fs = require("fs");
const path = require("path");

const DEFAULT_SETTINGS = {
  onboardingComplete: false,
  selectedModel: "gemma4:e2b",
  globalHotkey: "Alt+Tab",
  showMenuBarIcon: true,
  hideDockIcon: true,
};

function getSettingsPath() {
  return path.join(app.getPath("userData"), "settings.json");
}

function readSettings() {
  try {
    const raw = fs.readFileSync(getSettingsPath(), "utf8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function writeSettings(partial) {
  const current = readSettings();
  const next = { ...current, ...partial };
  fs.mkdirSync(path.dirname(getSettingsPath()), { recursive: true });
  fs.writeFileSync(getSettingsPath(), JSON.stringify(next, null, 2));
  return next;
}

module.exports = {
  DEFAULT_SETTINGS,
  readSettings,
  writeSettings,
};
