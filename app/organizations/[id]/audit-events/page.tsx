"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { ApiError, downloadBlob } from "@/lib/api-client";
import type { AuditEventResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function OrganizationAuditEventsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading, authGet, authGetBlob } = useRequireAuth();
  const [events, setEvents] = useState<AuditEventResponse[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading || !user) return;
    authGet<AuditEventResponse[]>(`/api/v1/organizations/${id}/audit-events`)
      .then(rows => { setEvents(rows); setDataLoading(false); })
      .catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "Unable to load this organisation's audit events."); setDataLoading(false); });
  }, [loading, user, authGet, id]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
    <header><div className="flex flex-wrap items-center justify-between gap-4"><h1 className="font-heading text-3xl font-bold">Audit trail</h1><Button type="button" variant="outline" onClick={async () => downloadBlob(await authGetBlob(`/api/v1/organizations/${id}/audit-events/export`), "audit-events.csv")}>Export CSV</Button></div></header>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {events.length === 0 ? <div className="border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">No audit events yet.</div> : <div className="divide-y border bg-card">{events.map(entry => <div key={entry.id} className="flex flex-wrap items-start justify-between gap-3 p-4 text-sm"><div className="min-w-0"><strong className="block">{entry.action}</strong><span className="block text-xs text-muted-foreground">{entry.target_type}{entry.target_id ? ` · ${entry.target_id}` : ""}</span>{entry.reason && <span className="mt-1 block text-xs text-muted-foreground">{entry.reason}</span>}</div><span className="shrink-0 text-xs text-muted-foreground">{new Date(entry.occurred_at).toLocaleString()}</span></div>)}</div>}
  </main></WorkspaceShell>;
}
