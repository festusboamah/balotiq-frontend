"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { ApiError } from "@/lib/api-client";
import type { SitePageResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function AdminPagesPage() {
  const { user, loading, authGet } = useRequireAuth();
  const [pages, setPages] = useState<SitePageResponse[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading || !user) return;
    authGet<SitePageResponse[]>("/api/v1/pages").then(rows => { setPages(rows); setDataLoading(false); })
      .catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "Unable to load pages."); setDataLoading(false); });
  }, [loading, user, authGet]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;
  if (!user.is_super_admin) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">Only a Super Admin can view this page.</p></main>;

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
    <header><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Platform administration</p><h1 className="mt-1 font-heading text-3xl font-bold">Site content</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Edit the title and body stored for each page. These are served from <code>/api/v1/public/pages/&#123;slug&#125;</code> — this project&apos;s own About/Privacy/Terms/Billing pages aren&apos;t wired to read from here yet.</p></header>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="divide-y border bg-card">{pages.map(page => <Link key={page.slug} href={`/admin/pages/${page.slug}`} className="flex items-center justify-between gap-3 p-4 text-sm transition-colors hover:bg-secondary/60"><span><strong className="block">{page.title}</strong><span className="text-xs text-muted-foreground">/{page.slug} · updated {new Date(page.updated_at).toLocaleDateString()}</span></span></Link>)}</div>
  </main></WorkspaceShell>;
}
