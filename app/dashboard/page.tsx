"use client";

import { useEffect, useState } from "react";
import { Building2, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import { WorkspaceCard, WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/lib/use-require-auth";
import type { EngageOrganiserResponse, TicketingOrganiserResponse } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading, authGet } = useRequireAuth();
  const [engageOrganisers, setEngageOrganisers] = useState<EngageOrganiserResponse[]>([]);
  const [ticketingOrganisers, setTicketingOrganisers] = useState<TicketingOrganiserResponse[]>([]);
  const [operationsLoading, setOperationsLoading] = useState(true);
  const [operationsError, setOperationsError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (loading || !user || user.is_super_admin) return;
    void Promise.all([
        authGet<EngageOrganiserResponse[]>("/api/engage/organisers"),
        authGet<TicketingOrganiserResponse[]>("/api/ticketing/organisers"),
      ])
      .then(([engage, ticketing]) => {
      setEngageOrganisers(engage);
      setTicketingOrganisers(ticketing);
      setOperationsLoading(false);
      })
      .catch((error: unknown) => {
      setOperationsError(error instanceof Error ? error.message : "Unable to load your organiser workspaces.");
      setOperationsLoading(false);
      });
  }, [loading, user, authGet, retryCount]);

  if (loading || !user) {
    return <main className="grid min-h-screen place-items-center px-4" aria-live="polite"><p className="text-sm text-muted-foreground">Loading your workspace…</p></main>;
  }

  return (
    <WorkspaceShell admin={user.is_super_admin}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <section className="relative overflow-hidden bg-primary px-6 py-9 text-primary-foreground sm:px-8">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_center,var(--color-accent),transparent_70%)] opacity-20" aria-hidden="true" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/65">Your workspace</p>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Welcome back</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/70">Manage your organisations, voting operations, and account security from one place.</p>
          </div>
        </section>

        {user.is_super_admin && (
          <section aria-labelledby="admin-heading">
            <div className="mb-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Platform operations</p><h2 id="admin-heading" className="mt-1 font-heading text-2xl font-bold">Control centre</h2></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <WorkspaceCard icon={Building2} href="/organizations/new" title="New organisation" detail="Provision a tenant workspace" badge="Admin" />
              <WorkspaceCard icon={Sparkles} href="/engage/organisers/new" title="New Engage organiser" detail="Events and organiser controls" badge="Admin" />
              <WorkspaceCard icon={Ticket} href="/ticketing/organisers/new" title="New Ticketing organiser" detail="Events, tiers and check-in" badge="Admin" />
              <WorkspaceCard icon={ShieldCheck} href="/admin/audit-events" title="Audit evidence" detail="Sensitive platform activity" badge="Admin" />
              <WorkspaceCard icon={ShieldCheck} href="/admin/super-admins" title="Super Admins" detail="Promote or remove platform access" badge="Admin" />
            </div>
          </section>
        )}

        {!user.is_super_admin && operationsLoading && <p className="text-sm text-muted-foreground" aria-live="polite">Loading organiser workspaces…</p>}
        {!user.is_super_admin && operationsError && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><span>{operationsError}</span><Button type="button" variant="outline" onClick={() => { setOperationsLoading(true); setOperationsError(""); setRetryCount(value => value + 1); }}>Try again</Button></div>}

        {!user.is_super_admin && !operationsLoading && engageOrganisers.length > 0 && (
          <section aria-labelledby="engage-heading"><div className="mb-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Engage</p><h2 id="engage-heading" className="mt-1 font-heading text-2xl font-bold">Your organisers</h2></div><div className="grid gap-3 sm:grid-cols-2">{engageOrganisers.map((organiser) => <WorkspaceCard key={organiser.id} href={`/engage/organisers/${organiser.id}`} icon={Sparkles} title={organiser.display_name} detail="Engage organiser" badge={organiser.status} />)}</div></section>
        )}

        {!user.is_super_admin && !operationsLoading && ticketingOrganisers.length > 0 && (
          <section aria-labelledby="ticketing-heading"><div className="mb-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">E-Ticketing</p><h2 id="ticketing-heading" className="mt-1 font-heading text-2xl font-bold">Your ticketing organisers</h2></div><div className="grid gap-3 sm:grid-cols-2">{ticketingOrganisers.map((organiser) => <WorkspaceCard key={organiser.id} href={`/ticketing/organisers/${organiser.id}`} icon={Ticket} title={organiser.display_name} detail="Ticketing organiser" badge={organiser.status} />)}</div></section>
        )}

        <section aria-labelledby="governance-heading">
          <div className="mb-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Governance</p><h2 id="governance-heading" className="mt-1 font-heading text-2xl font-bold">Your organisations</h2></div>
          {user.organizations.length === 0 ? <div className="border border-dashed bg-card px-6 py-10 text-center"><Building2 className="mx-auto size-6 text-muted-foreground" aria-hidden="true" /><p className="mt-3 text-sm font-semibold">No organisations yet</p><p className="mt-1 text-sm text-muted-foreground">Your organisation memberships will appear here.</p></div> : <div className="grid gap-3 sm:grid-cols-2">{user.organizations.map((org) => <WorkspaceCard key={`${org.id}-${org.role}`} href={`/organizations/${org.id}`} title={org.name} detail="Governance workspace" badge={org.role} />)}</div>}
        </section>
      </main>
    </WorkspaceShell>
  );
}
