"use client";

import AppModal from "@/components/AppModal";
import ModelPicker from "@/components/onboarding/ModelPicker";
import {
  checkModelAvailable,
  OllamaError,
  pullOllamaModel,
  type PullProgress,
} from "@/lib/rewrite";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useCallback, useEffect, useState } from "react";

type ModelSettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ModelSettingsModal({
  open,
  onClose,
}: ModelSettingsModalProps) {
  const { settings, updateSettings } = useAppSettings();
  const [selectedModel, setSelectedModel] = useState(settings.selectedModel);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<PullProgress | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modelInstalled, setModelInstalled] = useState<boolean | null>(null);

  const refreshInstalled = useCallback(async () => {
    const installed = await checkModelAvailable(selectedModel);
    setModelInstalled(installed);
  }, [selectedModel]);

  useEffect(() => {
    if (!open) return;
    setSelectedModel(settings.selectedModel);
    setErrorMessage(null);
    setDownloadProgress(null);
  }, [open, settings.selectedModel]);

  useEffect(() => {
    if (!open) return;
    void refreshInstalled();
  }, [open, selectedModel, refreshInstalled]);

  async function handleSave() {
    setDownloading(true);
    setErrorMessage(null);
    setDownloadProgress(null);

    try {
      const installed = await checkModelAvailable(selectedModel);
      if (!installed) {
        await pullOllamaModel(selectedModel, setDownloadProgress);
      }

      await updateSettings({ selectedModel });
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof OllamaError
          ? error.message
          : "Could not save model settings. Please try again.",
      );
    } finally {
      setDownloading(false);
    }
  }

  const progressPercent =
    downloadProgress && downloadProgress.total > 0
      ? Math.min(
          100,
          Math.round(
            (downloadProgress.completed / downloadProgress.total) * 100,
          ),
        )
      : null;

  return (
    <AppModal
      open={open}
      onClose={onClose}
      ariaLabelledBy="model-settings-title"
      panelClassName="max-w-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h2
          id="model-settings-title"
          className="text-base font-medium text-neutral-950 dark:text-neutral-50"
        >
          AI model
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
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

      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Choose which local model Recast uses for rewrites.
      </p>

      <div className="mt-4">
        <ModelPicker
          selectedModel={selectedModel}
          onSelect={setSelectedModel}
        />
      </div>

      {modelInstalled === true && selectedModel === settings.selectedModel ? (
        <p className="mt-3 text-xs text-emerald-700 dark:text-emerald-400">
          Current model is installed and ready.
        </p>
      ) : modelInstalled === true ? (
        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          This model is already installed.
        </p>
      ) : modelInstalled === false ? (
        <p className="mt-3 text-xs text-amber-800 dark:text-amber-300">
          This model needs to be downloaded before use.
        </p>
      ) : null}

      {downloading ? (
        <div className="mt-3 space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <div
              className="h-full rounded-full bg-neutral-950 transition-all duration-300 dark:bg-neutral-50"
              style={{
                width: `${progressPercent ?? (downloadProgress ? 8 : 0)}%`,
              }}
            />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {downloadProgress?.status ?? "Downloading…"}
            {progressPercent !== null ? ` · ${progressPercent}%` : null}
          </p>
        </div>
      ) : null}

      {errorMessage ? (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={downloading}
        className="mt-5 w-full cursor-pointer rounded-2xl bg-neutral-950 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-950"
      >
        {downloading ? "Saving…" : "Save"}
      </button>
    </AppModal>
  );
}
