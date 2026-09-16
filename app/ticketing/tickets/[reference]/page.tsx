"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiGet, ApiError } from "@/lib/api-client";
import type { TicketingOrderWithTicketsResponse } from "@/lib/types";

const VERIFY_INTERVAL_MS = 4_000;

export default function TicketConfirmationPage() {
  const { reference } = useParams<{ reference: string }>();
  const [data, setData] = useState<TicketingOrderWithTicketsResponse | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    void apiGet<TicketingOrderWithTicketsResponse>(`/api/public/ticketing/orders/${reference}`)
      .then(setData)
      .catch((reason: unknown) => setError(reason instanceof ApiError ? reason.message : "Unable to load this order."));
  }, [reference, reload]);

  useEffect(() => {
    if (data && data.order.status !== "PENDING") return;
    const interval = window.setInterval(() => setReload(value => value + 1), VERIFY_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [data]);

  return <main className="mx-auto min-h-screen w-full max-w-xl px-4 py-10 sm:px-6">
    <div className="border bg-card p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ticket order</p>
      <h1 className="mt-2 font-heading text-2xl font-bold">{data ? data.event_name : "Confirming your order"}</h1>
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      {!data && !error && <p className="mt-4 text-sm text-muted-foreground">Checking payment status…</p>}
      {data?.order.status === "PENDING" && <div className="mt-4 space-y-3"><p className="text-sm text-muted-foreground">Still processing — this can take a moment.</p><Button type="button" variant="outline" onClick={() => setReload(value => value + 1)}>Check again</Button></div>}
      {data?.order.status === "FAILED" && <p className="mt-4 text-sm font-bold text-destructive">Payment failed.</p>}
      {data?.order.status === "PAID" && <div className="mt-6 space-y-4">
        <p className="text-sm text-muted-foreground">{data.tier_name} × {data.tickets.length} · {data.order.currency} {data.order.total_amount}</p>
        {data.tickets.map(ticket => <div key={ticket.id} className="flex items-center justify-between gap-4 border p-4">
          <span><strong className="block text-sm">{ticket.display_code}</strong><span className="block text-xs uppercase text-muted-foreground">{ticket.status}</span></span>
          {ticket.qr_data_uri && <img src={ticket.qr_data_uri} alt={`QR code for ticket ${ticket.display_code}`} className="size-24" />}
        </div>)}
        <p className="text-xs text-muted-foreground">Save this page or screenshot your QR codes — present them at check-in.</p>
      </div>}
    </div>
  </main>;
}
