const { app } = require("electron");
const { isMac } = require("./env");

function applyDockIconSetting(hide) {
  if (!isMac || !app.dock) return;
  if (hide) {
    app.dock.hide();
    return;
  }
  app.dock.show();
}

module.exports = {
  applyDockIconSetting,
};
