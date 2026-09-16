"use client";

import { useEffect, useState, type FormEvent } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import type { SuperAdminResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function SuperAdminsPage() {
  const { user, loading, authGet, authPost, authDelete } = useRequireAuth();
  const [admins, setAdmins] = useState<SuperAdminResponse[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    authGet<SuperAdminResponse[]>("/api/v1/super-admins").then(rows => { setAdmins(rows); setDataLoading(false); })
      .catch((reason2: unknown) => { setError(reason2 instanceof ApiError ? reason2.message : "Unable to load Super Admins."); setDataLoading(false); });
  }, [loading, user, authGet, reload]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;
  if (!user.is_super_admin) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">Only a Super Admin can view this page.</p></main>;

  const promote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setPending(true); setError("");
    try { await authPost("/api/v1/super-admins", { email, reason }); setEmail(""); setReason(""); setReload(value => value + 1); }
    catch (reason2) { setError(reason2 instanceof ApiError ? reason2.message : "Unable to promote this account."); }
    finally { setPending(false); }
  };

  const demote = async (id: string) => {
    const removalReason = window.prompt("Reason for removing Super Admin access (at least 10 characters):");
    if (!removalReason || removalReason.trim().length < 10) { setError("A reason of at least 10 characters is required."); return; }
    try { await authDelete(`/api/v1/super-admins/${id}?reason=${encodeURIComponent(removalReason.trim())}`); setReload(value => value + 1); }
    catch (reason2) { setError(reason2 instanceof ApiError ? reason2.message : "Unable to remove Super Admin access."); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
    <header><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Platform administration</p><h1 className="mt-1 font-heading text-3xl font-bold">Super Admins</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Promoting or removing Super Admin access re-verifies your password (and authenticator code, if enabled) and is recorded in the audit trail.</p></header>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

    <section className="divide-y border bg-card">{admins.length === 0 ? <p className="p-5 text-sm text-muted-foreground">No Super Admins found.</p> : admins.map(admin => <div key={admin.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"><span><strong>{admin.email}</strong><span className="ml-2 text-muted-foreground">since {new Date(admin.created_at).toLocaleDateString()}</span></span>{admins.length > 1 && <button type="button" onClick={() => void demote(admin.id)} className="min-h-11 cursor-pointer px-2 text-xs font-semibold text-destructive hover:underline">Remove</button>}</div>)}</section>

    <form onSubmit={promote} className="grid gap-3 border bg-card p-5 md:grid-cols-2">
      <h2 className="font-heading text-lg font-semibold md:col-span-2">Promote an account</h2>
      <div className="md:col-span-2"><label htmlFor="promote-email" className="text-sm font-medium">Account email</label><p className="mt-1 text-xs text-muted-foreground">Must already have a Balotiq account.</p><Input id="promote-email" type="email" required value={email} onChange={event => setEmail(event.target.value)} className="mt-2 h-11" /></div>
      <div className="md:col-span-2"><label htmlFor="promote-reason" className="text-sm font-medium">Reason</label><Input id="promote-reason" required minLength={10} value={reason} onChange={event => setReason(event.target.value)} className="mt-2 h-11" placeholder="Reason for granting Super Admin access (minimum 10 characters)" /></div>
      <Button type="submit" disabled={pending} className="h-11 md:col-span-2">{pending ? "Promoting…" : "Promote to Super Admin"}</Button>
    </form>
  </main></WorkspaceShell>;
}
