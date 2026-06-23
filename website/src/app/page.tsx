import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
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
        <FeatureShowcase />
        <ComparisonSection />
        <TestimonialsSection />

        <section className="cta-glow py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-4xl tracking-tight text-(--foreground) md:text-5xl">
              Ready to rewrite?
            </h2>
            <p className="mt-4 text-lg text-(--muted)">
              Download Recast for Mac and stop explaining yourself to ChatGPT.
            </p>
            <div className="mt-8">
              <DownloadButton />
            </div>
          </div>
        </section>

        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
