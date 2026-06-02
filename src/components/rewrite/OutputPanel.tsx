"use client";

import { useEffect, useState } from "react";

type OutputPanelProps = {
  result: string;
  isLoading: boolean;
};

export default function OutputPanel({ result, isLoading }: OutputPanelProps) {
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
      className="flex min-h-0 flex-1 flex-col gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-800"
      aria-live="polite"
      aria-busy={isLoading}
    >
      <p className="shrink-0 text-[11px] uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
        Output
      </p>
      <section className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
        {isLoading ? (
          <div className="flex flex-col gap-3 py-0.5" aria-hidden>
            <div className="h-4 animate-pulse rounded-md bg-neutral-200/90 dark:bg-neutral-700/90" />
            <div className="h-4 w-[94%] animate-pulse rounded-md bg-neutral-200/90 dark:bg-neutral-700/90" />
            <div className="h-4 w-[72%] animate-pulse rounded-md bg-neutral-200/90 dark:bg-neutral-700/90" />
          </div>
        ) : (
          <p className="output-fade-in whitespace-pre-wrap text-[15px] leading-relaxed text-neutral-950 dark:text-neutral-50">
            {result}
          </p>
        )}
      </section>
      {!isLoading && result ? (
        <div className="flex h-9 shrink-0 items-center justify-end">
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy to clipboard"}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-transparent text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-neutral-600 focus-visible:bg-neutral-200/70 focus-visible:text-neutral-600 focus-visible:outline-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 dark:focus-visible:bg-neutral-800 dark:focus-visible:text-neutral-200"
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
        </div>
      ) : null}
    </div>
  );
}
