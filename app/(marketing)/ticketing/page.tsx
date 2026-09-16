import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  LayersIcon,
  QrCodeIcon,
  WalletCardsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DecorIcon } from "@/components/decor-icon";

export const metadata: Metadata = {
  title: "Ticketing",
  description:
    "Sell tickets to your event, price them by tier, and check guests in with a single QR scan at the door.",
  alternates: { canonical: "/ticketing" },
};

const features = [
  {
    icon: <LayersIcon />,
    title: "Tiered tickets, honestly priced",
    description:
      "Set up ticket tiers with their own price and capacity. Once your event is published, pricing and capacity lock in, so no guest is quoted a different price than the one before them.",
  },
  {
    icon: <QrCodeIcon />,
    title: "One scan, no do overs",
    description:
      "Every ticket carries a secure QR code checked against the event at the door. It can only be checked in once, so a forwarded screenshot won't get a second person through.",
  },
  {
    icon: <WalletCardsIcon />,
    title: "Payments that respect your capacity",
    description:
      "Guests pay by Mobile Money or card through Paystack. If a tier sells out mid payment, that order is flagged instead of quietly overselling your venue.",
  },
];

const steps = [
  [
    "01",
    "List your event",
    "Name it, set the venue and dates, and add a cover image.",
  ],
  [
    "02",
    "Set your tiers",
    "Price each tier and cap its capacity before you publish.",
  ],
  [
    "03",
    "Scan guests in",
    "Guests show their QR ticket at the door, and your team checks them in with a scan.",
  ],
];

export default function TicketingPage() {
  return (
    <>
      <section className="relative px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Balotiq Ticketing
          </span>

          <h1 className="mt-6 text-balance font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Bringing people together, one scan at a time.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            Sell tickets to your event, price them by tier, and check guests
            in with a single QR scan at the door.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              render={<a href="/sign-up" />}
              nativeButton={false}
            >
              Start selling tickets{" "}
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
            <QrCodeIcon className="size-8 text-primary" />
            <h2 className="max-w-xl font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Ready to sell your first ticket?
            </h2>
            <p className="max-w-md text-sm text-muted-foreground md:text-base">
              Set up your event, price your tiers, and let guests scan
              straight through the door.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                render={<a href="/sign-up" />}
                nativeButton={false}
              >
                Start selling tickets{" "}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <Button
                variant="outline"
                render={<Link href="/ticketing/events" />}
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
