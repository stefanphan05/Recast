"use client";

import { formatHotkeyDisplay, keyboardEventToAccelerator } from "@/lib/hotkey";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useCallback, useEffect, useState } from "react";

export default function ShortcutsSection() {
  const { settings } = useAppSettings();
  const [hotkey, setHotkey] = useState(settings.globalHotkey || "Alt+Tab");
  const [recording, setRecording] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void window.electronAPI?.getHotkey().then((next) => {
      setHotkey(next);
    });
  }, [settings.globalHotkey]);

  const handleKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      if (!recording) return;

      event.preventDefault();
      event.stopPropagation();

      if (event.key === "Escape") {
        setRecording(false);
        return;
      }

      const accelerator = keyboardEventToAccelerator(event);
      if (!accelerator) return;

      setRecording(false);
      setSaving(true);
      setErrorMessage(null);
      setSaved(false);

      const result = await window.electronAPI?.setHotkey(accelerator);
      setSaving(false);

      if (!result?.ok) {
        setErrorMessage(result?.error ?? "Could not save shortcut.");
        return;
      }

      setHotkey(result.accelerator ?? accelerator);
      setSaved(true);
    },
    [recording],
  );

  useEffect(() => {
    if (!recording) return;

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [recording, handleKeyDown]);

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

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex min-w-[160px] items-center justify-center rounded-xl border border-[var(--settings-border)] bg-neutral-50 px-4 py-3 font-mono text-sm dark:bg-neutral-900">
            {formatHotkeyDisplay(hotkey)}
          </div>
          <button
            type="button"
            onClick={() => {
              setRecording(true);
              setErrorMessage(null);
              setSaved(false);
            }}
            disabled={recording || saving}
            className="cursor-pointer rounded-xl border border-[var(--settings-border)] bg-[var(--settings-panel)] px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400/70 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-300 dark:hover:border-neutral-500/70"
          >
            {recording ? "Press keys…" : saving ? "Saving…" : "Change shortcut"}
          </button>
        </div>

        {recording ? (
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
            Press the key combination you want to use. Press Esc to cancel.
          </p>
        ) : null}

        {saved ? (
          <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-400">
            Shortcut saved.
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        ) : null}
      </section>
    </div>
  );
}
