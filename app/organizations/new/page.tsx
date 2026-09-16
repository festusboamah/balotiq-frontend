"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import type { OrganizationResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function NewOrganizationPage() {
  const router = useRouter();
  const { user, loading, authPost } = useRequireAuth();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (loading || !user) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setPending(true); setError("");
    try {
      const org = await authPost<OrganizationResponse>("/api/v1/organizations", { name, slug });
      router.push(`/organizations/${org.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to create the organisation.");
    } finally { setPending(false); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
    {!user.is_super_admin ? <div role="alert" className="border bg-card p-6 text-sm">Only a super-admin can create organisations.</div> : <section className="border bg-card p-6 shadow-sm sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Platform setup</p><h1 className="mt-2 font-heading text-3xl font-bold">New organisation</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Create the tenant workspace first. Members and billing can be configured afterwards.</p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <div><label htmlFor="name" className="text-sm font-medium">Official name</label><Input id="name" required value={name} onChange={event => { setName(event.target.value); if (!slugTouched) setSlug(slugify(event.target.value)); }} className="mt-2 h-11" placeholder="Ghana Students Association" /><p className="mt-1 text-xs text-muted-foreground">Use the organisation&apos;s official public name.</p></div>
        <div><label htmlFor="slug" className="text-sm font-medium">Slug</label><Input id="slug" required pattern="[a-z0-9\-]+" value={slug} onChange={event => { setSlugTouched(true); setSlug(event.target.value); }} className="mt-2 h-11" placeholder="ghana-students-association" /><p className="mt-1 text-xs text-muted-foreground">Lowercase letters, numbers and hyphens only.</p></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={pending || !name || !slug} className="h-11 w-full">{pending ? "Creating…" : "Create organisation"}</Button>
      </form>
    </section>}
  </main></WorkspaceShell>;
}
