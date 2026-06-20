"use client";

import AISection from "@/components/settings/AISection";
import SetupSection from "@/components/settings/SetupSection";
import ShortcutsSection from "@/components/settings/ShortcutsSection";
import { AppSettingsProvider } from "@/hooks/useAppSettings";
import { useEffect, useState } from "react";

type SettingsSection = "setup" | "ai" | "shortcuts";

const SECTIONS: {
  id: SettingsSection;
  label: string;
  icon: string;
}[] = [
  { id: "setup", label: "Setup", icon: "⚙️" },
  { id: "ai", label: "AI", icon: "✨" },
  { id: "shortcuts", label: "Shortcuts", icon: "⌨️" },
];

export default function SettingsApp() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("setup");

  useEffect(() => {
    document.documentElement.dataset.window = "settings";
  }, []);

  return (
    <AppSettingsProvider>
      <div className="flex h-dvh bg-[var(--settings-bg)] text-neutral-950 dark:text-neutral-50">
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
                  className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? "bg-neutral-950/5 font-medium text-neutral-950 dark:bg-neutral-50/10 dark:text-neutral-50"
                      : "text-neutral-600 hover:bg-neutral-950/5 dark:text-neutral-400 dark:hover:bg-neutral-50/5"
                  }`}
                >
                  <span aria-hidden className="text-base leading-none">
                    {section.icon}
                  </span>
                  {section.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <div className="mx-auto max-w-xl px-8 py-8">
            {activeSection === "setup" ? <SetupSection /> : null}
            {activeSection === "ai" ? <AISection /> : null}
            {activeSection === "shortcuts" ? <ShortcutsSection /> : null}
          </div>
        </main>
      </div>
    </AppSettingsProvider>
  );
}
