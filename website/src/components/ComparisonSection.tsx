const ROWS = [
  { feature: "Works from any app" },
  { feature: "Tone presets, no prompting" },
  { feature: "Runs 100% locally" },
  { feature: "Your text never leaves your Mac" },
  { feature: "No subscription required" },
  { feature: "Works without internet" },
] as const;

function CheckMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Yes" role="img">
      <circle cx="9" cy="9" r="8.5" stroke="rgba(17,17,16,0.15)" />
      <path
        d="M5.5 9L7.8 11.3L12.5 6.5"
        stroke="rgba(17,17,16,0.8)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="No" role="img">
      <circle cx="9" cy="9" r="8.5" stroke="rgba(17,17,16,0.08)" />
      <path
        d="M6.5 6.5L11.5 11.5M11.5 6.5L6.5 11.5"
        stroke="rgba(17,17,16,0.22)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ComparisonSection() {
  return (
    <section className="site-divider border-b py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6">

        {/* Header */}
        <div className="text-center">
          <p className="eyebrow">Comparison</p>
          <h2 className="font-display mt-3 text-4xl tracking-tight text-(--foreground) md:text-5xl">
            Stop explaining<br className="hidden sm:block" /> yourself.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-(--muted)">
            Recast is a focused tool. Not a chatbot, not a writing suite — just
            fast, private rewrites when you need them.
          </p>
        </div>

        {/* Table */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-[rgba(17,17,16,0.09)]">

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_100px_100px] items-center border-b border-[rgba(17,17,16,0.08)] bg-[rgba(17,17,16,0.025)] px-6 py-3 md:grid-cols-[1fr_140px_140px]">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(17,17,16,0.35)]">
              Feature
            </span>
            <span className="text-center text-sm font-semibold text-(--foreground)">
              Recast
            </span>
            <span className="text-center text-xs font-medium text-[rgba(17,17,16,0.35)]">
              ChatGPT
            </span>
          </div>

          {/* Rows */}
          {ROWS.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_100px_100px] items-center bg-(--surface) px-6 py-4 md:grid-cols-[1fr_140px_140px] ${
                i < ROWS.length - 1
                  ? "border-b border-[rgba(17,17,16,0.06)]"
                  : ""
              }`}
            >
              <span className="text-sm text-(--muted)">{row.feature}</span>
              <span className="flex justify-center">
                <CheckMark />
              </span>
              <span className="flex justify-center">
                <CrossMark />
              </span>
            </div>
          ))}

        </div>

        {/* Footer note */}
        <p className="mt-5 text-center text-xs text-[rgba(17,17,16,0.32)]">
          ChatGPT offers powerful general AI — Recast just does one thing faster.
        </p>
      </div>
    </section>
  );
}
