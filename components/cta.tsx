"use client";

import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
  VoteIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecorIcon } from "@/components/decor-icon";

export function CallToAction() {
  return (
    <section className="px-4 py-20 md:px-8 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative mx-auto max-w-6xl"
      >
        {/* Main framed box */}
        <div className="relative overflow-hidden border border-foreground/15 bg-muted">
          {/* Decorative corners */}
          <DecorIcon
            className="absolute left-0 top-0 z-20 size-5 -translate-x-1/2 -translate-y-1/2"
            position="top-left"
          />
          <DecorIcon
            className="absolute right-0 top-0 z-20 size-5 translate-x-1/2 -translate-y-1/2"
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

          {/* Ambient shapes */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.18, 0.28, 0.18],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
          />

          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.12, 0.2, 0.12],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-background/60 blur-3xl"
          />

          {/* Layout */}
          <div className="relative grid md:grid-cols-[1.35fr_0.65fr]">
            {/* Left content */}
            <div className="px-7 py-12 md:px-12 md:py-16 lg:px-16">
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Get started
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-6 max-w-3xl font-heading text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl"
              >
                Your next election
                <br />
                <span className="text-primary">starts here.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.16 }}
                className="mt-6 max-w-xl text-sm leading-7 text-foreground/65 md:text-base"
              >
                Create a secure election, invite voters, manage every stage of
                the process, and certify trusted results — all from one place.
              </motion.p>
            </div>

            {/* Right action panel */}
            <div className="relative border-t border-foreground/10 bg-background/50 px-7 py-10 md:border-l md:border-t-0 md:px-8 md:py-12">
              {/* Animated voting icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 15,
                  delay: 0.15,
                }}
                className="relative mx-auto flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0 rounded-2xl bg-primary"
                />

                <VoteIcon className="relative z-10 size-7" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-7"
              >
                <p className="text-center font-heading text-lg font-semibold text-foreground">
                  Ready when you are.
                </p>

                <p className="mt-2 text-center text-sm leading-6 text-muted-foreground">
                  Start building your election today.
                </p>
              </motion.div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.32 }}
                className="mt-7 space-y-3"
              >
                <Button
                  size="lg"
                  className="group h-12 w-full"
                  render={<a href="https://balotiq.com/register" />}
                  nativeButton={false}
                >
                  Start Your Election
                  <ArrowRightIcon className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full border-foreground/15 bg-transparent"
                  render={
                    <a href="mailto:support@balotiq.com?subject=Sales%20inquiry" />
                  }
                  nativeButton={false}
                >
                  Contact Sales
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.42 }}
                className="mt-7 space-y-2.5"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2Icon className="size-3.5 text-primary" />
                  Secure voter access
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheckIcon className="size-3.5 text-primary" />
                  Private & verifiable ballots
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom rule */}
          <div className="relative flex items-center border-t border-foreground/10 px-7 py-4 md:px-12">
            <div className="h-px flex-1 bg-foreground/10" />

            <span className="px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/35">
              Secure · Simple · Verifiable
            </span>

            <div className="h-px flex-1 bg-foreground/10" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
