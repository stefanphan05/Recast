import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import ToneMarquee from "@/components/ToneMarquee";
import FeatureShowcase from "@/components/FeatureShowcase";
import ComparisonSection from "@/components/ComparisonSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";
import DownloadButton from "@/components/DownloadButton";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ToneMarquee />
        <FeatureShowcase />
        <ComparisonSection />
        <TestimonialsSection />

        {/* ── CTA section ────────────────────────────────────── */}
        <section className="relative overflow-hidden border-t border-border bg-accent/30 py-28 md:py-40">
          <div
            className="ambient-glow animate-blob left-1/2 top-0 h-[440px] w-[440px] -translate-x-1/2 bg-accent-2"
            style={{ animationDelay: "-4s" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <p className="eyebrow">Free download</p>
            <h2 className="mt-4 text-5xl font-semibold leading-none tracking-tight text-foreground md:text-7xl">
              Ready to
              <br />
              rewrite?
            </h2>
            <p className="mx-auto mt-5 max-w-xs text-lg text-muted-foreground">
              Stop copy-pasting into ChatGPT. Recast lives in your menu bar.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <DownloadButton />
              <p className="font-mono text-xs tracking-wide text-muted-foreground/70">
                Free · Apple Silicon · macOS only
              </p>
            </div>
          </div>
        </section>

        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
