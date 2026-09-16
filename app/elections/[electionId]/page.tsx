"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Trash2, UserRound } from "lucide-react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import type { ElectionResponse, PositionWithCandidatesResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function ElectionPage() {
  const { electionId } = useParams<{ electionId: string }>();
  const { user, loading, authGet, authPost, authDelete } = useRequireAuth();
  const [election, setElection] = useState<ElectionResponse | null>(null);
  const [positions, setPositions] = useState<PositionWithCandidatesResponse[]>([]);
  const [dataLoading, setDataLoading] = useState(true); const [error, setError] = useState(""); const [reload, setReload] = useState(0);
  const [positionTitle, setPositionTitle] = useState(""); const [positionType, setPositionType] = useState<"STANDARD" | "MOTION">("STANDARD"); const [threshold, setThreshold] = useState("50"); const [pending, setPending] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    void Promise.all([authGet<ElectionResponse>(`/api/v1/elections/${electionId}`), authGet<PositionWithCandidatesResponse[]>(`/api/v1/elections/${electionId}/positions`)]).then(([record, rows]) => { setElection(record); setPositions(rows); setDataLoading(false); }).catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "Unable to load this election."); setDataLoading(false); });
  }, [loading, user, authGet, electionId, reload]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading election…</p></main>;
  if (!election) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">{error || "Election not found."}</p></main>;

  const canManage = user.is_super_admin || user.organizations.some(item => item.id === election.organization_id && ["ORG_ADMIN", "ELECTION_MANAGER"].includes(item.role));
  const canEdit = canManage && election.status === "DRAFT";
  const ready = positions.length > 0 && positions.every(position => position.candidates.length > 0);
  const refresh = () => setReload(value => value + 1);

  const transition = async (action: "close" | "pause" | "resume") => {
    setError(""); let body: unknown;
    if (action !== "close") { const reason = window.prompt(`Reason for ${action === "pause" ? "pausing" : "resuming"} this election (at least 10 characters):`); if (!reason || reason.trim().length < 10) { setError("A reason of at least 10 characters is required."); return; } body = { reason: reason.trim() }; }
    try { setElection(await authPost<ElectionResponse>(`/api/v1/elections/${electionId}/${action}`, body)); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : `Unable to ${action} the election.`); }
  };

  const schedule = async () => {
    setPending(true); setError("");
    try { setElection(await authPost<ElectionResponse>(`/api/v1/elections/${electionId}/schedule`)); }
    catch (reason) {
      if (reason instanceof ApiError && reason.code === "PAYMENT_REQUIRED") {
        try { const payment = await authPost<{ authorization_url: string }>(`/api/v1/elections/${electionId}/payment/initiate`); window.location.href = payment.authorization_url; return; } catch (paymentError) { setError(paymentError instanceof ApiError ? paymentError.message : "Unable to start payment."); }
      } else setError(reason instanceof ApiError ? reason.message : "Unable to schedule the election.");
    } finally { setPending(false); }
  };

  const addPosition = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setPending(true); setError("");
    try { await authPost(`/api/v1/elections/${electionId}/positions`, { title: positionTitle, position_type: positionType, approval_threshold_percent: positionType === "MOTION" ? threshold : null, ...(positionType === "STANDARD" ? { selection_min: 0, selection_max: 1 } : {}) }); setPositionTitle(""); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to add the position."); }
    finally { setPending(false); }
  };

  const removePosition = async (id: string) => { try { await authDelete(`/api/v1/positions/${id}`); refresh(); } catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to remove the position."); } };
  const addCandidate = async (positionId: string, name: string, bio: string) => { await authPost(`/api/v1/positions/${positionId}/candidates`, { name, bio: bio || null }); refresh(); };
  const removeCandidate = async (id: string) => { try { await authDelete(`/api/v1/candidates/${id}`); refresh(); } catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to remove the candidate."); } };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
    <header><Link href={`/organizations/${election.organization_id}`} className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" />Organisation</Link><div className="mt-2 flex flex-wrap items-start justify-between gap-4"><div><h1 className="font-heading text-3xl font-bold">{election.title}</h1><p className="mt-2 text-sm text-muted-foreground">{new Date(election.start_at).toLocaleString()} – {new Date(election.end_at).toLocaleString()}</p></div><span className="border bg-secondary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">{election.status}</span></div>{election.description && <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">{election.description}</p>}</header>
    {error && <p role="alert" className="border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}
    <nav aria-label="Election tools" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><ToolLink href={`/elections/${electionId}/vote`} label="Ballot" /><ToolLink href={`/elections/${electionId}/nominate`} label="Nominate" />{canManage && <ToolLink href={`/elections/${electionId}/voter-roll`} label="Voter roll" />}<ToolLink href={`/elections/${electionId}/results`} label="Results" /></nav>
    {canManage && <section className="border bg-card p-5"><h2 className="font-heading text-xl font-bold">Election controls</h2><div className="mt-4 flex flex-wrap gap-3">{election.status === "DRAFT" && <Button type="button" disabled={!ready || pending} onClick={() => void schedule()}>{pending ? "Scheduling…" : "Schedule election"}</Button>}{election.status === "OPEN" && <><Button type="button" variant="outline" onClick={() => void transition("pause")}>Pause</Button><Button type="button" variant="destructive" onClick={() => void transition("close")}>Close election</Button></>}{election.status === "PAUSED" && <Button type="button" onClick={() => void transition("resume")}>Resume</Button>}</div>{election.status === "DRAFT" && !ready && <p className="mt-3 text-xs text-muted-foreground">Add at least one position and one candidate per position before scheduling.</p>}</section>}
    <section aria-labelledby="positions-heading"><h2 id="positions-heading" className="font-heading text-2xl font-bold">Ballot positions</h2><div className="mt-4 space-y-4">{positions.length === 0 && <div className="border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">No positions configured yet.</div>}{positions.map(position => <article key={position.id} className="border bg-card p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="font-heading text-lg font-semibold">{position.title}</h3><p className="text-xs uppercase tracking-wide text-muted-foreground">{position.position_type.replaceAll("_", " ")}</p></div>{canEdit && <button type="button" aria-label={`Delete ${position.title}`} onClick={() => void removePosition(position.id)} className="grid size-11 cursor-pointer place-items-center text-destructive hover:bg-destructive/10"><Trash2 className="size-4" aria-hidden="true" /></button>}</div><div className="mt-4 grid gap-3 sm:grid-cols-2">{position.candidates.map(candidate => <div key={candidate.id} className="flex items-center justify-between gap-3 border bg-secondary/50 p-3"><span className="flex min-w-0 items-center gap-3"><UserRound className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" /><span className="min-w-0"><strong className="block truncate text-sm">{candidate.name}</strong><span className="block truncate text-xs text-muted-foreground">{candidate.bio || candidate.status}</span></span></span>{canEdit && <button type="button" aria-label={`Remove ${candidate.name}`} onClick={() => void removeCandidate(candidate.id)} className="grid size-11 shrink-0 cursor-pointer place-items-center text-destructive hover:bg-destructive/10"><Trash2 className="size-4" aria-hidden="true" /></button>}</div>)}</div>{canEdit && <CandidateForm positionId={position.id} onAdd={addCandidate} />}</article>)}</div>
      {canEdit && <form onSubmit={addPosition} className="mt-5 grid gap-3 border bg-card p-5 sm:grid-cols-2"><div><label htmlFor="position-title" className="text-sm font-medium">Position or motion title</label><Input id="position-title" required value={positionTitle} onChange={event => setPositionTitle(event.target.value)} className="mt-2 h-11" /></div><div><label htmlFor="position-type" className="text-sm font-medium">Type</label><select id="position-type" value={positionType} onChange={event => setPositionType(event.target.value as "STANDARD" | "MOTION")} className="mt-2 h-11 w-full border bg-background px-3 text-sm"><option value="STANDARD">Candidate position</option><option value="MOTION">Yes/no motion</option></select></div>{positionType === "MOTION" && <div className="sm:col-span-2"><label htmlFor="threshold" className="text-sm font-medium">Approval threshold %</label><Input id="threshold" type="number" min="0" max="100" value={threshold} onChange={event => setThreshold(event.target.value)} className="mt-2 h-11" /></div>}<Button type="submit" disabled={pending} className="h-11 sm:col-span-2">Add position</Button></form>}
    </section>
  </main></WorkspaceShell>;
}

function ToolLink({ href, label }: { href: string; label: string }) { return <Link href={href} className="flex min-h-11 items-center justify-center border bg-card px-4 text-sm font-semibold transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{label}</Link>; }

function CandidateForm({ positionId, onAdd }: { positionId: string; onAdd: (positionId: string, name: string, bio: string) => Promise<void> }) {
  const [name, setName] = useState(""); const [bio, setBio] = useState(""); const [pending, setPending] = useState(false); const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setPending(true); setError(""); try { await onAdd(positionId, name, bio); setName(""); setBio(""); } catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to add candidate."); } finally { setPending(false); } };
  return <form onSubmit={submit} className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2"><Input aria-label="Candidate name" required value={name} onChange={event => setName(event.target.value)} placeholder="Candidate name" className="h-11" /><Input aria-label="Candidate biography" value={bio} onChange={event => setBio(event.target.value)} placeholder="Short biography (optional)" className="h-11" />{error && <p role="alert" className="text-sm text-destructive sm:col-span-2">{error}</p>}<Button type="submit" variant="outline" disabled={pending} className="h-11 sm:col-span-2">{pending ? "Adding…" : "Add candidate"}</Button></form>;
}
