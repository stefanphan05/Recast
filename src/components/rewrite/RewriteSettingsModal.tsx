"use client";

import LanguageSelect, {
  type LanguageSelectOption,
} from "@/components/LanguageSelect";
import AppModal from "@/components/AppModal";
import { useCallback } from "react";

const MAX_INSTRUCTIONS_CHARS = 500;

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
  const requestClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <AppModal
      open={open}
      onClose={requestClose}
      ariaLabelledBy="rewrite-settings-title"
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

      <div className="mt-4 flex flex-col">
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
        className={`mt-4 grid gap-3 ${isCrossLanguage ? "grid-cols-2" : "grid-cols-1"}`}
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
        className="mt-5 w-full cursor-pointer rounded-2xl bg-neutral-950 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 dark:bg-neutral-50 dark:text-neutral-950"
      >
        Done
      </button>
    </AppModal>
  );
}
