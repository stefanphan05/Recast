"use client";

import ModelSettingsModal from "@/components/onboarding/ModelSettingsModal";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import OllamaSetupBanner from "@/components/OllamaSetupBanner";
import RewriteWorkspace from "@/components/rewrite/RewriteWorkspace";
import WindowChrome from "@/components/WindowChrome";
import { AppSettingsProvider, useAppSettings } from "@/hooks/useAppSettings";
import { useState } from "react";

function AppShell() {
  const { settings, loading, isElectron } = useAppSettings();
  const [isExpanded, setIsExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const showOnboarding =
    isElectron && !loading && !settings.onboardingComplete;

  return (
    <div className="group relative flex h-dvh flex-col overflow-hidden bg-transparent text-neutral-950 dark:text-neutral-50">
      <WindowChrome showCloseButton={isExpanded && !showOnboarding} />
      {showOnboarding ? <OnboardingWizard /> : null}
      {!showOnboarding ? (
        <>
          <OllamaSetupBanner selectedModel={settings.selectedModel} />
          <div className="flex min-h-0 flex-1 flex-col items-center p-2">
            <RewriteWorkspace
              selectedModel={settings.selectedModel}
              onExpandedChange={setIsExpanded}
              onOpenSettings={
                isElectron ? () => setSettingsOpen(true) : undefined
              }
            />
          </div>
          {isElectron ? (
            <ModelSettingsModal
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
            />
          ) : null}
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
