import { CallToAction } from "@/components/cta";
import { FeatureSection } from "@/components/feature-section";
import { HeroSection } from "@/components/hero";
import HowItWorks from "@/components/home/how-it-works";
import { LogosSection } from "@/components/logos-section";
import { PricingSection } from "@/components/pricing-section";
import { TestimonialsSection } from "@/components/testimonials-section";

// The hero fetches site-images (editable via /admin/site-images) at
// render time -- without revalidation, an edit there would never appear
// on the live homepage without a full redeploy, defeating the point of
// a CMS. 5 minutes is a reasonable staleness window for occasional
// content tweaks, not real-time editing.
export const revalidate = 300;

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
