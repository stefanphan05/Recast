"use client";

import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import OllamaSetupBanner from "@/components/OllamaSetupBanner";
import RewriteWorkspace from "@/components/rewrite/RewriteWorkspace";
import WindowChrome from "@/components/WindowChrome";
import { AppSettingsProvider, useAppSettings } from "@/hooks/useAppSettings";
import { useEffect, useRef, useState } from "react";

function AppShell() {
  const { settings, loading, isElectron } = useAppSettings();
  const [expanded, setExpanded] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  const showOnboarding =
    isElectron && !loading && !settings.onboardingComplete;

  useEffect(() => {
    if (!isElectron || expanded || showOnboarding) return;

    const el = shellRef.current;
    if (!el) return;

    const syncHeight = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      window.electronAPI?.setContentHeight(height);
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded, isElectron, showOnboarding]);

  const fillWindow = expanded || showOnboarding;

  return (
    <div
      ref={shellRef}
      className={`relative flex flex-col bg-transparent text-neutral-950 dark:text-neutral-50 ${
        fillWindow ? "h-dvh overflow-hidden" : "h-auto overflow-visible"
      }`}
    >
      <WindowChrome />
      {showOnboarding ? <OnboardingWizard /> : null}
      {!showOnboarding ? (
        <>
          <OllamaSetupBanner selectedModel={settings.selectedModel} />
          <div
            className={`flex w-full flex-col items-center p-2 ${
              expanded ? "min-h-0 flex-1" : ""
            }`}
          >
            <RewriteWorkspace
              selectedModel={settings.selectedModel}
              onExpandedChange={setExpanded}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function ClientAppShell() {
  return (
    <AppSettingsProvider>
      <AppShell />
    </AppSettingsProvider>
  );
}
