# Recast

Recast is a small Mac app for quickly rewriting text with better grammar and tone presets. It runs **local AI**, so your text stays on your machine (no cloud).

## What it does

- **Rewrite modes**: Correct, Shorter, Longer, Casual, Formal, Friendly, Direct, Polite, Gen Z (0–10 intensity), Flirty (1–10 intensity)
- **Global hotkey**: Press **Option+Tab** to show/hide Recast from anywhere on your Mac

## Download & install (macOS)

- **Download**: Get the latest build from [GitHub Releases](https://github.com/stefanphan05/MessageRewriter/releases/latest) (or the `/download` page when deployed).
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
