"use client";

type FlirtIntensitySliderProps = {
  value: number;
  onChange: (value: number) => void;
  compact?: boolean;
};

export default function FlirtIntensitySlider({
  value,
  onChange,
  compact = false,
}: FlirtIntensitySliderProps) {
  return (
    <div className={compact ? "mt-2.5" : "mt-4"}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
          How flirt
        </p>
        <span className="tabular-nums text-sm text-neutral-600 dark:text-neutral-400">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Flirt intensity"
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-neutral-950 dark:bg-neutral-700 dark:accent-neutral-50"
      />
      <div className="mt-1 flex justify-between text-xs text-neutral-400 dark:text-neutral-500">
        <span>Normal cringe</span>
        <span>Most cringy</span>
      </div>
    </div>
  );
}

