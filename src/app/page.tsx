"use client";

import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { useMemo, useState } from "react";

type RewriteStyle = "grammar" | "shorter" | "formal" | "casual" | "genz";

const MAX_CHARS = 2000;
const SERVER_ERROR_MESSAGE = "Server error. Please try again later.";
const RATE_LIMIT_MESSAGE =
  "Too many requests. Please wait a moment and try again.";

const STYLES: { value: RewriteStyle; label: string }[] = [
  { value: "grammar", label: "Correct" },
  { value: "shorter", label: "Shorter" },
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "genz", label: "Gen Z" },
];

export default function Home() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState<RewriteStyle>("grammar");
  const [genzIntensity, setGenzIntensity] = useState(5);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canSubmit = useMemo(() => {
    const trimmedLength = text.trim().length;
    return trimmedLength > 0 && trimmedLength <= MAX_CHARS && !isLoading;
  }, [text, isLoading]);

  async function handleRewrite() {
    if (!canSubmit) return;

    setIsLoading(true);
    setErrorMessage(null);
    setCopied(false);

    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          style,
          ...(style === "genz" ? { genzIntensity } : {}),
          variantCount: 1,
        }),
      });

      const data = (await response.json()) as {
        variants?: { text: string }[];
        message?: string;
      };

      if (!response.ok) {
        if (response.status === 400 && data.message) {
          const validationError = new Error(data.message);
          validationError.name = "ValidationError";
          throw validationError;
        }
        if (response.status === 429) {
          const rateLimitError = new Error(
            data.message ?? RATE_LIMIT_MESSAGE,
          );
          rateLimitError.name = "RateLimitError";
          throw rateLimitError;
        }
        throw new Error(SERVER_ERROR_MESSAGE);
      }

      const rewritten = data.variants?.[0]?.text?.trim();
      if (!rewritten) {
        throw new Error(SERVER_ERROR_MESSAGE);
      }

      setResult(rewritten);
    } catch (error) {
      const isKnownError =
        error instanceof Error &&
        (error.name === "ValidationError" || error.name === "RateLimitError");
      setErrorMessage(
        isKnownError && error instanceof Error
          ? error.message
          : SERVER_ERROR_MESSAGE,
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <header className="fixed left-0 top-0 z-10 flex w-full items-center justify-between px-5 py-6 sm:px-8">
        <Logo size="sm" />
        <ThemeToggle />
      </header>
      <div className="flex flex-1 items-center justify-center px-5 py-16">
        <main className="flex w-full max-w-lg flex-col gap-10">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label
                htmlFor="message-input"
                className="text-[11px] uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500"
              >
                Your message
              </label>
              <textarea
                id="message-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type the text you want to rewrite…"
                rows={5}
                maxLength={MAX_CHARS}
                className="mt-2 w-full resize-none rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-3.5 text-[15px] leading-relaxed text-neutral-950 shadow-sm placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-950 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-neutral-400 dark:focus:bg-neutral-950"
              />
            </div>

            <div className="flex flex-col">
              <p className="text-[11px] uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
                Rewrite as
              </p>
              <div className="mt-2 flex w-full gap-2">
                {STYLES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStyle(value)}
                    className={`min-w-0 flex-1 cursor-pointer rounded-2xl border px-2 py-2.5 text-center text-sm transition-colors ${
                      style === value
                        ? "border-neutral-950 bg-neutral-950 text-white dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {style === "genz" ? (
                <div className="mt-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
                      How Gen Z
                    </p>
                    <span className="tabular-nums text-sm text-neutral-600 dark:text-neutral-400">
                      {genzIntensity}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={genzIntensity}
                    onChange={(e) => setGenzIntensity(Number(e.target.value))}
                    aria-label="Gen Z intensity"
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-neutral-950 dark:bg-neutral-700 dark:accent-neutral-50"
                  />
                  <div className="mt-1 flex justify-between text-xs text-neutral-400 dark:text-neutral-500">
                    <span>Less</span>
                    <span>Most</span>
                  </div>
                </div>
              ) : null}
              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleRewrite}
                aria-busy={isLoading}
                className={`mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 py-3 text-sm font-medium text-white transition-opacity enabled:cursor-pointer enabled:hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-100 dark:bg-neutral-50 dark:text-neutral-950 ${
                  isLoading ? "cursor-wait opacity-80" : ""
                }`}
              >
                {isLoading ? (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white dark:border-neutral-950/25 dark:border-t-neutral-950"
                    aria-hidden
                  />
                ) : null}
                Rewrite
              </button>
              {errorMessage ? (
                <p className="mt-3 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          </div>

          {isLoading || result ? (
            <div
              className="flex flex-col gap-2 border-t border-neutral-200 pt-8 dark:border-neutral-800"
              aria-live="polite"
              aria-busy={isLoading}
            >
              <p className="text-[11px] uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
                Output
              </p>
              <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
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
                <div className="flex h-9 items-center justify-end">
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
          ) : null}
        </main>
      </div>
      <Footer />
    </div>
  );
}
