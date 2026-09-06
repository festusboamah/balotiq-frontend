"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const timeline = [
  {
    step: "01",
    title: "Create your election",
    description:
      "Set up your organisation, define positions, add candidates, and configure when voting opens and closes.",
  },
  {
    step: "02",
    title: "Invite your voters",
    description:
      "Upload your voter roll and securely send personalised voting links to every eligible voter.",
  },
  {
    step: "03",
    title: "Go live with confidence",
    description:
      "Balotiq automatically opens the election while keeping every ballot private, encrypted, and verifiable.",
  },
  {
    step: "04",
    title: "Certify the results",
    description:
      "Review the immutable audit trail, run the tally, certify the results, and export the final record.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative w-full overflow-hidden bg-primary px-4 py-24 md:px-8 md:py-32">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-primary-foreground/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              How it works
            </span>

            <h2 className="mt-6 font-heading text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl">
              From setup to
              <span className="text-accent"> certification</span>
              <br className="hidden md:block" />
              in under 10 minutes.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-primary-foreground/70 md:text-lg">
              A simple workflow designed to make secure, verifiable elections
              effortless for administrators and trustworthy for every voter.
            </p>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          {/* Desktop timeline */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block">
            <div className="absolute inset-0 bg-primary-foreground/15" />

            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              className="absolute inset-x-0 top-0 h-full origin-top bg-linear-to-b from-accent via-accent/80 to-primary-foreground"
            />
          </div>

          {/* Mobile timeline */}
          <div className="absolute left-5 top-0 h-full w-px md:hidden">
            <div className="absolute inset-0 bg-primary-foreground/15" />

            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 origin-top bg-accent"
            />
          </div>

          <div className="space-y-14 md:space-y-24">
            {timeline.map((item, index) => (
              <TimelineItem key={item.step} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

function TimelineItem({
  item,
  index,
}: {
  item: (typeof timeline)[number];
  index: number;
}) {
  const isLeft = index % 2 === 0;

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
        amount: 0.35,
      }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative grid grid-cols-[42px_1fr] gap-6 md:grid-cols-[1fr_80px_1fr] md:gap-0"
    >
      {/* Left */}
      <div className="hidden md:col-start-1 md:row-start-1 md:block">
        {isLeft && <TimelineContent item={item} align="right" />}
      </div>

      {/* Center node */}
      <div className="relative col-start-1 row-start-1 flex justify-center md:col-start-2">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 16,
            delay: index * 0.08 + 0.15,
          }}
          className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-4 border-primary bg-accent shadow-[0_0_0_6px_color-mix(in_oklab,var(--primary-foreground)_10%,transparent)]"
        >
          {/* Pulse */}
          <motion.span
            animate={{
              scale: [1, 1.7, 1],
              opacity: [0.35, 0, 0.35],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeOut",
              delay: index * 0.4,
            }}
            className="absolute inset-0 rounded-full bg-accent"
          />

          <Check
            size={16}
            strokeWidth={3}
            className="relative z-10 text-accent-foreground"
          />
        </motion.div>
      </div>

      {/* Right */}
      <div className="hidden md:col-start-3 md:row-start-1 md:block">
        {!isLeft && <TimelineContent item={item} align="left" />}
      </div>

      {/* Mobile */}
      <div className="col-start-2 row-start-1 md:hidden">
        <TimelineContent item={item} />
      </div>
    </motion.div>
  );
}

function TimelineContent({
  item,
  align = "left",
}: {
  item: (typeof timeline)[number];
  align?: "left" | "right";
}) {
  return (
    <div
      className={`max-w-md ${
        align === "right" ? "ml-auto text-right" : "text-left"
      }`}
    >
      <span className="text-xs font-bold tracking-[0.2em] text-accent">
        STEP {item.step}
      </span>

      <h3 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-primary-foreground md:text-3xl">
        {item.title}
      </h3>

      <p className="mt-4 text-sm leading-7 text-primary-foreground/65 md:text-base">
        {item.description}
      </p>

      <div
        className={`mt-5 flex items-center gap-2 ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        <div className="h-px w-8 bg-accent" />
        <div className="h-1 w-1 rounded-full bg-accent" />
      </div>
    </div>
  );
}
