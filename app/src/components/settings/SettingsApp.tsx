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
      <div className="app-shell relative flex h-dvh overflow-hidden text-[var(--foreground)]">
        <div className="app-noise pointer-events-none absolute inset-0" />
        <WindowChrome />
        <aside className="relative z-10 flex w-[220px] shrink-0 flex-col border-r border-[var(--settings-border)] bg-[var(--settings-sidebar)]/95 pt-10 backdrop-blur-xl">
          <div className="px-4 pb-4">
            <h1 className="text-sm font-semibold text-[var(--foreground)]">
              Recast
            </h1>
            <p className="mt-0.5 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
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
                      ? "bg-[rgba(244,201,120,0.12)] font-medium text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:bg-white/[0.04] hover:text-[var(--foreground)]"
                  }`}
                >
                  <SettingsSidebarIcon section={section.id} />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
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
