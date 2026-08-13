const { app, Menu, Tray, nativeImage } = require("electron");
const fs = require("fs");
const path = require("path");
const { isMac } = require("./env");
const { readSettings } = require("./settings-store");
const windows = require("./windows");
const { getGlobalHotkey } = require("./global-hotkey");

let tray = null;

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
      click: () => windows.showMainWindow(),
    },
    { type: "separator" },
    {
      label: "Settings…",
      click: () => windows.createSettingsWindow(),
    },
    {
      label: "Quit",
      click: () => {
        windows.setQuitting(true);
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

module.exports = {
  createTray,
  destroyTray,
  applyMenuBarIconSetting,
  refreshTrayMenu,
};
