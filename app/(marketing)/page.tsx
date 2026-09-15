import { CallToAction } from "@/components/cta";
import { FeatureSection } from "@/components/feature-section";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero";
import HowItWorks from "@/components/home/how-it-works";
import { LogosSection } from "@/components/logos-section";
import { PricingSection } from "@/components/pricing-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <div className="relative mx-auto w-full max-w-4xl grow">
        <HeroSection />
        <LogosSection />
      </div>
      <FeatureSection />
      <HowItWorks />
      <TestimonialsSection />
      <PricingSection />
      <CallToAction />
    </>
  );
}
