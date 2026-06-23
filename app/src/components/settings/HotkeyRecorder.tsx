"use client";

import { formatHotkeyDisplay } from "@/lib/hotkey";
import { useHotkeyRecorder } from "@/hooks/useHotkeyRecorder";

type HotkeyRecorderProps = {
  hotkey: string;
  showRestoreDefault?: boolean;
  variant?: "settings" | "embedded";
};

export default function HotkeyRecorder({
  hotkey: initialHotkey,
  showRestoreDefault = true,
  variant = "settings",
}: HotkeyRecorderProps) {
  const {
    hotkey,
    conflictHotkey,
    recording,
    saving,
    errorMessage,
    saved,
    startRecording,
    restoreDefault,
  } = useHotkeyRecorder(initialHotkey);

  const hasConflict = Boolean(conflictHotkey);
  const displayHotkey = conflictHotkey ?? hotkey;
  const isEmbedded = variant === "embedded";
  const buttonClass = isEmbedded
    ? "border-[var(--border)] bg-[var(--surface-elevated)]"
    : "border-[var(--settings-border)] bg-[var(--settings-panel)]";
  const displayClass = isEmbedded
    ? buttonClass
    : "border-[var(--settings-border)] bg-[rgba(255,255,255,0.03)]";

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div
          className={`flex min-w-[160px] items-center justify-center rounded-xl border px-4 py-3 font-mono text-sm ${
            hasConflict
              ? "border-red-400 bg-red-50 text-red-700 dark:border-red-500/70 dark:bg-red-950/40 dark:text-red-300"
              : displayClass
          }`}
          aria-invalid={hasConflict}
        >
          {formatHotkeyDisplay(displayHotkey)}
        </div>
        <button
          type="button"
          onClick={startRecording}
          disabled={recording || saving}
          className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[rgba(244,201,120,0.24)] hover:bg-[rgba(244,201,120,0.08)] disabled:cursor-not-allowed disabled:opacity-50 ${buttonClass}`}
        >
          {recording ? "Press keys…" : saving ? "Saving…" : "Change shortcut"}
        </button>
        {showRestoreDefault ? (
          <button
            type="button"
            onClick={() => void restoreDefault()}
            disabled={recording || saving}
            className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[rgba(244,201,120,0.24)] hover:bg-[rgba(244,201,120,0.08)] disabled:cursor-not-allowed disabled:opacity-50 ${buttonClass}`}
          >
            Restore default
          </button>
        ) : null}
      </div>

      {recording ? (
        <p className="mt-3 text-xs text-[var(--muted)]">
          Press the key combination you want to use. Press Esc to cancel.
        </p>
      ) : null}

      {saved ? (
        <p className="mt-3 text-sm text-emerald-300">
          Shortcut saved.
        </p>
      ) : null}

      {errorMessage ? (
        <p
          className="mt-3 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}
    </>
  );
}
