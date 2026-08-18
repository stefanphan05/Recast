const { BrowserWindow } = require("electron");
const path = require("path");
const { isDev, isMac } = require("../env");
const {
  WINDOW_WIDTH,
  PROMPT_WINDOW_MIN_HEIGHT,
  PROMPT_WINDOW_ABSOLUTE_MIN_HEIGHT,
  SETTINGS_WINDOW_WIDTH,
  SETTINGS_WINDOW_HEIGHT,
  configureMacOverlayWindow,
  positionWindowTopCenter,
  getLayoutHeight,
} = require("./window-geometry");
const { loadWindowRoute } = require("../app-protocol");

let mainWindow = null;
let settingsWindow = null;
let isQuitting = false;
let currentLayoutMode = "prompt";

function getMainWindow() {
  return mainWindow;
}

function getSettingsWindow() {
  return settingsWindow;
}

function setQuitting(value) {
  isQuitting = value;
}

function getCurrentLayoutMode() {
  return currentLayoutMode;
}

function broadcastSettingsChanged(next) {
  mainWindow?.webContents.send("settings-changed", next);
  settingsWindow?.webContents.send("settings-changed", next);
}

function broadcastLocalAIEngineProgress(progress) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("local-ai:engine-progress", progress);
  }
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.webContents.send("local-ai:engine-progress", progress);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: PROMPT_WINDOW_MIN_HEIGHT,
    minWidth: WINDOW_WIDTH,
    minHeight: PROMPT_WINDOW_ABSOLUTE_MIN_HEIGHT,
    resizable: false,
    title: "Recast",
    frame: false,
    transparent: isMac,
    backgroundColor: "#00000000",
    hasShadow: false,
    ...(isMac ? { type: "panel" } : {}),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  configureMacOverlayWindow(mainWindow, isMac);

  loadWindowRoute(mainWindow, "/", isDev);

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow?.webContents.executeJavaScript(
      `document.documentElement.dataset.platform="${process.platform}"`,
    );
  });

  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      hideMainWindow();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createSettingsWindow() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.show();
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: SETTINGS_WINDOW_WIDTH,
    height: SETTINGS_WINDOW_HEIGHT,
    minWidth: 600,
    minHeight: 480,
    title: "Recast Settings",
    show: false,
    titleBarStyle: isMac ? "hiddenInset" : "default",
    trafficLightPosition: isMac ? { x: 14, y: 14 } : undefined,
    backgroundColor: isMac ? "#f5f5f5" : "#ffffff",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  loadWindowRoute(settingsWindow, "/settings/", isDev);

  settingsWindow.webContents.on("did-finish-load", () => {
    settingsWindow?.webContents.executeJavaScript(
      `document.documentElement.dataset.platform="${process.platform}";document.documentElement.dataset.window="settings";`,
    );
  });

  settingsWindow.once("ready-to-show", () => {
    settingsWindow?.show();
  });

  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });
}

function showMainWindow() {
  if (!mainWindow) {
    createWindow();
  }

  positionWindowTopCenter(mainWindow);
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }
  configureMacOverlayWindow(mainWindow, isMac);
  mainWindow.show();
  mainWindow.focus();
}

function hideMainWindow() {
  if (!mainWindow?.isVisible()) return;
  mainWindow.hide();
  mainWindow.webContents.send("window-hidden");
}

function toggleMainWindow() {
  if (!mainWindow || !mainWindow.isVisible()) {
    showMainWindow();
    return;
  }

  if (mainWindow.isFocused()) {
    hideMainWindow();
    return;
  }

  positionWindowTopCenter(mainWindow);
  configureMacOverlayWindow(mainWindow, isMac);
  mainWindow.focus();
}

function setWindowLayout(mode, contentHeight, animate = true) {
  if (!mainWindow) return;

  currentLayoutMode = mode;
  const currentHeight = mainWindow.getBounds().height;
  const height = getLayoutHeight(mode, contentHeight, currentHeight);
  mainWindow.setMinimumSize(WINDOW_WIDTH, PROMPT_WINDOW_ABSOLUTE_MIN_HEIGHT);

  // Resize only — the window keeps wherever the user dragged it. Repositioning
  // happens on summon (positionWindowTopCenter), never on a layout change.
  mainWindow.setSize(WINDOW_WIDTH, height, animate);
}

module.exports = {
  createWindow,
  createSettingsWindow,
  showMainWindow,
  hideMainWindow,
  toggleMainWindow,
  setWindowLayout,
  getCurrentLayoutMode,
  getMainWindow,
  getSettingsWindow,
  setQuitting,
  broadcastSettingsChanged,
  broadcastLocalAIEngineProgress,
};
