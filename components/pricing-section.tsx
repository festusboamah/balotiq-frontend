"use client";

import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { type FREQUENCY, FrequencyToggle } from "@/components/frequency-toggle";
import { StarIcon, CheckCircleIcon, ShieldCheckIcon } from "lucide-react";

type Plan = {
  name: string;
  info: string;
  price: {
    monthly: number;
    yearly: number; // yearly price per month
  };
  features: string[];
  btn: {
    text: string;
    href: string;
  };
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    info: "For small teams and community elections",
    price: {
      monthly: 29,
      yearly: 24,
    },
    features: [
      "Up to 250 voters",
      "Up to 3 active elections",
      "Secure voter invitations",
      "Candidate & position management",
      "Private digital ballots",
      "Basic election results",
      "Election activity dashboard",
      "Email support",
    ],
    btn: {
      text: "Start your election",
      href: "#",
    },
  },
  {
    highlighted: true,
    name: "Professional",
    info: "For organisations running regular elections",
    price: {
      monthly: 79,
      yearly: 65,
    },
    features: [
      "Up to 2,500 voters",
      "Unlimited elections",
      "Personalised voter links",
      "Encrypted & private ballots",
      "Advanced election configuration",
      "Live election monitoring",
      "Immutable audit trail",
      "Result certification & export",
      "Priority support",
    ],
    btn: {
      text: "Get started",
      href: "#",
    },
  },
  {
    name: "Organisation",
    info: "For large institutions and associations",
    price: {
      monthly: 199,
      yearly: 165,
    },
    features: [
      "Up to 10,000 voters",
      "Unlimited elections",
      "Advanced voter management",
      "Multiple positions & contests",
      "Secure voter authentication",
      "Full audit & verification tools",
      "Certified result exports",
      "Organisation-wide administration",
      "Dedicated onboarding",
      "Priority support",
    ],
    btn: {
      text: "Talk to our team",
      href: "#",
    },
  },
];

export function PricingSection() {
  const [frequency, setFrequency] = React.useState<"monthly" | "yearly">(
    "monthly",
  );

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
              Run elections with
              <br className="hidden md:block" />
              <span className="text-accent"> confidence, not complexity.</span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-primary-foreground/70 md:text-lg">
              Flexible plans for clubs, associations, institutions, and
              organisations that need secure, transparent, and verifiable
              elections.
            </p>
          </motion.div>
        </div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 flex justify-center"
        >
          <div className="rounded-full border border-primary-foreground/15 bg-primary-foreground/5 p-1">
            <FrequencyToggle
              frequency={frequency}
              setFrequency={setFrequency}
            />
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="mx-auto mt-16 grid w-full max-w-6xl grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
          {plans.map((plan, index) => (
            <PricingCard
              frequency={frequency}
              key={plan.name}
              plan={plan}
              index={index}
            />
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
            every plan.
          </span>
        </motion.div>
      </div>
    </section>
  );
}

type PricingCardProps = {
  plan: Plan;
  frequency?: FREQUENCY;
  index: number;
} & React.ComponentPropsWithoutRef<typeof motion.div>;

export function PricingCard({
  plan,
  className,
  frequency = "monthly",
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
        plan.highlighted &&
          "border-accent/60 shadow-[0_0_0_1px_rgb(240_160_60/20%),0_25px_60px_rgb(0_0_0/20%)] md:scale-[1.035] md:-translate-y-2",
        className,
      )}
      {...props}
    >
      {/* Popular badge */}
      <AnimatePresence mode="wait">
        <div className="absolute right-5 top-5 z-10 flex items-center gap-2">
          {plan.highlighted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-sm"
            >
              <StarIcon className="size-3 fill-current" />
              Most popular
            </motion.div>
          )}
        </div>
      </AnimatePresence>

      {/* Header */}
      <div
        className={cn(
          "border-b border-foreground/10 p-7",
          plan.highlighted && "bg-primary/[0.06]",
        )}
      >
        <div
          className={cn(
            "font-heading text-xl font-bold tracking-tight text-foreground",
            plan.highlighted && "text-primary",
          )}
        >
          {plan.name}
        </div>

        <p className="mt-1.5 max-w-[260px] text-sm leading-6 text-muted-foreground">
          {plan.info}
        </p>

        {/* Price */}
        <h3 className="mt-7 mb-1 flex w-max items-end gap-1">
          <NumberFlow
            className="font-heading font-extrabold text-4xl tracking-tight text-foreground [&::part(suffix)]:font-normal [&::part(suffix)]:text-sm [&::part(suffix)]:text-muted-foreground"
            format={{
              style: "currency",
              currency: "USD",
              notation: "compact",
            }}
            suffix="/month"
            value={plan.price[frequency]}
          />
        </h3>

        <p className="font-normal text-muted-foreground text-xs">
          billed {frequency}
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-1 flex-col px-7 pt-7 pb-8">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Everything included
        </p>

        <div className="space-y-3.5">
          {plan.features.map(feature => (
            <div className="flex items-start gap-3" key={feature}>
              <CheckCircleIcon
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  plan.highlighted ? "text-primary" : "text-accent",
                )}
              />

              <p className="text-sm leading-5 text-foreground/75">{feature}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-8">
          <Button
            className={cn(
              "h-11 w-full rounded-xl font-semibold",
              plan.highlighted
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border-foreground/15 bg-transparent text-foreground hover:bg-muted",
            )}
            variant={plan.highlighted ? "default" : "outline"}
            render={<Link href={plan.btn.href} />}
            nativeButton={false}
          >
            {plan.btn.text}
          </Button>
        </div>
      </div>

      {/* Bottom accent */}
      {plan.highlighted && (
        <div className="h-1 w-full bg-linear-to-r from-primary via-accent to-primary" />
      )}
    </motion.div>
  );
}
