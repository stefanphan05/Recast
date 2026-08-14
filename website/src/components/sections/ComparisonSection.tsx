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
      <circle cx="9" cy="9" r="8.5" stroke="var(--accent-1)" strokeOpacity="0.4" />
      <path
        d="M5.5 9L7.8 11.3L12.5 6.5"
        stroke="var(--accent-1)"
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
      <circle cx="9" cy="9" r="8.5" stroke="var(--border)" />
      <path
        d="M6.5 6.5L11.5 11.5M11.5 6.5L6.5 11.5"
        stroke="var(--muted-foreground)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ComparisonSection() {
  return (
    <section className="border-b border-border py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <p className="eyebrow">Comparison</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Stop explaining
            <br className="hidden sm:block" /> yourself.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Recast is a focused tool. Not a chatbot, not a writing suite — just
            fast, private rewrites when you need them.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[1fr_100px_100px] items-center border-b border-border bg-accent/50 px-6 py-3 md:grid-cols-[1fr_140px_140px]">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Feature
            </span>
            <span className="text-center text-sm font-semibold text-foreground">
              Recast
            </span>
            <span className="text-center text-xs font-medium text-muted-foreground">
              ChatGPT
            </span>
          </div>

          {ROWS.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_100px_100px] items-center bg-card px-6 py-4 md:grid-cols-[1fr_140px_140px] ${
                i < ROWS.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-sm text-muted-foreground">{row.feature}</span>
              <span className="flex justify-center">
                <CheckMark />
              </span>
              <span className="flex justify-center">
                <CrossMark />
              </span>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground/70">
          ChatGPT offers powerful general AI — Recast just does one thing faster.
        </p>
      </div>
    </section>
  );
}
