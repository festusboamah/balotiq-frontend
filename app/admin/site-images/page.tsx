"use client";

import { useEffect, useState, type FormEvent } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL, apiGet, ApiError } from "@/lib/api-client";
import type { SiteImageResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

// An admin-uploaded replacement is a backend-served /uploads/... path and
// needs the API's own origin; a seeded default is a path expected to be
// bundled with the frontend build, so it stays relative as-is.
const resolveSiteImageUrl = (url: string) => (url.startsWith("/uploads/") ? `${API_URL}${url}` : url);

export default function AdminSiteImagesPage() {
  const { user, loading, authPost } = useRequireAuth();
  const [images, setImages] = useState<SiteImageResponse[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [altText, setAltText] = useState<Record<string, string>>({});
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user) return;
    // Public endpoint (deliberately -- it's the same data every visitor sees), used here for the admin list too.
    apiGet<SiteImageResponse[]>("/api/v1/public/site-images").then(rows => { setImages(rows); setDataLoading(false); })
      .catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "Unable to load site images."); setDataLoading(false); });
  }, [loading, user, reload]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;
  if (!user.is_super_admin) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">Only a Super Admin can view this page.</p></main>;

  const upload = async (event: FormEvent<HTMLFormElement>, slug: string) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;
    setPending(slug); setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("alt_text", altText[slug] ?? "");
      await authPost(`/api/v1/site-images/${slug}`, body);
      form.reset();
      setReload(value => value + 1);
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to upload this image."); }
    finally { setPending(null); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
    <header><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Platform administration</p><h1 className="mt-1 font-heading text-3xl font-bold">Site images</h1></header>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-2">{images.map(image => <form key={image.slug} onSubmit={event => void upload(event, image.slug)} className="space-y-3 border bg-card p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{image.slug}</p><img src={resolveSiteImageUrl(image.image_url)} alt={image.alt_text} className="h-32 w-full border object-cover" /><Input aria-label="Alt text" value={altText[image.slug] ?? image.alt_text} onChange={event => setAltText(previous => ({ ...previous, [image.slug]: event.target.value }))} className="h-11" placeholder="Alt text" /><input name="file" type="file" accept="image/jpeg,image/png,image/webp" className="w-full text-sm" /><Button type="submit" disabled={pending === image.slug} variant="outline" className="h-11 w-full">{pending === image.slug ? "Uploading…" : "Replace image"}</Button></form>)}</div>
  </main></WorkspaceShell>;
}
