"use client";

import { useEffect, useState } from "react";
import { WorkspaceCard, WorkspaceShell } from "@/components/workspace-shell";
import { Building2 } from "lucide-react";
import { ApiError } from "@/lib/api-client";
import type { OrganizationResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function AdminOrganizationsPage() {
  const { user, loading, authGet } = useRequireAuth();
  const [orgs, setOrgs] = useState<OrganizationResponse[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading || !user) return;
    authGet<OrganizationResponse[]>("/api/v1/organizations").then(rows => { setOrgs(rows); setDataLoading(false); })
      .catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "Unable to load organisations."); setDataLoading(false); });
  }, [loading, user, authGet]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;
  if (!user.is_super_admin) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">Only a Super Admin can view this page.</p></main>;

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
    <header><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Platform administration</p><h1 className="mt-1 font-heading text-3xl font-bold">All organisations</h1><p className="mt-2 text-sm text-muted-foreground">{orgs.length} total</p></header>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="grid gap-3 sm:grid-cols-2">{orgs.map(org => <WorkspaceCard key={org.id} icon={Building2} href={`/organizations/${org.id}`} title={org.name} detail={org.billing_mode.replaceAll("_", " ")} badge={org.status} />)}</div>
  </main></WorkspaceShell>;
}
