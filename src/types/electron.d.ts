export type AppSettings = {
  onboardingComplete: boolean;
  selectedModel: string;
  globalHotkey: string;
  showMenuBarIcon: boolean;
  hideDockIcon: boolean;
};

export {};

declare global {
  interface Window {
    electronAPI?: {
      close: () => void;
      setLayout: (
        mode: "prompt" | "expanded" | "onboarding",
        contentHeight?: number,
      ) => void;
      setContentHeight: (height: number) => void;
      onWindowHidden: (callback: () => void) => () => void;
      getSettings: () => Promise<AppSettings>;
      setSettings: (partial: Partial<AppSettings>) => Promise<AppSettings>;
      onSettingsChanged: (callback: (settings: AppSettings) => void) => () => void;
      openSettings: () => Promise<boolean>;
      beginHotkeyRecording: () => Promise<boolean>;
      endHotkeyRecording: () => Promise<boolean>;
      onHotkeyCaptured: (callback: (accelerator: string) => void) => () => void;
      onHotkeyRecordingCancelled: (callback: () => void) => () => void;
      setHotkey: (
        accelerator: string,
      ) => Promise<{ ok: boolean; accelerator?: string; error?: string }>;
      openExternal: (url: string) => Promise<boolean>;
      revealModelsFolder: () => Promise<boolean>;
      platform: string;
    };
  }
}
