const {
  app,
  BrowserWindow,
  Menu,
  dialog,
  shell,
  ipcMain,
  globalShortcut,
  screen,
} = require("electron");
const fs = require("fs");
const path = require("path");

const DEFAULT_SETTINGS = {
  onboardingComplete: false,
  selectedModel: "llama3.2",
};

const isDev = !app.isPackaged;
const isMac = process.platform === "darwin";

/** Global shortcut to show/hide the window (Option+Tab). */
const HOTKEY = "Alt+Tab";

/** @type {BrowserWindow | null} */
let mainWindow = null;

/** @type {boolean} */
let isQuitting = false;

function showMainWindow() {
  if (!mainWindow) {
    createWindow();
  }

  positionWindowTopCenter(mainWindow);
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }
  configureMacOverlayWindow(mainWindow);
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
  configureMacOverlayWindow(mainWindow);
  mainWindow.focus();
}

function registerGlobalHotkey() {
  const registered = globalShortcut.register(HOTKEY, toggleMainWindow);
  if (!registered) {
    console.warn(`Failed to register global shortcut: ${HOTKEY}`);
  }
}

const PROMPT_WINDOW_HEIGHT = 200;
const EXPANDED_WINDOW_HEIGHT = 520;
const ONBOARDING_WINDOW_HEIGHT = 640;
const WINDOW_WIDTH = 480;
const TOP_MARGIN = 24;

function getActiveDisplay() {
  return screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
}

/** Keep the window on the current Space, including over other apps in fullscreen. */
function configureMacOverlayWindow(win) {
  if (!isMac) return;

  win.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
    skipTransformProcessType: true,
  });
  win.setAlwaysOnTop(true, "floating", 1);
  win.setFullScreenable(false);
}

function positionWindowTopCenter(win, display = getActiveDisplay()) {
  const { x: areaX, y: areaY, width: areaW } = display.workArea;
  const [winW] = win.getSize();
  const x = Math.round(areaX + (areaW - winW) / 2);
  const y = Math.round(areaY + TOP_MARGIN);
  win.setPosition(x, y, false);
}

function getLayoutHeight(mode) {
  if (mode === "onboarding") return ONBOARDING_WINDOW_HEIGHT;
  if (mode === "expanded") return EXPANDED_WINDOW_HEIGHT;
  return PROMPT_WINDOW_HEIGHT;
}

function setWindowLayout(mode) {
  if (!mainWindow) return;

  const height = getLayoutHeight(mode);
  mainWindow.setMinimumSize(WINDOW_WIDTH, PROMPT_WINDOW_HEIGHT);

  if (mode === "prompt" || mode === "onboarding") {
    mainWindow.setSize(WINDOW_WIDTH, height, true);
    positionWindowTopCenter(mainWindow);
    return;
  }

  const bounds = mainWindow.getBounds();
  mainWindow.setSize(WINDOW_WIDTH, height, true);
  const display = screen.getDisplayMatching(bounds);
  const { x: areaX, width: areaW } = display.workArea;
  const x = Math.round(areaX + (areaW - WINDOW_WIDTH) / 2);
  mainWindow.setPosition(x, bounds.y, false);
}

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

function createWindow() {
  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: PROMPT_WINDOW_HEIGHT,
    minWidth: WINDOW_WIDTH,
    minHeight: PROMPT_WINDOW_HEIGHT,
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

  configureMacOverlayWindow(mainWindow);

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(__dirname, "../out/index.html"));
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

function buildMenu() {
  const isMac = process.platform === "darwin";

  /** @type {Electron.MenuItemConstructorOptions[]} */
  const template = [];

  if (isMac) {
    template.push({
      label: app.name,
      submenu: [
        {
          label: `About ${app.name}`,
          click: () => {
            dialog.showMessageBox({
              type: "info",
              title: "About Recast",
              message: "Recast",
              detail: `Version ${app.getVersion()}\n\nRewrite your messages in different styles using local AI via Ollama.`,
            });
          },
        },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        {
          label: "Show Recast",
          accelerator: HOTKEY,
          click: () => showMainWindow(),
        },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    });
  }

  template.push({
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "selectAll" },
    ],
  });

  if (!isMac) {
    template.push({
      label: "File",
      submenu: [{ role: "quit" }],
    });
  }

  return Menu.buildFromTemplate(template);
}

app.whenReady().then(async () => {
  app.setName("Recast");
  ipcMain.on("window-close", () => {
    hideMainWindow();
  });

  ipcMain.on("window-set-layout", (_event, mode) => {
    if (mode === "prompt" || mode === "expanded" || mode === "onboarding") {
      setWindowLayout(mode);
    }
  });

  ipcMain.handle("settings:get", () => readSettings());
  ipcMain.handle("settings:set", (_event, partial) => {
    if (!partial || typeof partial !== "object") {
      return readSettings();
    }
    return writeSettings(partial);
  });
  ipcMain.handle("shell:openExternal", (_event, url) => {
    if (typeof url === "string" && /^https?:\/\//.test(url)) {
      return shell.openExternal(url);
    }
    return false;
  });

  if (!isDev) {
    Menu.setApplicationMenu(buildMenu());
  }

  registerGlobalHotkey();
  createWindow();
  positionWindowTopCenter(mainWindow);

  app.on("activate", () => {
    showMainWindow();
  });
});

app.on("before-quit", () => {
  isQuitting = true;
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
