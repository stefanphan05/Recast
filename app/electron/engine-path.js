const fs = require("fs");
const os = require("os");
const path = require("path");
const { app } = require("electron");

function getEngineHomePath() {
  return path.join(app.getPath("userData"), "engine");
}

function getOllamaDataPath() {
  return path.join(getEngineHomePath(), ".ollama");
}

function getLocalModelsPath() {
  return path.join(getOllamaDataPath(), "models");
}

function hasModelFiles(modelsPath) {
  try {
    const manifestsDir = path.join(modelsPath, "manifests");
    return (
      fs.existsSync(manifestsDir) &&
      fs.readdirSync(manifestsDir, { withFileTypes: true }).length > 0
    );
  } catch {
    return false;
  }
}

function migrateLegacyModels(modelsPath) {
  if (hasModelFiles(modelsPath)) return;

  const legacyPaths = [
    path.join(app.getPath("userData"), "models"),
    path.join(os.homedir(), ".ollama", "models"),
  ];

  for (const legacyPath of legacyPaths) {
    if (legacyPath === modelsPath || !hasModelFiles(legacyPath)) continue;

    fs.cpSync(legacyPath, modelsPath, { recursive: true, force: true });
    return;
  }
}

function ensureEngineHome() {
  const engineHome = getEngineHomePath();
  const modelsPath = getLocalModelsPath();

  fs.mkdirSync(modelsPath, { recursive: true });
  migrateLegacyModels(modelsPath);

  return engineHome;
}

function getEngineEnv() {
  const engineHome = ensureEngineHome();

  return {
    HOME: engineHome,
    OLLAMA_MODELS: getLocalModelsPath(),
  };
}

module.exports = {
  ensureEngineHome,
  getEngineEnv,
  getEngineHomePath,
  getLocalModelsPath,
};
