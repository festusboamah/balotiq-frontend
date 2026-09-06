import type { Metadata } from "next";
import {
  ArrowRightIcon,
  ClipboardCheckIcon,
  LockIcon,
  ShieldCheckIcon,
  UserCheckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DecorIcon } from "@/components/decor-icon";
import { FullWidthDivider } from "@/components/full-width-divider";

export const metadata: Metadata = {
  title: "Governance",
  description:
    "Run organisational elections with controlled voter registers, ballot privacy, and accountable results.",
  alternates: { canonical: "/governance" },
};

const features = [
  {
    icon: <UserCheckIcon />,
    title: "Controlled voter registers",
    description:
      "Import your voter roll as a CSV, and every voter verifies their own eligibility before they can see a ballot. Being on the list isn't the same as being able to vote.",
  },
  {
    icon: <LockIcon />,
    title: "Private, tamper-evident ballots",
    description:
      "Each selection is encrypted and chained to the one before it, so an altered ballot would visibly break the chain. No one, including us, can trace a vote back to who cast it.",
  },
  {
    icon: <ClipboardCheckIcon />,
    title: "Accountable results",
    description:
      "Tallying is a deliberate step an admin triggers, not something that happens automatically. Certification records who signed off, when, and against what turnout.",
  },
];

const steps = [
  [
    "01",
    "Set up your organisation",
    "Create your workspace, invite Org Admins and Election Managers, and decide how the election gets billed.",
  ],
  [
    "02",
    "Build the election",
    "Add positions and candidates, or open self-nomination. Import your voter roll and set the dates.",
  ],
  [
    "03",
    "Vote, tally, certify",
    "Voting opens and closes automatically on schedule. Tally when it's over, then certify once turnout clears your quorum.",
  ],
];

export default function GovernancePage() {
  return (
    <>
      <section className="relative px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Balotiq Governance
          </span>

          <h1 className="mt-6 text-balance font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            A stronger voice for your members.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            Run organisational elections with controlled voter registers,
            ballot privacy, and accountable results, for unions,
            universities, and associations.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              render={<a href="https://balotiq.com/register" />}
              nativeButton={false}
            >
              Set up your workspace{" "}
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
                <div className="absolute -inset-y-4 -left-px w-px bg-border" />
                <div className="absolute -inset-y-4 -right-px w-px bg-border" />
                <div className="absolute -inset-x-4 -top-px h-px bg-border" />
                <div className="absolute -right-4 -bottom-px -left-4 h-px bg-border" />
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
            <ShieldCheckIcon className="size-8 text-primary" />
            <h2 className="max-w-xl font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Ready to run your next election?
            </h2>
            <p className="max-w-md text-sm text-muted-foreground md:text-base">
              Create a secure election, invite voters, and certify a result
              you can defend, all from one workspace.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                render={<a href="https://balotiq.com/register" />}
                nativeButton={false}
              >
                Start your election{" "}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <Button
                variant="outline"
                render={<a href="https://balotiq.com/login" />}
                nativeButton={false}
              >
                Already have an account? Log in
              </Button>
            </div>
          </div>

          <FullWidthDivider contained position="top" />
        </div>
      </section>
    </>
  );
}
