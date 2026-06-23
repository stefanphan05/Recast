"use client";

import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import LocalAISetupBanner from "@/components/LocalAISetupBanner";
import RewriteWorkspace from "@/components/rewrite/RewriteWorkspace";
import WindowChrome from "@/components/WindowChrome";
import { AppSettingsProvider, useAppSettings } from "@/hooks/useAppSettings";
import { WINDOW_MAX_HEIGHT_PX } from "@/components/rewrite/constants";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

function AppShell() {
  const { settings, loading, isElectron } = useAppSettings();
  const shellRef = useRef<HTMLDivElement>(null);
  const [workspaceExpanded, setWorkspaceExpanded] = useState(false);

  const showOnboarding = isElectron && !loading && !settings.onboardingComplete;

  useLayoutEffect(() => {
    if (!isElectron || showOnboarding || !workspaceExpanded) return;

    const el = shellRef.current;
    if (!el) return;

    const height = Math.ceil(el.getBoundingClientRect().height);
    window.electronAPI?.setLayout("expanded", height);
  }, [isElectron, showOnboarding, workspaceExpanded]);

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
      className={`group app-shell relative flex flex-col overflow-hidden rounded-[30px] border border-[var(--window-border)] text-[var(--foreground)] ${
        workspaceExpanded
          ? "max-h-[var(--window-max-height)] min-h-0 overflow-hidden"
          : "h-auto overflow-visible"
      }`}
      style={
        workspaceExpanded
          ? ({
              "--window-max-height": `${WINDOW_MAX_HEIGHT_PX}px`,
            } as CSSProperties)
          : undefined
      }
    >
      <div className="app-noise pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.06] to-transparent" />
      <WindowChrome />
      {showOnboarding ? <OnboardingWizard /> : null}
      {!showOnboarding ? (
        <>
          <LocalAISetupBanner selectedModel={settings.selectedModel} />
          <div
            className={`relative z-10 flex w-full flex-col items-center p-2 ${
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
