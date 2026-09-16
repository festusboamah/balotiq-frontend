"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

export default function VoterInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { user, loading, authPost } = useAuth();
  const [error, setError] = useState("");
  const claimed = useRef(false);

  useEffect(() => {
    if (loading || !user || claimed.current || error) return;
    claimed.current = true;
    void authPost<{ election_id: string }>("/api/v1/voter-invitations/claim", { token })
      .then(({ election_id }) => router.replace(`/elections/${election_id}/vote`))
      .catch((reason: unknown) => {
        setError(reason instanceof ApiError ? reason.message : "Unable to verify this voting link.");
        claimed.current = false;
      });
  }, [authPost, error, loading, router, token, user]);

  if (loading || (user && !error)) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Verifying your voting link…</p></main>;

  const next = `/vote/invite/${token}`;
  return <main className="grid min-h-screen place-items-center px-4">
    <div className="w-full max-w-lg space-y-5 border bg-card p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Secure voter access</p>
      <h1 className="font-heading text-3xl font-bold">Your voting link is ready</h1>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : <p className="text-sm leading-6 text-muted-foreground">Sign in or create an account to confirm this one-time link. We never show your voter ID in the URL.</p>}
      {!user && !error && <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={`/sign-in?next=${encodeURIComponent(next)}`} className="flex-1"><Button type="button" className="h-11 w-full">Sign in to vote</Button></Link>
        <Link href={`/sign-up?next=${encodeURIComponent(next)}`} className="flex-1"><Button type="button" variant="outline" className="h-11 w-full">Create account</Button></Link>
      </div>}
    </div>
  </main>;
}
