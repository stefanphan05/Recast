"use client";

import HotkeyRecorder from "@/components/settings/HotkeyRecorder";
import { getEffectiveHotkey } from "@/lib/hotkey";
import { useAppSettings } from "@/hooks/useAppSettings";

export default function ShortcutsSection() {
  const { settings } = useAppSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">
          Shortcuts
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Choose a keyboard shortcut to show or hide Recast from anywhere.
        </p>
      </div>

      <section className="rounded-2xl border border-[var(--settings-border)] bg-[var(--settings-panel)] p-5">
        <h3 className="text-sm font-medium text-neutral-950 dark:text-neutral-50">
          Show Recast
        </h3>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Press the shortcut once to open Recast, and again to hide it.
        </p>

        <HotkeyRecorder hotkey={getEffectiveHotkey(settings.globalHotkey)} />
      </section>
    </div>
  );
}
