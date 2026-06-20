export type AppSettings = {
  onboardingComplete: boolean;
  selectedModel: string;
  globalHotkey: string;
};

export {};

declare global {
  interface Window {
    electronAPI?: {
      close: () => void;
      setLayout: (mode: "prompt" | "expanded" | "onboarding") => void;
      onWindowHidden: (callback: () => void) => () => void;
      getSettings: () => Promise<AppSettings>;
      setSettings: (partial: Partial<AppSettings>) => Promise<AppSettings>;
      onSettingsChanged: (callback: (settings: AppSettings) => void) => () => void;
      openSettings: () => Promise<boolean>;
      getHotkey: () => Promise<string>;
      setHotkey: (
        accelerator: string,
      ) => Promise<{ ok: boolean; accelerator?: string; error?: string }>;
      openExternal: (url: string) => Promise<boolean>;
      platform: string;
    };
  }
}
