const { app } = require("electron");

const useStaticExport =
  app.isPackaged || process.env.ELECTRON_USE_STATIC === "1";

module.exports = {
  isDev: !useStaticExport,
  isMac: process.platform === "darwin",
};
