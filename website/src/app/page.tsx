import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import ToneMarquee from "@/components/ToneMarquee";
import FeatureShowcase from "@/components/FeatureShowcase";
import ComparisonSection from "@/components/ComparisonSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";

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
        <CtaSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
