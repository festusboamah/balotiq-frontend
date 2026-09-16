"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import { resolveSiteImageUrl } from "@/lib/site-images";
import type { TicketingEventResponse, TicketingSalesSummaryResponse, TicketingTierResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

const toIso = (value: string) => (value ? new Date(value).toISOString() : null);
const toLocal = (value: string | null) => (value ? value.slice(0, 16) : "");

export default function TicketingEventPage() {
  const { id: eventId } = useParams<{ id: string }>();
  const { user, loading, authGet, authPost, authPatch } = useRequireAuth();
  const [event, setEvent] = useState<TicketingEventResponse | null>(null);
  const [tiers, setTiers] = useState<TicketingTierResponse[]>([]);
  const [sales, setSales] = useState<TicketingSalesSummaryResponse | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [pending, setPending] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [startsAt, setStartsAt] = useState(""); const [endsAt, setEndsAt] = useState(""); const [description, setDescription] = useState("");
  const [tierName, setTierName] = useState(""); const [tierAmount, setTierAmount] = useState(""); const [tierCapacity, setTierCapacity] = useState(""); const [tierDescription, setTierDescription] = useState("");

  useEffect(() => {
    if (loading || !user) return;
    void Promise.all([
      authGet<TicketingEventResponse>(`/api/ticketing/events/${eventId}`),
      authGet<TicketingTierResponse[]>(`/api/ticketing/events/${eventId}/tiers`),
      authGet<TicketingSalesSummaryResponse>(`/api/ticketing/events/${eventId}/sales-summary`),
    ]).then(([record, rows, salesSummary]) => {
      setEvent(record); setTiers(rows); setSales(salesSummary);
      setStartsAt(toLocal(record.event_starts_at)); setEndsAt(toLocal(record.event_ends_at)); setDescription(record.description ?? ""); setDataLoading(false);
    }).catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "Unable to load this event."); setDataLoading(false); });
  }, [eventId, loading, user, authGet, reload]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading event…</p></main>;
  if (!event) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">{error || "Event not found."}</p></main>;

  const canManage = user.is_super_admin || user.organizations.some(item => item.id === event.organization_id && ["ORG_ADMIN", "ELECTION_MANAGER"].includes(item.role));
  const refresh = () => setReload(value => value + 1);

  const saveSchedule = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault(); setPending(true); setError("");
    try { await authPatch(`/api/ticketing/events/${eventId}`, { event_starts_at: toIso(startsAt), event_ends_at: toIso(endsAt), description: description || null }); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to save the schedule."); }
    finally { setPending(false); }
  };

  const addTier = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault(); setPending(true); setError("");
    try { await authPost(`/api/ticketing/events/${eventId}/tiers`, { name: tierName, description: tierDescription || null, amount: tierAmount, capacity: tierCapacity ? Number(tierCapacity) : null }); setTierName(""); setTierAmount(""); setTierCapacity(""); setTierDescription(""); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to add the ticket tier."); }
    finally { setPending(false); }
  };

  const uploadCoverImage = async (file: File) => {
    setUploadingCover(true); setError("");
    try { const body = new FormData(); body.append("file", file); await authPost(`/api/ticketing/events/${eventId}/cover-image`, body); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to upload this cover image."); }
    finally { setUploadingCover(false); }
  };

  const transition = async (target: string) => {
    setPending(true); setError("");
    try { await authPost(`/api/ticketing/events/${eventId}/transitions`, { target_status: target }); refresh(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : `Unable to move this event to ${target}.`); }
    finally { setPending(false); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
    <header><Link href={`/ticketing/organisers/${event.organiser_id}`} className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" />Organiser</Link>{event.cover_image_url && <img src={resolveSiteImageUrl(event.cover_image_url)} alt="" className="mt-3 h-40 w-full rounded object-cover" />}{canManage && <label className="mt-3 inline-block cursor-pointer text-xs font-semibold text-primary hover:underline">{uploadingCover ? "Uploading…" : event.cover_image_url ? "Replace cover image" : "Add cover image"}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={uploadingCover} onChange={fileEvent => { const file = fileEvent.target.files?.[0]; if (file) void uploadCoverImage(file); fileEvent.target.value = ""; }} /></label>}<div className="mt-2 flex flex-wrap items-start justify-between gap-4"><div><h1 className="font-heading text-3xl font-bold">{event.name}</h1><p className="mt-1 text-sm text-muted-foreground">{event.venue ? `${event.venue} · ` : ""}/{event.slug}</p></div><span className="border bg-secondary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">{event.status}</span></div><nav aria-label="Public and staff links" className="mt-3 flex flex-wrap gap-3 text-sm"><Link href={`/ticketing/buy/${event.slug}`} className="text-primary underline-offset-4 hover:underline">Public ticket page →</Link><Link href={`/ticketing/checkin/${event.id}`} className="text-primary underline-offset-4 hover:underline">Check-in scanner →</Link></nav></header>
    {error && <p role="alert" className="border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}

    {canManage && <section className="border bg-card p-5"><h2 className="font-heading text-xl font-bold">Schedule</h2><form onSubmit={saveSchedule} className="mt-4 grid gap-3 sm:grid-cols-2"><div><label htmlFor="starts-at" className="text-sm font-medium">Starts</label><Input id="starts-at" type="datetime-local" value={startsAt} onChange={e => setStartsAt(e.target.value)} className="mt-2 h-11" /></div><div><label htmlFor="ends-at" className="text-sm font-medium">Ends</label><Input id="ends-at" type="datetime-local" value={endsAt} onChange={e => setEndsAt(e.target.value)} className="mt-2 h-11" /></div><div className="sm:col-span-2"><label htmlFor="event-description" className="text-sm font-medium">Description</label><textarea id="event-description" rows={3} value={description} onChange={e => setDescription(e.target.value)} className="mt-2 w-full border bg-background p-3 text-sm" placeholder="Shown on the public ticket page" /></div><Button type="submit" disabled={pending} variant="outline" className="h-11 sm:col-span-2">Save schedule</Button></form></section>}

    {canManage && <section className="border bg-card p-5"><h2 className="font-heading text-xl font-bold">Lifecycle</h2><p className="mt-2 text-sm text-muted-foreground">Publishing needs the organiser&apos;s platform fee rate set, the agreement accepted, and at least one active ticket tier.</p><div className="mt-4 flex flex-wrap gap-3">{event.status === "DRAFT" && <Button type="button" disabled={pending} onClick={() => void transition("PUBLISHED")}>Publish</Button>}{event.status === "PUBLISHED" && <Button type="button" variant="destructive" disabled={pending} onClick={() => void transition("CLOSED")}>Close event</Button>}</div></section>}

    {canManage && sales && <section aria-labelledby="sales-heading"><h2 id="sales-heading" className="font-heading text-2xl font-bold">Sales summary</h2><div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="border bg-card p-4"><span className="text-xs uppercase text-muted-foreground">Gross sales</span><strong className="mt-1 block text-xl">{sales.currency} {sales.gross_sales}</strong></div><div className="border bg-card p-4"><span className="text-xs uppercase text-muted-foreground">Tickets issued</span><strong className="mt-1 block text-xl">{sales.tickets_issued}</strong></div><div className="border bg-card p-4"><span className="text-xs uppercase text-muted-foreground">Checked in</span><strong className="mt-1 block text-xl">{sales.tickets_checked_in}</strong></div></div></section>}

    <section aria-labelledby="tiers-heading"><h2 id="tiers-heading" className="font-heading text-2xl font-bold">Ticket tiers</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{tiers.length === 0 ? <p className="text-sm text-muted-foreground">No ticket tiers yet.</p> : tiers.map(tier => <div key={tier.id} className="border bg-secondary/50 p-4 text-sm"><strong>{tier.name}</strong>{tier.description && <span className="mt-0.5 block text-xs text-muted-foreground">{tier.description}</span>}<span className="block text-xs text-muted-foreground">{tier.currency} {tier.amount}{tier.capacity ? ` · ${tier.capacity} available` : ""} · {tier.status}</span></div>)}</div>{canManage && <form onSubmit={addTier} className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-3"><Input aria-label="Tier name" required value={tierName} onChange={e => setTierName(e.target.value)} placeholder="e.g. Regular" className="h-11" /><Input aria-label="Amount" required type="number" min="0" step="0.01" value={tierAmount} onChange={e => setTierAmount(e.target.value)} placeholder="Amount (GHS)" className="h-11" /><Input aria-label="Capacity" type="number" min="1" value={tierCapacity} onChange={e => setTierCapacity(e.target.value)} placeholder="Capacity (optional)" className="h-11" /><Input aria-label="Tier description" value={tierDescription} onChange={e => setTierDescription(e.target.value)} placeholder="Description (optional)" className="h-11 sm:col-span-3" /><Button type="submit" disabled={pending} variant="outline" className="h-11 sm:col-span-3">Add tier</Button></form>}</section>
  </main></WorkspaceShell>;
}
