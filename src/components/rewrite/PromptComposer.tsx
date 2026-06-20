"use client";

import StylePicker from "@/components/rewrite/StylePicker";
import { MAX_CHARS } from "@/components/rewrite/constants";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import type { RewriteStyle } from "@/lib/rewrite";
import { useRef, type KeyboardEvent } from "react";

type PromptComposerProps = {
  value: string;
  onChange: (value: string) => void;
  style: RewriteStyle;
  onStyleChange: (style: RewriteStyle) => void;
  genzIntensity: number;
  onGenzIntensityChange: (value: number) => void;
  flirtIntensity: number;
  onFlirtIntensityChange: (value: number) => void;
  canSubmit: boolean;
  isLoading: boolean;
  compact: boolean;
  onSubmit: () => void;
  onOpenSettings?: () => void;
};

export default function PromptComposer({
  value,
  onChange,
  style,
  onStyleChange,
  genzIntensity,
  onGenzIntensityChange,
  flirtIntensity,
  onFlirtIntensityChange,
  canSubmit,
  isLoading,
  compact,
  onSubmit,
  onOpenSettings,
}: PromptComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResizeTextarea(textareaRef, value, compact ? "compact" : "landing");

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    if (canSubmit) onSubmit();
  }

  return (
    <div className="glass-elevated rounded-[26px] border p-3 shadow-sm">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <StylePicker
            variant="embedded"
            style={style}
            onStyleChange={onStyleChange}
            genzIntensity={genzIntensity}
            onGenzIntensityChange={onGenzIntensityChange}
            flirtIntensity={flirtIntensity}
            onFlirtIntensityChange={onFlirtIntensityChange}
          />
        </div>
        {onOpenSettings ? (
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="AI model settings"
            className="mt-0.5 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        ) : null}
      </div>

      <div className="relative mt-2 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          id="message-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste or type your message…"
          rows={1}
          maxLength={MAX_CHARS}
          autoFocus
          className="min-w-0 flex-1 resize-none overflow-hidden bg-transparent py-1.5 text-[15px] leading-relaxed text-neutral-950 outline-none placeholder:text-neutral-400 dark:text-neutral-50 dark:placeholder:text-neutral-500"
        />

        <SendButton
          canSubmit={canSubmit}
          isLoading={isLoading}
          onClick={onSubmit}
        />
      </div>

      {compact && value.length > 0 ? (
        <p className="mt-1 text-right text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
          {value.length} / {MAX_CHARS}
        </p>
      ) : null}
    </div>
  );
}

function SendButton({
  canSubmit,
  isLoading,
  onClick,
}: {
  canSubmit: boolean;
  isLoading: boolean;
  onClick: () => void;
}) {
  const enabled = canSubmit || isLoading;

  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={onClick}
      aria-label={isLoading ? "Rewriting" : "Rewrite message"}
      aria-busy={isLoading}
      className={`mb-0.5 flex h-8 w-8 shrink-0 appearance-none items-center justify-center rounded-full border-0 outline-none transition-colors ${
        enabled
          ? "cursor-pointer bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
          : "cursor-not-allowed bg-[#b8b8b8] text-[#ffffff] dark:bg-[#2a2a2a] dark:text-[#737373]"
      } ${isLoading ? "cursor-wait" : ""}`}
    >
      {isLoading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white dark:border-neutral-950/25 dark:border-t-neutral-950"
          aria-hidden
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      )}
    </button>
  );
}
