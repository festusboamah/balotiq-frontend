"use client";

import { useEffect, useState, type FormEvent } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import type { DataSubjectRequestResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

const TYPES = ["ACCESS", "CORRECTION", "DELETION", "RESTRICTION"] as const;

export default function PrivacyRequestsPage() {
  const { user, loading, authGet, authPost } = useRequireAuth();
  const [requests, setRequests] = useState<DataSubjectRequestResponse[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [requestType, setRequestType] = useState<(typeof TYPES)[number]>("ACCESS");
  const [details, setDetails] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    authGet<DataSubjectRequestResponse[]>("/api/v1/me/data-requests").then(rows => { setRequests(rows); setDataLoading(false); })
      .catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "Unable to load your requests."); setDataLoading(false); });
  }, [loading, user, authGet, reload]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setPending(true); setError("");
    try { await authPost("/api/v1/me/data-requests", { request_type: requestType, details }); setDetails(""); setReload(value => value + 1); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to submit this request."); }
    finally { setPending(false); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
    <header><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Account security</p><h1 className="mt-1 font-heading text-3xl font-bold">Your data requests</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Request access to, correction of, deletion of, or a restriction on how we use your data.</p></header>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

    <section className="divide-y border bg-card">{requests.length === 0 ? <p className="p-5 text-sm text-muted-foreground">No requests yet.</p> : requests.map(item => <div key={item.id} className="p-4 text-sm"><strong>{item.request_type}</strong><span className="ml-2 text-xs uppercase text-muted-foreground">{item.status}</span><p className="mt-1 text-xs text-muted-foreground">Submitted {new Date(item.created_at).toLocaleDateString()} · due {new Date(item.due_at).toLocaleDateString()}</p>{item.resolution_note && <p className="mt-1 text-xs text-muted-foreground">{item.resolution_note}</p>}</div>)}</section>

    <form onSubmit={submit} className="grid gap-3 border bg-card p-5">
      <h2 className="font-heading text-lg font-semibold">Submit a new request</h2>
      <div><label htmlFor="request-type" className="text-sm font-medium">Type</label><select id="request-type" value={requestType} onChange={event => setRequestType(event.target.value as (typeof TYPES)[number])} className="mt-2 h-11 w-full border bg-background px-3 text-sm">{TYPES.map(value => <option key={value}>{value}</option>)}</select></div>
      <div><label htmlFor="details" className="text-sm font-medium">Details</label><textarea id="details" required minLength={10} rows={4} value={details} onChange={event => setDetails(event.target.value)} className="mt-2 w-full border bg-background p-3 text-sm" placeholder="Describe what you're requesting (minimum 10 characters)" /></div>
      <Button type="submit" disabled={pending} className="h-11">{pending ? "Submitting…" : "Submit request"}</Button>
    </form>
  </main></WorkspaceShell>;
}
