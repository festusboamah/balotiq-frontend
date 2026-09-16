"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import type { SitePageResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function EditSitePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, loading, authGet, authPatch } = useRequireAuth();
  const [page, setPage] = useState<SitePageResponse | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    authGet<SitePageResponse[]>("/api/v1/pages").then(rows => {
      const record = rows.find(item => item.slug === slug);
      if (!record) { setError("No page with that slug exists."); setDataLoading(false); return; }
      setPage(record); setTitle(record.title); setBody(record.body); setDataLoading(false);
    }).catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "Unable to load this page."); setDataLoading(false); });
  }, [loading, user, authGet, slug]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;
  if (!user.is_super_admin) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">Only a Super Admin can view this page.</p></main>;
  if (!page) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">{error}</p></main>;

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setPending(true); setError(""); setMessage("");
    try { const updated = await authPatch<SitePageResponse>(`/api/v1/pages/${slug}`, { title, body }); setPage(updated); setMessage("Saved."); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to save this page."); }
    finally { setPending(false); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
    <header><h1 className="font-heading text-3xl font-bold">/{page.slug}</h1></header>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
    <form onSubmit={save} className="space-y-4 border bg-card p-5">
      <div><label htmlFor="page-title" className="text-sm font-medium">Title</label><Input id="page-title" required value={title} onChange={event => setTitle(event.target.value)} className="mt-2 h-11" /></div>
      <div><label htmlFor="page-body" className="text-sm font-medium">Body</label><textarea id="page-body" required rows={20} value={body} onChange={event => setBody(event.target.value)} className="mt-2 w-full border bg-background p-3 font-mono text-sm" /></div>
      <Button type="submit" disabled={pending} className="h-11">{pending ? "Saving…" : "Save"}</Button>
    </form>
  </main></WorkspaceShell>;
}
