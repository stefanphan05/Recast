import DownloadButton from "@/components/DownloadButton";
import DemoImage from "@/components/DemoImage";

export default function Hero() {
  return (
    <section className="hero-glow site-divider relative overflow-hidden border-b">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid min-h-[calc(100vh-4rem)] items-center gap-10 py-16 md:grid-cols-[1fr_1fr] md:gap-12 md:py-0 lg:grid-cols-[1.1fr_0.9fr]">

          {/* ── Left column: Text ──────────────────────────────── */}
          <div className="md:py-28">
            <div className="hero-badge animate-fade-up">
              <span className="hero-badge-dot" />
              Local AI for Mac
            </div>

            <h1
              className="font-display animate-fade-up mt-7 text-[clamp(2.8rem,5.5vw,5rem)] leading-none tracking-tight text-(--foreground)"
              style={{ animationDelay: "0.08s" }}
            >
              Write with<br />confidence.
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-md text-lg leading-relaxed text-(--muted)"
              style={{ animationDelay: "0.18s" }}
            >
              Paste your message, pick a tone — fix grammar, sound professional,
              write like Gen Z, or keep it casual — and get a rewritten version
              in seconds. No more copy-pasting into ChatGPT.
            </p>

            <div
              className="animate-fade-up mt-8 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "0.28s" }}
            >
              <DownloadButton />
              <a
                href="#features"
                className="site-button-secondary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium"
              >
                See how it works
              </a>
            </div>

            <p
              className="animate-fade-up mt-5 text-sm text-(--muted)"
              style={{ animationDelay: "0.38s" }}
            >
              Free · Apple Silicon · Your text stays on your Mac
            </p>
          </div>

          {/* ── Right column: App mock ─────────────────────────── */}
          <div className="animate-scale-in relative">
            <DemoImage
              variant="hero"
              alt="Recast rewrite interface on Mac"
              priority
              className="aspect-[4/3] w-full"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
