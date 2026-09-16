"use client";

import { useEffect, useState } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, downloadBlob } from "@/lib/api-client";
import type { AuditEventResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function AdminAuditEventsPage() {
  const { user, loading, authGet, authGetBlob } = useRequireAuth();
  const [events, setEvents] = useState<AuditEventResponse[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [action, setAction] = useState("");
  const [targetType, setTargetType] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (loading || !user) return;
    const params = new URLSearchParams();
    if (action) params.set("action", action);
    if (targetType) params.set("target_type", targetType);
    authGet<AuditEventResponse[]>(`/api/v1/admin/audit-events?${params.toString()}`)
      .then(rows => { setEvents(rows); setDataLoading(false); })
      .catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "Unable to load audit events."); setDataLoading(false); });
  }, [loading, user, authGet, action, targetType, reload]);

  if (loading || !user) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;
  if (!user.is_super_admin) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">Only a Super Admin can view this page.</p></main>;

  const exportCsv = async () => {
    const params = new URLSearchParams();
    if (action) params.set("action", action);
    if (targetType) params.set("target_type", targetType);
    downloadBlob(await authGetBlob(`/api/v1/admin/audit-events/export?${params.toString()}`), "audit-events.csv");
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
    <header><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Platform administration</p><h1 className="mt-1 font-heading text-3xl font-bold">Audit trail</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Every sensitive platform action, platform-wide.</p></header>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

    <div className="flex flex-wrap items-end gap-3"><div><label htmlFor="filter-action" className="text-sm font-medium">Action contains</label><Input id="filter-action" value={action} onChange={event => setAction(event.target.value)} className="mt-2 h-11" placeholder="e.g. MEMBER" /></div><div><label htmlFor="filter-target" className="text-sm font-medium">Target type</label><Input id="filter-target" value={targetType} onChange={event => setTargetType(event.target.value)} className="mt-2 h-11" placeholder="e.g. ORGANIZATION" /></div><Button type="button" variant="outline" className="h-11" onClick={() => setReload(value => value + 1)}>Refresh</Button><Button type="button" variant="outline" className="h-11" onClick={() => void exportCsv()}>Export CSV</Button></div>

    {dataLoading ? <p className="text-sm text-muted-foreground">Loading events…</p> : events.length === 0 ? <div className="border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">No matching audit events.</div> : <div className="divide-y border bg-card">{events.map(entry => <div key={entry.id} className="flex flex-wrap items-start justify-between gap-3 p-4 text-sm"><div className="min-w-0"><strong className="block">{entry.action}</strong><span className="block text-xs text-muted-foreground">{entry.target_type}{entry.target_id ? ` · ${entry.target_id}` : ""}</span>{entry.reason && <span className="mt-1 block text-xs text-muted-foreground">{entry.reason}</span>}</div><span className="shrink-0 text-xs text-muted-foreground">{new Date(entry.occurred_at).toLocaleString()}</span></div>)}</div>}
  </main></WorkspaceShell>;
}
