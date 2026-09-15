import type { Metadata } from "next";
import { MailIcon } from "lucide-react";
import { DecorIcon } from "@/components/decor-icon";

export const metadata: Metadata = {
  title: "About",
  description:
    "Balotiq is a secure, tenant isolated e-voting platform built by PagezTech Ventures for institutions, unions, and pageants.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <section className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            About Balotiq
          </span>

          <h1 className="mt-6 text-balance font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            A platform for elections you can actually trust.
          </h1>
        </div>

        <div className="relative mt-14 border border-foreground/15 bg-background px-6 py-10 md:px-12 md:py-14">
          <DecorIcon className="size-4" position="top-left" />
          <DecorIcon className="size-4" position="top-right" />
          <DecorIcon className="size-4" position="bottom-left" />
          <DecorIcon className="size-4" position="bottom-right" />

          <p className="text-sm leading-7 text-foreground md:text-base">
            Balotiq is a secure, tenant isolated e-voting platform built for
            institutions, unions, and pageants, anywhere a group needs to run
            an election it can actually trust the result of. It&apos;s built
            and operated by PagezTech Ventures.
          </p>

          <h2 className="mt-10 font-heading text-xl font-bold text-foreground">
            Why we built this
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
            Elections fail people in two ways: either the process is opaque
            and people don&apos;t trust the count, or it&apos;s so cumbersome
            that turnout suffers. We wanted a platform where every ballot is
            encrypted and chained to the one before it, so nothing can be
            quietly altered after the fact, while still being simple enough
            for a students&apos; union or a small pageant to set up in an
            afternoon.
          </p>

          <h2 className="mt-10 font-heading text-xl font-bold text-foreground">
            What Balotiq does
          </h2>
          <ul className="mt-3 space-y-2.5">
            <li className="flex gap-2 text-sm leading-7 text-muted-foreground md:text-base">
              <span className="text-primary">•</span>
              <span>
                <strong className="font-medium text-foreground">
                  Registered elections:
                </strong>{" "}
                import an eligible voter list, verify identity, and every
                eligible voter casts exactly one ballot.
              </span>
            </li>
            <li className="flex gap-2 text-sm leading-7 text-muted-foreground md:text-base">
              <span className="text-primary">•</span>
              <span>
                <strong className="font-medium text-foreground">
                  Engage,
                </strong>{" "}
                our separate paid public voting product for pageants and
                awards: named contestants, purchasable vote packages, billed
                via Mobile Money or card through Paystack, with no voter
                account required.
              </span>
            </li>
            <li className="flex gap-2 text-sm leading-7 text-muted-foreground md:text-base">
              <span className="text-primary">•</span>
              <span>
                <strong className="font-medium text-foreground">
                  Tenant isolation:
                </strong>{" "}
                every organisation&apos;s data is walled off at the database
                level, not just the application layer.
              </span>
            </li>
          </ul>

          <h2 className="mt-10 font-heading text-xl font-bold text-foreground">
            Where we are
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
            Balotiq is an early stage platform, actively being built out.
            We&apos;d rather be upfront about that than oversell it. See
            our{" "}
            <a className="text-primary underline underline-offset-4" href="/terms">
              Terms of Service
            </a>{" "}
            for what that means in practice.
          </p>

          <h2 className="mt-10 font-heading text-xl font-bold text-foreground">
            Get in touch
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
            <MailIcon className="mr-2 inline-block size-4 align-text-bottom text-primary" />
            Questions, feedback, or something not working as expected? Reach
            us at{" "}
            <a
              className="text-primary underline underline-offset-4"
              href="mailto:support@balotiq.com"
            >
              support@balotiq.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
