# Recast

Recast is a small Mac app for quickly rewriting text with better grammar and tone presets. It runs **local AI**, so your text stays on your machine (no cloud).

This repo is split into two packages:

- **`app/`** — the Electron Mac app (rewrite UI, settings, local AI)
- **`website/`** — the marketing site (landing page + download)

## What it does

- **Rewrite modes**: Correct, Shorter, Longer, Casual, Formal, Friendly, Direct, Polite, Gen Z (0–10 intensity), Flirty (1–10 intensity)
- **Global hotkey**: Press **Option+Tab** to show/hide Recast from anywhere on your Mac

## Development

```bash
npm install

# Mac app (Electron + Next.js on port 3000)
npm run electron:dev

# Marketing website (Next.js on port 3001)
npm run dev:website
```

## Build

```bash
# Mac app (.dmg / .zip in app/dist)
npm run electron:build

# Static marketing site (website/out)
npm run build:website
```

## Deploy the website (Vercel)

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Leave the root directory as `.` — `vercel.json` at the repo root builds `website/out`
4. Deploy

To use a custom domain, add it in Vercel project settings.

### Add screenshots

Drop PNG or WebP images into `website/public/demos/` and update paths in `website/src/lib/demos.ts`:

- `hero` — main hero screenshot
- `tones`, `hotkey`, `private`, `fast` — feature tab screenshots

Placeholder SVGs live in `website/public/demos/posters/` until you replace them.

## Download & install (macOS)

- **Download**: Get the latest build from [GitHub Releases](https://github.com/stefanphan05/MessageRewriter/releases/latest) or the website download page.
- **Move to Applications**: Drag `Recast.app` into **Applications**.
- **First launch**: Because builds are currently **unsigned**, macOS may block the app. Right-click `Recast` → **Open** to bypass Gatekeeper.

### If macOS shows “can’t be opened” / “damaged” / blocked

Remove Apple’s quarantine attribute from the app:

```bash
xattr -cr /Applications/Recast.app
```

Then try opening Recast again.

## First run

Recast will guide you to install a local AI model, then you’re ready to rewrite.
