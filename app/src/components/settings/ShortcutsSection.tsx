"use client";

import HotkeyRecorder from "@/components/settings/HotkeyRecorder";
import { getEffectiveHotkey } from "@/lib/hotkey";
import { useAppSettings } from "@/hooks/useAppSettings";

export default function ShortcutsSection() {
  const { settings } = useAppSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Shortcuts
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Choose a keyboard shortcut to show or hide Recast from anywhere.
        </p>
      </div>

      <section className="app-panel-shadow rounded-[24px] border border-[var(--settings-border)] bg-[var(--settings-panel)] p-5 backdrop-blur-xl">
        <h3 className="text-sm font-medium text-[var(--foreground)]">
          Show Recast
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Press the shortcut once to open Recast, and again to hide it.
        </p>

        <HotkeyRecorder hotkey={getEffectiveHotkey(settings.globalHotkey)} />
      </section>
    </div>
  );
}
