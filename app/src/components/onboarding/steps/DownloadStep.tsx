"use client";

import { getModelDisplayName, type PullProgress } from "@/lib/rewrite";
import {
  formatPullProgressLine,
  usePullProgressTracking,
} from "@/hooks/usePullProgress";
import {
  getEngineProgressPercent,
  isEngineSettingUp,
  type LocalAIEngineProgress,
} from "@/types/local-ai-engine";
import { PrimaryButton, SecondaryButton } from "../OnboardingButtons";

type DownloadStepProps = {
  step: "download" | "preparing";
  selectedModel: string;
  downloading: boolean;
  downloadProgress: PullProgress | null;
  engineProgress: LocalAIEngineProgress | null;
  preparingMessage: string;
  downloadError: string | null;
  onChooseAnotherModel: () => void;
  onRetry: () => void;
};

export default function DownloadStep({
  step,
  selectedModel,
  downloading,
  downloadProgress,
  engineProgress,
  preparingMessage,
  downloadError,
  onChooseAnotherModel,
  onRetry,
}: DownloadStepProps) {
  const { progressPercent, etaSeconds } =
    usePullProgressTracking(downloadProgress);

  const settingUpEngine = isEngineSettingUp(
    downloading,
    Boolean(downloadProgress),
    engineProgress,
  );

  const headline =
    step === "preparing"
      ? "Almost ready"
      : settingUpEngine
        ? "Setting up AI engine"
        : "Downloading model";

  const description =
    step === "preparing" ? (
      preparingMessage
    ) : settingUpEngine ? (
      engineProgress?.message ||
      "Recast is installing the local AI engine. This only happens once."
    ) : (
      <>
        Downloading{" "}
        <span className="font-medium">
          {getModelDisplayName(selectedModel)}
        </span>{" "}
        to your Mac. This may take a few minutes depending on your connection.
      </>
    );

  const barPercent = settingUpEngine
    ? getEngineProgressPercent(engineProgress)
    : (progressPercent ?? (downloading ? 8 : 0));

  const statusLine = settingUpEngine
    ? engineProgress?.phase === "downloading" &&
      typeof engineProgress.percent === "number"
      ? `Engine download ${engineProgress.percent}%`
      : engineProgress?.message || "Setting up…"
    : formatPullProgressLine(downloadProgress, {
        percent: progressPercent,
        etaSeconds,
      });

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
          {headline}
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      </div>

      {step === "download" ? (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <div
              className="h-full rounded-full bg-neutral-950 transition-all duration-300 dark:bg-neutral-50"
              style={{
                width: `${barPercent}%`,
              }}
            />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {statusLine}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950 dark:border-neutral-700 dark:border-t-neutral-50" />
          {preparingMessage}
        </div>
      )}

      {downloadError ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          {downloadError}
        </p>
      ) : null}

      {downloadError ? (
        <div className="flex flex-wrap gap-2">
          <SecondaryButton onClick={onChooseAnotherModel}>
            Choose another model
          </SecondaryButton>
          <PrimaryButton onClick={onRetry} disabled={downloading}>
            Retry download
          </PrimaryButton>
        </div>
      ) : null}
    </div>
  );
}
