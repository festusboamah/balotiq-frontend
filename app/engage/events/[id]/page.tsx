"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import { resolveSiteImageUrl } from "@/lib/site-images";
import type {
  EngageCaseNoteResponse,
  EngageCategoryResponse,
  EngageConfigurationVersionResponse,
  EngageContestantResponse,
  EngageEventResponse,
  EngageFinancialSummaryResponse,
  EngageIntegrityCaseResponse,
  EngageNominationResponse,
  EngageSettlementResponse,
  EngageSupportCaseResponse,
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
  const [uploadingPhotoFor, setUploadingPhotoFor] = useState<string | null>(null);

  const [opensAt, setOpensAt] = useState(""); const [closesAt, setClosesAt] = useState("");
  const [nominationsOpenAt, setNominationsOpenAt] = useState(""); const [nominationsCloseAt, setNominationsCloseAt] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [contestantCategory, setContestantCategory] = useState(""); const [contestantName, setContestantName] = useState(""); const [contestantBio, setContestantBio] = useState("");
  const [packageName, setPackageName] = useState(""); const [packageAmount, setPackageAmount] = useState(""); const [packageVotes, setPackageVotes] = useState("");

  const [financials, setFinancials] = useState<EngageFinancialSummaryResponse | null>(null);
  const [nominations, setNominations] = useState<EngageNominationResponse[]>([]);
  const [settlement, setSettlement] = useState<EngageSettlementResponse | null>(null);
  const [integrityCases, setIntegrityCases] = useState<EngageIntegrityCaseResponse[]>([]);
  const [supportCases, setSupportCases] = useState<EngageSupportCaseResponse[]>([]);
  const [caseNotes, setCaseNotes] = useState<Record<string, EngageCaseNoteResponse[]>>({});
  const [openNoteInput, setOpenNoteInput] = useState<Record<string, string>>({});
  const [payoutReference, setPayoutReference] = useState(""); const [settlementNote, setSettlementNote] = useState("");
  const [integritySeverity, setIntegritySeverity] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM");
  const [integrityTrigger, setIntegrityTrigger] = useState(""); const [integritySummary, setIntegritySummary] = useState("");
  const [supportContact, setSupportContact] = useState(""); const [supportCategory, setSupportCategory] = useState<"PAYMENT" | "VOTE" | "REFUND" | "RESULT" | "ACCOUNT" | "OTHER">("PAYMENT");
  const [supportPriority, setSupportPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM"); const [supportSummary, setSupportSummary] = useState("");

  useEffect(() => {
    if (loading || !user) return;
    void Promise.all([
      authGet<EngageEventResponse>(`/api/engage/events/${eventId}`),
      authGet<EngageCategoryResponse[]>(`/api/engage/events/${eventId}/categories`),
      authGet<EngageContestantResponse[]>(`/api/engage/events/${eventId}/contestants`),
      authGet<EngageVotePackageResponse[]>(`/api/engage/events/${eventId}/vote-packages`),
      authGet<EngageFinancialSummaryResponse>(`/api/engage/events/${eventId}/financial-summary`),
      authGet<EngageNominationResponse[]>(`/api/engage/events/${eventId}/nominations?status=PENDING`),
    ]).then(([record, categoryRows, contestantRows, packageRows, financialSummary, nominationRows]) => {
      setEvent(record); setCategories(categoryRows); setContestants(contestantRows); setPackages(packageRows); setFinancials(financialSummary); setNominations(nominationRows);
      setOpensAt(toLocal(record.opens_at)); setClosesAt(toLocal(record.closes_at));
      setNominationsOpenAt(toLocal(record.nominations_open_at)); setNominationsCloseAt(toLocal(record.nominations_close_at)); setDataLoading(false);
    }).catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "Unable to load this event."); setDataLoading(false); });
  }, [eventId, loading, user, authGet, reload]);

  useEffect(() => {
    if (loading || !user || !user.is_super_admin) return;
    authGet<EngageSettlementResponse>(`/api/engage/events/${eventId}/settlement`).then(setSettlement).catch(() => setSettlement(null));
    void Promise.all([
      authGet<EngageIntegrityCaseResponse[]>(`/api/engage/events/${eventId}/integrity-cases`),
      authGet<EngageSupportCaseResponse[]>(`/api/engage/events/${eventId}/support-cases`),
    ]).then(([integrityRows, supportRows]) => { setIntegrityCases(integrityRows); setSupportCases(supportRows); }).catch(() => {});
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
    try { await authPatch(`/api/engage/events/${eventId}`, { opens_at: toIso(opensAt), closes_at: toIso(closesAt), nominations_open_at: toIso(nominationsOpenAt), nominations_close_at: toIso(nominationsCloseAt) }); refresh(); }
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

  const setContestantStatus = async (contestantId: string, action: "disqualify" | "suspend" | "withdraw" | "reinstate") => {
    const reason = window.prompt(`Reason for this action (at least 10 characters):`);
    if (!reason || reason.trim().length < 10) return;
    try { await authPost(`/api/engage/contestants/${contestantId}/${action}`, { reason: reason.trim() }); refresh(); }
    catch (reason2) { setError(reason2 instanceof ApiError ? reason2.message : "Unable to update this contestant."); }
  };

  const uploadContestantPhoto = async (contestantId: string, file: File) => {
    setUploadingPhotoFor(contestantId); setError("");
    try { const body = new FormData(); body.append("file", file); await authPost(`/api/engage/contestants/${contestantId}/photo`, body); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to upload this photo."); }
    finally { setUploadingPhotoFor(null); }
  };

  const addPackage = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault(); setPending(true); setError("");
    try { await authPost(`/api/engage/events/${eventId}/vote-packages`, { name: packageName, amount: packageAmount, vote_quantity: Number(packageVotes) }); setPackageName(""); setPackageAmount(""); setPackageVotes(""); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to add the vote package."); }
    finally { setPending(false); }
  };

  const approveNomination = async (id: string) => {
    setError("");
    try { await authPost(`/api/engage/nominations/${id}/approve`); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to approve this nomination."); }
  };

  const rejectNomination = async (id: string) => {
    const reason = window.prompt("Reason for rejecting this nomination (at least 10 characters):");
    if (!reason || reason.trim().length < 10) return;
    try { await authPost(`/api/engage/nominations/${id}/reject`, { reason: reason.trim() }); refresh(); }
    catch (reason2) { setError(reason2 instanceof ApiError ? reason2.message : "Unable to reject this nomination."); }
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

  const calculateSettlement = async () => {
    setPending(true); setError("");
    try { setSettlement(await authPost<EngageSettlementResponse>(`/api/engage/events/${eventId}/settlement/calculate`)); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to calculate settlement."); }
    finally { setPending(false); }
  };

  const approveSettlement = async () => {
    if (settlementNote.trim().length < 10) { setError("A settlement note of at least 10 characters is required to approve."); return; }
    setPending(true); setError("");
    try { setSettlement(await authPost<EngageSettlementResponse>(`/api/engage/events/${eventId}/settlement/approve`, { note: settlementNote.trim() })); setSettlementNote(""); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to approve settlement."); }
    finally { setPending(false); }
  };

  const markSettlementPaid = async () => {
    if (!payoutReference.trim() || settlementNote.trim().length < 10) { setError("A payout reference and a note of at least 10 characters are required."); return; }
    setPending(true); setError("");
    try { setSettlement(await authPost<EngageSettlementResponse>(`/api/engage/events/${eventId}/settlement/mark-paid`, { payout_reference: payoutReference.trim(), note: settlementNote.trim() })); setPayoutReference(""); setSettlementNote(""); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to mark settlement paid."); }
    finally { setPending(false); }
  };

  const openIntegrityCase = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault(); setPending(true); setError("");
    try { await authPost(`/api/engage/events/${eventId}/integrity-cases`, { severity: integritySeverity, trigger: integrityTrigger, summary: integritySummary }); setIntegrityTrigger(""); setIntegritySummary(""); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to open this case."); }
    finally { setPending(false); }
  };

  const closeIntegrityCase = async (caseId: string) => {
    const outcome = window.prompt("Outcome — one of CONFIRMED_ABUSE, INCONCLUSIVE, LEGITIMATE, DEFECT, OTHER:");
    if (!outcome) return;
    try { await authPost(`/api/engage/integrity-cases/${caseId}/close`, { outcome: outcome.toUpperCase() }); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to close this case."); }
  };

  const openSupportCase = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault(); setPending(true); setError("");
    try { await authPost(`/api/engage/events/${eventId}/support-cases`, { requester_contact: supportContact, requester_type: "VOTER", category: supportCategory, priority: supportPriority, summary: supportSummary }); setSupportContact(""); setSupportSummary(""); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to open this case."); }
    finally { setPending(false); }
  };

  const resolveSupportCase = async (caseId: string) => {
    const note = window.prompt("Resolution note (at least 10 characters):");
    if (!note || note.trim().length < 10) return;
    try { await authPost(`/api/engage/support-cases/${caseId}/resolve`, { resolution_note: note.trim() }); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to resolve this case."); }
  };

  const toggleNotes = async (kind: "integrity-cases" | "support-cases", caseId: string) => {
    if (caseNotes[caseId]) { setCaseNotes(previous => { const next = { ...previous }; delete next[caseId]; return next; }); return; }
    try { setCaseNotes(previous => ({ ...previous, [caseId]: [] })); const notes = await authGet<EngageCaseNoteResponse[]>(`/api/engage/${kind}/${caseId}/notes`); setCaseNotes(previous => ({ ...previous, [caseId]: notes })); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to load notes."); }
  };

  const addNote = async (kind: "integrity-cases" | "support-cases", caseId: string) => {
    const note = openNoteInput[caseId];
    if (!note || !note.trim()) return;
    try { await authPost(`/api/engage/${kind}/${caseId}/notes`, { note: note.trim() }); setOpenNoteInput(previous => ({ ...previous, [caseId]: "" })); const notes = await authGet<EngageCaseNoteResponse[]>(`/api/engage/${kind}/${caseId}/notes`); setCaseNotes(previous => ({ ...previous, [caseId]: notes })); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to add note."); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
    <header><div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="font-heading text-3xl font-bold">{event.name}</h1><p className="mt-1 text-sm text-muted-foreground">/{event.slug}</p></div><span className="border bg-secondary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">{event.status}</span></div><nav aria-label="Public links" className="mt-3 flex flex-wrap gap-3 text-sm"><Link href={`/engage/vote/${event.slug}`} className="text-primary underline-offset-4 hover:underline">Public voting page →</Link>{event.nominations_open_at && <Link href={`/engage/nominate/${event.slug}`} className="text-primary underline-offset-4 hover:underline">Public nomination page →</Link>}</nav></header>
    {error && <p role="alert" className="border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}

    {canManage && <section className="border bg-card p-5"><h2 className="font-heading text-xl font-bold">Configuration</h2>{hasConfiguration ? <p className="mt-2 text-sm text-muted-foreground">An approved configuration version is active. Categories, contestants and vote packages can be managed below.</p> : <><p className="mt-2 text-sm text-muted-foreground">Categories, contestants and vote packages can only be added once a configuration version is approved.</p><Button type="button" disabled={pending} className="mt-4" onClick={() => void setUpConfiguration()}>Set up configuration</Button></>}</section>}

    {canManage && <section className="border bg-card p-5"><h2 className="font-heading text-xl font-bold">Schedule</h2><form onSubmit={saveSchedule} className="mt-4 grid gap-3 sm:grid-cols-2"><div><label htmlFor="opens-at" className="text-sm font-medium">Opens</label><Input id="opens-at" type="datetime-local" value={opensAt} onChange={e => setOpensAt(e.target.value)} className="mt-2 h-11" /></div><div><label htmlFor="closes-at" className="text-sm font-medium">Closes</label><Input id="closes-at" type="datetime-local" value={closesAt} onChange={e => setClosesAt(e.target.value)} className="mt-2 h-11" /></div><div><label htmlFor="nominations-open-at" className="text-sm font-medium">Nominations open</label><Input id="nominations-open-at" type="datetime-local" value={nominationsOpenAt} onChange={e => setNominationsOpenAt(e.target.value)} className="mt-2 h-11" /></div><div><label htmlFor="nominations-close-at" className="text-sm font-medium">Nominations close</label><Input id="nominations-close-at" type="datetime-local" value={nominationsCloseAt} onChange={e => setNominationsCloseAt(e.target.value)} className="mt-2 h-11" /></div><p className="text-xs text-muted-foreground sm:col-span-2">Leave both nomination fields blank to keep public nominations closed.</p><Button type="submit" disabled={pending} variant="outline" className="h-11 sm:col-span-2">Save schedule</Button></form></section>}

    {canManage && <section className="border bg-card p-5"><h2 className="font-heading text-xl font-bold">Lifecycle</h2><p className="mt-2 text-sm text-muted-foreground">This event moves through configuration, testing, approval, scheduling and going live before closing, certification and settlement. Going LIVE additionally needs opens/closes times, the organiser&apos;s platform fee rate, at least one active contestant and one active vote package.</p><div className="mt-4 flex flex-wrap gap-3">{(NEXT_STAGES[event.status] ?? []).map(stage => <Button key={stage.target} type="button" variant={stage.target === "CLOSED" || stage.target === "CLOSING_RECONCILIATION" ? "destructive" : "default"} disabled={pending} onClick={() => void transition(stage.target)}>{stage.label}</Button>)}</div></section>}

    <section aria-labelledby="categories-heading"><h2 id="categories-heading" className="font-heading text-2xl font-bold">Categories</h2><div className="mt-4 space-y-2">{categories.length === 0 ? <p className="text-sm text-muted-foreground">No categories yet.</p> : categories.map(category => <div key={category.id} className="border bg-card p-4 text-sm"><strong>{category.name}</strong><span className="ml-2 text-xs uppercase text-muted-foreground">{category.status}</span></div>)}</div>{canManage && hasConfiguration && <form onSubmit={addCategory} className="mt-4 flex flex-wrap gap-3"><Input aria-label="Category name" required value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="e.g. Best Newcomer" className="h-11 flex-1" /><Button type="submit" disabled={pending} variant="outline" className="h-11">Add category</Button></form>}</section>

    {canManage && nominations.length > 0 && <section aria-labelledby="nominations-heading"><h2 id="nominations-heading" className="font-heading text-2xl font-bold">Pending nominations</h2><div className="mt-4 space-y-3">{nominations.map(nomination => <div key={nomination.id} className="flex flex-wrap items-start justify-between gap-3 border bg-card p-4 text-sm"><div><strong>{nomination.nominee_name}</strong>{nomination.nominee_reason && <p className="mt-1 text-xs text-muted-foreground">{nomination.nominee_reason}</p>}<p className="mt-1 text-xs text-muted-foreground">Submitted by {nomination.submitter_name} ({nomination.submitter_email})</p></div><div className="flex shrink-0 gap-2"><Button type="button" size="sm" onClick={() => void approveNomination(nomination.id)}>Approve</Button><Button type="button" size="sm" variant="destructive" onClick={() => void rejectNomination(nomination.id)}>Reject</Button></div></div>)}</div></section>}

    <section aria-labelledby="contestants-heading"><h2 id="contestants-heading" className="font-heading text-2xl font-bold">Contestants</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{contestants.length === 0 ? <p className="text-sm text-muted-foreground">No contestants yet.</p> : contestants.map(contestant => <div key={contestant.id} className="flex gap-3 border bg-secondary/50 p-4 text-sm">{contestant.photo_url ? <img src={resolveSiteImageUrl(contestant.photo_url)} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" /> : <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-muted text-xs text-muted-foreground">No photo</div>}<div className="min-w-0 flex-1"><strong>{contestant.name}</strong><span className="block text-xs text-muted-foreground">{contestant.public_code} · {contestant.status}</span>{canManage && <div className="mt-2 flex flex-wrap items-center gap-2"><label className="cursor-pointer text-xs font-semibold text-primary hover:underline">{uploadingPhotoFor === contestant.id ? "Uploading…" : contestant.photo_url ? "Replace photo" : "Add photo"}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={uploadingPhotoFor === contestant.id} onChange={event => { const file = event.target.files?.[0]; if (file) void uploadContestantPhoto(contestant.id, file); event.target.value = ""; }} /></label>{contestant.status === "ACTIVE" && <><button type="button" onClick={() => void setContestantStatus(contestant.id, "suspend")} className="cursor-pointer text-xs font-semibold text-amber-600 hover:underline">Suspend</button><button type="button" onClick={() => void setContestantStatus(contestant.id, "disqualify")} className="cursor-pointer text-xs font-semibold text-destructive hover:underline">Disqualify</button><button type="button" onClick={() => void setContestantStatus(contestant.id, "withdraw")} className="cursor-pointer text-xs font-semibold text-muted-foreground hover:underline">Withdraw</button></>}{contestant.status === "SUSPENDED" && <button type="button" onClick={() => void setContestantStatus(contestant.id, "reinstate")} className="cursor-pointer text-xs font-semibold text-primary hover:underline">Reinstate</button>}</div>}</div></div>)}</div>{canManage && hasConfiguration && categories.length > 0 && <form onSubmit={addContestant} className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2"><select aria-label="Category" required value={contestantCategory} onChange={e => setContestantCategory(e.target.value)} className="h-11 border bg-background px-3 text-sm"><option value="">Select a category</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select><Input aria-label="Contestant name" required value={contestantName} onChange={e => setContestantName(e.target.value)} placeholder="Contestant name" className="h-11" /><Input aria-label="Contestant bio" value={contestantBio} onChange={e => setContestantBio(e.target.value)} placeholder="Short bio (optional)" className="h-11 sm:col-span-2" /><Button type="submit" disabled={pending} variant="outline" className="h-11 sm:col-span-2">Add contestant</Button></form>}</section>

    <section aria-labelledby="packages-heading"><h2 id="packages-heading" className="font-heading text-2xl font-bold">Vote packages</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{packages.length === 0 ? <p className="text-sm text-muted-foreground">No vote packages yet.</p> : packages.map(item => <div key={item.id} className="border bg-secondary/50 p-4 text-sm"><strong>{item.name}</strong><span className="block text-xs text-muted-foreground">{item.currency} {item.amount} · {item.vote_quantity} vote(s)</span></div>)}</div>{canManage && hasConfiguration && <form onSubmit={addPackage} className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-3"><Input aria-label="Package name" required value={packageName} onChange={e => setPackageName(e.target.value)} placeholder="Package name" className="h-11" /><Input aria-label="Amount" required type="number" min="0" step="0.01" value={packageAmount} onChange={e => setPackageAmount(e.target.value)} placeholder="Amount (GHS)" className="h-11" /><Input aria-label="Vote quantity" required type="number" min="1" value={packageVotes} onChange={e => setPackageVotes(e.target.value)} placeholder="Votes" className="h-11" /><Button type="submit" disabled={pending} variant="outline" className="h-11 sm:col-span-3">Add package</Button></form>}</section>

    {canManage && financials && <section aria-labelledby="financials-heading"><h2 id="financials-heading" className="font-heading text-2xl font-bold">Financial summary</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="border bg-card p-4"><span className="text-xs uppercase text-muted-foreground">Gross verified</span><strong className="mt-1 block text-xl">GHS {financials.gross_verified_value}</strong></div><div className="border bg-card p-4"><span className="text-xs uppercase text-muted-foreground">Refunded (excluded)</span><strong className="mt-1 block text-xl">GHS {financials.excluded_refunded_amount}</strong></div><div className="border bg-card p-4"><span className="text-xs uppercase text-muted-foreground">Balotiq fee</span><strong className="mt-1 block text-xl">{financials.balotiq_fee ? `GHS ${financials.balotiq_fee}` : "—"}</strong></div><div className="border bg-card p-4"><span className="text-xs uppercase text-muted-foreground">Organiser net</span><strong className="mt-1 block text-xl">{financials.organiser_net ? `GHS ${financials.organiser_net}` : "—"}</strong></div></div><p className="mt-2 text-xs text-muted-foreground">Settlement status: {financials.settlement_status}</p></section>}

    {user.is_super_admin && ["CLOSED", "CERTIFIED", "SETTLED"].includes(event.status) && <section aria-labelledby="settlement-heading" className="border bg-card p-5"><h2 id="settlement-heading" className="font-heading text-xl font-bold">Settlement</h2>
      {!settlement ? <Button type="button" disabled={pending} className="mt-4" onClick={() => void calculateSettlement()}>Calculate settlement</Button> : <div className="mt-4 space-y-4">
        <p className="text-sm">Status: <strong>{settlement.status}</strong> · Balotiq fee GHS {settlement.balotiq_fee} · Organiser net GHS {settlement.organiser_net}</p>
        {settlement.status === "DRAFT" && <div className="space-y-3"><p className="text-xs text-muted-foreground">The admin who calculated this settlement cannot also approve it — a different Super Admin must approve.</p><div><label htmlFor="settlement-note" className="text-sm font-medium">Approval note</label><Input id="settlement-note" value={settlementNote} onChange={event => setSettlementNote(event.target.value)} className="mt-2 h-11" placeholder="Minimum 10 characters" /></div><Button type="button" disabled={pending} onClick={() => void approveSettlement()}>Approve settlement</Button></div>}
        {settlement.status === "APPROVED" && <div className="space-y-3"><div><label htmlFor="payout-ref" className="text-sm font-medium">Payout reference</label><Input id="payout-ref" value={payoutReference} onChange={event => setPayoutReference(event.target.value)} className="mt-2 h-11" /></div><div><label htmlFor="payout-note" className="text-sm font-medium">Note</label><Input id="payout-note" value={settlementNote} onChange={event => setSettlementNote(event.target.value)} className="mt-2 h-11" placeholder="Minimum 10 characters" /></div><Button type="button" disabled={pending} onClick={() => void markSettlementPaid()}>Mark paid</Button></div>}
      </div>}
    </section>}

    {user.is_super_admin && <section aria-labelledby="integrity-heading"><h2 id="integrity-heading" className="font-heading text-2xl font-bold">Integrity cases</h2><div className="mt-4 space-y-3">{integrityCases.length === 0 ? <p className="text-sm text-muted-foreground">No integrity cases.</p> : integrityCases.map(item => <div key={item.id} className="border bg-card p-4 text-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><strong>{item.trigger}</strong><span className="ml-2 text-xs uppercase text-muted-foreground">{item.severity} · {item.status}</span><p className="mt-1 text-xs text-muted-foreground">{item.summary}</p>{item.outcome && <p className="mt-1 text-xs text-muted-foreground">Outcome: {item.outcome}</p>}</div>{item.status !== "CLOSED" && <button type="button" onClick={() => void closeIntegrityCase(item.id)} className="min-h-11 shrink-0 cursor-pointer px-2 text-xs font-semibold text-destructive hover:underline">Close</button>}</div>
      <button type="button" onClick={() => void toggleNotes("integrity-cases", item.id)} className="mt-2 cursor-pointer text-xs text-primary underline-offset-4 hover:underline">{caseNotes[item.id] ? "Hide notes" : "View notes"}</button>
      {caseNotes[item.id] && <div className="mt-2 space-y-2 border-t pt-2">{caseNotes[item.id].map(note => <p key={note.id} className="text-xs text-muted-foreground">{note.note}</p>)}<div className="flex gap-2"><Input aria-label="Add note" value={openNoteInput[item.id] ?? ""} onChange={event => setOpenNoteInput(previous => ({ ...previous, [item.id]: event.target.value }))} className="h-9 flex-1 text-xs" /><Button type="button" size="sm" variant="outline" onClick={() => void addNote("integrity-cases", item.id)}>Add</Button></div></div>}
    </div>)}</div>
      <form onSubmit={openIntegrityCase} className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2"><select aria-label="Severity" value={integritySeverity} onChange={e => setIntegritySeverity(e.target.value as typeof integritySeverity)} className="h-11 border bg-background px-3 text-sm"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select><Input aria-label="Trigger" required value={integrityTrigger} onChange={e => setIntegrityTrigger(e.target.value)} placeholder="Trigger" className="h-11" /><Input aria-label="Integrity case summary" required minLength={10} value={integritySummary} onChange={e => setIntegritySummary(e.target.value)} placeholder="Summary (minimum 10 characters)" className="h-11 sm:col-span-2" /><Button type="submit" disabled={pending} variant="outline" className="h-11 sm:col-span-2">Open integrity case</Button></form>
    </section>}

    {user.is_super_admin && <section aria-labelledby="support-heading"><h2 id="support-heading" className="font-heading text-2xl font-bold">Support cases</h2><div className="mt-4 space-y-3">{supportCases.length === 0 ? <p className="text-sm text-muted-foreground">No support cases.</p> : supportCases.map(item => <div key={item.id} className="border bg-card p-4 text-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><strong>{item.category}</strong><span className="ml-2 text-xs uppercase text-muted-foreground">{item.priority} · {item.status}</span><p className="mt-1 text-xs text-muted-foreground">{item.summary}</p><p className="mt-1 text-xs text-muted-foreground">{item.requester_contact}</p></div>{item.status !== "RESOLVED" && <button type="button" onClick={() => void resolveSupportCase(item.id)} className="min-h-11 shrink-0 cursor-pointer px-2 text-xs font-semibold text-primary hover:underline">Resolve</button>}</div>
      <button type="button" onClick={() => void toggleNotes("support-cases", item.id)} className="mt-2 cursor-pointer text-xs text-primary underline-offset-4 hover:underline">{caseNotes[item.id] ? "Hide notes" : "View notes"}</button>
      {caseNotes[item.id] && <div className="mt-2 space-y-2 border-t pt-2">{caseNotes[item.id].map(note => <p key={note.id} className="text-xs text-muted-foreground">{note.note}</p>)}<div className="flex gap-2"><Input aria-label="Add note" value={openNoteInput[item.id] ?? ""} onChange={event => setOpenNoteInput(previous => ({ ...previous, [item.id]: event.target.value }))} className="h-9 flex-1 text-xs" /><Button type="button" size="sm" variant="outline" onClick={() => void addNote("support-cases", item.id)}>Add</Button></div></div>}
    </div>)}</div>
      <form onSubmit={openSupportCase} className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2"><Input aria-label="Requester contact" required value={supportContact} onChange={e => setSupportContact(e.target.value)} placeholder="Requester email or phone" className="h-11" /><select aria-label="Support case category" value={supportCategory} onChange={e => setSupportCategory(e.target.value as typeof supportCategory)} className="h-11 border bg-background px-3 text-sm"><option value="PAYMENT">Payment</option><option value="VOTE">Vote</option><option value="REFUND">Refund</option><option value="RESULT">Result</option><option value="ACCOUNT">Account</option><option value="OTHER">Other</option></select><select aria-label="Priority" value={supportPriority} onChange={e => setSupportPriority(e.target.value as typeof supportPriority)} className="h-11 border bg-background px-3 text-sm"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option></select><Input aria-label="Support case summary" required minLength={10} value={supportSummary} onChange={e => setSupportSummary(e.target.value)} placeholder="Summary (minimum 10 characters)" className="h-11" /><Button type="submit" disabled={pending} variant="outline" className="h-11 sm:col-span-2">Open support case</Button></form>
    </section>}
  </main></WorkspaceShell>;
}
