"use client";

import GeneralSection from "@/components/settings/GeneralSection";
import ModelsSection from "@/components/settings/ModelsSection";
import RewriteModesSection from "@/components/settings/RewriteModesSection";
import SettingsTabIcon from "@/components/settings/SettingsTabIcon";
import ShortcutsSection from "@/components/settings/ShortcutsSection";
import WindowChrome, { NO_DRAG_STYLE } from "@/components/layout/WindowChrome";
import { AppSettingsProvider } from "@/hooks/useAppSettings";
import { useEffect, useState } from "react";

type SettingsSection = "general" | "models" | "shortcuts" | "modes";

const SECTIONS: {
  id: SettingsSection;
  label: string;
}[] = [
  { id: "general", label: "General" },
  { id: "models", label: "Models" },
  { id: "shortcuts", label: "Shortcuts" },
  { id: "modes", label: "Rewrite modes" },
];

export default function SettingsApp() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("general");

  useEffect(() => {
    document.documentElement.dataset.window = "settings";
  }, []);

  return (
    <AppSettingsProvider>
      <div className="relative flex h-dvh flex-col bg-[var(--settings-bg)] text-neutral-950 dark:text-neutral-50">
        <WindowChrome />
        <header className="shrink-0 border-b border-[var(--settings-border)] pt-1.5">
          {/* Sits in the frameless drag strip, mirroring a native window title. */}
          <h1 className="h-6 text-center text-[13px] font-semibold text-neutral-950 dark:text-neutral-50">
            Recast Settings
          </h1>

          <nav className="flex justify-center gap-1 px-3 pb-2">
            {SECTIONS.map((section) => {
              const active = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`flex min-w-[74px] cursor-pointer flex-col items-center gap-0.5 rounded-[10px] px-3 py-1.5 text-[11px] transition-colors ${
                    active
                      ? "bg-neutral-950 font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] dark:bg-neutral-50 dark:text-neutral-950"
                      : "text-neutral-600 hover:bg-neutral-950/5 dark:text-neutral-400 dark:hover:bg-neutral-50/5"
                  }`}
                  style={NO_DRAG_STYLE}
                >
                  <SettingsTabIcon section={section.id} />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <div className="mx-auto max-w-xl px-8 py-8">
            {activeSection === "general" ? <GeneralSection /> : null}
            {activeSection === "models" ? <ModelsSection /> : null}
            {activeSection === "shortcuts" ? <ShortcutsSection /> : null}
            {activeSection === "modes" ? <RewriteModesSection /> : null}
          </div>
        </main>
      </div>
    </AppSettingsProvider>
  );
}
