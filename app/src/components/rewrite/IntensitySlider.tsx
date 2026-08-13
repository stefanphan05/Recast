"use client";

type IntensitySliderProps = {
  value: number;
  onChange: (value: number) => void;
  label: string;
  ariaLabel: string;
  minLabel: string;
  maxLabel: string;
  compact?: boolean;
};

export default function IntensitySlider({
  value,
  onChange,
  label,
  ariaLabel,
  minLabel,
  maxLabel,
  compact = false,
}: IntensitySliderProps) {
  return (
    <div className={compact ? "mt-2.5" : "mt-4"}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
          {label}
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
        aria-label={ariaLabel}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-neutral-950 dark:bg-neutral-700 dark:accent-neutral-50"
      />
      <div className="mt-1 flex justify-between text-xs text-neutral-400 dark:text-neutral-500">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
