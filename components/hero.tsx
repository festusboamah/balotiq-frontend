import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, PhoneCallIcon } from "lucide-react";
import { GhanaStoriesCarousel } from "@/components/ghana-stories-carousel";
import { apiGet, ApiError } from "@/lib/api-client";
import { buildSiteImageMap, SITE_IMAGE_DEFAULTS } from "@/lib/site-images";
import type { SiteImageResponse } from "@/lib/types";

export async function HeroSection() {
  const siteImages = await apiGet<SiteImageResponse[]>("/api/v1/public/site-images")
    .then(buildSiteImageMap)
    .catch((reason: unknown) => {
      if (!(reason instanceof ApiError)) console.error(reason);
      return SITE_IMAGE_DEFAULTS;
    });

  return (
    <section className="w-full min-w-0 overflow-x-clip">
      <div className="relative flex w-full min-w-0 flex-col items-center justify-center gap-5 px-4 py-12 md:px-4 md:py-24 lg:py-28">
        {/* Ambient shade */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-1 size-full overflow-hidden"
        >
          <div
            className={cn(
              "absolute -inset-x-20 inset-y-0 z-0 rounded-full",
              "bg-[radial-gradient(ellipse_at_center,theme(--color-foreground/.1),transparent,transparent)]",
              "blur-[50px]",
            )}
          />
        </div>
        <a
          className={cn(
            "group mx-auto flex w-fit items-center gap-3 rounded-sm border bg-card p-1 shadow",
            "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out",
          )}
          href="#link"
        >
          <div className="rounded-xs border bg-card px-1.5 py-0.5 shadow-sm">
            <p className="font-mono text-xs">NOW</p>
          </div>

          <span className="text-xs">serving 50+ institutions</span>
          <span className="block h-5 border-l" />

          <div className="pr-1">
            <ArrowRightIcon className="size-3 -translate-x-0.5 duration-150 ease-out group-hover:translate-x-0.5" />
          </div>
        </a>

        <h1
          className={cn(
            "w-full max-w-[calc(100vw-2rem)] text-balance text-center text-3xl text-foreground md:max-w-2xl md:text-5xl lg:text-6xl",
            "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-100 duration-500 ease-out font-heading font-bold",
          )}
        >
          Run Elections & Public Campaigns You Can Actually Defend
        </h1>

        <p
          className={cn(
            "w-full max-w-[calc(100vw-2rem)] text-center text-muted-foreground text-sm tracking-wider sm:max-w-2xl sm:text-lg",
            "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-200 duration-500 ease-out",
          )}
        >
          Balotiq delivers tamper-proof audit trails, encrypted secret ballots,
          and automated certification &mdash; so your results are trusted
          instantly, without question.
        </p>

        <div className="fade-in slide-in-from-bottom-10 flex max-w-full flex-wrap items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
          <Button
            variant="outline"
            render={
              <a href="mailto:support@balotiq.com?subject=Demo%20request" />
            }
            nativeButton={false}
          >
            <PhoneCallIcon data-icon="inline-start" /> Request A Demo
          </Button>
          <Button render={<a href="/sign-up" />} nativeButton={false}>
            Get started <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
      <GhanaStoriesCarousel images={siteImages} />
    </section>
  );
}
