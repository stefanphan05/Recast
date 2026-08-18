import type { LocalAIEngineProgress } from "./local-ai-engine";

export type AppSettings = {
  onboardingComplete: boolean;
  selectedModel: string;
  globalHotkey: string;
  showMenuBarIcon: boolean;
  hideDockIcon: boolean;
  /** User-defined order of rewrite mode ids; empty = built-in order */
  styleOrder: string[];
  /** Rewrite mode ids hidden from the rewrite bar */
  hiddenStyles: string[];
};

export type { LocalAIEngineProgress };

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
      ensureLocalAIReady: (
        model?: string,
      ) => Promise<{ running: boolean; warmed: boolean; installed: boolean }>;
      warmUpModel: (model?: string) => Promise<boolean>;
      onLocalAIEngineProgress: (
        callback: (progress: LocalAIEngineProgress) => void,
      ) => () => void;
      platform: string;
    };
  }
}
