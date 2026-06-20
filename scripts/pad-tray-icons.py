#!/usr/bin/env python3
"""Add transparent padding so tray icons match macOS menu bar visual weight."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

# Neighboring menu bar icons leave ~20-24% transparent margin.
GLYPH_SCALE = 0.76

ROOT = Path(__file__).resolve().parents[1]
ICONS = [
    (ROOT / "src/app/menu-icon-22.png", 22),
    (ROOT / "src/app/menu-icon-44.png", 44),
]


def pad_icon(source: Path, canvas: int) -> None:
    image = Image.open(source).convert("RGBA")
    glyph_size = max(1, round(canvas * GLYPH_SCALE))
    glyph = image.resize((glyph_size, glyph_size), Image.Resampling.LANCZOS)

    padded = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    offset = (canvas - glyph_size) // 2
    padded.paste(glyph, (offset, offset), glyph)
    padded.save(source, format="PNG", optimize=True)


def main() -> int:
    for path, size in ICONS:
        if not path.exists():
            print(f"missing: {path}", file=sys.stderr)
            return 1
        pad_icon(path, size)
        print(f"padded {path.name} ({size}px canvas, {round(size * GLYPH_SCALE)}px glyph)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
