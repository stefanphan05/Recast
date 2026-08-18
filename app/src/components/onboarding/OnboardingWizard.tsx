"use client";

import DoneStep from "@/components/onboarding/steps/DoneStep";
import DownloadStep from "@/components/onboarding/steps/DownloadStep";
import ModelStep from "@/components/onboarding/steps/ModelStep";
import WelcomeStep from "@/components/onboarding/steps/WelcomeStep";
import {
  checkLocalAIRunning,
  checkModelAvailable,
  downloadModel,
  LocalAIError,
  type PullProgress,
} from "@/lib/rewrite";
import { DEFAULT_MODEL_ID } from "@/lib/rewrite/models";
import { CloseWindowButton, DRAG_STYLE } from "@/components/layout/WindowChrome";
import { useAppSettings } from "@/hooks/useAppSettings";
import { type LocalAIEngineProgress } from "@/types/local-ai-engine";
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
  const [engineProgress, setEngineProgress] =
    useState<LocalAIEngineProgress | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [preparingMessage, setPreparingMessage] = useState(
    "Loading your AI model…",
  );
  const downloadStartedRef = useRef(false);
  const skipCheckedRef = useRef(false);
  const engineErrorRef = useRef<string | null>(null);
  const wizardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.electronAPI?.setLayout("onboarding");
    return () => {
      window.electronAPI?.setLayout("prompt");
    };
  }, []);

  useEffect(() => {
    const unsubscribe = window.electronAPI?.onLocalAIEngineProgress(
      (progress) => {
        setEngineProgress(progress);
        if (progress.phase === "error" && progress.message) {
          engineErrorRef.current = progress.message;
        }
      },
    );
    return () => unsubscribe?.();
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
    setEngineProgress(null);
    engineErrorRef.current = null;

    try {
      let running = await checkLocalAIRunning();
      if (!running) {
        await window.electronAPI?.ensureLocalAIReady(selectedModel);
        running = await checkLocalAIRunning();
      }

      if (!running) {
        throw new LocalAIError(
          engineErrorRef.current ||
            "Could not set up the local AI engine. Check your internet connection and try again.",
        );
      }

      setEngineProgress(null);
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
          <WelcomeStep onGetStarted={() => setStep("model")} />
        ) : null}

        {step === "model" ? (
          <ModelStep
            selectedModel={selectedModel}
            onSelect={setSelectedModel}
            onBack={() => setStep("welcome")}
            onDownload={() => {
              downloadStartedRef.current = false;
              setDownloadError(null);
              setStep("download");
            }}
          />
        ) : null}

        {step === "download" || step === "preparing" ? (
          <DownloadStep
            step={step}
            selectedModel={selectedModel}
            downloading={downloading}
            downloadProgress={downloadProgress}
            engineProgress={engineProgress}
            preparingMessage={preparingMessage}
            downloadError={downloadError}
            onChooseAnotherModel={() => setStep("model")}
            onRetry={() => {
              downloadStartedRef.current = false;
              void runDownload();
            }}
          />
        ) : null}

        {step === "done" ? (
          <DoneStep
            globalHotkey={settings.globalHotkey}
            onFinish={() => void handleFinish()}
          />
        ) : null}
      </div>
    </div>
  );
}
