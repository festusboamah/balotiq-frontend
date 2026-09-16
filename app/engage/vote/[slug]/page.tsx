"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGet, apiPost, ApiError } from "@/lib/api-client";
import type {
  EngagePublicCategoryResponse,
  EngagePublicContestantResponse,
  EngagePublicEventResponse,
  EngagePublicVotePackageResponse,
  EngageVoteIntentResponse,
} from "@/lib/types";

export default function PublicEngageVotePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<EngagePublicEventResponse | null>(null);
  const [categories, setCategories] = useState<EngagePublicCategoryResponse[]>([]);
  const [contestants, setContestants] = useState<EngagePublicContestantResponse[]>([]);
  const [packages, setPackages] = useState<EngagePublicVotePackageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<EngagePublicContestantResponse | null>(null);
  const [packageId, setPackageId] = useState("");
  const [amount, setAmount] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void Promise.all([
      apiGet<EngagePublicEventResponse>(`/api/public/engage/events/${slug}`),
      apiGet<EngagePublicCategoryResponse[]>(`/api/public/engage/events/${slug}/categories`),
      apiGet<EngagePublicContestantResponse[]>(`/api/public/engage/events/${slug}/contestants`),
    ]).then(async ([eventRecord, categoryRows, contestantRows]) => {
      setEvent(eventRecord); setCategories(categoryRows); setContestants(contestantRows);
      if (eventRecord.open_vote_rate === null) setPackages(await apiGet<EngagePublicVotePackageResponse[]>(`/api/public/engage/events/${slug}/vote-packages`));
      setLoading(false);
    }).catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "This event isn't available."); setLoading(false); });
  }, [slug]);

  if (loading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading event…</p></main>;
  if (!event) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">{error || "Event not found."}</p></main>;

  const free = event.open_vote_rate === "0";
  const openAmount = event.open_vote_rate !== null && event.open_vote_rate !== "0";

  const submitVote = async () => {
    if (!selected) return;
    setPending(true); setError("");
    try {
      const body: Record<string, unknown> = { contestant_id: selected.id };
      if (packages.length > 0) body.vote_package_id = packageId;
      if (openAmount) body.amount = amount;
      const result = await apiPost<EngageVoteIntentResponse>(`/api/public/engage/events/${slug}/votes`, body, { headers: { "Idempotency-Key": crypto.randomUUID() } });
      if (result.authorization_url) window.location.href = result.authorization_url;
      else router.push(`/engage/vote/receipt?reference=${encodeURIComponent(result.reference)}`);
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to submit this vote."); setPending(false); }
  };

  return <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6">
    <header>{event.cover_image_url && <img src={event.cover_image_url} alt="" className="mb-6 h-48 w-full object-cover" />}<h1 className="font-heading text-3xl font-bold">{event.name}</h1>{event.closes_at && event.countdown_visible && <p className="mt-2 text-sm text-muted-foreground">Voting closes {new Date(event.closes_at).toLocaleString()}</p>}</header>
    {error && <p role="alert" className="mt-4 border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}

    {!selected && <div className="mt-8 space-y-8">{categories.map(category => <section key={category.id}><h2 className="font-heading text-xl font-bold">{category.name}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{contestants.filter(item => item.category_id === category.id).map(contestant => <button key={contestant.id} type="button" onClick={() => setSelected(contestant)} className="flex cursor-pointer items-center gap-3 border bg-card p-4 text-left transition-colors hover:bg-secondary/60"><span className="min-w-0"><strong className="block truncate text-sm">{contestant.name}</strong><span className="block text-xs text-muted-foreground">{contestant.public_code}</span>{contestant.bio && <span className="mt-1 block line-clamp-2 text-xs text-muted-foreground">{contestant.bio}</span>}</span></button>)}</div></section>)}</div>}

    {selected && <section className="mt-8 border bg-card p-6">
      <button type="button" onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground">← Choose someone else</button>
      <h2 className="mt-3 font-heading text-2xl font-bold">Vote for {selected.name}</h2>
      {free && <p className="mt-4 text-sm text-muted-foreground">Voting is free for this event.</p>}
      {packages.length > 0 && <div className="mt-4 grid gap-3 sm:grid-cols-2">{packages.map(item => <label key={item.id} className="flex cursor-pointer items-center justify-between gap-3 border p-3"><span><strong className="block text-sm">{item.name}</strong><span className="block text-xs text-muted-foreground">{item.currency} {item.amount} · {item.vote_quantity} vote(s)</span></span><input type="radio" name="package" checked={packageId === item.id} onChange={() => setPackageId(item.id)} /></label>)}</div>}
      {openAmount && <div className="mt-4"><label htmlFor="amount" className="text-sm font-medium">Amount (GHS, {event.open_vote_rate} per vote)</label><Input id="amount" type="number" min="0" step="1" value={amount} onChange={e => setAmount(e.target.value)} className="mt-2 h-11" /></div>}
      <Button type="button" disabled={pending || (packages.length > 0 && !packageId) || (openAmount && !amount)} className="mt-5 h-11 w-full" onClick={() => void submitVote()}>{pending ? "Redirecting…" : free ? "Cast free vote" : "Continue to payment"}</Button>
    </section>}
  </main>;
}
