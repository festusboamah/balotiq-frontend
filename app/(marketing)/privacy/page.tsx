import type { Metadata } from "next";
import { DecorIcon } from "@/components/decor-icon";
import { SitePageContent } from "@/components/site-page-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What personal data Balotiq collects, why, and how it's handled, written with Ghana's Data Protection Act, 2012 (Act 843) in mind.",
  alternates: { canonical: "/privacy" },
};

const body = `This policy explains what personal data Balotiq collects, why, and how it's handled. It's written with Ghana's Data Protection Act, 2012 (Act 843) in mind, since Balotiq processes personal data of people in Ghana. The data controller is PagezTech Ventures, which builds and operates Balotiq at balotiq.com.

## What we collect

What we hold about you depends on how you use Balotiq:

- Organization admins and members: an email address and a password (stored as a salted hash, never in plain text). We don't collect your name unless you choose to include it somewhere like an election's content.
- Voters in a registered election: whatever identifying information the organization running that election uploads to its voter roll (typically a voter ID and/or email address), used only to verify you're eligible to vote in that specific election.
- Engage voters: an optional contact (e.g. an email address or phone number) provided at checkout, used only for purchase confirmation and support. Card or Mobile Money details are entered directly on Paystack's payment page and never pass through Balotiq's servers.
- Ballot content: every vote is encrypted before it's stored, and is deliberately not kept linked back to the voter who cast it in any form we can reverse. This is a structural property of how ballots are recorded, not just a policy promise.

## Why we process it

To run the service you've asked for: verifying you're eligible to vote, preventing double-voting, processing Engage vote-package payments, and keeping accounts secure. Where the law requires a specific legal basis, this is either your consent (e.g. providing a contact at Engage checkout) or our legitimate interest in running a fraud-resistant, secure election platform.

## Who we share it with

We use a small number of infrastructure and service providers to run Balotiq:

- Paystack: payment processing for Governance flat fees and Engage vote-package purchases.
- Resend: transactional email (password resets, notifications).
- Cloudflare and Vultr: network security and server hosting.

We don't sell personal data, and we don't share voter roll data or ballot content with anyone outside the organization running that specific election.

## How long we keep it

Ballots and voter roll records are retained for at least 7 years, matching standard election record-keeping practice, so that results can be independently verified or audited well after an election closes. Account data (like your login email) is kept for as long as your account is active.

## Your rights

Under Act 843, you can ask to access, correct, or request deletion of personal data we hold about you. Two limits apply in practice: we can't reverse ballot secrecy even on request (nobody can, including us), and we may need to retain some records where we're legally required to for election integrity or audit purposes. To make a request, email support@balotiq.com.

## Security

Ballots are encrypted at rest and chained so tampering is detectable. Every organization's data is isolated at the database level, not just in the application. Passwords are hashed, never stored in plain text, and two-factor authentication is available on every account. Sign-in attempts are rate-limited, and the highest-risk administrative actions require re-confirming your password even within an already-signed-in session.

## Data Protection Commission registration

PagezTech Ventures' registration with Ghana's Data Protection Commission is currently in progress. We're noting that plainly here rather than overstating our status.

## Changes to this policy

If this policy changes materially, we'll update the date at the top of this page. Continued use of Balotiq after a change means you accept the updated policy.

## Contact

Questions about this policy or your data? Email support@balotiq.com.`;

export default function PrivacyPage() {
  return (
    <section className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Privacy Policy
          </span>

          <h1 className="mt-6 text-balance font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            What we collect, and why.
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
