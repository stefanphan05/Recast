"use client";

import AISection from "@/components/settings/AISection";
import GeneralSection from "@/components/settings/GeneralSection";
import SettingsSidebarIcon from "@/components/settings/SettingsSidebarIcon";
import ShortcutsSection from "@/components/settings/ShortcutsSection";
import WindowChrome from "@/components/WindowChrome";
import { AppSettingsProvider } from "@/hooks/useAppSettings";
import { useEffect, useState } from "react";

type SettingsSection = "general" | "ai" | "shortcuts";

const SECTIONS: {
  id: SettingsSection;
  label: string;
}[] = [
  { id: "general", label: "General" },
  { id: "ai", label: "AI" },
  { id: "shortcuts", label: "Shortcuts" },
];

export default function SettingsApp() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("general");

  useEffect(() => {
    document.documentElement.dataset.window = "settings";
  }, []);

  return (
    <AppSettingsProvider>
      <div className="relative flex h-dvh bg-[var(--settings-bg)] text-neutral-950 dark:text-neutral-50">
        <WindowChrome />
        <aside className="flex w-[220px] shrink-0 flex-col border-r border-[var(--settings-border)] bg-[var(--settings-sidebar)] pt-10">
          <div className="px-4 pb-4">
            <h1 className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">
              Recast
            </h1>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Settings
            </p>
          </div>

          <nav className="flex flex-col gap-0.5 px-2">
            {SECTIONS.map((section) => {
              const active = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                    active
                      ? "bg-neutral-950/5 font-medium text-neutral-950 dark:bg-neutral-50/10 dark:text-neutral-50"
                      : "text-neutral-600 hover:bg-neutral-950/5 dark:text-neutral-400 dark:hover:bg-neutral-50/5"
                  }`}
                >
                  <SettingsSidebarIcon section={section.id} />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <div className="mx-auto max-w-xl px-8 py-8">
            {activeSection === "general" ? <GeneralSection /> : null}
            {activeSection === "ai" ? <AISection /> : null}
            {activeSection === "shortcuts" ? <ShortcutsSection /> : null}
          </div>
        </main>
      </div>
    </AppSettingsProvider>
  );
}
