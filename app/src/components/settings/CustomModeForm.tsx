"use client";

import {
  MAX_CUSTOM_MODE_LABEL_LENGTH,
  MAX_CUSTOM_MODE_PROMPT_LENGTH,
} from "@/lib/rewrite";
import { useState, type KeyboardEvent } from "react";

const PROMPT_PLACEHOLDER =
  "Rewrite as a terse Slack standup update. Bullet points, no greeting, no sign-off.";

const FIELD_CLASS =
  "w-full rounded-lg border border-[var(--settings-border)] bg-[var(--settings-panel)] px-3 py-2 text-sm text-neutral-950 transition-colors placeholder:text-neutral-400 focus:border-neutral-400/70 focus:outline-none dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-neutral-500/70";

const LABEL_CLASS =
  "text-xs font-medium text-neutral-600 dark:text-neutral-400";

type CustomModeFormProps = {
  initialLabel?: string;
  initialPrompt?: string;
  submitLabel?: string;
  onCancel: () => void;
  onSave: (values: { label: string; prompt: string }) => void;
};

export default function CustomModeForm({
  initialLabel = "",
  initialPrompt = "",
  submitLabel = "Save mode",
  onCancel,
  onSave,
}: CustomModeFormProps) {
  const [label, setLabel] = useState(initialLabel);
  const [prompt, setPrompt] = useState(initialPrompt);

  const canSave = label.trim().length > 0 && prompt.trim().length > 0;

  function submit() {
    if (!canSave) return;
    onSave({ label: label.trim(), prompt: prompt.trim() });
  }

  /** Escape backs out, Cmd/Ctrl+Enter saves from either field. */
  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
      return;
    }
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div
      onKeyDown={handleKeyDown}
      className="mt-2 space-y-3 rounded-xl border border-[var(--settings-border)] bg-[var(--settings-bg)] p-4"
    >
      <div className="space-y-1.5">
        <label htmlFor="custom-mode-title" className={LABEL_CLASS}>
          Title
        </label>
        <input
          id="custom-mode-title"
          type="text"
          autoFocus
          value={label}
          maxLength={MAX_CUSTOM_MODE_LABEL_LENGTH}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Slack standup"
          className={FIELD_CLASS}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="custom-mode-prompt" className={LABEL_CLASS}>
          Prompt
        </label>
        <textarea
          id="custom-mode-prompt"
          rows={4}
          value={prompt}
          maxLength={MAX_CUSTOM_MODE_PROMPT_LENGTH}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={PROMPT_PLACEHOLDER}
          className={`${FIELD_CLASS} resize-y`}
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            Describe how Recast should rewrite the message in this mode.
          </p>
          <span className="shrink-0 text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
            {prompt.length}/{MAX_CUSTOM_MODE_PROMPT_LENGTH}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-xl border border-[var(--settings-border)] bg-[var(--settings-panel)] px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400/70 dark:text-neutral-300 dark:hover:border-neutral-500/70"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!canSave}
          onClick={submit}
          className="cursor-pointer rounded-xl bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-950"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
