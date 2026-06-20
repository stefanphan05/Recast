"use client";

import SettingsToggle from "@/components/settings/SettingsToggle";
import { useAppSettings } from "@/hooks/useAppSettings";

export default function GeneralSection() {
  const { settings, updateSettings, isElectron } = useAppSettings();
  const isMac =
    isElectron && window.electronAPI?.platform === "darwin";

  async function handleRevealModelsFolder() {
    await window.electronAPI?.revealModelsFolder();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">
          General
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Control how Recast appears on your Mac.
        </p>
      </div>

      {isMac ? (
        <section className="rounded-2xl border border-[var(--settings-border)] bg-[var(--settings-panel)] p-5">
          <h3 className="text-sm font-medium text-neutral-950 dark:text-neutral-50">
            Application
          </h3>

          <div className="mt-2 divide-y divide-[var(--settings-border)]">
            <SettingsToggle
              label="Show menu bar icon"
              description="Display the Recast icon in the menu bar for quick access to settings and shortcuts."
              checked={settings.showMenuBarIcon}
              onChange={(checked) =>
                void updateSettings({ showMenuBarIcon: checked })
              }
            />
            <SettingsToggle
              label="Hide Dock icon"
              description="Keep Recast out of the Dock while it runs in the background."
              checked={settings.hideDockIcon}
              onChange={(checked) =>
                void updateSettings({ hideDockIcon: checked })
              }
            />
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-[var(--settings-border)] bg-[var(--settings-panel)] p-5">
        <h3 className="text-sm font-medium text-neutral-950 dark:text-neutral-50">
          Model files
        </h3>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Open the folder containing downloaded AI models.
        </p>

        <button
          type="button"
          onClick={() => void handleRevealModelsFolder()}
          disabled={!isElectron}
          className="mt-4 cursor-pointer rounded-xl border border-[var(--settings-border)] bg-[var(--settings-panel)] px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400/70 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-300 dark:hover:border-neutral-500/70"
        >
          Reveal in Finder
        </button>
      </section>
    </div>
  );
}
