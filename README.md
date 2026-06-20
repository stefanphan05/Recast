# Recast

Rewrite messages with better grammar and style presets:

- `Grammar` — fix mistakes only
- `Shorter` / `Formal` / `Casual`
- `GenZ` (with 0–10 intensity slider)
- `Flirt` (with 1–10 cringe intensity slider)

Recast runs **local AI via Ollama** — your text never leaves your Mac.

## Download for Mac

Get the latest build from [GitHub Releases](https://github.com/stefanphan05/MessageRewriter/releases/latest) or the [download page](/download) when deployed.

**First launch (unsigned build):** right-click Recast → **Open** to bypass Gatekeeper.

The in-app setup wizard will guide you to install [Ollama](https://ollama.com) and download an AI model.

Press **Option+Tab** to show or hide Recast from anywhere on your Mac.

## Development

### Web (Next.js)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Requires Ollama running locally at `http://localhost:11434`.

Optional env override:

```bash
NEXT_PUBLIC_OLLAMA_MODEL=llama3.2
```

### Electron desktop

```bash
npm run electron:dev
```

Build a Mac `.dmg` and `.zip` locally:

```bash
npm run electron:build
```

Output goes to `dist/`.

## Release a new Mac build

1. Bump the version in `package.json`
2. Commit and push
3. Tag and push:

```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions builds the Mac app and publishes assets to the GitHub Release.

**Note:** Builds are unsigned. Users must right-click → Open on first launch. Code signing and notarization can be added later with an Apple Developer account.

## Deploy website to Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Deploy

The site includes a `/download` page linking to GitHub Releases.

## Architecture

- **Frontend:** Next.js (static export for Electron)
- **Desktop:** Electron with global hotkey overlay
- **AI:** Ollama at `localhost:11434` — model chosen in first-run setup, stored in Electron user settings
