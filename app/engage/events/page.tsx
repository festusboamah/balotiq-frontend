"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet, ApiError } from "@/lib/api-client";
import { resolveSiteImageUrl } from "@/lib/site-images";
import type { EngagePublicEventListItem } from "@/lib/types";

export default function PublicEngageEventsPage() {
  const [events, setEvents] = useState<EngagePublicEventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<EngagePublicEventListItem[]>("/api/public/engage/events")
      .then(setEvents)
      .catch((reason: unknown) => setError(reason instanceof ApiError ? reason.message : "Unable to load events."))
      .finally(() => setLoading(false));
  }, []);

  return <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 sm:px-6">
    <header><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Balotiq Engage</p><h1 className="mt-2 font-heading text-3xl font-bold">Public events open for voting</h1></header>
    {error && <p role="alert" className="mt-6 text-sm text-destructive">{error}</p>}
    {loading ? <p className="mt-6 text-sm text-muted-foreground">Loading…</p> : events.length === 0 ? <div className="mt-8 border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">No events are open for voting right now. Check back soon.</div> : <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{events.map(event => <Link key={event.id} href={`/engage/vote/${event.slug}`} className="block overflow-hidden border bg-card transition-colors hover:bg-secondary/60">{event.cover_image_url && <img src={resolveSiteImageUrl(event.cover_image_url)} alt="" className="h-52 w-full object-cover" />}<div className="p-4"><strong className="block text-sm">{event.name}</strong><span className="mt-1 block text-xs text-muted-foreground">{event.organiser_name}</span>{event.closes_at && <span className="mt-1 block text-xs text-muted-foreground">Closes {new Date(event.closes_at).toLocaleString()}</span>}</div></Link>)}</div>}
  </main>;
}
