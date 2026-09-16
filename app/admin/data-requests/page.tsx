"use client";

import { useEffect, useState } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import type { DataSubjectRequestResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function AdminDataRequestsPage() {
  const { user, loading, authGet, authPost } = useRequireAuth();
  const [requests, setRequests] = useState<DataSubjectRequestResponse[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (loading || !user) return;
    authGet<DataSubjectRequestResponse[]>("/api/v1/admin/data-requests").then(rows => { setRequests(rows); setDataLoading(false); })
      .catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "Unable to load data requests."); setDataLoading(false); });
  }, [loading, user, authGet, reload]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;
  if (!user.is_super_admin) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">Only a Super Admin can view this page.</p></main>;

  const advance = async (id: string, status: "VERIFYING" | "IN_PROGRESS") => {
    try { await authPost(`/api/v1/admin/data-requests/${id}/status`, { status }); setReload(value => value + 1); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to update this request."); }
  };

  const resolve = async (id: string, outcome: "COMPLETED" | "REJECTED") => {
    const note = window.prompt(`Resolution note for marking this ${outcome === "COMPLETED" ? "completed" : "rejected"} (at least 10 characters):`);
    if (!note || note.trim().length < 10) return;
    try { await authPost(`/api/v1/admin/data-requests/${id}/resolve`, { outcome, resolution_note: note.trim() }); setReload(value => value + 1); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to resolve this request."); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
    <header><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Platform administration</p><h1 className="mt-1 font-heading text-3xl font-bold">Data subject requests</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Access, correction, deletion and restriction requests under the Data Protection Act.</p></header>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {requests.length === 0 ? <div className="border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">No data requests.</div> : <div className="divide-y border bg-card">{requests.map(item => <div key={item.id} className="flex flex-wrap items-start justify-between gap-3 p-4 text-sm"><div className="min-w-0"><strong>{item.request_type}</strong><span className="ml-2 text-xs uppercase text-muted-foreground">{item.status}</span><p className="mt-1 text-xs text-muted-foreground">{item.requester_email} · due {new Date(item.due_at).toLocaleDateString()}</p><p className="mt-1 max-w-md text-xs text-muted-foreground">{item.details}</p>{item.resolution_note && <p className="mt-1 text-xs text-muted-foreground">Resolution: {item.resolution_note}</p>}</div>{!["COMPLETED", "REJECTED"].includes(item.status) && <div className="flex shrink-0 flex-wrap gap-2">{item.status === "RECEIVED" && <Button type="button" size="sm" variant="outline" onClick={() => void advance(item.id, "VERIFYING")}>Verifying</Button>}{item.status !== "IN_PROGRESS" && <Button type="button" size="sm" variant="outline" onClick={() => void advance(item.id, "IN_PROGRESS")}>In progress</Button>}<Button type="button" size="sm" onClick={() => void resolve(item.id, "COMPLETED")}>Complete</Button><Button type="button" size="sm" variant="destructive" onClick={() => void resolve(item.id, "REJECTED")}>Reject</Button></div>}</div>)}</div>}
  </main></WorkspaceShell>;
}
