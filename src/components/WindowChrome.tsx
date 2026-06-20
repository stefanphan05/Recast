"use client";

import { useEffect, useState, type CSSProperties } from "react";

type WindowChromeProps = {
  showCloseButton?: boolean;
};

export default function WindowChrome({
  showCloseButton = true,
}: WindowChromeProps) {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(Boolean(window.electronAPI));
  }, []);

  if (!isElectron || !showCloseButton) return null;

  return (
    <div
      className="window-chrome absolute inset-x-0 top-0 z-30 h-11"
      style={{ WebkitAppRegion: "drag" } as CSSProperties}
    >
      <button
        type="button"
        aria-label="Close app"
        onClick={() => window.electronAPI?.close()}
        className="window-close-btn absolute left-3.5 top-3 flex h-[24px] w-[24px] shrink-0 cursor-default items-center justify-center rounded-full border border-[var(--window-border)] bg-[var(--surface-elevated)] text-neutral-500 opacity-0 backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100 hover:!opacity-100 hover:text-neutral-800 focus-visible:opacity-100 dark:text-neutral-400 dark:hover:text-neutral-200"
        style={
          { WebkitAppRegion: "no-drag", width: 24, height: 24, minWidth: 24, minHeight: 24 } as CSSProperties
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}
