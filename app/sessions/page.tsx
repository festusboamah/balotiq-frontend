"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import type { SessionResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function SessionsPage() {
  const { user, loading, authGet, authDelete, authPost } = useRequireAuth();
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (loading || !user) return;
    authGet<SessionResponse[]>("/api/v1/auth/sessions").then(rows => { setSessions(rows); setDataLoading(false); })
      .catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "Unable to load your sessions."); setDataLoading(false); });
  }, [loading, user, authGet, reload]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;

  const revoke = async (id: string) => {
    try { await authDelete(`/api/v1/auth/sessions/${id}`); setReload(value => value + 1); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to sign out that session."); }
  };

  const revokeOthers = async () => {
    try { await authPost("/api/v1/auth/sessions/revoke-others"); setReload(value => value + 1); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to sign out other sessions."); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
    <header><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Account security</p><div className="mt-1 flex flex-wrap items-center justify-between gap-3"><h1 className="font-heading text-3xl font-bold">Active sessions</h1><Link href="/mfa" className="text-sm text-primary underline-offset-4 hover:underline">Two-factor authentication →</Link></div><p className="mt-2 text-sm leading-6 text-muted-foreground">Every device currently signed in to your account.</p></header>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

    <section className="divide-y border bg-card">{sessions.map(session => <div key={session.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"><span><strong>{session.is_current ? "This device" : "Session"}</strong><span className="ml-2 text-muted-foreground">signed in {new Date(session.created_at).toLocaleString()} · expires {new Date(session.expires_at).toLocaleDateString()}</span></span>{!session.is_current && <button type="button" onClick={() => void revoke(session.id)} className="min-h-11 cursor-pointer px-2 text-xs font-semibold text-destructive hover:underline">Sign out</button>}</div>)}</section>

    {sessions.length > 1 && <Button type="button" variant="destructive" onClick={() => void revokeOthers()}>Sign out all other sessions</Button>}
  </main></WorkspaceShell>;
}
