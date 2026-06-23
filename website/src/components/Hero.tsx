import DownloadButton from "@/components/DownloadButton";
import DemoImage from "@/components/DemoImage";

export default function Hero() {
  return (
    <section className="hero-glow site-divider relative overflow-hidden border-b">
      <div className="site-grain pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-white/4 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-(--muted)">
            For Mac · Local AI
          </p>
          <h1 className="font-display mt-5 text-5xl leading-[1.02] tracking-tight text-(--foreground) md:text-7xl">
            Write with confidence.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-(--muted) md:text-xl">
            Paste your message, pick a tone — fix grammar, sound professional,
            write like Gen Z, or keep it casual — and get a rewritten version in
            seconds. No more copy-pasting into ChatGPT.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <DownloadButton />
            <a
              href="#features"
              className="site-button-secondary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors"
            >
              See how it works
            </a>
          </div>

          <p className="mt-4 text-sm text-(--muted)">
            Free · Apple Silicon · Your text stays on your Mac
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl animate-fade-up">
          <DemoImage
            variant="hero"
            alt="Recast rewrite interface on Mac"
            priority
            className="aspect-16/10 w-full"
          />
        </div>
      </div>
    </section>
  );
}
