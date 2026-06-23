"use client";

type SettingsToggleProps = {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export default function SettingsToggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: SettingsToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </p>
        {description ? (
          <p className="mt-0.5 text-sm text-[var(--muted)]">
            {description}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50 ${
          checked
            ? "bg-[var(--accent)]"
            : "bg-[rgba(246,239,227,0.14)]"
        }`}
      >
        <span
          aria-hidden
          className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-[var(--accent-contrast)] shadow-sm transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
