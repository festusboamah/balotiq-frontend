"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import type {
  EngageCategoryResponse,
  EngageConfigurationVersionResponse,
  EngageContestantResponse,
  EngageEventResponse,
  EngageVotePackageResponse,
} from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

const toIso = (value: string) => (value ? new Date(value).toISOString() : null);
const toLocal = (value: string | null) => (value ? value.slice(0, 16) : "");

// Mirrors engage.service._ALLOWED_TRANSITIONS -- Engage events move through
// a formal release pipeline (config -> UAT -> sign-off -> schedule -> live
// -> reconciliation -> certification -> settlement), not a single DRAFT/LIVE
// toggle, so the UI offers whichever next stage(s) the backend actually allows.
const NEXT_STAGES: Record<string, { target: string; label: string }[]> = {
  DRAFT: [{ target: "CONFIGURATION", label: "Start configuration" }],
  CONFIGURATION: [{ target: "UAT_READY", label: "Mark ready for testing" }],
  UAT_READY: [{ target: "APPROVED", label: "Approve" }, { target: "CONFIGURATION", label: "Send back to configuration" }],
  APPROVED: [{ target: "SCHEDULED", label: "Schedule" }],
  SCHEDULED: [{ target: "LIVE", label: "Go live" }],
  LIVE: [{ target: "PAUSED", label: "Pause" }, { target: "CLOSING_RECONCILIATION", label: "Begin closing reconciliation" }],
  PAUSED: [{ target: "LIVE", label: "Resume" }, { target: "CLOSING_RECONCILIATION", label: "Begin closing reconciliation" }],
  CLOSING_RECONCILIATION: [{ target: "CLOSED", label: "Close event" }],
  CLOSED: [{ target: "CERTIFIED", label: "Certify" }],
  CERTIFIED: [{ target: "SETTLED", label: "Mark settled" }],
};

export default function EngageEventPage() {
  const { id: eventId } = useParams<{ id: string }>();
  const { user, loading, authGet, authPost, authPatch } = useRequireAuth();
  const [event, setEvent] = useState<EngageEventResponse | null>(null);
  const [categories, setCategories] = useState<EngageCategoryResponse[]>([]);
  const [contestants, setContestants] = useState<EngageContestantResponse[]>([]);
  const [packages, setPackages] = useState<EngageVotePackageResponse[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [pending, setPending] = useState(false);

  const [opensAt, setOpensAt] = useState(""); const [closesAt, setClosesAt] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [contestantCategory, setContestantCategory] = useState(""); const [contestantName, setContestantName] = useState(""); const [contestantBio, setContestantBio] = useState("");
  const [packageName, setPackageName] = useState(""); const [packageAmount, setPackageAmount] = useState(""); const [packageVotes, setPackageVotes] = useState("");

  useEffect(() => {
    if (loading || !user) return;
    void Promise.all([
      authGet<EngageEventResponse>(`/api/engage/events/${eventId}`),
      authGet<EngageCategoryResponse[]>(`/api/engage/events/${eventId}/categories`),
      authGet<EngageContestantResponse[]>(`/api/engage/events/${eventId}/contestants`),
      authGet<EngageVotePackageResponse[]>(`/api/engage/events/${eventId}/vote-packages`),
    ]).then(([record, categoryRows, contestantRows, packageRows]) => {
      setEvent(record); setCategories(categoryRows); setContestants(contestantRows); setPackages(packageRows);
      setOpensAt(toLocal(record.opens_at)); setClosesAt(toLocal(record.closes_at)); setDataLoading(false);
    }).catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "Unable to load this event."); setDataLoading(false); });
  }, [eventId, loading, user, authGet, reload]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading event…</p></main>;
  if (!event) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">{error || "Event not found."}</p></main>;

  const canManage = user.is_super_admin || user.organizations.some(item => item.id === event.organization_id && ["ORG_ADMIN", "ELECTION_MANAGER"].includes(item.role));
  const hasConfiguration = event.current_configuration_version_id !== null;
  const refresh = () => setReload(value => value + 1);

  const setUpConfiguration = async () => {
    setPending(true); setError("");
    try {
      const version = await authPost<EngageConfigurationVersionResponse>(`/api/engage/events/${eventId}/configuration-versions`);
      await authPost(`/api/engage/events/${eventId}/configuration-versions/${version.id}/approve`);
      refresh();
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to set up the configuration."); }
    finally { setPending(false); }
  };

  const saveSchedule = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault(); setPending(true); setError("");
    try { await authPatch(`/api/engage/events/${eventId}`, { opens_at: toIso(opensAt), closes_at: toIso(closesAt) }); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to save the schedule."); }
    finally { setPending(false); }
  };

  const addCategory = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault(); setPending(true); setError("");
    try { await authPost(`/api/engage/events/${eventId}/categories`, { name: categoryName }); setCategoryName(""); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to add the category."); }
    finally { setPending(false); }
  };

  const addContestant = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault(); setPending(true); setError("");
    try { await authPost(`/api/engage/events/${eventId}/contestants`, { category_id: contestantCategory, name: contestantName, bio: contestantBio || null }); setContestantName(""); setContestantBio(""); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to add the contestant."); }
    finally { setPending(false); }
  };

  const addPackage = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault(); setPending(true); setError("");
    try { await authPost(`/api/engage/events/${eventId}/vote-packages`, { name: packageName, amount: packageAmount, vote_quantity: Number(packageVotes) }); setPackageName(""); setPackageAmount(""); setPackageVotes(""); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to add the vote package."); }
    finally { setPending(false); }
  };

  const transition = async (target: string) => {
    setError("");
    let reason: string | undefined;
    if (target === "PAUSED" || event.status === "PAUSED") {
      const entered = window.prompt(`Reason for ${target === "PAUSED" ? "pausing" : "resuming"} this event (at least 10 characters):`);
      if (!entered || entered.trim().length < 10) { setError("A reason of at least 10 characters is required."); return; }
      reason = entered.trim();
    }
    setPending(true);
    try { await authPost(`/api/engage/events/${eventId}/transitions`, { target_status: target, reason }); refresh(); }
    catch (reason2) { setError(reason2 instanceof ApiError ? reason2.message : `Unable to move this event to ${target}.`); }
    finally { setPending(false); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
    <header><Link href={`/engage/organisers/${event.organiser_id}`} className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" />Organiser</Link><div className="mt-2 flex flex-wrap items-start justify-between gap-4"><div><h1 className="font-heading text-3xl font-bold">{event.name}</h1><p className="mt-1 text-sm text-muted-foreground">/{event.slug}</p></div><span className="border bg-secondary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">{event.status}</span></div></header>
    {error && <p role="alert" className="border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}

    {canManage && <section className="border bg-card p-5"><h2 className="font-heading text-xl font-bold">Configuration</h2>{hasConfiguration ? <p className="mt-2 text-sm text-muted-foreground">An approved configuration version is active. Categories, contestants and vote packages can be managed below.</p> : <><p className="mt-2 text-sm text-muted-foreground">Categories, contestants and vote packages can only be added once a configuration version is approved.</p><Button type="button" disabled={pending} className="mt-4" onClick={() => void setUpConfiguration()}>Set up configuration</Button></>}</section>}

    {canManage && <section className="border bg-card p-5"><h2 className="font-heading text-xl font-bold">Schedule</h2><form onSubmit={saveSchedule} className="mt-4 grid gap-3 sm:grid-cols-2"><div><label htmlFor="opens-at" className="text-sm font-medium">Opens</label><Input id="opens-at" type="datetime-local" value={opensAt} onChange={e => setOpensAt(e.target.value)} className="mt-2 h-11" /></div><div><label htmlFor="closes-at" className="text-sm font-medium">Closes</label><Input id="closes-at" type="datetime-local" value={closesAt} onChange={e => setClosesAt(e.target.value)} className="mt-2 h-11" /></div><Button type="submit" disabled={pending} variant="outline" className="h-11 sm:col-span-2">Save schedule</Button></form></section>}

    {canManage && <section className="border bg-card p-5"><h2 className="font-heading text-xl font-bold">Lifecycle</h2><p className="mt-2 text-sm text-muted-foreground">This event moves through configuration, testing, approval, scheduling and going live before closing, certification and settlement. Going LIVE additionally needs opens/closes times, the organiser&apos;s platform fee rate, at least one active contestant and one active vote package.</p><div className="mt-4 flex flex-wrap gap-3">{(NEXT_STAGES[event.status] ?? []).map(stage => <Button key={stage.target} type="button" variant={stage.target === "CLOSED" || stage.target === "CLOSING_RECONCILIATION" ? "destructive" : "default"} disabled={pending} onClick={() => void transition(stage.target)}>{stage.label}</Button>)}</div></section>}

    <section aria-labelledby="categories-heading"><h2 id="categories-heading" className="font-heading text-2xl font-bold">Categories</h2><div className="mt-4 space-y-2">{categories.length === 0 ? <p className="text-sm text-muted-foreground">No categories yet.</p> : categories.map(category => <div key={category.id} className="border bg-card p-4 text-sm"><strong>{category.name}</strong><span className="ml-2 text-xs uppercase text-muted-foreground">{category.status}</span></div>)}</div>{canManage && hasConfiguration && <form onSubmit={addCategory} className="mt-4 flex flex-wrap gap-3"><Input aria-label="Category name" required value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="e.g. Best Newcomer" className="h-11 flex-1" /><Button type="submit" disabled={pending} variant="outline" className="h-11">Add category</Button></form>}</section>

    <section aria-labelledby="contestants-heading"><h2 id="contestants-heading" className="font-heading text-2xl font-bold">Contestants</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{contestants.length === 0 ? <p className="text-sm text-muted-foreground">No contestants yet.</p> : contestants.map(contestant => <div key={contestant.id} className="border bg-secondary/50 p-4 text-sm"><strong>{contestant.name}</strong><span className="block text-xs text-muted-foreground">{contestant.public_code} · {contestant.status}</span></div>)}</div>{canManage && hasConfiguration && categories.length > 0 && <form onSubmit={addContestant} className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2"><select aria-label="Category" required value={contestantCategory} onChange={e => setContestantCategory(e.target.value)} className="h-11 border bg-background px-3 text-sm"><option value="">Select a category</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select><Input aria-label="Contestant name" required value={contestantName} onChange={e => setContestantName(e.target.value)} placeholder="Contestant name" className="h-11" /><Input aria-label="Contestant bio" value={contestantBio} onChange={e => setContestantBio(e.target.value)} placeholder="Short bio (optional)" className="h-11 sm:col-span-2" /><Button type="submit" disabled={pending} variant="outline" className="h-11 sm:col-span-2">Add contestant</Button></form>}</section>

    <section aria-labelledby="packages-heading"><h2 id="packages-heading" className="font-heading text-2xl font-bold">Vote packages</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{packages.length === 0 ? <p className="text-sm text-muted-foreground">No vote packages yet.</p> : packages.map(item => <div key={item.id} className="border bg-secondary/50 p-4 text-sm"><strong>{item.name}</strong><span className="block text-xs text-muted-foreground">{item.currency} {item.amount} · {item.vote_quantity} vote(s)</span></div>)}</div>{canManage && hasConfiguration && <form onSubmit={addPackage} className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-3"><Input aria-label="Package name" required value={packageName} onChange={e => setPackageName(e.target.value)} placeholder="Package name" className="h-11" /><Input aria-label="Amount" required type="number" min="0" step="0.01" value={packageAmount} onChange={e => setPackageAmount(e.target.value)} placeholder="Amount (GHS)" className="h-11" /><Input aria-label="Vote quantity" required type="number" min="1" value={packageVotes} onChange={e => setPackageVotes(e.target.value)} placeholder="Votes" className="h-11" /><Button type="submit" disabled={pending} variant="outline" className="h-11 sm:col-span-3">Add package</Button></form>}</section>
  </main></WorkspaceShell>;
}
