"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGet, apiPost, ApiError } from "@/lib/api-client";
import type { EngagePublicCategoryResponse, EngagePublicEventResponse, EngagePublicNominationReceiptResponse } from "@/lib/types";

export default function PublicNominatePage() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EngagePublicEventResponse | null>(null);
  const [categories, setCategories] = useState<EngagePublicCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  const [categoryId, setCategoryId] = useState("");
  const [nomineeName, setNomineeName] = useState(""); const [nomineeReason, setNomineeReason] = useState("");
  const [nomineeEmail, setNomineeEmail] = useState(""); const [nomineePhone, setNomineePhone] = useState("");
  const [submitterName, setSubmitterName] = useState(""); const [submitterEmail, setSubmitterEmail] = useState(""); const [submitterPhone, setSubmitterPhone] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void Promise.all([
      apiGet<EngagePublicEventResponse>(`/api/public/engage/events/${slug}`),
      apiGet<EngagePublicCategoryResponse[]>(`/api/public/engage/events/${slug}/categories`),
    ]).then(([eventRecord, categoryRows]) => { setEvent(eventRecord); setCategories(categoryRows); setLoading(false); })
      .catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "This event isn't available."); setLoading(false); });
  }, [slug]);

  if (loading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;
  if (!event) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">{error || "Event not found."}</p></main>;

  const submit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault(); setPending(true); setError("");
    try {
      const receipt = await apiPost<EngagePublicNominationReceiptResponse>(`/api/public/engage/events/${slug}/nominations`, {
        category_id: categoryId, nominee_name: nomineeName, nominee_reason: nomineeReason || null,
        nominee_contact_email: nomineeEmail || null, nominee_contact_phone: nomineePhone || null,
        submitter_name: submitterName, submitter_email: submitterEmail, submitter_phone: submitterPhone || null,
      }, { headers: { "Idempotency-Key": crypto.randomUUID() } });
      const file = fileRef.current?.files?.[0];
      if (file) {
        const form = new FormData();
        form.append("file", file);
        await apiPost(`/api/public/engage/events/${slug}/nominations/${receipt.id}/photo`, form);
      }
      setDone(true);
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to submit this nomination."); }
    finally { setPending(false); }
  };

  if (done) return <main className="grid min-h-screen place-items-center px-4"><div className="w-full max-w-lg border bg-card p-6 sm:p-8"><h1 className="font-heading text-3xl font-bold">Nomination submitted</h1><p className="mt-2 text-sm text-muted-foreground">The organiser will review it before it appears on the ballot.</p></div></main>;

  return <main className="mx-auto min-h-screen w-full max-w-xl px-4 py-10 sm:px-6">
    <h1 className="font-heading text-3xl font-bold">Nominate someone for {event.name}</h1>
    {error && <p role="alert" className="mt-4 border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}
    <form onSubmit={submit} className="mt-6 space-y-4 border bg-card p-6">
      <div><label htmlFor="category" className="text-sm font-medium">Category</label><select id="category" required value={categoryId} onChange={e => setCategoryId(e.target.value)} className="mt-2 h-11 w-full border bg-background px-3 text-sm"><option value="">Select a category</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
      <div><label htmlFor="nominee-name" className="text-sm font-medium">Nominee&apos;s full name</label><Input id="nominee-name" required value={nomineeName} onChange={e => setNomineeName(e.target.value)} className="mt-2 h-11" /></div>
      <div><label htmlFor="nominee-reason" className="text-sm font-medium">Why are you nominating them?</label><textarea id="nominee-reason" rows={4} value={nomineeReason} onChange={e => setNomineeReason(e.target.value)} className="mt-2 w-full border bg-background p-3 text-sm" /></div>
      <div className="grid gap-3 sm:grid-cols-2"><div><label htmlFor="nominee-email" className="text-sm font-medium">Nominee email (optional)</label><Input id="nominee-email" type="email" value={nomineeEmail} onChange={e => setNomineeEmail(e.target.value)} className="mt-2 h-11" /></div><div><label htmlFor="nominee-phone" className="text-sm font-medium">Nominee phone (optional)</label><Input id="nominee-phone" value={nomineePhone} onChange={e => setNomineePhone(e.target.value)} className="mt-2 h-11" /></div></div>
      <div><label htmlFor="nominee-photo" className="text-sm font-medium">Photo (optional)</label><input ref={fileRef} id="nominee-photo" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 w-full text-sm" /></div>
      <div className="border-t pt-4"><p className="text-sm font-medium">Your details</p><p className="mt-1 text-xs text-muted-foreground">So the organiser can follow up if they have questions.</p></div>
      <div><label htmlFor="submitter-name" className="text-sm font-medium">Your name</label><Input id="submitter-name" required value={submitterName} onChange={e => setSubmitterName(e.target.value)} className="mt-2 h-11" /></div>
      <div><label htmlFor="submitter-email" className="text-sm font-medium">Your email</label><Input id="submitter-email" type="email" required value={submitterEmail} onChange={e => setSubmitterEmail(e.target.value)} className="mt-2 h-11" /></div>
      <div><label htmlFor="submitter-phone" className="text-sm font-medium">Your phone (optional)</label><Input id="submitter-phone" value={submitterPhone} onChange={e => setSubmitterPhone(e.target.value)} className="mt-2 h-11" /></div>
      <Button type="submit" disabled={pending || !categoryId} className="h-11 w-full">{pending ? "Submitting…" : "Submit nomination"}</Button>
    </form>
  </main>;
}
