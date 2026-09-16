"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, KeyRound, LayoutDashboard, LogOut, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const baseItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/engage", label: "Explore Engage", icon: Sparkles },
  { href: "/ticketing", label: "Explore tickets", icon: Ticket },
  { href: "/sessions", label: "Account security", icon: KeyRound },
];

export function WorkspaceShell({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-muted lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="sticky top-0 z-40 border-b border-white/10 bg-sidebar px-4 py-5 text-sidebar-foreground lg:h-screen lg:border-r lg:border-b-0 lg:px-5 lg:py-7">
        <div className="flex items-center justify-between gap-3 px-2">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center border border-sidebar-foreground/20 bg-sidebar-foreground/5"><ShieldCheck className="size-5 text-sidebar-primary" aria-hidden="true" /></span>
            <div className="min-w-0"><strong className="block text-sm">Balotiq workspace</strong><span className="block truncate text-xs text-sidebar-foreground/60">{admin ? "Platform administration" : "Your account"}</span></div>
          </div>
          <button type="button" onClick={async () => { await logout(); router.replace("/sign-in"); }} aria-label="Sign out" className="grid size-9 shrink-0 cursor-pointer place-items-center text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring lg:hidden"><LogOut className="size-4" aria-hidden="true" /></button>
        </div>

        <nav aria-label="Workspace navigation" className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-col lg:overflow-visible">
          {baseItems.map(({ href, label, icon: Icon }) => {
            const current = pathname === href;
            return <Link key={href} href={href} aria-current={current ? "page" : undefined} className={cn("flex min-h-11 shrink-0 items-center gap-3 px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", current ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground")}><Icon className="size-4" aria-hidden="true" />{label}</Link>;
          })}
        </nav>

        <div className="mt-5 hidden border-t border-sidebar-foreground/15 pt-4 lg:block lg:mt-auto lg:absolute lg:inset-x-5 lg:bottom-7">
          <button type="button" onClick={async () => { await logout(); router.replace("/sign-in"); }} className="flex min-h-11 w-full cursor-pointer items-center gap-3 px-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"><LogOut className="size-4" aria-hidden="true" />Sign out</button>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function WorkspaceCard({ icon: Icon = Building2, title, detail, badge, href }: { icon?: typeof Building2; title: string; detail: string; badge?: string; href?: string }) {
  const content = <><span className="flex min-w-0 items-center gap-3"><span className="grid size-11 shrink-0 place-items-center bg-secondary"><Icon className="size-5 text-muted-foreground" aria-hidden="true" /></span><span className="min-w-0"><strong className="block truncate text-sm">{title}</strong><span className="mt-1 block text-xs text-muted-foreground">{detail}</span></span></span>{badge && <span className="shrink-0 border bg-secondary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{badge.replaceAll("_", " ")}</span>}</>;
  return <article className="border bg-card shadow-sm">{href ? <Link href={href} className="flex min-h-28 items-center justify-between gap-4 p-5 transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{content}</Link> : <div className="flex min-h-28 items-center justify-between gap-4 p-5">{content}</div>}</article>;
}
