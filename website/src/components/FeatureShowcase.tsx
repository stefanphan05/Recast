import AppMockFrame from "@/components/AppMockFrame";

function HotkeyVisual() {
  return (
    <div className="flex items-center gap-2">
      <kbd className="inline-flex items-center rounded-lg border border-border bg-accent px-3.5 py-2.5 font-mono text-sm font-medium text-foreground">
        ⌥ Option
      </kbd>
      <span className="text-sm text-muted-foreground">+</span>
      <kbd className="inline-flex items-center rounded-lg border border-border bg-accent px-3.5 py-2.5 font-mono text-sm font-medium text-foreground">
        Tab
      </kbd>
    </div>
  );
}

function PrivacyVisual() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="23.5" stroke="var(--border)" />
      <path
        d="M24 10L34 15V24C34 29.8 29.8 34.8 24 36C18.2 34.8 14 29.8 14 24V15L24 10Z"
        stroke="var(--accent-1)"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 24L22.5 27L28.5 21"
        stroke="var(--accent-1)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FeatureShowcase() {
  return (
    <section id="features" className="border-b border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            One tool. Every tone.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Built for non-native speakers, heavy Slackers, and anyone who
            rewrites the same message five times.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="site-card shadow-depth hover-lift overflow-hidden md:col-span-2 md:row-span-2">
            <AppMockFrame
              variant="tones"
              alt="Tone picker — Recast rewrite interface"
              className="aspect-[4/3] w-full md:h-full md:aspect-auto"
            />
          </div>

          <div className="site-card hover-lift flex flex-col justify-between p-7 transition-shadow duration-300 hover:shadow-depth md:h-[270px]">
            <div>
              <p className="eyebrow">Hotkey</p>
              <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-foreground">
                From anywhere.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Summon Recast over any app — no switching required.
              </p>
            </div>
            <HotkeyVisual />
          </div>

          <div className="site-card hover-lift flex flex-col justify-between p-7 transition-shadow duration-300 hover:shadow-depth md:h-[270px]">
            <div>
              <p className="eyebrow">Privacy</p>
              <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-foreground">
                Stays on your Mac.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
