const { app, Menu, dialog } = require("electron");
const { isDev, isMac } = require("./env");
const windows = require("./windows");
const { getGlobalHotkey } = require("./global-hotkey");
const { refreshTrayMenu } = require("./tray");

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
              detail: `Version ${app.getVersion()}\n\nRewrite your messages in different styles using local AI on your Mac.`,
            });
          },
        },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        {
          label: "Show Recast",
          accelerator: getGlobalHotkey(),
          click: () => windows.showMainWindow(),
        },
        {
          label: "Settings…",
          accelerator: "CommandOrControl+,",
          click: () => windows.createSettingsWindow(),
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

function refreshApplicationMenu() {
  if (!isDev) {
    Menu.setApplicationMenu(buildMenu());
  }
  refreshTrayMenu();
}

module.exports = {
  buildMenu,
  refreshApplicationMenu,
};
