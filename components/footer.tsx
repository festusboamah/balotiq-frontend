import Link from "next/link";
import { cn } from "@/lib/utils";
// import { GithubIcon } from "@/components/github-icon";
// import { InstagramIcon } from "@/components/instagram-icon";
// import { XIcon } from "@/components/x-icon";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer
      className={cn(
        "relative mx-auto max-w-6xl",
        "dark:bg-[radial-gradient(35%_80%_at_15%_0%,--theme(--color-foreground/.1),transparent)]",
      )}
    >
      <div className="grid grid-cols-6 gap-6 p-4">
        {/* Brand */}
        <div className="col-span-6 flex flex-col gap-4 pt-5">
          <Link className="w-max" href="/">
            <Logo className="h-5" />
          </Link>

          <p className="max-w-sm text-balance text-muted-foreground text-sm">
            Secure, transparent, and verifiable elections made simple.
          </p>

          {/* Social links, temporarily disabled until real accounts exist
          <div className="flex gap-2">
            {socialLinks.map((item, index) => (
              <Button
                key={`social-${item.link}-${index}`}
                size="icon"
                variant="outline"
                render={<a href={item.link} target="_blank" rel="noreferrer" />}
                nativeButton={false}
              >
                {item.icon}
              </Button>
            ))}
          </div>
          */}
        </div>

        {/* Navigation */}
        <div className="col-span-3 w-full sm:col-span-2">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.14em]">
            Navigation
          </p>
          <div className="mt-3 flex flex-col items-start gap-2.5">
            {navLinks.map(({ href, label }) => (
              <a
                className="w-max text-sm hover:underline"
                href={href}
                key={label}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div className="col-span-3 w-full sm:col-span-2">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.14em]">
            Legal
          </p>
          <div className="mt-3 flex flex-col items-start gap-2.5">
            {legalLinks.map(({ href, label }) => (
              <a
                className="w-max text-sm hover:underline"
                href={href}
                key={label}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="col-span-6 w-full sm:col-span-2">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.14em]">
            Support
          </p>
          <a
            className="mt-3 inline-block text-sm font-medium hover:underline"
            href="mailto:support@balotiq.com"
          >
            support@balotiq.com
          </a>
          <p className="mt-2 max-w-xs text-muted-foreground text-xs leading-5">
            Questions about an election or Engage event? We&apos;re here to
            help.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-1.5 py-4 sm:flex-row sm:justify-between sm:px-4">
        <p className="text-center font-light text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Balotiq, All rights reserved
        </p>
        <p className="text-center font-light text-muted-foreground text-sm">
          A product by{" "}
          <a
            className="font-medium text-foreground hover:underline"
            href="https://nerdsiv.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nerds IV Technologies
          </a>
        </p>
      </div>
    </footer>
  );
}

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Governance",
    href: "/governance",
  },
  {
    label: "Engage",
    href: "/engage",
  },
  {
    label: "Ticketing",
    href: "/ticketing",
  },
  {
    label: "Features",
    href: "/#features",
  },
  {
    label: "Pricing",
    href: "/#pricing",
  },
  {
    label: "About",
    href: "/about",
  },
];

const legalLinks = [
  {
    label: "Privacy Policy",
    href: "https://balotiq.com/privacy",
  },
  {
    label: "Terms of Service",
    href: "https://balotiq.com/terms",
  },
  {
    label: "Billing & Refunds",
    href: "https://balotiq.com/billing-policy",
  },
];

// const socialLinks = [
//   {
//     icon: <GithubIcon />,
//     link: "#",
//   },
//   {
//     icon: <InstagramIcon />,
//     link: "#",
//   },
//   {
//     icon: <XIcon />,
//     link: "#",
//   },
// ];
