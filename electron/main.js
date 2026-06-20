const {
  app,
  BrowserWindow,
  Menu,
  dialog,
  shell,
  ipcMain,
  globalShortcut,
  screen,
  protocol,
  net,
} = require("electron");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const DEFAULT_SETTINGS = {
  onboardingComplete: false,
  selectedModel: "llama3.2",
  globalHotkey: "Alt+Tab",
};

const useStaticExport =
  app.isPackaged || process.env.ELECTRON_USE_STATIC === "1";
const isDev = !useStaticExport;
const isMac = process.platform === "darwin";

protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    },
  },
]);

/** Default global shortcut to show/hide the window (Option+Tab). */
const DEFAULT_HOTKEY = DEFAULT_SETTINGS.globalHotkey;

/** @type {BrowserWindow | null} */
let mainWindow = null;

/** @type {BrowserWindow | null} */
let settingsWindow = null;

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

function getGlobalHotkey() {
  const settings = readSettings();
  return settings.globalHotkey || DEFAULT_HOTKEY;
}

function broadcastSettingsChanged(next) {
  mainWindow?.webContents.send("settings-changed", next);
  settingsWindow?.webContents.send("settings-changed", next);
}

function registerGlobalHotkey(accelerator = getGlobalHotkey()) {
  globalShortcut.unregisterAll();
  const registered = globalShortcut.register(accelerator, toggleMainWindow);
  if (!registered) {
    console.warn(`Failed to register global shortcut: ${accelerator}`);
  }
  return registered;
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

const SETTINGS_WINDOW_WIDTH = 720;
const SETTINGS_WINDOW_HEIGHT = 560;

function getOutDir() {
  return path.resolve(path.join(__dirname, "../out"));
}

function resolveAppPath(urlPathname) {
  const outDir = getOutDir();
  let pathname = decodeURIComponent(urlPathname).replace(/^\/+/, "");

  if (!pathname) {
    return path.join(outDir, "index.html");
  }

  pathname = pathname.replace(/\/+$/, "");
  const candidate = path.join(outDir, pathname);

  if (fs.existsSync(candidate)) {
    const stat = fs.statSync(candidate);
    if (stat.isFile()) {
      return candidate;
    }
    if (stat.isDirectory()) {
      const indexInDir = path.join(candidate, "index.html");
      if (fs.existsSync(indexInDir)) {
        return indexInDir;
      }
    }
  }

  const routeIndex = path.join(outDir, pathname, "index.html");
  if (fs.existsSync(routeIndex)) {
    return routeIndex;
  }

  return path.join(outDir, "index.html");
}

function loadWindowRoute(win, route) {
  if (isDev) {
    win.loadURL(`http://localhost:3000${route}`);
    return;
  }

  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
  win.loadURL(`app://localhost${normalizedRoute}`);
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

  loadWindowRoute(settingsWindow, "/settings/");

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

  loadWindowRoute(mainWindow, "/");

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
          accelerator: getGlobalHotkey(),
          click: () => showMainWindow(),
        },
        {
          label: "Settings…",
          accelerator: "CommandOrControl+,",
          click: () => createSettingsWindow(),
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
  if (!isDev) {
    protocol.handle("app", (request) => {
      const url = new URL(request.url);
      const filePath = resolveAppPath(url.pathname);
      const resolvedOutDir = getOutDir();

      if (
        !filePath.startsWith(resolvedOutDir + path.sep) &&
        filePath !== resolvedOutDir
      ) {
        return net.fetch(pathToFileURL(path.join(resolvedOutDir, "index.html")).toString());
      }

      return net.fetch(pathToFileURL(filePath).toString());
    });
  }

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
    const next = writeSettings(partial);
    broadcastSettingsChanged(next);
    return next;
  });
  ipcMain.handle("settings:open", () => {
    createSettingsWindow();
    return true;
  });
  ipcMain.handle("hotkey:get", () => getGlobalHotkey());
  ipcMain.handle("hotkey:set", (_event, accelerator) => {
    if (typeof accelerator !== "string" || !accelerator.trim()) {
      return { ok: false, error: "Invalid shortcut." };
    }

    const nextAccelerator = accelerator.trim();
    const registered = registerGlobalHotkey(nextAccelerator);
    if (!registered) {
      registerGlobalHotkey(getGlobalHotkey());
      return {
        ok: false,
        error: "That shortcut is unavailable. Try a different combination.",
      };
    }

    const next = writeSettings({ globalHotkey: nextAccelerator });
    broadcastSettingsChanged(next);
    return { ok: true, accelerator: nextAccelerator };
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

  registerGlobalHotkey(getGlobalHotkey());
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
