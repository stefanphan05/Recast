const crypto = require("crypto");
const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require("path");
const { spawnSync } = require("child_process");
const {
  getManagedEngineBinaryPath,
  getManagedEngineDir,
  getManagedEngineVersionPath,
} = require("./engine-path");

/** Pinned Ollama CLI release used by Recast's managed engine. */
const OLLAMA_VERSION = "0.32.9";
const OLLAMA_ARCHIVE_SHA256 =
  "17a5b096d4515d00a6415012db847a2b353b389ed7ab33d025e3b98c2f05b49c";
const OLLAMA_DOWNLOAD_URL = `https://github.com/ollama/ollama/releases/download/v${OLLAMA_VERSION}/ollama-darwin.tgz`;

/** @type {Promise<boolean> | null} */
let installInFlight = null;

function emitProgress(onProgress, progress) {
  if (typeof onProgress === "function") {
    onProgress(progress);
  }
}

function isManagedEngineInstalled() {
  const binary = getManagedEngineBinaryPath();
  if (!fs.existsSync(binary)) return false;

  try {
    const version = fs.readFileSync(getManagedEngineVersionPath(), "utf8").trim();
    return version === OLLAMA_VERSION;
  } catch {
    // Binary exists without a version marker — treat as usable.
    return true;
  }
}

function followRedirects(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 8) {
      reject(new Error("Too many redirects while downloading the AI engine."));
      return;
    }

    const client = url.startsWith("https:") ? https : http;
    const request = client.get(url, (response) => {
      const status = response.statusCode ?? 0;
      if ([301, 302, 303, 307, 308].includes(status) && response.headers.location) {
        response.resume();
        const nextUrl = new URL(response.headers.location, url).toString();
        resolve(followRedirects(nextUrl, redirectCount + 1));
        return;
      }

      if (status < 200 || status >= 300) {
        response.resume();
        reject(new Error(`Engine download failed with status ${status}.`));
        return;
      }

      resolve(response);
    });

    request.on("error", reject);
  });
}

async function downloadArchive(destPath, onProgress) {
  emitProgress(onProgress, {
    phase: "downloading",
    percent: 0,
    message: "Downloading local AI engine…",
  });

  const response = await followRedirects(OLLAMA_DOWNLOAD_URL);
  const totalBytes = Number(response.headers["content-length"] || 0);
  const hash = crypto.createHash("sha256");

  await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    let received = 0;
    let lastPercent = -1;

    response.on("data", (chunk) => {
      received += chunk.length;
      hash.update(chunk);
      if (totalBytes > 0) {
        const percent = Math.min(99, Math.floor((received / totalBytes) * 100));
        if (percent !== lastPercent) {
          lastPercent = percent;
          emitProgress(onProgress, {
            phase: "downloading",
            percent,
            message: "Downloading local AI engine…",
          });
        }
      }
    });

    response.pipe(file);
    file.on("finish", () => file.close((error) => (error ? reject(error) : resolve())));
    file.on("error", reject);
    response.on("error", reject);
  });

  const digest = hash.digest("hex");
  if (digest !== OLLAMA_ARCHIVE_SHA256) {
    throw new Error("Downloaded AI engine failed integrity check.");
  }

  emitProgress(onProgress, {
    phase: "downloading",
    percent: 100,
    message: "Downloading local AI engine…",
  });
}

function clearQuarantine(targetPath) {
  spawnSync("xattr", ["-cr", targetPath], { encoding: "utf8" });
}

function extractArchive(archivePath, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  const result = spawnSync(
    "tar",
    ["-xzf", archivePath, "-C", destDir],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() || "Failed to extract the local AI engine.",
    );
  }
}

async function installManagedEngine(onProgress) {
  const runtimeDir = getManagedEngineDir();
  const stagingDir = `${runtimeDir}.installing`;
  const downloadsDir = path.join(path.dirname(runtimeDir), "downloads");
  const archivePath = path.join(
    downloadsDir,
    `ollama-darwin-${OLLAMA_VERSION}.tgz`,
  );

  fs.rmSync(stagingDir, { recursive: true, force: true });
  fs.mkdirSync(downloadsDir, { recursive: true });
  fs.mkdirSync(stagingDir, { recursive: true });

  try {
    await downloadArchive(archivePath, onProgress);

    emitProgress(onProgress, {
      phase: "extracting",
      message: "Installing local AI engine…",
    });

    extractArchive(archivePath, stagingDir);
    clearQuarantine(stagingDir);

    const stagedBinary = path.join(stagingDir, "ollama");
    if (!fs.existsSync(stagedBinary)) {
      throw new Error("Engine archive did not contain an ollama binary.");
    }
    fs.chmodSync(stagedBinary, 0o755);

    fs.rmSync(runtimeDir, { recursive: true, force: true });
    fs.renameSync(stagingDir, runtimeDir);
    fs.writeFileSync(getManagedEngineVersionPath(), `${OLLAMA_VERSION}\n`, "utf8");
    clearQuarantine(runtimeDir);

    emitProgress(onProgress, {
      phase: "ready",
      message: "Local AI engine installed.",
    });

    return true;
  } catch (error) {
    fs.rmSync(stagingDir, { recursive: true, force: true });
    emitProgress(onProgress, {
      phase: "error",
      message:
        error instanceof Error
          ? error.message
          : "Could not install the local AI engine.",
    });
    throw error;
  } finally {
    fs.rmSync(archivePath, { force: true });
  }
}

async function ensureManagedEngineInstalled(onProgress) {
  if (isManagedEngineInstalled()) return true;

  if (installInFlight) {
    return installInFlight;
  }

  installInFlight = installManagedEngine(onProgress)
    .then(() => true)
    .catch((error) => {
      console.error("Managed AI engine install failed:", error);
      return false;
    })
    .finally(() => {
      installInFlight = null;
    });

  return installInFlight;
}

module.exports = {
  OLLAMA_VERSION,
  ensureManagedEngineInstalled,
  isManagedEngineInstalled,
};
