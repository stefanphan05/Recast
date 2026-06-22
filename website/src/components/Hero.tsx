import DownloadButton from "@/components/DownloadButton";
import DemoImage from "@/components/DemoImage";
import { HERO_IMAGE } from "@/lib/demos";

export default function Hero() {
  return (
    <section className="hero-glow relative overflow-hidden border-b border-black/5">
      <div className="site-grain pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            For Mac · Local AI
          </p>
          <h1 className="font-display mt-5 text-5xl leading-[1.05] tracking-tight text-neutral-950 md:text-7xl">
            Write with confidence.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600 md:text-xl">
            Paste your message, pick a tone — fix grammar, sound professional,
            write like Gen Z, or keep it casual — and get a rewritten version in
            seconds. No more copy-pasting into ChatGPT.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <DownloadButton />
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-50"
            >
              See how it works
            </a>
          </div>

          <p className="mt-4 text-sm text-neutral-500">
            Free · Apple Silicon · Your text stays on your Mac
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl animate-fade-up">
          <DemoImage
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            priority
            className="aspect-[16/10] w-full"
          />
        </div>
      </div>
    </section>
  );
}
