"use client";

import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Building2Icon,
  CheckCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TicketIcon,
} from "lucide-react";

type Plan = {
  name: string;
  icon: React.ReactNode;
  info: string;
  price: number | string;
  priceSuffix?: string;
  priceNote: string;
  features: string[];
  btn: {
    text: string;
    href: string;
  };
};

const plans: Plan[] = [
  {
    name: "Governance",
    icon: <Building2Icon />,
    info: "Organisational elections for unions, universities, and associations",
    price: 50,
    priceSuffix: "/election",
    priceNote: "Starting price. Pay once to schedule, not a subscription.",
    features: [
      "Voter roll import & eligibility verification",
      "Positions, candidates, and self-nomination",
      "Encrypted, private ballots",
      "Immutable audit trail",
      "Tallying, certification & turnout reporting",
    ],
    btn: {
      text: "Start your election",
      href: "https://balotiq.com/register",
    },
  },
  {
    name: "Engage",
    icon: <SparklesIcon />,
    info: "Public pay-per-vote voting for pageants, awards, and campaigns",
    price: "Custom",
    priceNote: "A share of votes collected. Agreed with your organiser account.",
    features: [
      "Categories & contestant profiles",
      "Free or paid vote packages",
      "Mobile Money and card payments",
      "Independently verified transactions",
      "Live leaderboard",
    ],
    btn: {
      text: "Talk to us about your event",
      href: "mailto:support@balotiq.com",
    },
  },
  {
    name: "Ticketing",
    icon: <TicketIcon />,
    info: "Event tickets with tiered pricing and QR check-in",
    price: "Custom",
    priceNote: "A share of ticket sales. Agreed with your organiser account.",
    features: [
      "Tiered ticket pricing & capacity",
      "QR check-in at the door",
      "Capacity-safe payment handling",
      "Order & attendee management",
    ],
    btn: {
      text: "Talk to us about your event",
      href: "mailto:support@balotiq.com",
    },
  },
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative w-full overflow-hidden bg-foreground px-4 py-24 md:px-8 md:py-32"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-foreground/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Eyebrow */}
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Simple pricing
            </span>

            {/* Heading */}
            <h2 className="mt-6 font-heading text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl">
              Pay for what you run,
              <br className="hidden md:block" />
              <span className="text-accent"> not a subscription.</span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-primary-foreground/70 md:text-lg">
              No monthly plans or voter caps. Governance elections are billed
              once per election; Engage and Ticketing take a share of what
              they collect.
            </p>
          </motion.div>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto mt-16 grid w-full max-w-6xl grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>

        {/* Trust note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-2 text-center text-sm text-primary-foreground/50"
        >
          <ShieldCheckIcon className="size-4 text-accent" />
          <span>
            Secure elections, private ballots, and verifiable results across
            every product.
          </span>
        </motion.div>
      </div>
    </section>
  );
}

type PricingCardProps = {
  plan: Plan;
  index: number;
} & React.ComponentPropsWithoutRef<typeof motion.div>;

export function PricingCard({
  plan,
  className,
  index,
  ...props
}: PricingCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        transition: {
          duration: 0.25,
          ease: "easeOut",
        },
      }}
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-3xl border border-primary-foreground/10 bg-background shadow-2xl shadow-black/10",
        className,
      )}
      {...props}
    >
      {/* Header */}
      <div className="border-b border-foreground/10 p-7">
        <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent [&_svg]:size-4.5">
          {plan.icon}
        </div>

        <div className="font-heading text-xl font-bold tracking-tight text-foreground">
          {plan.name}
        </div>

        <p className="mt-1.5 max-w-[260px] text-sm leading-6 text-muted-foreground">
          {plan.info}
        </p>

        {/* Price */}
        <h3 className="mt-7 mb-1 flex w-max items-end gap-1">
          {typeof plan.price === "number" ? (
            <NumberFlow
              className="font-heading font-extrabold text-4xl tracking-tight text-foreground [&::part(suffix)]:font-normal [&::part(suffix)]:text-sm [&::part(suffix)]:text-muted-foreground"
              format={{
                style: "currency",
                currency: "GHS",
                notation: "compact",
              }}
              suffix={plan.priceSuffix}
              value={plan.price}
            />
          ) : (
            <span className="font-heading font-extrabold text-4xl tracking-tight text-foreground">
              {plan.price}
            </span>
          )}
        </h3>

        <p className="font-normal text-muted-foreground text-xs">
          {plan.priceNote}
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-1 flex-col px-7 pt-7 pb-8">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Includes
        </p>

        <div className="space-y-3.5">
          {plan.features.map(feature => (
            <div className="flex items-start gap-3" key={feature}>
              <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-accent" />

              <p className="text-sm leading-5 text-foreground/75">{feature}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-8">
          <Button
            className="h-11 w-full rounded-xl border-foreground/15 bg-transparent font-semibold text-foreground hover:bg-muted"
            variant="outline"
            render={<Link href={plan.btn.href} />}
            nativeButton={false}
          >
            {plan.btn.text}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
