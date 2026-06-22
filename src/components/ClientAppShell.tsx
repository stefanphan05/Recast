"use client";

import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import LocalAISetupBanner from "@/components/LocalAISetupBanner";
import RewriteWorkspace from "@/components/rewrite/RewriteWorkspace";
import WindowChrome from "@/components/WindowChrome";
import { AppSettingsProvider, useAppSettings } from "@/hooks/useAppSettings";
import { useEffect, useRef } from "react";

function AppShell() {
  const { settings, loading, isElectron } = useAppSettings();
  const shellRef = useRef<HTMLDivElement>(null);

  const showOnboarding =
    isElectron && !loading && !settings.onboardingComplete;

  useEffect(() => {
    if (!isElectron || showOnboarding) return;

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
  }, [isElectron, showOnboarding]);

  return (
    <div
      ref={shellRef}
      className="relative flex h-auto flex-col overflow-visible bg-transparent text-neutral-950 dark:text-neutral-50"
    >
      <WindowChrome />
      {showOnboarding ? <OnboardingWizard /> : null}
      {!showOnboarding ? (
        <>
          <LocalAISetupBanner selectedModel={settings.selectedModel} />
          <div className="flex w-full flex-col items-center p-2">
            <RewriteWorkspace selectedModel={settings.selectedModel} />
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
