"use client";

import StylePicker from "@/components/rewrite/StylePicker";
import { MAX_CHARS, PANEL_SURFACE_CLASS } from "@/components/rewrite/constants";
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
}: PromptComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResizeTextarea(textareaRef, value, compact ? "compact" : "landing");

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    if (canSubmit) onSubmit();
  }

  return (
    <div className={`${PANEL_SURFACE_CLASS} p-2.5`}>
      <StylePicker
        variant="embedded"
        style={style}
        onStyleChange={onStyleChange}
        genzIntensity={genzIntensity}
        onGenzIntensityChange={onGenzIntensityChange}
        flirtIntensity={flirtIntensity}
        onFlirtIntensityChange={onFlirtIntensityChange}
      />

      {compact ? (
        <div className="mt-1.5 flex items-center gap-2">
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
            className="scrollbar-subtle min-w-0 flex-1 resize-none bg-transparent py-0.5 pr-1 text-[15px] leading-snug text-neutral-950 outline-none placeholder:text-neutral-400 dark:text-neutral-50 dark:placeholder:text-neutral-500"
          />
          <SendButton
            canSubmit={canSubmit}
            isLoading={isLoading}
            onClick={onSubmit}
          />
        </div>
      ) : (
        <div className="mt-1.5 flex flex-col gap-1">
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
            className="scrollbar-subtle block w-full resize-none bg-transparent py-0.5 pr-1 text-[15px] leading-snug text-neutral-950 outline-none placeholder:text-neutral-400 dark:text-neutral-50 dark:placeholder:text-neutral-500"
          />

          <div className="flex justify-end">
            <SendButton
              canSubmit={canSubmit}
              isLoading={isLoading}
              onClick={onSubmit}
            />
          </div>
        </div>
      )}
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
      className={`flex h-8 w-8 shrink-0 appearance-none items-center justify-center rounded-full border-0 outline-none transition-colors ${
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
