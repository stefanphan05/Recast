const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  nativeImage,
  dialog,
  shell,
  ipcMain,
  globalShortcut,
  screen,
  protocol,
  net,
} = require("electron");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { pathToFileURL } = require("url");
const { inputEventToAccelerator } = require("./hotkey");

const DEFAULT_SETTINGS = {
  onboardingComplete: false,
  selectedModel: "llama3.2",
  globalHotkey: "Alt+Tab",
  showMenuBarIcon: true,
  hideDockIcon: false,
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

let mainWindow = null;
let settingsWindow = null;
let tray = null;
let isQuitting = false;
let hotkeyRecording = false;
let hotkeyRecordingHandler = null;
let hotkeyRecordingTargets = [];

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
  return settings.globalHotkey || DEFAULT_SETTINGS.globalHotkey;
}

function broadcastSettingsChanged(next) {
  mainWindow?.webContents.send("settings-changed", next);
  settingsWindow?.webContents.send("settings-changed", next);
}

function registerGlobalHotkey(accelerator = getGlobalHotkey()) {
  globalShortcut.unregisterAll();
  if (hotkeyRecording) {
    return true;
  }
  const registered = globalShortcut.register(accelerator, toggleMainWindow);
  if (!registered) {
    console.warn(`Failed to register global shortcut: ${accelerator}`);
  }
  return registered;
}

function setGlobalHotkey(accelerator) {
  if (typeof accelerator !== "string" || !accelerator.trim()) {
    return { ok: false, error: "Invalid shortcut." };
  }

  const nextAccelerator = accelerator.trim();
  hotkeyRecording = false;
  const registered = registerGlobalHotkey(nextAccelerator);
  if (!registered) {
    registerGlobalHotkey(getGlobalHotkey());
    return {
      ok: false,
      error:
        "That shortcut is already used by macOS or another app. Please try a different combination.",
    };
  }

  const next = writeSettings({ globalHotkey: nextAccelerator });
  broadcastSettingsChanged(next);
  refreshApplicationMenu();
  return { ok: true, accelerator: nextAccelerator };
}

function stopHotkeyRecordingListeners() {
  if (!hotkeyRecordingHandler) return;

  for (const webContents of hotkeyRecordingTargets) {
    if (!webContents.isDestroyed()) {
      webContents.removeListener("before-input-event", hotkeyRecordingHandler);
    }
  }

  hotkeyRecordingTargets = [];
  hotkeyRecordingHandler = null;
}

function stopHotkeyRecording() {
  hotkeyRecording = false;
  stopHotkeyRecordingListeners();
  registerGlobalHotkey(getGlobalHotkey());
}

function broadcastHotkeyRecordingCancelled() {
  for (const webContents of [
    mainWindow?.webContents,
    settingsWindow?.webContents,
  ]) {
    if (webContents && !webContents.isDestroyed()) {
      webContents.send("hotkey:recording-cancelled");
    }
  }
}

function startHotkeyRecording(webContents) {
  hotkeyRecording = true;
  globalShortcut.unregisterAll();
  stopHotkeyRecordingListeners();

  hotkeyRecordingHandler = (event, input) => {
    if (!hotkeyRecording || input.type !== "keyDown") return;

    if (input.key === "Escape") {
      stopHotkeyRecording();
      broadcastHotkeyRecordingCancelled();
      return;
    }

    const accelerator = inputEventToAccelerator(input);
    if (!accelerator) return;

    event.preventDefault();
    stopHotkeyRecordingListeners();
    hotkeyRecording = false;

    if (webContents && !webContents.isDestroyed()) {
      webContents.send("hotkey:captured", accelerator);
    }
  };

  const targets = new Set();
  if (webContents && !webContents.isDestroyed()) {
    targets.add(webContents);
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    targets.add(mainWindow.webContents);
  }
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    targets.add(settingsWindow.webContents);
  }

  for (const target of targets) {
    target.on("before-input-event", hotkeyRecordingHandler);
    hotkeyRecordingTargets.push(target);
  }
}

function refreshApplicationMenu() {
  if (!isDev) {
    Menu.setApplicationMenu(buildMenu());
  }
  refreshTrayMenu();
}

function getMenuIconPath(filename) {
  const candidates = [
    path.join(__dirname, "..", "src", "app", filename),
    path.join(__dirname, filename),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  return path.join(__dirname, "..", "src", "app", filename);
}

function getTrayIcon() {
  const icon1x = nativeImage.createFromPath(
    getMenuIconPath("menu-icon-22.png"),
  );
  const icon2x = nativeImage.createFromPath(
    getMenuIconPath("menu-icon-44.png"),
  );

  if (isMac && !icon1x.isEmpty() && !icon2x.isEmpty()) {
    const icon = nativeImage.createEmpty();
    icon.addRepresentation({
      scaleFactor: 1,
      width: 22,
      height: 22,
      buffer: icon1x.toPNG(),
    });
    icon.addRepresentation({
      scaleFactor: 2,
      width: 22,
      height: 22,
      buffer: icon2x.toPNG(),
    });
    icon.setTemplateImage(false);
    return icon;
  }

  const icon = icon1x.isEmpty() ? icon2x : icon1x;
  icon.setTemplateImage(false);
  return icon;
}

function buildTrayMenu() {
  const hotkey = getGlobalHotkey();

  return Menu.buildFromTemplate([
    {
      label: "Open Recast",
      accelerator: hotkey,
      click: () => showMainWindow(),
    },
    { type: "separator" },
    {
      label: "Settings…",
      click: () => createSettingsWindow(),
    },
    {
      label: "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
}

function refreshTrayMenu() {
  if (!tray) return;
  tray.setContextMenu(buildTrayMenu());
}

function createTray() {
  if (!isMac || tray) return;
  if (readSettings().showMenuBarIcon === false) return;

  tray = new Tray(getTrayIcon());
  tray.setToolTip("Recast");
  refreshTrayMenu();
}

function destroyTray() {
  if (!tray) return;
  tray.destroy();
  tray = null;
}

function applyMenuBarIconSetting(show) {
  if (!isMac) return;
  if (show) {
    createTray();
    return;
  }
  destroyTray();
}

function applyDockIconSetting(hide) {
  if (!isMac || !app.dock) return;
  if (hide) {
    app.dock.hide();
    return;
  }
  app.dock.show();
}

function applyGeneralSettings(settings = readSettings()) {
  applyMenuBarIconSetting(settings.showMenuBarIcon !== false);
  applyDockIconSetting(Boolean(settings.hideDockIcon));
}

function getOllamaModelsPath() {
  return path.join(os.homedir(), ".ollama", "models");
}

const PROMPT_WINDOW_MIN_HEIGHT = 140;
const PROMPT_WINDOW_ABSOLUTE_MIN_HEIGHT = 120;
const PROMPT_WINDOW_MAX_HEIGHT = 640;
const EXPANDED_WINDOW_HEIGHT = 640;
const ONBOARDING_WINDOW_HEIGHT = 640;
const WINDOW_WIDTH = 480;
const TOP_MARGIN = 24;

let currentLayoutMode = "prompt";

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

function getLayoutHeight(mode, contentHeight) {
  if (mode === "onboarding") return ONBOARDING_WINDOW_HEIGHT;
  if (mode === "expanded") return EXPANDED_WINDOW_HEIGHT;
  if (typeof contentHeight === "number" && contentHeight > 0) {
    return Math.min(
      Math.max(Math.round(contentHeight), PROMPT_WINDOW_ABSOLUTE_MIN_HEIGHT),
      PROMPT_WINDOW_MAX_HEIGHT,
    );
  }
  return PROMPT_WINDOW_MIN_HEIGHT;
}

function setWindowLayout(mode, contentHeight) {
  if (!mainWindow) return;

  currentLayoutMode = mode;
  const height = getLayoutHeight(mode, contentHeight);
  mainWindow.setMinimumSize(WINDOW_WIDTH, PROMPT_WINDOW_ABSOLUTE_MIN_HEIGHT);

  if (mode === "prompt" || mode === "onboarding") {
    mainWindow.setSize(WINDOW_WIDTH, height, true);
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
        return net.fetch(
          pathToFileURL(path.join(resolvedOutDir, "index.html")).toString(),
        );
      }

      return net.fetch(pathToFileURL(filePath).toString());
    });
  }

  app.setName("Recast");
  ipcMain.on("window-close", () => {
    hideMainWindow();
  });

  ipcMain.on("window-set-layout", (_event, mode, contentHeight) => {
    if (mode === "prompt" || mode === "expanded" || mode === "onboarding") {
      setWindowLayout(mode, contentHeight);
    }
  });

  ipcMain.on("window-set-content-height", (_event, contentHeight) => {
    if (
      currentLayoutMode !== "prompt" ||
      typeof contentHeight !== "number" ||
      !Number.isFinite(contentHeight)
    ) {
      return;
    }
    setWindowLayout("prompt", contentHeight);
  });

  ipcMain.handle("settings:get", () => readSettings());
  ipcMain.handle("settings:set", (_event, partial) => {
    if (!partial || typeof partial !== "object") {
      return readSettings();
    }
    const next = writeSettings(partial);
    applyGeneralSettings(next);
    broadcastSettingsChanged(next);
    return next;
  });
  ipcMain.handle("settings:open", () => {
    createSettingsWindow();
    return true;
  });
  ipcMain.handle("hotkey:beginRecording", (event) => {
    startHotkeyRecording(event.sender);
    return true;
  });
  ipcMain.handle("hotkey:endRecording", () => {
    stopHotkeyRecording();
    return true;
  });
  ipcMain.handle("hotkey:set", (_event, accelerator) =>
    setGlobalHotkey(accelerator),
  );
  ipcMain.handle("shell:openExternal", (_event, url) => {
    if (typeof url === "string" && /^https?:\/\//.test(url)) {
      return shell.openExternal(url);
    }
    return false;
  });
  ipcMain.handle("shell:revealModelsFolder", async () => {
    const modelsPath = getOllamaModelsPath();
    fs.mkdirSync(modelsPath, { recursive: true });
    const error = await shell.openPath(modelsPath);
    return !error;
  });

  if (!isDev) {
    Menu.setApplicationMenu(buildMenu());
  }

  registerGlobalHotkey(getGlobalHotkey());
  applyGeneralSettings();
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
