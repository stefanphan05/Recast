"use client";

import ModelPicker from "@/components/onboarding/ModelPicker";
import {
  checkLocalAIRunning,
  checkModelAvailable,
  downloadModel,
  LocalAIError,
  type PullProgress,
} from "@/lib/rewrite";
import { DEFAULT_MODEL_ID, getModelDisplayName } from "@/lib/rewrite/models";
import { getEffectiveHotkey } from "@/lib/hotkey";
import HotkeyRecorder from "@/components/settings/HotkeyRecorder";
import { CloseWindowButton, DRAG_STYLE } from "@/components/WindowChrome";
import { useAppSettings } from "@/hooks/useAppSettings";
import {
  formatPullProgressLine,
  usePullProgressTracking,
} from "@/hooks/usePullProgress";
import { useCallback, useEffect, useRef, useState } from "react";

type OnboardingStep = "welcome" | "model" | "download" | "preparing" | "done";

export default function OnboardingWizard() {
  const { settings, updateSettings } = useAppSettings();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [selectedModel, setSelectedModel] = useState(
    settings.selectedModel || DEFAULT_MODEL_ID,
  );
  const [downloadProgress, setDownloadProgress] = useState<PullProgress | null>(
    null,
  );
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [preparingMessage, setPreparingMessage] = useState(
    "Loading your AI model…",
  );
  const downloadStartedRef = useRef(false);
  const skipCheckedRef = useRef(false);
  const wizardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.electronAPI?.setLayout("onboarding");
    return () => {
      window.electronAPI?.setLayout("prompt");
    };
  }, []);

  useEffect(() => {
    const el = wizardRef.current;
    if (!el) return;

    const syncHeight = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      window.electronAPI?.setLayout("onboarding", height);
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [step]);

  useEffect(() => {
    if (skipCheckedRef.current) return;
    skipCheckedRef.current = true;

    async function detectExistingSetup() {
      let running = await checkLocalAIRunning();
      if (!running) {
        await window.electronAPI?.ensureLocalAIReady(selectedModel);
        running = await checkLocalAIRunning();
      }

      if (!running) return;

      const installed = await checkModelAvailable(selectedModel);
      if (installed) {
        setStep("done");
      }
    }

    void detectExistingSetup();
  }, [selectedModel]);

  const runDownload = useCallback(async () => {
    setDownloading(true);
    setDownloadError(null);
    setDownloadProgress(null);

    try {
      let running = await checkLocalAIRunning();
      if (!running) {
        await window.electronAPI?.ensureLocalAIReady(selectedModel);
        running = await checkLocalAIRunning();
      }

      if (!running) {
        throw new LocalAIError(
          "Could not start the local AI engine. Restart Recast and try again.",
        );
      }

      const alreadyInstalled = await checkModelAvailable(selectedModel);
      if (!alreadyInstalled) {
        await downloadModel(selectedModel, setDownloadProgress);
      }

      await updateSettings({ selectedModel });
      setStep("preparing");
      setPreparingMessage("Loading your AI model…");
      await window.electronAPI?.warmUpModel(selectedModel);
      setStep("done");
    } catch (error) {
      setDownloadError(
        error instanceof LocalAIError
          ? error.message
          : "Download failed. Please try again.",
      );
      setStep("download");
    } finally {
      setDownloading(false);
    }
  }, [selectedModel, updateSettings]);

  useEffect(() => {
    if (step !== "download" || downloadStartedRef.current) return;
    downloadStartedRef.current = true;
    void runDownload();
  }, [step, runDownload]);

  async function handleFinish() {
    await window.electronAPI?.warmUpModel(selectedModel);
    await updateSettings({ onboardingComplete: true });
    window.electronAPI?.setLayout("prompt");
  }

  const { progressPercent, etaSeconds } =
    usePullProgressTracking(downloadProgress);

  return (
    <div
      ref={wizardRef}
      className="group relative z-40 flex max-h-[640px] flex-col overflow-hidden bg-[var(--surface-fade)]"
    >
      <div className="relative h-9 shrink-0">
        <div
          className="absolute inset-x-2 top-2 bottom-0"
          style={DRAG_STYLE}
          aria-hidden
        />
        <CloseWindowButton className="absolute top-2 right-2 z-10 pointer-events-none opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100" />
      </div>
      <div className="flex min-h-0 flex-col overflow-y-auto overscroll-y-contain px-4 pb-5">
        {step === "welcome" ? (
          <div className="mx-auto flex w-full max-w-md flex-col gap-4">
            <div>
              <h1 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">
                Welcome to Recast
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                Rewrite messages in different styles using AI that runs entirely
                on your Mac. Your text never leaves your device.
              </p>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              This one-time setup lets you pick and download an AI model —
              Gemma, Qwen, and more. After that, just open Recast and start
              rewriting.
            </p>
            <PrimaryButton onClick={() => setStep("model")}>
              Get started
            </PrimaryButton>
          </div>
        ) : null}

        {step === "model" ? (
          <div className="mx-auto flex w-full max-w-md flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
                Choose a model
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Pick one to download to your Mac. Everything runs locally — no
                cloud. You can change this later in Settings.
              </p>
            </div>

            <ModelPicker
              selectedModel={selectedModel}
              onSelect={setSelectedModel}
            />

            <div className="flex gap-2">
              <SecondaryButton onClick={() => setStep("welcome")}>
                Back
              </SecondaryButton>
              <PrimaryButton
                onClick={() => {
                  downloadStartedRef.current = false;
                  setDownloadError(null);
                  setStep("download");
                }}
              >
                Download model
              </PrimaryButton>
            </div>
          </div>
        ) : null}

        {step === "download" || step === "preparing" ? (
          <div className="mx-auto flex w-full max-w-md flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
                {step === "preparing" ? "Almost ready" : "Downloading model"}
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {step === "preparing" ? (
                  preparingMessage
                ) : (
                  <>
                    Downloading{" "}
                    <span className="font-medium">
                      {getModelDisplayName(selectedModel)}
                    </span>{" "}
                    to your Mac. This may take a few minutes depending on your
                    connection.
                  </>
                )}
              </p>
            </div>

            {step === "download" ? (
              <div className="space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <div
                    className="h-full rounded-full bg-neutral-950 transition-all duration-300 dark:bg-neutral-50"
                    style={{
                      width: `${progressPercent ?? (downloading ? 8 : 0)}%`,
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
                <SecondaryButton onClick={() => setStep("model")}>
                  Choose another model
                </SecondaryButton>
                <PrimaryButton
                  onClick={() => {
                    downloadStartedRef.current = false;
                    void runDownload();
                  }}
                  disabled={downloading}
                >
                  Retry download
                </PrimaryButton>
              </div>
            ) : null}
          </div>
        ) : null}

        {step === "done" ? (
          <div className="mx-auto flex w-full max-w-md flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
                You&apos;re all set
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Your model is downloaded and ready. Choose a keyboard shortcut
                to show or hide Recast from anywhere.
              </p>
            </div>

            <HotkeyRecorder
              hotkey={getEffectiveHotkey(settings.globalHotkey)}
              variant="embedded"
            />

            <PrimaryButton onClick={() => void handleFinish()}>
              Start rewriting
            </PrimaryButton>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-950"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400/70 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-300 dark:hover:border-neutral-500/70"
    >
      {children}
    </button>
  );
}
