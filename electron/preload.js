const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  close: () => ipcRenderer.send("window-close"),
  setLayout: (mode) => ipcRenderer.send("window-set-layout", mode),
  onWindowHidden: (callback) => {
    const handler = () => callback();
    ipcRenderer.on("window-hidden", handler);
    return () => ipcRenderer.removeListener("window-hidden", handler);
  },
  getSettings: () => ipcRenderer.invoke("settings:get"),
  setSettings: (partial) => ipcRenderer.invoke("settings:set", partial),
  openExternal: (url) => ipcRenderer.invoke("shell:openExternal", url),
  platform: process.platform,
});
