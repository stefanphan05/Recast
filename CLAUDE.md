# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Recast is a Mac menu-bar app that rewrites selected text in different tones/styles (Correct, Shorter, Longer, Casual, Formal, Friendly, Direct, Polite, Gen Z, Flirty) using a **local** LLM via Ollama — no cloud calls, text never leaves the machine. The user summons it anywhere with a global hotkey (default **Option+Tab**), types or pastes text, and gets a rewritten result.

npm workspaces monorepo with two independent Next.js packages:

- **`app/`** (`recast-app`) — the Electron Mac app: rewrite UI, settings, local AI engine management
- **`website/`** (`recast-website`) — the marketing/landing site, statically exported and deployed to Vercel

The two packages don't share code or types; treat them as separate projects that happen to live in one repo.

## Commands

Run from the repo root unless noted. Root scripts delegate to the workspace via `npm run <script> -w <workspace>`.

```bash
npm install                 # install once, for both workspaces

# App (Electron + Next.js on :3000)
npm run electron:dev        # next dev + electron, live reload
npm run electron:build      # next build (static export) + electron-builder --mac -> app/dist/*.dmg,*.zip
npm run electron:preview    # static-export build, running against the built `out/` (no dev server)
npm run electron:start      # launch electron against whatever is already in app/out (no build)
npm run dev:app             # next dev only, no Electron shell (useful for fast UI iteration in a browser)
npm run build:app

# Website (Next.js on :3001)
npm run dev:website
npm run build:website       # static export -> website/out (what vercel.json points at)

# Linting (both workspaces)
npm run lint
```

There is no test suite in this repo (no test runner configured, no `*.test.*` files) — do not invent testing commands. Verification is: `npm run lint`, `npm run build:app` / `npm run build:website` to catch type errors (Next's build runs `tsc`), and manually exercising the Electron app for UI changes (see `/run` skill).

To work on a single workspace, `cd app` or `cd website` and run its own `npm run dev` / `lint` / `build` — each has its own `package.json`, `tsconfig.json`, and `eslint.config.mjs`.

## Architecture (`app/`)

### Process split

- **`electron/main.js`** — main process. Owns the frameless always-on-top overlay window (`mainWindow`), the separate `settingsWindow`, the tray icon, the global hotkey registration (`electron/hotkey/hotkey.js` converts `before-input-event` key data to an Electron accelerator string for the in-app hotkey recorder), settings persistence (plain JSON at `app.getPath("userData")/settings.json`, merged over `DEFAULT_SETTINGS`), and all `ipcMain` handlers. The rest of `electron/` is grouped by subsystem: `windows/` (window/tray/menu/dock), `engine/` (Ollama engine lifecycle), `hotkey/` (hotkey recording/registration); `env.js`, `app-protocol.js`, and `settings-store.js` stay at `electron/` root since they're shared across all three.
- **`electron/windows/preload.js`** — the only bridge between renderer and main (`contextIsolation: true`, `nodeIntegration: false`). Exposes `window.electronAPI`; its shape is mirrored in `app/src/types/electron.d.ts`. Any new main<->renderer capability needs changes in both files plus a new `ipcMain.handle`/`ipcMain.on` in `main.js`.
- **Renderer** — a statically-exported Next.js app (`output: "export"`, App Router). In production it's served over a custom `app://` protocol registered in `main.js` (`resolveAppPath` maps URL paths to files in `app/out`); in dev it loads `http://localhost:3000` directly. This means renderer code must not assume a Node/Next server is available at runtime — treat it as a static SPA.

### Window lifecycle is intentional, not a bug

The main window never really "closes" — `close` is intercepted and turns into `hide()` (see `mainWindow.on("close", ...)` in `main.js`) so the hotkey can re-summon it instantly. It's `setVisibleOnAllWorkspaces` + always-on-top so it floats above fullscreen apps. Renderer-driven resizing goes through `electronAPI.setLayout(mode, contentHeight)` / `setContentHeight(height)`, which main.js clamps into `PROMPT_WINDOW_*` bounds — the renderer reports its content height, main.js decides the actual window size. Don't try to resize the window from CSS/renderer directly.

### Local AI engine (Ollama), not a hosted API

There is no backend server and no API route — the renderer talks straight to a local Ollama HTTP server over `fetch`.

- Recast runs its **own** Ollama instance on **port 11435** (`app/electron/engine/local-ai-config.js`), deliberately not the default 11434, so it never collides with a system-wide Ollama the user may already have running. `NEXT_PUBLIC_LOCAL_AI_BASE` / `NEXT_PUBLIC_LOCAL_AI_MODEL` env vars can override the base URL/model for local dev.
- `electron/engine/engine-install.js` + `electron/engine/engine-path.js` manage a **self-contained, per-app copy** of the Ollama binary and model store under `app.getPath("userData")/engine/` (binary in `runtime/`, models/data in `.ollama/`), downloaded on first run if no system Ollama is found. `engine-path.js` also migrates model files from legacy locations (old userData `models/`, `~/.ollama/models`) into the new location.
- `electron/engine/local-ai.js` (main process) is responsible for finding/starting the engine binary, waiting for it to come up, and warming a model. `app/src/lib/rewrite/local-ai.ts` (renderer) is the client that actually issues rewrite requests (`/api/chat`), checks engine/model health, and streams `/api/pull` progress when downloading a model — these are two different files with overlapping names/responsibilities, don't confuse them.
- Rewrite flow: `src/components/rewrite/RewriteWorkspace.tsx` → `src/lib/rewrite/client.ts` (`requestRewrite`, validates params via `validate-input.ts`) → `local-ai.ts` (`rewriteWithLocalAI`, builds the chat request via `prompts.ts`) → sanitizes the model output (`sanitize-output.ts`) before it's shown/copied.
- `src/lib/rewrite/models.ts` defines the recommended/default model IDs and display names shown in onboarding and settings.

### Settings

Single source of truth is the JSON file main.js reads/writes (`readSettings`/`writeSettings`), always merged over `DEFAULT_SETTINGS`. The renderer never touches this file directly — it goes through `electronAPI.getSettings()` / `setSettings()` and reacts to the `settings-changed` broadcast (sent to both windows) via `useAppSettings.tsx`. Changing `selectedModel` from `settings:set` automatically triggers `ensureLocalAIReady` for the new model in main.js.

### Packaging

`electron-builder` config lives inline in `app/package.json` (`build` key), targeting `dmg`/`zip` for mac (arm64-only in practice, per the release workflow). The Electron version is pinned exactly (`electronVersion` in the builder config must match the `electron` devDependency) — bump both together or `electron-builder` will fetch the wrong prebuild. Releases are built by `.github/workflows/release-mac.yml` on `v*` tags, unsigned (users bypass Gatekeeper manually).

## Architecture (`website/`)

Plain static-export Next.js marketing site (App Router), no Electron, no local AI. `src/lib/demos.ts` maps named screenshot slots (`hero`, `tones`, `hotkey`, `private`, `fast`) to image paths under `public/demos/`; placeholders live in `public/demos/posters/` until real screenshots are dropped in. Deployed via Vercel using the root `vercel.json`, which points at `website/out` — the Vercel project root stays `.`, don't change that without updating `vercel.json`.

## Design

Use the frontend-design skill when creating or modifying UI.
