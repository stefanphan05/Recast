import DemoImage from "@/components/DemoImage";

function HotkeyVisual() {
  return (
    <div className="flex items-center gap-2">
      <kbd className="inline-flex items-center rounded-xl border border-[rgba(17,17,16,0.12)] bg-[rgba(17,17,16,0.04)] px-3.5 py-2.5 text-sm font-medium text-(--foreground) shadow-[0_2px_0_rgba(17,17,16,0.1),inset_0_1px_0_rgba(255,255,255,0.8)]">
        ⌥ Option
      </kbd>
      <span className="text-sm text-(--muted)">+</span>
      <kbd className="inline-flex items-center rounded-xl border border-[rgba(17,17,16,0.12)] bg-[rgba(17,17,16,0.04)] px-3.5 py-2.5 text-sm font-medium text-(--foreground) shadow-[0_2px_0_rgba(17,17,16,0.1),inset_0_1px_0_rgba(255,255,255,0.8)]">
        Tab
      </kbd>
    </div>
  );
}

function PrivacyVisual() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="23.5" stroke="rgba(17,17,16,0.1)" />
      <path
        d="M24 10L34 15V24C34 29.8 29.8 34.8 24 36C18.2 34.8 14 29.8 14 24V15L24 10Z"
        stroke="rgba(17,17,16,0.35)"
        strokeWidth="1.5"
        fill="rgba(17,17,16,0.04)"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 24L22.5 27L28.5 21"
        stroke="rgba(17,17,16,0.7)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FeatureShowcase() {
  return (
    <section id="features" className="site-divider border-b py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">

        {/* Section header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow">How it works</p>
          <h2 className="font-display mt-3 text-4xl tracking-tight text-(--foreground) md:text-5xl">
            One tool. Every tone.
          </h2>
          <p className="mt-4 text-(--muted)">
            Built for non-native speakers, heavy Slackers, and anyone who
            rewrites the same message five times.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid gap-3 md:grid-cols-3">

          {/* ── Main card: spans 2 cols × 2 rows ─────────────── */}
          <div className="site-card overflow-hidden rounded-3xl md:col-span-2 md:row-span-2">
            <DemoImage
              variant="tones"
              alt="Tone picker — Recast rewrite interface"
              className="aspect-[4/3] w-full md:h-full md:aspect-auto"
            />
          </div>

          {/* ── Hotkey card ───────────────────────────────────── */}
          <div className="site-card flex flex-col justify-between rounded-3xl p-7 md:h-[270px]">
            <div>
              <p className="eyebrow">Hotkey</p>
              <h3 className="font-display mt-3 text-2xl leading-tight text-(--foreground)">
                From anywhere.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-(--muted)">
                Summon Recast over any app — no switching required.
              </p>
            </div>
            <HotkeyVisual />
          </div>

          {/* ── Privacy card ─────────────────────────────────── */}
          <div className="site-card flex flex-col justify-between rounded-3xl p-7 md:h-[270px]">
            <div>
              <p className="eyebrow">Privacy</p>
              <h3 className="font-display mt-3 text-2xl leading-tight text-(--foreground)">
                Stays on your Mac.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-(--muted)">
                Local AI runs entirely on your device. Zero cloud. Zero
                uploads.
              </p>
            </div>
            <PrivacyVisual />
          </div>

        </div>
      </div>
    </section>
  );
}
