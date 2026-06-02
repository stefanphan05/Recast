"use client";

import {
  MAX_CHARS,
  TEXTAREA_MIN_COMPACT_PX,
  TEXTAREA_MIN_HEIGHT_PX,
} from "@/components/rewrite/constants";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import { useRef } from "react";

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  compact: boolean;
};

export default function MessageInput({
  value,
  onChange,
  compact,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResizeTextarea(textareaRef, value, compact);

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor="message-input"
          className="text-[11px] uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500"
        >
          Your message
        </label>
        <span
          className="tabular-nums text-sm text-neutral-500 dark:text-neutral-400"
          aria-live="polite"
        >
          {value.length} / {MAX_CHARS}
        </span>
      </div>
      <textarea
        ref={textareaRef}
        id="message-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste or type the text you want to rewrite…"
        rows={1}
        maxLength={MAX_CHARS}
        className="mt-2 w-full resize-none overflow-hidden rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-3.5 text-[15px] leading-relaxed text-neutral-950 shadow-sm placeholder:text-neutral-400 outline-none transition-[border-color,box-shadow,background-color] focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200/80 focus:ring-inset dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-neutral-600 dark:focus:ring-neutral-700/50"
        style={{
          minHeight: compact
            ? TEXTAREA_MIN_COMPACT_PX
            : TEXTAREA_MIN_HEIGHT_PX,
        }}
      />
    </div>
  );
}
