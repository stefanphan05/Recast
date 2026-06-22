"use client";

import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import LocalAISetupBanner from "@/components/LocalAISetupBanner";
import RewriteWorkspace from "@/components/rewrite/RewriteWorkspace";
import WindowChrome from "@/components/WindowChrome";
import { AppSettingsProvider, useAppSettings } from "@/hooks/useAppSettings";
import { WINDOW_MAX_HEIGHT_PX } from "@/components/rewrite/constants";
import { useEffect, useRef, useState, type CSSProperties } from "react";

function AppShell() {
  const { settings, loading, isElectron } = useAppSettings();
  const shellRef = useRef<HTMLDivElement>(null);
  const [workspaceExpanded, setWorkspaceExpanded] = useState(false);

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
      className={`relative flex flex-col bg-transparent text-neutral-950 dark:text-neutral-50 ${
        workspaceExpanded
          ? "max-h-[var(--window-max-height)] min-h-0 overflow-hidden"
          : "h-auto overflow-visible"
      }`}
      style={
        workspaceExpanded
          ? ({ "--window-max-height": `${WINDOW_MAX_HEIGHT_PX}px` } as CSSProperties)
          : undefined
      }
    >
      <WindowChrome />
      {showOnboarding ? <OnboardingWizard /> : null}
      {!showOnboarding ? (
        <>
          <LocalAISetupBanner selectedModel={settings.selectedModel} />
          <div
            className={`flex w-full flex-col items-center p-2 ${
              workspaceExpanded ? "min-h-0 flex-1" : ""
            }`}
          >
            <RewriteWorkspace
              selectedModel={settings.selectedModel}
              onExpandedChange={setWorkspaceExpanded}
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
