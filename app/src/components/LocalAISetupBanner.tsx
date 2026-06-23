"use client";

import {
  downloadModel,
  getLocalAIHealthStatus,
  LocalAIError,
  type LocalAIHealthStatus,
  type PullProgress,
} from "@/lib/rewrite/local-ai";
import {
  formatPullProgressLine,
  usePullProgressTracking,
} from "@/hooks/usePullProgress";
import { useCallback, useEffect, useState } from "react";

type LocalAISetupBannerProps = {
  selectedModel: string;
};

export default function LocalAISetupBanner({
  selectedModel,
}: LocalAISetupBannerProps) {
  const [health, setHealth] = useState<LocalAIHealthStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [recovering, setRecovering] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<PullProgress | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { progressPercent, etaSeconds } =
    usePullProgressTracking(downloadProgress);

  const refresh = useCallback(async () => {
    setChecking(true);
    const status = await getLocalAIHealthStatus(selectedModel);
    setHealth(status);
    if (status.status === "ok") {
      setDismissed(false);
      setErrorMessage(null);
    }
    setChecking(false);
  }, [selectedModel]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (health?.status !== "not_running") return;

    const interval = window.setInterval(() => {
      void refresh();
    }, 2000);

    return () => window.clearInterval(interval);
  }, [health?.status, refresh]);

  async function handleStartEngine() {
    setRecovering(true);
    setErrorMessage(null);
    try {
      await window.electronAPI?.ensureLocalAIReady(selectedModel);
      await refresh();
    } catch {
      setErrorMessage("Could not start the AI engine. Please try again.");
    } finally {
      setRecovering(false);
    }
  }

  async function handleDownloadModel() {
    const model =
      health?.status === "model_missing" ? health.model : selectedModel;

    setRecovering(true);
    setErrorMessage(null);
    setDownloadProgress(null);

    try {
      let status = await getLocalAIHealthStatus(model);
      if (status.status === "not_running") {
        await window.electronAPI?.ensureLocalAIReady(model);
        status = await getLocalAIHealthStatus(model);
      }

      if (status.status === "not_running") {
        throw new LocalAIError("Local AI engine is not running.");
      }

      await downloadModel(model, setDownloadProgress);
      await window.electronAPI?.warmUpModel(model);
      await refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof LocalAIError
          ? error.message
          : "Could not download the model. Please try again.",
      );
    } finally {
      setRecovering(false);
      setDownloadProgress(null);
    }
  }

  if (dismissed || health?.status === "ok" || health === null) {
    return null;
  }

  return (
    <div
      role="alert"
      className="relative z-10 border-b border-[rgba(244,201,120,0.18)] bg-[rgba(244,201,120,0.08)] px-4 py-3 text-sm text-[var(--foreground)] backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          {health.status === "not_running" ? (
            <>
              <p className="font-medium">AI engine not running</p>
              <p className="text-[rgba(246,239,227,0.76)]">
                Recast can start it in the background. If you haven&apos;t
                installed it yet, download the free AI engine first.
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">AI model not downloaded</p>
              <p className="text-[rgba(246,239,227,0.76)]">
                Download your model here — it only takes a few minutes.
              </p>
            </>
          )}

          {recovering && downloadProgress ? (
            <div className="mt-2 space-y-1">
              <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-[rgba(246,239,227,0.12)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-all"
                  style={{
                    width: `${progressPercent ?? 8}%`,
                  }}
                />
              </div>
              <p className="text-xs text-[rgba(246,239,227,0.7)]">
                {formatPullProgressLine(downloadProgress, {
                  percent: progressPercent,
                  etaSeconds,
                })}
              </p>
            </div>
          ) : null}

          {errorMessage ? (
            <p className="text-xs text-red-300">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {health.status === "not_running" ? (
            <button
              type="button"
              onClick={() => void handleStartEngine()}
              disabled={recovering || checking}
              className="rounded-lg border border-[rgba(244,201,120,0.18)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[rgba(244,201,120,0.08)] disabled:opacity-60"
            >
              {recovering ? "Starting…" : "Start in background"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void handleDownloadModel()}
              disabled={recovering || checking}
              className="rounded-lg border border-[rgba(244,201,120,0.18)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[rgba(244,201,120,0.08)] disabled:opacity-60"
            >
              {recovering ? "Downloading…" : "Download model"}
            </button>
          )}
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={checking || recovering}
            className="rounded-lg border border-[rgba(244,201,120,0.18)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[rgba(244,201,120,0.08)] disabled:opacity-60"
          >
            {checking ? "Checking…" : "Retry"}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-lg px-2 py-1.5 text-xs font-medium text-[rgba(246,239,227,0.76)] transition-colors hover:bg-white/[0.04]"
            aria-label="Dismiss setup banner"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
