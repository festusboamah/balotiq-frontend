import { cn } from "@/lib/utils";
import { GithubIcon } from "@/components/github-icon";
import { InstagramIcon } from "@/components/instagram-icon";
import { XIcon } from "@/components/x-icon";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { FullWidthDivider } from "@/components/full-width-divider";

export function Footer() {
  return (
    <footer
      className={cn(
        "relative mx-auto max-w-6xl lg:border-x",
        "dark:bg-[radial-gradient(35%_80%_at_15%_0%,--theme(--color-foreground/.1),transparent)]",
      )}
    >
      <FullWidthDivider position="top" />

      <div className="grid max-w-5xl grid-cols-6 gap-6 p-4">
        {/* Brand */}
        <div className="col-span-6 flex flex-col gap-4 pt-5 md:col-span-4">
          <a className="w-max" href="#">
            <Logo className="h-5" />
          </a>

          <p className="max-w-sm text-balance text-muted-foreground text-sm">
            Secure, transparent, and verifiable elections made simple.
          </p>

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
        </div>

        {/* Navigation */}
        <div className="col-span-3 w-full md:col-span-2">
          <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-2">
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
      </div>

      <FullWidthDivider />

      <div className="flex items-center justify-center gap-2 py-4">
        <p className="text-center font-light text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Balotiq, All rights reserved
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
    label: "Features",
    href: "#features",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Privacy Policy",
    href: "/privacy",
  },
  {
    label: "Terms & Conditions",
    href: "/terms",
  },
];

const socialLinks = [
  {
    icon: <GithubIcon />,
    link: "#",
  },
  {
    icon: <InstagramIcon />,
    link: "#",
  },
  {
    icon: <XIcon />,
    link: "#",
  },
];
