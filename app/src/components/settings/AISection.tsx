"use client";

import ModelPicker from "@/components/onboarding/ModelPicker";
import {
  downloadModel,
  LocalAIError,
  checkModelAvailable,
  type PullProgress,
} from "@/lib/rewrite";
import { useAppSettings } from "@/hooks/useAppSettings";
import {
  formatPullProgressLine,
  usePullProgressTracking,
} from "@/hooks/usePullProgress";
import { useCallback, useEffect, useState } from "react";

export default function AISection() {
  const { settings, updateSettings } = useAppSettings();
  const [selectedModel, setSelectedModel] = useState(settings.selectedModel);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<PullProgress | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modelInstalled, setModelInstalled] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);

  const refreshInstalled = useCallback(async () => {
    const installed = await checkModelAvailable(selectedModel);
    setModelInstalled(installed);
  }, [selectedModel]);

  useEffect(() => {
    setSelectedModel(settings.selectedModel);
  }, [settings.selectedModel]);

  useEffect(() => {
    void refreshInstalled();
  }, [selectedModel, refreshInstalled]);

  async function handleSave() {
    setDownloading(true);
    setErrorMessage(null);
    setDownloadProgress(null);
    setSaved(false);

    try {
      const installed = await checkModelAvailable(selectedModel);
      if (!installed) {
        await downloadModel(selectedModel, setDownloadProgress);
      }

      await updateSettings({ selectedModel });
      await window.electronAPI?.warmUpModel(selectedModel);
      setSaved(true);
    } catch (error) {
      setErrorMessage(
        error instanceof LocalAIError
          ? error.message
          : "Could not save model settings. Please try again.",
      );
    } finally {
      setDownloading(false);
    }
  }

  const { progressPercent, etaSeconds } =
    usePullProgressTracking(downloadProgress);

  const hasChanges = selectedModel !== settings.selectedModel;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">
          AI
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Choose which local model Recast uses for rewrites.
        </p>
      </div>

      <section className="rounded-2xl border border-[var(--settings-border)] bg-[var(--settings-panel)] p-5">
        <h3 className="text-sm font-medium text-neutral-950 dark:text-neutral-50">
          AI model
        </h3>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Select the model used for rewrites. Larger models are more capable but
          use more disk space.
        </p>

        <div className="mt-4">
          <ModelPicker
            selectedModel={selectedModel}
            onSelect={(modelId) => {
              setSelectedModel(modelId);
              setSaved(false);
            }}
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
              {formatPullProgressLine(downloadProgress, {
                percent: progressPercent,
                etaSeconds,
              })}
            </p>
          </div>
        ) : null}

        {errorMessage ? (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        ) : null}

        {saved && !hasChanges ? (
          <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-400">
            Model saved.
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={downloading || (!hasChanges && modelInstalled === true)}
          className="mt-5 cursor-pointer rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-950"
        >
          {downloading ? "Saving…" : hasChanges ? "Save model" : "Saved"}
        </button>
      </section>
    </div>
  );
}
