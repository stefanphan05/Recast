"use client";

import ModelPicker from "@/components/onboarding/ModelPicker";
import {
  checkModelAvailable,
  checkOllamaRunning,
  OllamaError,
  pullOllamaModel,
  type PullProgress,
} from "@/lib/rewrite";
import { DEFAULT_MODEL_ID } from "@/lib/rewrite/models";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useCallback, useEffect, useState } from "react";

type OnboardingStep = "welcome" | "ollama" | "model" | "download" | "done";

export default function OnboardingWizard() {
  const { settings, updateSettings } = useAppSettings();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [selectedModel, setSelectedModel] = useState(
    settings.selectedModel || DEFAULT_MODEL_ID,
  );
  const [ollamaRunning, setOllamaRunning] = useState<boolean | null>(null);
  const [checkingOllama, setCheckingOllama] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<PullProgress | null>(
    null,
  );
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    window.electronAPI?.setLayout("onboarding");
    return () => {
      window.electronAPI?.setLayout("prompt");
    };
  }, []);

  const refreshOllama = useCallback(async () => {
    setCheckingOllama(true);
    const running = await checkOllamaRunning();
    setOllamaRunning(running);
    setCheckingOllama(false);
    return running;
  }, []);

  useEffect(() => {
    if (step !== "ollama") return;

    void refreshOllama();
    const interval = window.setInterval(() => {
      void refreshOllama();
    }, 2000);

    return () => window.clearInterval(interval);
  }, [step, refreshOllama]);

  async function handleOpenOllama() {
    await window.electronAPI?.openExternal("https://ollama.com");
  }

  async function handleDownload() {
    setDownloading(true);
    setDownloadError(null);
    setDownloadProgress(null);

    try {
      const alreadyInstalled = await checkModelAvailable(selectedModel);
      if (!alreadyInstalled) {
        await pullOllamaModel(selectedModel, setDownloadProgress);
      }

      await updateSettings({ selectedModel });
      setStep("done");
    } catch (error) {
      setDownloadError(
        error instanceof OllamaError
          ? error.message
          : "Download failed. Please try again.",
      );
    } finally {
      setDownloading(false);
    }
  }

  async function handleFinish() {
    await updateSettings({ onboardingComplete: true });
    window.electronAPI?.setLayout("prompt");
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
    <div className="absolute inset-0 z-40 flex flex-col overflow-hidden bg-[var(--surface-fade)]">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-4 py-5">
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
              This quick setup will help you install Ollama and download an AI
              model.
            </p>
            <PrimaryButton onClick={() => setStep("ollama")}>
              Get started
            </PrimaryButton>
          </div>
        ) : null}

        {step === "ollama" ? (
          <div className="mx-auto flex w-full max-w-md flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
                Install Ollama
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                Recast uses Ollama to run AI models locally. Install it once,
                then come back here.
              </p>
            </div>

            <ol className="list-decimal space-y-1 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
              <li>Download and install Ollama from ollama.com</li>
              <li>Ollama starts automatically after install</li>
              <li>Return here and click Continue</li>
            </ol>

            <div className="flex flex-wrap gap-2">
              <SecondaryButton onClick={() => void handleOpenOllama()}>
                Open ollama.com
              </SecondaryButton>
              <SecondaryButton
                onClick={() => void refreshOllama()}
                disabled={checkingOllama}
              >
                {checkingOllama ? "Checking…" : "Check again"}
              </SecondaryButton>
            </div>

            {ollamaRunning === true ? (
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Ollama is running
              </p>
            ) : ollamaRunning === false ? (
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Ollama is not running yet. If you just installed it, wait a
                moment and check again.
              </p>
            ) : null}

            <PrimaryButton
              onClick={() => setStep("model")}
              disabled={!ollamaRunning}
            >
              Continue
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
                Pick one to download. You can change this later in settings.
              </p>
            </div>

            <ModelPicker
              selectedModel={selectedModel}
              onSelect={setSelectedModel}
            />

            <div className="flex gap-2">
              <SecondaryButton onClick={() => setStep("ollama")}>
                Back
              </SecondaryButton>
              <PrimaryButton onClick={() => setStep("download")}>
                Continue
              </PrimaryButton>
            </div>
          </div>
        ) : null}

        {step === "download" ? (
          <div className="mx-auto flex w-full max-w-md flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
                Download model
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Downloading{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">
                  {selectedModel}
                </code>
                . This may take a few minutes depending on your connection.
              </p>
            </div>

            {downloading ? (
              <div className="space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <div
                    className="h-full rounded-full bg-neutral-950 transition-all duration-300 dark:bg-neutral-50"
                    style={{
                      width: `${progressPercent ?? (downloadProgress ? 8 : 0)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {downloadProgress?.status
                    ? downloadProgress.status
                    : "Starting download…"}
                  {progressPercent !== null ? ` · ${progressPercent}%` : null}
                </p>
              </div>
            ) : null}

            {downloadError ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                {downloadError}
              </p>
            ) : null}

            <div className="flex gap-2">
              <SecondaryButton
                onClick={() => setStep("model")}
                disabled={downloading}
              >
                Back
              </SecondaryButton>
              <PrimaryButton
                onClick={() => void handleDownload()}
                disabled={downloading}
              >
                {downloading ? "Downloading…" : "Download and finish"}
              </PrimaryButton>
            </div>
          </div>
        ) : null}

        {step === "done" ? (
          <div className="mx-auto flex w-full max-w-md flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
                You&apos;re all set
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Recast is ready. Press{" "}
                <kbd className="rounded border border-[var(--border)] bg-[var(--surface-elevated)] px-1.5 py-0.5 font-mono text-xs">
                  Option+Tab
                </kbd>{" "}
                anytime to show or hide the app.
              </p>
            </div>
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
