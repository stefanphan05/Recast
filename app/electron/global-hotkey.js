const { globalShortcut } = require("electron");
const { inputEventToAccelerator } = require("./hotkey");
const { DEFAULT_SETTINGS, readSettings, writeSettings } = require("./settings-store");
const windows = require("./windows");

let hotkeyRecording = false;
let hotkeyRecordingHandler = null;
let hotkeyRecordingTargets = [];

function getGlobalHotkey() {
  const settings = readSettings();
  return settings.globalHotkey || DEFAULT_SETTINGS.globalHotkey;
}

function registerGlobalHotkey(accelerator = getGlobalHotkey()) {
  globalShortcut.unregisterAll();
  if (hotkeyRecording) {
    return true;
  }
  const registered = globalShortcut.register(
    accelerator,
    windows.toggleMainWindow,
  );
  if (!registered) {
    console.warn(`Failed to register global shortcut: ${accelerator}`);
  }
  return registered;
}

/** Persists the new hotkey and broadcasts the change; caller decides whether to refresh menus. */
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
  windows.broadcastSettingsChanged(next);
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
    windows.getMainWindow()?.webContents,
    windows.getSettingsWindow()?.webContents,
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
  const mainWindow = windows.getMainWindow();
  const settingsWindow = windows.getSettingsWindow();
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

module.exports = {
  getGlobalHotkey,
  registerGlobalHotkey,
  setGlobalHotkey,
  startHotkeyRecording,
  stopHotkeyRecording,
};
