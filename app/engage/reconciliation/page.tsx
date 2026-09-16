"use client";

import { useEffect, useState } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import type { EngageReconciliationPaymentResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function EngageReconciliationPage() {
  const { user, loading, authGet, authPost } = useRequireAuth();
  const [payments, setPayments] = useState<EngageReconciliationPaymentResponse[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (loading || !user) return;
    authGet<EngageReconciliationPaymentResponse[]>("/api/engage/reconciliation/payment-transactions")
      .then(rows => { setPayments(rows); setDataLoading(false); })
      .catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "Unable to load reconciliation queue."); setDataLoading(false); });
  }, [loading, user, authGet, reload]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;
  if (!user.is_super_admin) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">Only a Super Admin can view this page.</p></main>;

  const retryCredit = async (id: string) => {
    const note = window.prompt("Reason for retrying credit (at least 10 characters):");
    if (!note || note.trim().length < 10) return;
    try { await authPost(`/api/engage/reconciliation/payment-transactions/${id}/retry-credit`, { note: note.trim() }); setReload(value => value + 1); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to retry this credit."); }
  };

  const refund = async (id: string) => {
    const note = window.prompt("Reason for refunding (at least 10 characters):");
    if (!note || note.trim().length < 10) return;
    try { await authPost(`/api/engage/reconciliation/payment-transactions/${id}/refund`, { note: note.trim() }); setReload(value => value + 1); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to refund this payment."); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
    <header><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Engage operations</p><h1 className="mt-1 font-heading text-3xl font-bold">Payment reconciliation</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Payments that verified with Paystack but couldn&apos;t be credited automatically, or that are pending a refund.</p></header>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {payments.length === 0 ? <div className="border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">Nothing needs reconciliation.</div> : <div className="divide-y border bg-card">{payments.map(item => <div key={item.id} className="flex flex-wrap items-start justify-between gap-3 p-4 text-sm"><div><strong>{item.internal_reference}</strong><span className="ml-2 text-xs uppercase text-muted-foreground">{item.status}</span><p className="mt-1 text-xs text-muted-foreground">{item.currency} {item.amount} · {item.vote_quantity} vote(s){item.reconciliation_reason ? ` · ${item.reconciliation_reason}` : ""}</p></div><div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => void retryCredit(item.id)}>Retry credit</Button><Button type="button" size="sm" variant="destructive" onClick={() => void refund(item.id)}>Refund</Button></div></div>)}</div>}
  </main></WorkspaceShell>;
}
