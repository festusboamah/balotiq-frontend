"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import type { EngageSearchHitResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

function hitHref(hit: EngageSearchHitResponse): string {
  if (hit.type === "ORGANISER") return `/engage/organisers/${hit.id}`;
  if (hit.type === "EVENT") return `/engage/events/${hit.id}`;
  if (hit.event_id) return `/engage/events/${hit.event_id}`;
  return "#";
}

export default function EngageSearchPage() {
  const { user, loading, authGet } = useRequireAuth();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<EngageSearchHitResponse[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [searched, setSearched] = useState(false);

  if (loading || !user) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;
  if (!user.is_super_admin) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">Only a Super Admin can view this page.</p></main>;

  const search = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    setPending(true); setError(""); setSearched(true);
    try { setHits(await authGet<EngageSearchHitResponse[]>(`/api/engage/search?q=${encodeURIComponent(query.trim())}`)); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Search failed."); }
    finally { setPending(false); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
    <header><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Engage operations</p><h1 className="mt-1 font-heading text-3xl font-bold">Search</h1><p className="mt-2 text-sm text-muted-foreground">Events, organisers, contestants, transactions and support cases.</p></header>
    <form onSubmit={search} className="flex gap-3"><Input aria-label="Search" required value={query} onChange={event => setQuery(event.target.value)} placeholder="Name, slug, or reference" className="h-11 flex-1" /><Button type="submit" disabled={pending} className="h-11">{pending ? "Searching…" : "Search"}</Button></form>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {searched && !pending && hits.length === 0 && !error && <p className="text-sm text-muted-foreground">No results.</p>}
    {hits.length > 0 && <div className="divide-y border bg-card">{hits.map(hit => <Link key={`${hit.type}-${hit.id}`} href={hitHref(hit)} className="flex items-center justify-between gap-3 p-4 text-sm transition-colors hover:bg-secondary/60"><span>{hit.label}</span><span className="shrink-0 border bg-secondary px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{hit.type.replaceAll("_", " ")}</span></Link>)}</div>}
  </main></WorkspaceShell>;
}
