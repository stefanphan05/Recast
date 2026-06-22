"use client";

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
  variant?: "default" | "embedded";
};

export default function StylePicker({
  style,
  onStyleChange,
  genzIntensity,
  onGenzIntensityChange,
  flirtIntensity,
  onFlirtIntensityChange,
  variant = "default",
}: StylePickerProps) {
  const embedded = variant === "embedded";
  const stripRef = useRef<HTMLDivElement>(null);
  const { canScrollLeft, canScrollRight, onScroll, scroll } =
    useHorizontalScroll(stripRef);

  return (
    <div className="flex flex-col">
      {!embedded ? (
        <p className="text-[11px] uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
          Rewrite as
        </p>
      ) : null}
      <div className={`relative ${embedded ? "" : "mt-2"}`}>
        <div
          ref={stripRef}
          onScroll={onScroll}
          className={`scrollbar-hide grid w-full grid-flow-col overflow-x-auto ${
            embedded
              ? "auto-cols-max gap-1.5"
              : "auto-cols-[76px] gap-1.5"
          }`}
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
              className={`shrink-0 cursor-pointer whitespace-nowrap transition-colors ${
                embedded
                  ? `rounded-full border px-3 py-1 text-[12px] ${
                      style === value
                        ? "border-neutral-950 bg-neutral-950 text-white dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
                        : "glass-surface border text-neutral-600 hover:border-neutral-400/70 hover:text-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-500/70 dark:hover:text-neutral-50"
                    }`
                  : `w-[76px] rounded-xl border px-2 py-2 text-center text-[13px] ${
                      style === value
                        ? "border-neutral-950 bg-neutral-950 text-white dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
                        : "glass-surface border text-neutral-600 hover:border-neutral-400/70 hover:text-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-500/70 dark:hover:text-neutral-50"
                    }`
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
          embedded={embedded}
        />
        <ScrollArrow
          direction="right"
          disabled={!canScrollRight}
          onClick={() => scroll(1)}
          embedded={embedded}
        />
      </div>
      {style === "genz" ? (
        <GenzIntensitySlider
          value={genzIntensity}
          onChange={onGenzIntensityChange}
          compact={embedded}
        />
      ) : null}
      {style === "flirt" ? (
        <FlirtIntensitySlider
          value={flirtIntensity}
          onChange={onFlirtIntensityChange}
          compact={embedded}
        />
      ) : null}
    </div>
  );
}

function ScrollArrow({
  direction,
  disabled,
  onClick,
  embedded = false,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  embedded?: boolean;
}) {
  const isLeft = direction === "left";
  return (
    <button
      type="button"
      aria-label={isLeft ? "Show earlier styles" : "Show more styles"}
      disabled={disabled}
      onClick={onClick}
      className={`absolute top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center text-neutral-500 transition-opacity hover:text-neutral-800 disabled:pointer-events-none disabled:opacity-0 dark:hover:text-neutral-200 ${
        embedded ? "h-7 w-6" : "h-full w-7"
      } ${
        isLeft
          ? "left-0 justify-start bg-gradient-to-r from-[var(--surface-fade)] from-40% to-transparent pl-0.5"
          : "right-0 justify-end bg-gradient-to-l from-[var(--surface-fade)] from-40% to-transparent pr-0.5"
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
