import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  ImagesIcon,
  SparklesIcon,
  WalletCardsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DecorIcon } from "@/components/decor-icon";

export const metadata: Metadata = {
  title: "Engage",
  description:
    "Bring pageants, awards, and competitions to life with public voting, contestant profiles, and vote packages.",
  alternates: { canonical: "/engage" },
};

const features = [
  {
    icon: <ImagesIcon />,
    title: "Categories & contestants",
    description:
      "Organise your event into categories with contestant profiles, photos, and a running vote count for each.",
  },
  {
    icon: <WalletCardsIcon />,
    title: "Free or paid voting",
    description:
      "Price your vote packages and take Mobile Money or card through Paystack, or run the whole event free if that suits it better.",
  },
  {
    icon: <SparklesIcon />,
    title: "Verified payments, live results",
    description:
      "Every vote is tied to a payment we independently confirm, not just trusted from a webhook. Your audience watches the leaderboard move as votes come in.",
  },
];

const steps = [
  [
    "01",
    "Create your event",
    "Set up your categories and add contestants with photos and a short bio.",
  ],
  [
    "02",
    "Set your vote packages",
    "Decide whether voting is free or priced per vote, then publish the event.",
  ],
  [
    "03",
    "Share and watch it grow",
    "Send your audience straight to the vote page. Results update live as votes are confirmed.",
  ],
];

export default function EngagePage() {
  return (
    <>
      <section className="relative px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Balotiq Engage
          </span>

          <h1 className="mt-6 text-balance font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Give your audience a part in the story.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            Bring pageants, awards, and competitions to life with public
            voting, contestant profiles, and vote packages your audience can
            actually pay for.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              render={<Link href="/engage/events" />}
              nativeButton={false}
            >
              Explore public events{" "}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              render={<a href="#how-it-works" />}
              nativeButton={false}
            >
              See how it works
            </Button>
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-background px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {features.map(feature => (
              <div
                className="relative flex flex-col justify-between gap-6 bg-background px-6 pt-8 pb-6 shadow-xs"
                key={feature.title}
              >
                <DecorIcon className="size-3.5" position="top-left" />

                <div
                  className={cn(
                    "relative z-10 flex w-fit items-center justify-center rounded-lg border bg-muted/20 p-3",
                    "[&_svg]:size-5 [&_svg]:stroke-[1.5] [&_svg]:text-foreground",
                  )}
                >
                  {feature.icon}
                </div>

                <div className="relative z-10 space-y-2">
                  <h3 className="font-medium text-base text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative px-4 py-20 md:px-8 md:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              From an idea to an outcome
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Less admin. More participation.
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map(([number, title, body]) => (
              <div key={number}>
                <span className="font-heading text-3xl font-bold text-primary/40">
                  {number}
                </span>
                <h3 className="mt-3 font-medium text-base text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:px-8 md:py-28">
        <div className="relative mx-auto max-w-6xl overflow-hidden border border-foreground/15 bg-muted">
          <DecorIcon
            className="absolute top-0 left-0 z-20 size-5 -translate-x-1/2 -translate-y-1/2"
            position="top-left"
          />
          <DecorIcon
            className="absolute top-0 right-0 z-20 size-5 translate-x-1/2 -translate-y-1/2"
            position="top-right"
          />
          <DecorIcon
            className="absolute bottom-0 left-0 z-20 size-5 -translate-x-1/2 translate-y-1/2"
            position="bottom-left"
          />
          <DecorIcon
            className="absolute bottom-0 right-0 z-20 size-5 translate-x-1/2 translate-y-1/2"
            position="bottom-right"
          />

          <div className="relative flex flex-col items-center gap-6 px-6 py-16 text-center md:px-12">
            <SparklesIcon className="size-8 text-primary" />
            <h2 className="max-w-xl font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Ready to launch your event?
            </h2>
            <p className="max-w-md text-sm text-muted-foreground md:text-base">
              Set up your categories, add contestants, and let your audience
              cast the first vote.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                render={<a href="/sign-up" />}
                nativeButton={false}
              >
                Start an event <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <Button
                variant="outline"
                render={<Link href="/engage/events" />}
                nativeButton={false}
              >
                Browse live events
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
