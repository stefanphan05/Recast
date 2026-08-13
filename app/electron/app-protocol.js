const fs = require("fs");
const path = require("path");

function getOutDir() {
  return path.resolve(path.join(__dirname, "../out"));
}

function resolveAppPath(urlPathname) {
  const outDir = getOutDir();
  let pathname = decodeURIComponent(urlPathname).replace(/^\/+/, "");

  if (!pathname) {
    return path.join(outDir, "index.html");
  }

  pathname = pathname.replace(/\/+$/, "");
  const candidate = path.join(outDir, pathname);

  if (fs.existsSync(candidate)) {
    const stat = fs.statSync(candidate);
    if (stat.isFile()) {
      return candidate;
    }
    if (stat.isDirectory()) {
      const indexInDir = path.join(candidate, "index.html");
      if (fs.existsSync(indexInDir)) {
        return indexInDir;
      }
    }
  }

  const routeIndex = path.join(outDir, pathname, "index.html");
  if (fs.existsSync(routeIndex)) {
    return routeIndex;
  }

  return path.join(outDir, "index.html");
}

function loadWindowRoute(win, route, isDev) {
  if (isDev) {
    win.loadURL(`http://localhost:3000${route}`);
    return;
  }

  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
  win.loadURL(`app://localhost${normalizedRoute}`);
}

module.exports = {
  getOutDir,
  resolveAppPath,
  loadWindowRoute,
};
