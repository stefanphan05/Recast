import SiteHeader from "@/components/layout/SiteHeader";
import Hero from "@/components/sections/Hero";
import ToneMarquee from "@/components/sections/ToneMarquee";
import FeatureShowcase from "@/components/sections/FeatureShowcase";
import ComparisonSection from "@/components/sections/ComparisonSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CtaSection from "@/components/sections/CtaSection";
import FaqSection from "@/components/sections/FaqSection";
import SiteFooter from "@/components/layout/SiteFooter";

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
