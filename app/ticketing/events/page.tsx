"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { apiGet, ApiError } from "@/lib/api-client";
import { resolveSiteImageUrl } from "@/lib/site-images";
import type { TicketingPublicEventListItem } from "@/lib/types";

export default function PublicTicketingEventsPage() {
  const [events, setEvents] = useState<TicketingPublicEventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    apiGet<TicketingPublicEventListItem[]>("/api/public/ticketing/events")
      .then(setEvents)
      .catch((reason: unknown) => setError(reason instanceof ApiError ? reason.message : "Unable to load events."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter(event => `${event.name} ${event.venue ?? ""} ${event.organiser_name}`.toLowerCase().includes(query.trim().toLowerCase()));

  return <main className="min-h-screen w-full">
    <header className="sticky top-0 z-10 bg-foreground px-4 py-6 text-primary-foreground sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">Balotiq Ticketing</p>
        <h1 className="mt-1 font-heading text-2xl font-bold">Events on sale</h1>
        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search events or venues…" aria-label="Search events or venues" className="h-11 w-full rounded-full border-0 bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
      </div>
    </header>

    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : filtered.length === 0 ? <div className="border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">{events.length === 0 ? "No events are on sale right now. Check back soon." : "No events match your search."}</div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(event => <Link key={event.id} href={`/ticketing/buy/${event.slug}`} className="block overflow-hidden border bg-card transition-colors hover:bg-secondary/60">{event.cover_image_url && <img src={resolveSiteImageUrl(event.cover_image_url)} alt="" className="h-52 w-full object-cover" />}<div className="p-4"><strong className="block text-sm">{event.name}</strong>{event.venue && <span className="mt-1 block text-xs text-muted-foreground">{event.venue}</span>}<span className="mt-1 block text-xs text-muted-foreground">{event.organiser_name}</span>{event.event_starts_at && <span className="mt-1 block text-xs text-muted-foreground">{new Date(event.event_starts_at).toLocaleString()}</span>}</div></Link>)}</div>}
    </div>
  </main>;
}
