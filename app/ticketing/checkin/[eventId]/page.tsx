"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { ApiError } from "@/lib/api-client";
import type { TicketingCheckInResponse, TicketingEventResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

type ScanOutcome =
  | { kind: "success"; response: TicketingCheckInResponse }
  | { kind: "already_used" }
  | { kind: "voided" }
  | { kind: "not_found" }
  | { kind: "error"; message: string };

const BANNER_STYLES: Record<ScanOutcome["kind"], string> = {
  success: "border-emerald-600/30 bg-emerald-50 text-emerald-900",
  already_used: "border-amber-600/30 bg-amber-50 text-amber-900",
  voided: "border-destructive/30 bg-destructive/5 text-destructive",
  not_found: "border-destructive/30 bg-destructive/5 text-destructive",
  error: "border-destructive/30 bg-destructive/5 text-destructive",
};

// A tap-to-dismiss result banner, not an auto-clearing timer -- staff at
// a busy door need to actually see who they just let in (or turned away)
// before the next scan overwrites it.
function ResultBanner({ outcome, onDismiss }: { outcome: ScanOutcome; onDismiss: () => void }) {
  let heading = ""; let detail = "";
  if (outcome.kind === "success") { heading = "✓ Checked in"; detail = `${outcome.response.tier_name} · ${outcome.response.display_code}`; }
  else if (outcome.kind === "already_used") { heading = "Already checked in"; detail = "This ticket has already been used for entry."; }
  else if (outcome.kind === "voided") { heading = "Ticket voided"; detail = "This ticket was cancelled and can't be used for entry."; }
  else if (outcome.kind === "not_found") { heading = "Not a valid ticket"; detail = "That QR code doesn't match a ticket for this event."; }
  else { heading = "Something went wrong"; detail = outcome.message; }

  return <button type="button" onClick={onDismiss} className={`w-full cursor-pointer border p-4 text-left ${BANNER_STYLES[outcome.kind]}`}>
    <p className="font-heading text-xl font-bold">{heading}</p>
    {detail && <p className="mt-1 text-sm opacity-80">{detail}</p>}
    <p className="mt-2 text-xs opacity-60">Tap to scan the next ticket</p>
  </button>;
}

export default function TicketingCheckInPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user, loading, authGet, authPost } = useRequireAuth();
  const [event, setEvent] = useState<TicketingEventResponse | null>(null);
  const [loadError, setLoadError] = useState("");
  const [outcome, setOutcome] = useState<ScanOutcome | null>(null);
  const [scannerError, setScannerError] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    if (loading || !user) return;
    authGet<TicketingEventResponse>(`/api/ticketing/events/${eventId}`)
      .then(setEvent)
      .catch((reason: unknown) => setLoadError(reason instanceof ApiError ? reason.message : "Failed to load this event."));
  }, [eventId, loading, user, authGet]);

  useEffect(() => {
    if (!event || !videoRef.current) return;

    const handleDecode = async (result: QrScanner.ScanResult) => {
      if (busyRef.current) return;
      busyRef.current = true;
      try {
        const response = await authPost<TicketingCheckInResponse>(`/api/ticketing/events/${eventId}/check-in`, { qr_token: result.data });
        setOutcome({ kind: "success", response });
      } catch (reason) {
        if (reason instanceof ApiError && reason.code === "TICKET_ALREADY_USED") setOutcome({ kind: "already_used" });
        else if (reason instanceof ApiError && reason.code === "TICKET_VOIDED") setOutcome({ kind: "voided" });
        else if (reason instanceof ApiError && reason.code === "TICKET_NOT_FOUND") setOutcome({ kind: "not_found" });
        else setOutcome({ kind: "error", message: reason instanceof ApiError ? reason.message : "Check-in failed." });
      }
    };

    const scanner = new QrScanner(videoRef.current, result => void handleDecode(result), { highlightScanRegion: true, highlightCodeOutline: true, maxScansPerSecond: 5 });
    scanner.start().catch(() => setScannerError("Couldn't access the camera. Check permissions and try again."));
    return () => { scanner.stop(); scanner.destroy(); };
  }, [event, eventId, authPost]);

  function resumeScanning() { setOutcome(null); busyRef.current = false; }

  if (loading || !user) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;
  if (loadError) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">{loadError}</p></main>;
  if (!event) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;

  return <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 p-6">
    <div><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Check-in</p><h1 className="mt-1 font-heading text-xl font-bold">{event.name}</h1></div>
    {outcome ? <ResultBanner outcome={outcome} onDismiss={resumeScanning} /> : <div className="overflow-hidden border bg-card"><video ref={videoRef} className="aspect-square w-full object-cover" muted playsInline /></div>}
    {scannerError && <p role="alert" className="text-sm text-destructive">{scannerError}</p>}
    {!outcome && <p className="text-center text-xs text-muted-foreground">Point the camera at a ticket&apos;s QR code.</p>}
  </main>;
}
