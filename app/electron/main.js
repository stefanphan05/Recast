const {
  app,
  Menu,
  ipcMain,
  globalShortcut,
  protocol,
  net,
  shell,
} = require("electron");
const path = require("path");
const { pathToFileURL } = require("url");
const { isDev } = require("./env");
const { readSettings, writeSettings } = require("./settings-store");
const { getOutDir, resolveAppPath } = require("./app-protocol");
const { positionWindowTopCenter } = require("./window-geometry");
const windows = require("./windows");
const tray = require("./tray");
const appMenu = require("./app-menu");
const globalHotkey = require("./global-hotkey");
const { applyDockIconSetting } = require("./dock");
const {
  ensureLocalAIReady,
  stopLocalAIIfStartedByUs,
  warmUpModel,
} = require("./local-ai");
const { ensureEngineHome, getLocalModelsPath } = require("./engine-path");

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

function applyGeneralSettings(settings = readSettings()) {
  tray.applyMenuBarIconSetting(settings.showMenuBarIcon !== false);
  applyDockIconSetting(Boolean(settings.hideDockIcon));
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
    windows.hideMainWindow();
  });

  ipcMain.on("window-set-layout", (_event, mode, contentHeight) => {
    if (mode === "prompt" || mode === "expanded" || mode === "onboarding") {
      windows.setWindowLayout(mode, contentHeight);
    }
  });

  ipcMain.on("window-set-content-height", (_event, contentHeight) => {
    const currentLayoutMode = windows.getCurrentLayoutMode();
    if (
      (currentLayoutMode !== "prompt" &&
        currentLayoutMode !== "onboarding" &&
        currentLayoutMode !== "expanded") ||
      typeof contentHeight !== "number" ||
      !Number.isFinite(contentHeight)
    ) {
      return;
    }
    windows.setWindowLayout(currentLayoutMode, contentHeight, false);
  });

  ipcMain.handle("settings:get", () => readSettings());
  ipcMain.handle("settings:set", (_event, partial) => {
    if (!partial || typeof partial !== "object") {
      return readSettings();
    }
    const previous = readSettings();
    const next = writeSettings(partial);
    applyGeneralSettings(next);
    windows.broadcastSettingsChanged(next);

    if (
      partial.selectedModel &&
      partial.selectedModel !== previous.selectedModel
    ) {
      void ensureLocalAIReady(next.selectedModel, {
        onProgress: windows.broadcastLocalAIEngineProgress,
      });
    }

    return next;
  });
  ipcMain.handle("settings:open", () => {
    windows.createSettingsWindow();
    return true;
  });
  ipcMain.handle("hotkey:beginRecording", (event) => {
    globalHotkey.startHotkeyRecording(event.sender);
    return true;
  });
  ipcMain.handle("hotkey:endRecording", () => {
    globalHotkey.stopHotkeyRecording();
    return true;
  });
  ipcMain.handle("hotkey:set", (_event, accelerator) => {
    const result = globalHotkey.setGlobalHotkey(accelerator);
    if (result.ok) {
      appMenu.refreshApplicationMenu();
    }
    return result;
  });
  ipcMain.handle("shell:openExternal", (_event, url) => {
    if (typeof url === "string" && /^https?:\/\//.test(url)) {
      return shell.openExternal(url);
    }
    return false;
  });
  ipcMain.handle("shell:revealModelsFolder", async () => {
    ensureEngineHome();
    const modelsPath = getLocalModelsPath();
    const error = await shell.openPath(modelsPath);
    return !error;
  });
  ipcMain.handle("local-ai:ensureReady", (_event, model) =>
    ensureLocalAIReady(
      typeof model === "string" ? model : readSettings().selectedModel,
      { onProgress: windows.broadcastLocalAIEngineProgress },
    ),
  );
  ipcMain.handle("local-ai:warmUp", (_event, model) =>
    warmUpModel(
      typeof model === "string" ? model : readSettings().selectedModel,
    ),
  );

  if (!isDev) {
    Menu.setApplicationMenu(appMenu.buildMenu());
  }

  globalHotkey.registerGlobalHotkey(globalHotkey.getGlobalHotkey());
  applyGeneralSettings();
  void ensureLocalAIReady(readSettings().selectedModel, {
    onProgress: windows.broadcastLocalAIEngineProgress,
  });
  windows.createWindow();
  positionWindowTopCenter(windows.getMainWindow());

  app.on("activate", () => {
    windows.showMainWindow();
  });
});

app.on("before-quit", () => {
  windows.setQuitting(true);
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
  stopLocalAIIfStartedByUs();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
