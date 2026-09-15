import type { Metadata } from "next";
import { DecorIcon } from "@/components/decor-icon";
import { SitePageContent } from "@/components/site-page-content";

export const metadata: Metadata = {
  title: "Billing & Refund Policy",
  description: "How charges and refunds work on Balotiq.",
  alternates: { canonical: "/billing-policy" },
};

const body = `All payments on Balotiq are processed through Paystack, in Ghana Cedis (GHS). Card and Mobile Money details are entered directly on Paystack's payment page and never pass through Balotiq's servers.

## Flat-fee elections

Registered elections are charged a one-time flat fee before they can be scheduled. Building the election out (positions, candidates, voter roll) is free; the fee only gates actually opening it to voters. Once an election has been scheduled or opened, this fee is non-refundable, since the service (hosting a live, tallied election) has been delivered. If payment succeeds but you decide not to schedule the election at all, contact support@balotiq.com. Refunds in that case are handled case by case.

## Engage vote packages

Each Engage payment purchases a package of votes for a contestant, credited to our ledger automatically the moment payment is confirmed. Because votes are credited immediately, Engage payments are non-refundable once the votes have been credited. The one exception is a payment confirmed by Paystack that never results in credited votes, for example, if an event closes in the brief window between starting checkout and payment confirming. Our team reconciles these cases against Paystack's own records and, where votes genuinely can't be credited, issues a refund back to your original payment method. Contact support@balotiq.com with your payment reference if you believe this applies to you.

## Disputes

If you believe you were charged in error, email support@balotiq.com with your payment reference (shown on your receipt) and a description of the issue. We'll investigate against Paystack's own transaction records before resolving it.`;

export default function BillingPolicyPage() {
  return (
    <section className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Billing & Refunds
          </span>

          <h1 className="mt-6 text-balance font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            How charges and refunds work.
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
