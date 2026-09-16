"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Ticket } from "lucide-react";
import { WorkspaceCard, WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import type { TicketingEventResponse, TicketingOrganiserResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function TicketingOrganiserPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading, authGet, authPost, authPatch } = useRequireAuth();
  const [organiser, setOrganiser] = useState<TicketingOrganiserResponse | null>(null);
  const [events, setEvents] = useState<TicketingEventResponse[]>([]);
  const [pageError, setPageError] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [feeRate, setFeeRate] = useState("");
  const [pending, setPending] = useState(false);

  const canManage = Boolean(user?.is_super_admin || user?.organizations.some(item => item.id === organiser?.organization_id && item.role === "ORG_ADMIN"));

  useEffect(() => {
    if (loading || !user) return;
    void Promise.all([
      authGet<TicketingOrganiserResponse>(`/api/ticketing/organisers/${id}`),
      authGet<TicketingEventResponse[]>(`/api/ticketing/organisers/${id}/events`),
    ]).then(([record, rows]) => {
      setOrganiser(record); setEvents(rows); setFeeRate(record.platform_fee_rate ?? ""); setDataLoading(false);
    }).catch((error: unknown) => {
      setPageError(error instanceof ApiError ? error.message : "Unable to load this organiser."); setDataLoading(false);
    });
  }, [id, loading, user, authGet, reload]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading organiser…</p></main>;
  if (!organiser) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">{pageError || "Organiser not found."}</p></main>;

  const acceptAgreement = async () => {
    setPending(true); setPageError("");
    try { await authPost(`/api/ticketing/organisers/${id}/accept-agreement`, { accepted: true }); setReload(value => value + 1); }
    catch (error) { setPageError(error instanceof ApiError ? error.message : "Unable to accept the agreement."); }
    finally { setPending(false); }
  };

  const saveFeeRate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setPending(true); setPageError("");
    try { await authPatch(`/api/ticketing/organisers/${id}`, { platform_fee_rate: feeRate || null }); setReload(value => value + 1); }
    catch (error) { setPageError(error instanceof ApiError ? error.message : "Unable to save the platform fee rate."); }
    finally { setPending(false); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
    <header><Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" />Dashboard</Link><div className="mt-2 flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Ticketing organiser</p><h1 className="mt-1 font-heading text-3xl font-bold">{organiser.display_name}</h1></div><span className="border bg-secondary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">{organiser.status}</span></div></header>
    {pageError && <p role="alert" className="text-sm text-destructive">{pageError}</p>}

    {canManage && !organiser.agreement_accepted_at && <section className="border bg-card p-5"><h2 className="font-heading text-xl font-bold">Organiser agreement</h2><p className="mt-2 text-sm text-muted-foreground">The Ticketing organiser agreement must be accepted before this organiser can publish an event.</p><Button type="button" disabled={pending} className="mt-4" onClick={() => void acceptAgreement()}>Accept agreement</Button></section>}

    {user.is_super_admin && <section className="border bg-card p-5"><h2 className="font-heading text-xl font-bold">Platform fee</h2><form onSubmit={saveFeeRate} className="mt-4 flex flex-wrap items-end gap-3"><div><label htmlFor="fee-rate" className="text-sm font-medium">Fee rate (0–1)</label><Input id="fee-rate" type="number" min="0" max="1" step="0.01" value={feeRate} onChange={event => setFeeRate(event.target.value)} className="mt-2 h-11 w-40" /></div><Button type="submit" disabled={pending} variant="outline" className="h-11">Save</Button></form></section>}

    <section aria-labelledby="events-heading"><div className="mb-4 flex flex-wrap items-center justify-between gap-4"><div><h2 id="events-heading" className="font-heading text-2xl font-bold">Events</h2><span className="text-sm text-muted-foreground">{events.length} total</span></div>{canManage && <Button render={<Link href={`/ticketing/organisers/${id}/events/new`} />} nativeButton={false}>New event</Button>}</div>{events.length === 0 ? <div className="border border-dashed bg-card p-8 text-center"><Ticket className="mx-auto size-6 text-muted-foreground" aria-hidden="true" /><p className="mt-3 text-sm font-semibold">No events yet</p></div> : <div className="grid gap-3 sm:grid-cols-2">{events.map(item => <WorkspaceCard key={item.id} icon={Ticket} href={`/ticketing/events/${item.id}`} title={item.name} detail={item.venue ?? `/${item.slug}`} badge={item.status} />)}</div>}</section>
  </main></WorkspaceShell>;
}
