"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGet, apiPost, ApiError } from "@/lib/api-client";
import type { TicketingOrderResponse, TicketingPublicEventResponse, TicketingPublicTierResponse } from "@/lib/types";

export default function PublicTicketingBuyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<TicketingPublicEventResponse | null>(null);
  const [tiers, setTiers] = useState<TicketingPublicTierResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tierId, setTierId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void Promise.all([
      apiGet<TicketingPublicEventResponse>(`/api/public/ticketing/events/${slug}`),
      apiGet<TicketingPublicTierResponse[]>(`/api/public/ticketing/events/${slug}/tiers`),
    ]).then(([eventRecord, tierRows]) => { setEvent(eventRecord); setTiers(tierRows); setLoading(false); })
      .catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "This event isn't available."); setLoading(false); });
  }, [slug]);

  if (loading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading event…</p></main>;
  if (!event) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">{error || "Event not found."}</p></main>;

  const selectedTier = tiers.find(item => item.id === tierId);

  const submit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault(); setPending(true); setError("");
    try {
      const order = await apiPost<TicketingOrderResponse>(`/api/public/ticketing/events/${slug}/orders`, { tier_id: tierId, quantity: Number(quantity), buyer_name: name, buyer_email: email, buyer_phone: phone || null }, { headers: { "Idempotency-Key": crypto.randomUUID() } });
      window.location.href = order.authorization_url ?? `/ticketing/tickets/${order.internal_reference}`;
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to start checkout."); setPending(false); }
  };

  return <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-10 sm:px-6">
    <header>{event.cover_image_url && <img src={event.cover_image_url} alt="" className="mb-6 h-48 w-full object-cover" />}<h1 className="font-heading text-3xl font-bold">{event.name}</h1>{event.venue && <p className="mt-1 text-sm text-muted-foreground">{event.venue}</p>}{event.event_starts_at && <p className="mt-1 text-sm text-muted-foreground">{new Date(event.event_starts_at).toLocaleString()}</p>}{event.description && <p className="mt-4 text-sm leading-6 text-muted-foreground">{event.description}</p>}</header>
    {error && <p role="alert" className="mt-4 border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}

    <section className="mt-8"><h2 className="font-heading text-xl font-bold">Choose a ticket</h2><div className="mt-4 space-y-3">{tiers.map(tier => {
      const soldOut = tier.remaining_capacity === 0;
      return <label key={tier.id} className={`flex items-center justify-between gap-3 border p-4 ${soldOut ? "opacity-50" : "cursor-pointer"}`}>
        <span><strong className="block text-sm">{tier.name}</strong>{tier.description && <span className="block text-xs text-muted-foreground">{tier.description}</span>}<span className="block text-xs text-muted-foreground">{tier.currency} {tier.amount}{tier.remaining_capacity !== null && !soldOut && ` · ${tier.remaining_capacity} left`}{soldOut && " · Sold out"}</span></span>
        <input type="radio" name="tier" disabled={soldOut} checked={tierId === tier.id} onChange={() => setTierId(tier.id)} />
      </label>;
    })}</div></section>

    {selectedTier && <form onSubmit={submit} className="mt-8 space-y-4 border bg-card p-6">
      <div><label htmlFor="quantity" className="text-sm font-medium">Quantity</label><Input id="quantity" type="number" min="1" max="20" value={quantity} onChange={e => setQuantity(e.target.value)} className="mt-2 h-11 w-24" /></div>
      <div><label htmlFor="buyer-name" className="text-sm font-medium">Full name</label><Input id="buyer-name" required value={name} onChange={e => setName(e.target.value)} className="mt-2 h-11" /></div>
      <div><label htmlFor="buyer-email" className="text-sm font-medium">Email</label><Input id="buyer-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-2 h-11" /></div>
      <div><label htmlFor="buyer-phone" className="text-sm font-medium">Phone (optional)</label><Input id="buyer-phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-2 h-11" /></div>
      <Button type="submit" disabled={pending} className="h-11 w-full">{pending ? "Redirecting…" : `Pay ${selectedTier.currency} ${(Number(selectedTier.amount) * Number(quantity || "1")).toFixed(2)}`}</Button>
    </form>}
  </main>;
}
