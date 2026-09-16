"use client";

import { useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import type { ElectionResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

const toIso = (value: string) => new Date(value).toISOString();

export default function NewElectionPage() {
  const { id: orgId } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading, authPost } = useRequireAuth();
  const [title, setTitle] = useState(""); const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState(""); const [endAt, setEndAt] = useState("");
  const [nominationStart, setNominationStart] = useState(""); const [nominationEnd, setNominationEnd] = useState("");
  const [quorum, setQuorum] = useState(""); const [error, setError] = useState(""); const [pending, setPending] = useState(false);

  if (loading || !user) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;
  const canManage = user.is_super_admin || user.organizations.some(item => item.id === orgId && ["ORG_ADMIN", "ELECTION_MANAGER"].includes(item.role));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setPending(true); setError("");
    try {
      const election = await authPost<ElectionResponse>(`/api/v1/organizations/${orgId}/elections`, { title, description: description || null, voting_mode: "REGISTERED", start_at: toIso(startAt), end_at: toIso(endAt), nominations_open_at: nominationStart ? toIso(nominationStart) : null, nominations_close_at: nominationEnd ? toIso(nominationEnd) : null, quorum_threshold_percent: quorum || null });
      router.push(`/elections/${election.id}`);
    } catch (err) { setError(err instanceof ApiError ? err.message : "Unable to create the election."); }
    finally { setPending(false); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">{!canManage ? <p role="alert" className="border bg-card p-6 text-sm">You do not have permission to create elections for this organisation.</p> : <section className="border bg-card p-6 shadow-sm sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Governance setup</p><h1 className="mt-2 font-heading text-3xl font-bold">New election</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Create the draft first. Positions, candidates and the voter register are configured before scheduling.</p>
    <form onSubmit={submit} className="mt-8 space-y-5"><div><label htmlFor="title" className="text-sm font-medium">Title</label><Input id="title" required value={title} onChange={e => setTitle(e.target.value)} className="mt-2 h-11" /></div><div><label htmlFor="description" className="text-sm font-medium">Description</label><textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-2 w-full border bg-background p-3 text-sm" /></div><div className="grid gap-4 sm:grid-cols-2"><DateField id="start" label="Starts" value={startAt} setValue={setStartAt} required /><DateField id="end" label="Ends" value={endAt} setValue={setEndAt} required /></div><div><label htmlFor="quorum" className="text-sm font-medium">Quorum threshold %</label><Input id="quorum" type="number" min="0" max="100" step="0.01" value={quorum} onChange={e => setQuorum(e.target.value)} className="mt-2 h-11" placeholder="Optional" /></div><fieldset><legend className="text-sm font-medium">Optional nomination window</legend><div className="mt-2 grid gap-4 sm:grid-cols-2"><DateField id="nomination-start" label="Opens" value={nominationStart} setValue={setNominationStart} /><DateField id="nomination-end" label="Closes" value={nominationEnd} setValue={setNominationEnd} /></div></fieldset>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={pending} className="h-11 w-full">{pending ? "Creating…" : "Create election"}</Button></form>
  </section>}</main></WorkspaceShell>;
}

function DateField({ id, label, value, setValue, required = false }: { id: string; label: string; value: string; setValue: (value: string) => void; required?: boolean }) {
  return <div><label htmlFor={id} className="text-sm font-medium">{label}</label><Input id={id} type="datetime-local" required={required} value={value} onChange={event => setValue(event.target.value)} className="mt-2 h-11" /></div>;
}
