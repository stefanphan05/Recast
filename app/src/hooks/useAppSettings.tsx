"use client";

import { DEFAULT_MODEL } from "@/lib/rewrite";
import { DEFAULT_GLOBAL_HOTKEY } from "@/lib/hotkey";
import type { AppSettings } from "@/types/electron";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const WEB_DEFAULT_SETTINGS: AppSettings = {
  onboardingComplete: true,
  selectedModel: DEFAULT_MODEL,
  globalHotkey: DEFAULT_GLOBAL_HOTKEY,
  showMenuBarIcon: true,
  hideDockIcon: false,
  styleOrder: [],
  hiddenStyles: [],
  customModes: [],
};

type AppSettingsContextValue = {
  settings: AppSettings;
  loading: boolean;
  isElectron: boolean;
  updateSettings: (partial: Partial<AppSettings>) => Promise<AppSettings>;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(WEB_DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [isElectron, setIsElectron] = useState(false);
  /** Lets `updateSettings` read the current settings without re-creating itself. */
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const api = window.electronAPI;
    setIsElectron(Boolean(api));

    if (!api?.getSettings) {
      setLoading(false);
      return;
    }

    void api.getSettings().then((next) => {
      setSettings(next);
      setLoading(false);
    });

    const unsubscribe = api.onSettingsChanged?.((next) => {
      setSettings(next);
    });

    return unsubscribe;
  }, []);

  const updateSettings = useCallback(async (partial: Partial<AppSettings>) => {
    const api = window.electronAPI;
    if (!api?.setSettings) {
      // Outside Electron, merge over current state: settings like `customModes`
      // are edited read-modify-write and would otherwise reset to the defaults.
      const next = { ...settingsRef.current, ...partial };
      settingsRef.current = next;
      setSettings(next);
      return next;
    }

    const next = await api.setSettings(partial);
    // Keep the ref authoritative at write time, not a commit behind.
    settingsRef.current = next;
    setSettings(next);
    return next;
  }, []);

  const value = useMemo(
    () => ({
      settings,
      loading,
      isElectron,
      updateSettings,
    }),
    [settings, loading, isElectron, updateSettings],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }
  return context;
}
