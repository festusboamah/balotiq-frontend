import { CallToAction } from "@/components/cta";
import { FeatureSection } from "@/components/feature-section";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero";
import HowItWorks from "@/components/home/how-it-works";
import { LogosSection } from "@/components/logos-section";
import { PricingSection } from "@/components/pricing-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <>
      <div
        className={cn(
          "relative mx-auto max-w-4xl grow",
          // X Borders
          "before:absolute before:-inset-y-14 before:-left-px before:w-px before:bg-border",
          "after:absolute after:-inset-y-14 after:-right-px after:w-px after:bg-border",
        )}
      >
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
