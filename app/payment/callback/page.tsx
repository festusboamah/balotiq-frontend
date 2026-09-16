"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import type { InvoiceResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

const VERIFY_INTERVAL_MS = 4_000;

function PaymentCallbackInner() {
  const searchParams = useSearchParams();
  const electionId = searchParams.get("election_id");
  const { user, loading, authGet } = useRequireAuth();
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (loading || !user || !electionId) return;
    // Actively re-verifies with Paystack rather than reading a cached
    // flag -- right after checkout is exactly when the webhook may not
    // have arrived yet, and this call is the fallback for that gap.
    void authGet<InvoiceResponse>(`/api/v1/elections/${electionId}/payment`)
      .then(setInvoice)
      .catch((reason: unknown) => setError(reason instanceof ApiError ? reason.message : "Failed to check payment status."));
  }, [loading, user, electionId, authGet, reload]);

  useEffect(() => {
    if (invoice?.status && invoice.status !== "PENDING") return;
    const interval = window.setInterval(() => setReload(value => value + 1), VERIFY_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [invoice?.status]);

  if (!electionId) return <p role="alert" className="text-sm text-destructive">Missing election reference.</p>;
  if (loading || !user) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return <div className="w-full max-w-md space-y-6 border bg-card p-6 sm:p-8">
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Secure payment verification</p>
      <h1 className="mt-2 font-heading text-2xl font-bold">Confirming your payment</h1>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">We&apos;re checking directly with the payment provider before unlocking your election.</p>
    </div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {!invoice && !error && <p className="text-sm text-muted-foreground">Checking payment status…</p>}
    {invoice?.status === "PAID" && <div className="space-y-2"><h2 className="font-heading text-xl font-bold">Payment received</h2><p className="text-sm text-muted-foreground">{invoice.currency} {invoice.amount} received. You can schedule the election now.</p></div>}
    {invoice?.status === "PENDING" && <div className="space-y-3"><h2 className="font-heading text-xl font-bold">Payment still processing</h2><p className="text-sm text-muted-foreground">This can take a moment. Try checking again.</p><Button type="button" variant="outline" onClick={() => setReload(value => value + 1)}>Check again</Button></div>}
    {invoice?.status === "FAILED" && <h2 className="font-heading text-xl font-bold text-destructive">Payment failed</h2>}
    <Link href={`/elections/${electionId}`} className="inline-block text-sm text-muted-foreground underline hover:text-foreground">← Back to election</Link>
  </div>;
}

export default function PaymentCallbackPage() {
  return <main className="grid min-h-screen place-items-center px-4">
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
      <PaymentCallbackInner />
    </Suspense>
  </main>;
}
