"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiGet, ApiError } from "@/lib/api-client";
import type { EngagePaymentStatusResponse } from "@/lib/types";

const VERIFY_INTERVAL_MS = 4_000;

function ReceiptInner() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState<EngagePaymentStatusResponse | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!reference) return;
    void apiGet<EngagePaymentStatusResponse>(`/api/public/engage/payments/${reference}/status`)
      .then(setStatus)
      .catch((reason: unknown) => setError(reason instanceof ApiError ? reason.message : "Unable to check this vote's status."));
  }, [reference, reload]);

  useEffect(() => {
    if (status && status.status !== "PENDING") return;
    const interval = window.setInterval(() => setReload(value => value + 1), VERIFY_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [status]);

  if (!reference) return <p role="alert" className="text-sm text-destructive">Missing payment reference.</p>;

  return <div className="w-full max-w-md space-y-5 border bg-card p-6 sm:p-8">
    <div><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Vote receipt</p><h1 className="mt-2 font-heading text-2xl font-bold">{status ? status.event_name : "Confirming your vote"}</h1></div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {!status && !error && <p className="text-sm text-muted-foreground">Checking payment status…</p>}
    {status?.status === "PENDING" && <div className="space-y-3"><p className="text-sm text-muted-foreground">Still processing — this can take a moment.</p><Button type="button" variant="outline" onClick={() => setReload(value => value + 1)}>Check again</Button></div>}
    {status?.status === "VERIFIED_SUCCESS" && <div className="space-y-2"><h2 className="font-heading text-xl font-bold">Vote counted</h2><p className="text-sm text-muted-foreground">{status.vote_quantity} vote(s) for {status.contestant_name} · {status.currency} {status.amount}</p>{status.reconciliation_required && <p className="text-sm text-amber-600">Your payment is being reconciled — this can take a little longer to reflect in the tally.</p>}</div>}
    {status && ["FAILED", "EXPIRED", "REVERSED"].includes(status.status) && <h2 className="font-heading text-xl font-bold text-destructive">Payment {status.status.toLowerCase()}</h2>}
    {status?.status === "VERIFIED_NO_CREDIT" && <p className="text-sm text-amber-600">Your payment went through but the vote hasn&apos;t been credited yet — this is being reconciled and may take a little longer.</p>}
  </div>;
}

export default function EngageVoteReceiptPage() {
  return <main className="grid min-h-screen place-items-center px-4"><Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}><ReceiptInner /></Suspense></main>;
}
