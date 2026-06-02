"use client";

import IconTooltip from "@/components/IconTooltip";
import GenzIntensitySlider from "@/components/rewrite/GenzIntensitySlider";
import FlirtIntensitySlider from "@/components/rewrite/FlirtIntensitySlider";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { STYLE_OPTIONS, type RewriteStyle } from "@/lib/rewrite";
import { useRef } from "react";

type StylePickerProps = {
  style: RewriteStyle;
  onStyleChange: (style: RewriteStyle) => void;
  genzIntensity: number;
  onGenzIntensityChange: (value: number) => void;
  flirtIntensity: number;
  onFlirtIntensityChange: (value: number) => void;
  settingsOpen: boolean;
  onOpenSettings: () => void;
  hasCustomSettings: boolean;
};

export default function StylePicker({
  style,
  onStyleChange,
  genzIntensity,
  onGenzIntensityChange,
  flirtIntensity,
  onFlirtIntensityChange,
  settingsOpen,
  onOpenSettings,
  hasCustomSettings,
}: StylePickerProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const { canScrollLeft, canScrollRight, onScroll, scroll } =
    useHorizontalScroll(stripRef);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
          Rewrite as
        </p>
        <IconTooltip label="Advanced settings" align="end">
          <button
            type="button"
            onClick={onOpenSettings}
            aria-expanded={settingsOpen}
            aria-haspopup="dialog"
            className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-neutral-600 focus-visible:bg-neutral-200/70 focus-visible:text-neutral-600 focus-visible:outline-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 dark:focus-visible:bg-neutral-800 dark:focus-visible:text-neutral-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {hasCustomSettings && !settingsOpen ? (
              <span
                className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-neutral-950 dark:bg-neutral-50"
                aria-hidden
              />
            ) : null}
          </button>
        </IconTooltip>
      </div>
      <div className="relative mt-2">
        <div
          ref={stripRef}
          onScroll={onScroll}
          className="scrollbar-hide grid w-full grid-flow-col auto-cols-[calc((100%-2rem)/5)] gap-2 overflow-x-auto"
          role="tablist"
          aria-label="Rewrite style"
        >
          {STYLE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={style === value}
              onClick={() => onStyleChange(value)}
              className={`cursor-pointer rounded-2xl border px-2 py-2.5 text-center text-sm whitespace-nowrap transition-colors ${
                style === value
                  ? "border-neutral-950 bg-neutral-950 text-white dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <ScrollArrow
          direction="left"
          disabled={!canScrollLeft}
          onClick={() => scroll(-1)}
        />
        <ScrollArrow
          direction="right"
          disabled={!canScrollRight}
          onClick={() => scroll(1)}
        />
      </div>
      {style === "genz" ? (
        <GenzIntensitySlider
          value={genzIntensity}
          onChange={onGenzIntensityChange}
        />
      ) : null}
      {style === "flirt" ? (
        <FlirtIntensitySlider
          value={flirtIntensity}
          onChange={onFlirtIntensityChange}
        />
      ) : null}
    </div>
  );
}

function ScrollArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const isLeft = direction === "left";
  return (
    <button
      type="button"
      aria-label={isLeft ? "Show earlier styles" : "Show more styles"}
      disabled={disabled}
      onClick={onClick}
      className={`absolute top-1/2 z-10 flex h-full w-7 -translate-y-1/2 cursor-pointer items-center text-neutral-500 transition-opacity hover:text-neutral-800 disabled:pointer-events-none disabled:opacity-0 dark:hover:text-neutral-200 ${
        isLeft
          ? "left-0 justify-start bg-gradient-to-r from-white from-40% to-transparent pl-0.5 dark:from-neutral-950"
          : "right-0 justify-end bg-gradient-to-l from-white from-40% to-transparent pr-0.5 dark:from-neutral-950"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d={isLeft ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
      </svg>
    </button>
  );
}
