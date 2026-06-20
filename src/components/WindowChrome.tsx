"use client";

import { ICON_ACTION_BTN_SECONDARY_CLASS } from "@/components/rewrite/constants";
import { useEffect, useState, type CSSProperties } from "react";

type CloseWindowButtonProps = {
  className?: string;
};

export function CloseWindowButton({ className = "" }: CloseWindowButtonProps) {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(Boolean(window.electronAPI));
  }, []);

  if (!isElectron) return null;

  return (
    <button
      type="button"
      aria-label="Close app"
      onClick={() => window.electronAPI?.close()}
      className={`${ICON_ACTION_BTN_SECONDARY_CLASS} cursor-default ${className}`}
      style={{ WebkitAppRegion: "no-drag" } as CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  );
}

export default function WindowChrome() {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(Boolean(window.electronAPI));
  }, []);

  if (!isElectron) return null;

  return (
    <div
      className="window-chrome pointer-events-none absolute inset-x-0 top-0 z-30 h-8"
      style={{ WebkitAppRegion: "drag" } as CSSProperties}
    />
  );
}
