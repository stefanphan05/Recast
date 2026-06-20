"use client";

import {
  EXPANDED_BLOCK_GAP_CLASS,
  ICON_ACTION_BTN_SECONDARY_CLASS,
  PANEL_SURFACE_CLASS,
} from "@/components/rewrite/constants";
import {
  CloseWindowButton,
  DRAG_STYLE,
  NO_DRAG_STYLE,
} from "@/components/WindowChrome";
import { useEffect, useState } from "react";

type OutputPanelProps = {
  result: string;
  isLoading: boolean;
  onStartOver: () => void;
  className?: string;
};

export default function OutputPanel({
  result,
  isLoading,
  onStartOver,
  className = "",
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeoutId = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
  }

  return (
    <div
      className={`flex min-h-0 flex-col ${EXPANDED_BLOCK_GAP_CLASS} ${className}`}
      aria-live="polite"
      aria-busy={isLoading}
    >
      <div className="flex h-9 shrink-0 items-center">
        <div className="h-full min-w-0 flex-1" style={DRAG_STYLE} aria-hidden />
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onStartOver}
            aria-label="Start over"
            className={`${ICON_ACTION_BTN_SECONDARY_CLASS} cursor-pointer`}
            style={NO_DRAG_STYLE}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
          {!isLoading && result ? (
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy to clipboard"}
              className={`${ICON_ACTION_BTN_SECONDARY_CLASS} cursor-pointer`}
              style={NO_DRAG_STYLE}
            >
              {copied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect width="13" height="13" x="9" y="9" rx="2" />
                  <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                </svg>
              )}
            </button>
          ) : null}
          <CloseWindowButton />
        </div>
      </div>

      <section
        className={`${PANEL_SURFACE_CLASS} flex min-h-0 flex-1 flex-col p-2.5`}
      >
        <div className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto py-0.5 pr-1">
          {isLoading ? (
            <div className="flex flex-col gap-3" aria-hidden>
              <div className="h-4 animate-pulse rounded-md bg-neutral-200/90 dark:bg-neutral-700/90" />
              <div className="h-4 w-[94%] animate-pulse rounded-md bg-neutral-200/90 dark:bg-neutral-700/90" />
              <div className="h-4 w-[72%] animate-pulse rounded-md bg-neutral-200/90 dark:bg-neutral-700/90" />
            </div>
          ) : (
            <p className="output-fade-in whitespace-pre-wrap text-[15px] leading-snug text-neutral-950 dark:text-neutral-50">
              {result}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
