export type AppSettings = {
  onboardingComplete: boolean;
  selectedModel: string;
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
      openExternal: (url: string) => Promise<boolean>;
      platform: string;
    };
  }
}
