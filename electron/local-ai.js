const { spawn, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { LOCAL_AI_BASE } = require("./local-ai-config");
const { getEngineEnv } = require("./engine-path");

const ENGINE_APP_PATH = "/Applications/Ollama.app";
const ENGINE_APP_BINARY = path.join(
  ENGINE_APP_PATH,
  "Contents",
  "Resources",
  "ollama",
);

/** @type {import("child_process").ChildProcess | null} */
let startedServeProcess = null;

async function checkLocalAIRunning() {
  try {
    const response = await fetch(LOCAL_AI_BASE);
    return response.ok;
  } catch {
    return false;
  }
}

function findEngineBinary() {
  const candidates = [
    "/usr/local/bin/ollama",
    "/opt/homebrew/bin/ollama",
    ENGINE_APP_BINARY,
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  const which = spawnSync("which", ["ollama"], { encoding: "utf8" });
  if (which.status === 0 && which.stdout.trim()) {
    return which.stdout.trim();
  }

  return null;
}

function modelMatches(name, model) {
  return name === model || name.startsWith(`${model}:`);
}

async function waitForEngine(timeoutMs = 15000, intervalMs = 500) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await checkLocalAIRunning()) return true;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return false;
}

function startEngineServe() {
  const binary = findEngineBinary();
  if (!binary) return false;

  const binaryDir = path.dirname(binary);
  const env = {
    ...process.env,
    ...getEngineEnv(),
    OLLAMA_HOST: LOCAL_AI_BASE.replace(/^https?:\/\//, ""),
  };
  if (binary === ENGINE_APP_BINARY) {
    env.PATH = `${binaryDir}${path.delimiter}${env.PATH ?? ""}`;
  }

  startedServeProcess = spawn(binary, ["serve"], {
    detached: true,
    stdio: "ignore",
    cwd: binaryDir,
    env,
  });
  startedServeProcess.unref();
  return true;
}

async function ensureEngineRunning() {
  if (await checkLocalAIRunning()) return true;

  // Run headless on Recast's dedicated port — never reuse a system Ollama on 11434.
  if (startEngineServe()) {
    return waitForEngine();
  }

  return false;
}

function isEngineInstalled() {
  return fs.existsSync(ENGINE_APP_PATH) || findEngineBinary() !== null;
}

async function isModelInstalled(model) {
  try {
    const tagsResponse = await fetch(`${LOCAL_AI_BASE}/api/tags`);
    if (!tagsResponse.ok) return false;

    const tags = await tagsResponse.json();
    return (tags.models ?? []).some((entry) =>
      modelMatches(entry.name ?? "", model),
    );
  } catch {
    return false;
  }
}

async function warmUpModel(model) {
  if (!model) return false;

  try {
    const installed = await isModelInstalled(model);
    if (!installed) return false;

    const response = await fetch(`${LOCAL_AI_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "hi" }],
        stream: false,
        keep_alive: "24h",
        options: { num_predict: 1 },
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function ensureLocalAIReady(model, options = {}) {
  const { warmUp = true } = options;
  const running = await ensureEngineRunning();
  if (!running) {
    console.warn("Could not start local AI engine automatically.");
    return { running: false, warmed: false, installed: isEngineInstalled() };
  }

  if (model && warmUp) {
    const warmed = await warmUpModel(model);
    return { running: true, warmed, installed: true };
  }

  return { running: true, warmed: false, installed: true };
}

function stopLocalAIIfStartedByUs() {
  if (!startedServeProcess || startedServeProcess.killed) return;

  try {
    process.kill(-startedServeProcess.pid, "SIGTERM");
  } catch {
    startedServeProcess.kill("SIGTERM");
  }

  startedServeProcess = null;
}

module.exports = {
  checkLocalAIRunning,
  ensureLocalAIReady,
  isEngineInstalled,
  isModelInstalled,
  warmUpModel,
  stopLocalAIIfStartedByUs,
};
