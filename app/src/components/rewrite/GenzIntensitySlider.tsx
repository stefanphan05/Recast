"use client";

type GenzIntensitySliderProps = {
  value: number;
  onChange: (value: number) => void;
  compact?: boolean;
};

export default function GenzIntensitySlider({
  value,
  onChange,
  compact = false,
}: GenzIntensitySliderProps) {
  return (
    <div className={compact ? "mt-2.5" : "mt-4"}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
          How Gen Z
        </p>
        <span className="tabular-nums text-sm text-[var(--muted)]">
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
        aria-label="Gen Z intensity"
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-[rgba(246,239,227,0.1)] accent-[var(--accent)]"
      />
      <div className="mt-1 flex justify-between text-xs text-[var(--muted)]">
        <span>Less</span>
        <span>Most</span>
      </div>
    </div>
  );
}
