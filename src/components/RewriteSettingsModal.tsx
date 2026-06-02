"use client";

import LanguageSelect, {
  type LanguageSelectOption,
} from "@/components/LanguageSelect";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

const MAX_INSTRUCTIONS_CHARS = 500;
const MODAL_ANIMATION_MS = 280;

type RewriteSettingsModalProps = {
  open: boolean;
  onClose: () => void;
  instructions: string;
  onInstructionsChange: (value: string) => void;
  sourceLanguage: string;
  onSourceLanguageChange: (value: string) => void;
  targetLanguage: string;
  onTargetLanguageChange: (value: string) => void;
  isCrossLanguage: boolean;
  sourceLanguageOptions: LanguageSelectOption[];
  targetLanguageOptions: LanguageSelectOption[];
  sourceLanguageAuto: string;
  targetLanguageSame: string;
};

export default function RewriteSettingsModal({
  open,
  onClose,
  instructions,
  onInstructionsChange,
  sourceLanguage,
  onSourceLanguageChange,
  targetLanguage,
  onTargetLanguageChange,
  isCrossLanguage,
  sourceLanguageOptions,
  targetLanguageOptions,
  sourceLanguageAuto,
  targetLanguageSame,
}: RewriteSettingsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
    }
  }, [open]);

  useEffect(() => {
    if (open || !visible) return;

    setClosing(true);
    const timeoutId = window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, MODAL_ANIMATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [open, visible]);

  const requestClose = useCallback(() => {
    if (closing) return;
    onClose();
  }, [closing, onClose]);

  useEffect(() => {
    if (!visible) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") requestClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [visible, requestClose]);

  if (!mounted || !visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close settings"
        className={`absolute inset-0 cursor-default bg-neutral-950/40 dark:bg-neutral-950/60 ${
          closing ? "modal-backdrop-out" : "modal-backdrop-in"
        }`}
        onClick={requestClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rewrite-settings-title"
        className={`relative flex w-full max-w-lg flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 ${
          closing ? "modal-panel-out" : "modal-panel-in"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <h2
            id="rewrite-settings-title"
            className="text-base font-medium text-neutral-950 dark:text-neutral-50"
          >
            Advanced settings
          </h2>
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-neutral-600 focus-visible:bg-neutral-200/70 focus-visible:text-neutral-600 focus-visible:outline-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col">
          <div className="flex items-baseline justify-between gap-3">
            <label
              htmlFor="rewrite-instructions"
              className="text-[11px] uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500"
            >
              Instructions
            </label>
            <span className="tabular-nums text-xs text-neutral-500 dark:text-neutral-400">
              {instructions.length} / {MAX_INSTRUCTIONS_CHARS}
            </span>
          </div>
          <textarea
            id="rewrite-instructions"
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            placeholder="Optional — e.g. rewrite as a professional email to a client"
            rows={3}
            maxLength={MAX_INSTRUCTIONS_CHARS}
            className="mt-2 w-full resize-none rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm leading-relaxed text-neutral-950 placeholder:text-neutral-400 outline-none transition-[border-color,box-shadow] focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200/80 focus:ring-inset dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-neutral-600 dark:focus:ring-neutral-700/50"
          />
        </div>

        <div
          className={`grid gap-3 ${isCrossLanguage ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {isCrossLanguage ? (
            <LanguageSelect
              id="source-language"
              label="Input language"
              value={sourceLanguage}
              options={sourceLanguageOptions}
              onChange={onSourceLanguageChange}
              muted={sourceLanguage === sourceLanguageAuto}
            />
          ) : null}
          <LanguageSelect
            id="target-language"
            label="Rewrite in"
            value={targetLanguage}
            options={targetLanguageOptions}
            onChange={onTargetLanguageChange}
            muted={targetLanguage === targetLanguageSame}
          />
        </div>

        <button
          type="button"
          onClick={requestClose}
          className="mt-1 w-full cursor-pointer rounded-2xl bg-neutral-950 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 dark:bg-neutral-50 dark:text-neutral-950"
        >
          Done
        </button>
      </div>
    </div>,
    document.body,
  );
}
