const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  close: () => ipcRenderer.send("window-close"),
  setLayout: (mode, contentHeight) =>
    ipcRenderer.send("window-set-layout", mode, contentHeight),
  setContentHeight: (height) =>
    ipcRenderer.send("window-set-content-height", height),
  onWindowHidden: (callback) => {
    const handler = () => callback();
    ipcRenderer.on("window-hidden", handler);
    return () => ipcRenderer.removeListener("window-hidden", handler);
  },
  getSettings: () => ipcRenderer.invoke("settings:get"),
  setSettings: (partial) => ipcRenderer.invoke("settings:set", partial),
  onSettingsChanged: (callback) => {
    const handler = (_event, next) => callback(next);
    ipcRenderer.on("settings-changed", handler);
    return () => ipcRenderer.removeListener("settings-changed", handler);
  },
  openSettings: () => ipcRenderer.invoke("settings:open"),
  beginHotkeyRecording: () => ipcRenderer.invoke("hotkey:beginRecording"),
  endHotkeyRecording: () => ipcRenderer.invoke("hotkey:endRecording"),
  onHotkeyCaptured: (callback) => {
    const handler = (_event, accelerator) => callback(accelerator);
    ipcRenderer.on("hotkey:captured", handler);
    return () => ipcRenderer.removeListener("hotkey:captured", handler);
  },
  onHotkeyRecordingCancelled: (callback) => {
    const handler = () => callback();
    ipcRenderer.on("hotkey:recording-cancelled", handler);
    return () =>
      ipcRenderer.removeListener("hotkey:recording-cancelled", handler);
  },
  setHotkey: (accelerator) => ipcRenderer.invoke("hotkey:set", accelerator),
  openExternal: (url) => ipcRenderer.invoke("shell:openExternal", url),
  revealModelsFolder: () => ipcRenderer.invoke("shell:revealModelsFolder"),
  ensureLocalAIReady: (model) => ipcRenderer.invoke("local-ai:ensureReady", model),
  warmUpModel: (model) => ipcRenderer.invoke("local-ai:warmUp", model),
  platform: process.platform,
});
