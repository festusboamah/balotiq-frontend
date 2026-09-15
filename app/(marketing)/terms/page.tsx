import type { Metadata } from "next";
import { DecorIcon } from "@/components/decor-icon";
import { SitePageContent } from "@/components/site-page-content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Balotiq.",
  alternates: { canonical: "/terms" },
};

const body = `These terms govern your use of Balotiq, operated by PagezTech Ventures. By creating an account, running an election, or casting a vote through Balotiq, you agree to them.

## The service

Balotiq offers two products: Governance, for registered elections run against an uploaded voter roll, and Engage, a separate paid public-voting product for pageants and awards where anyone can purchase votes for a contestant without needing an account.

## Accounts and responsibilities

You're responsible for keeping your login credentials secure and for the accuracy of anything you upload: voter rolls, candidate information, election settings. An organization admin is responsible for making sure the voters they're contacting have actually consented to be on that roll.

## Payments

Governance flat-fee elections and Engage vote-package purchases are processed through Paystack. See our Billing & Refund Policy for how charges and refunds work.

## Acceptable use

You agree not to:

- Run an election you don't have the authority to run.
- Upload a voter roll containing people who haven't consented to be on it.
- Attempt to vote more than once, impersonate another voter, or bypass verification.
- Attempt to interfere with, tamper with, or manipulate ballot data or results.

## Election integrity and ballot secrecy

Every ballot is encrypted and chained to the one before it, and once cast it's not possible for anyone, including PagezTech Ventures, to alter it undetected or trace it back to who cast it. We take this as a structural commitment, not just a policy statement.

## Availability

Balotiq is an early-stage platform. We work to keep it available and reliable, but we don't currently offer a formal uptime guarantee or service-level agreement. We recommend not relying on Balotiq for an election with no fallback plan if you need one.

## Limitation of liability

Balotiq is provided "as is." To the extent permitted by law, PagezTech Ventures isn't liable for indirect or consequential losses arising from your use of the platform, including a disputed or delayed election result.

## Termination

We may suspend or terminate an account that violates these terms, particularly around election integrity or acceptable use. You can stop using Balotiq at any time.

## Governing law

These terms are governed by the laws of Ghana.

## Changes to these terms

If these terms change materially, we'll update the date at the top of this page.

## Contact

Questions about these terms? Email support@balotiq.com.`;

export default function TermsPage() {
  return (
    <section className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Terms of Service
          </span>

          <h1 className="mt-6 text-balance font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            The rules for using Balotiq.
          </h1>
        </div>

        <div className="relative mt-14 border border-foreground/15 bg-background px-6 py-10 md:px-12 md:py-14">
          <DecorIcon className="size-4" position="top-left" />
          <DecorIcon className="size-4" position="top-right" />
          <DecorIcon className="size-4" position="bottom-left" />
          <DecorIcon className="size-4" position="bottom-right" />

          <SitePageContent body={body} />
        </div>
      </div>
    </section>
  );
}
