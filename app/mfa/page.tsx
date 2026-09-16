"use client";

import { useEffect, useState, type FormEvent } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import type { MfaConfirmResponse, MfaEnrollResponse, MfaStatusResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function MfaPage() {
  const { user, loading, authGet, authPost } = useRequireAuth();
  const [status, setStatus] = useState<MfaStatusResponse | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  const [enrollment, setEnrollment] = useState<MfaEnrollResponse | null>(null);
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    authGet<MfaStatusResponse>("/api/v1/auth/mfa/status").then(record => { setStatus(record); setDataLoading(false); })
      .catch((reason: unknown) => { setError(reason instanceof ApiError ? reason.message : "Unable to load MFA status."); setDataLoading(false); });
  }, [loading, user, authGet, reload]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading…</p></main>;

  const startEnroll = async () => {
    setPending(true); setError("");
    try { setEnrollment(await authPost<MfaEnrollResponse>("/api/v1/auth/mfa/enroll")); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to start enrollment."); }
    finally { setPending(false); }
  };

  const confirmEnroll = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setPending(true); setError("");
    try { const result = await authPost<MfaConfirmResponse>("/api/v1/auth/mfa/confirm", { code }); setBackupCodes(result.backup_codes); setEnrollment(null); setCode(""); setReload(value => value + 1); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "That code is wrong or expired."); }
    finally { setPending(false); }
  };

  const disable = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setPending(true); setError("");
    try { await authPost("/api/v1/auth/mfa/disable", { password }); setPassword(""); setReload(value => value + 1); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "Unable to disable MFA."); }
    finally { setPending(false); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
    <header><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Account security</p><h1 className="mt-1 font-heading text-3xl font-bold">Two-factor authentication</h1></header>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

    {backupCodes && <section className="border bg-card p-6"><h2 className="font-heading text-xl font-bold">Save your backup codes</h2><p className="mt-2 text-sm text-muted-foreground">Each code can be used once if you lose access to your authenticator app. They won&apos;t be shown again.</p><ul className="mt-4 grid grid-cols-2 gap-2 font-mono text-sm">{backupCodes.map(item => <li key={item} className="border bg-secondary p-2 text-center">{item}</li>)}</ul><Button type="button" className="mt-5" onClick={() => setBackupCodes(null)}>Done</Button></section>}

    {!backupCodes && status?.enabled && <section className="border bg-card p-6"><h2 className="font-heading text-xl font-bold">Enabled</h2><p className="mt-2 text-sm text-muted-foreground">{status.backup_codes_remaining} backup code(s) remaining.</p><form onSubmit={disable} className="mt-5 space-y-3"><div><label htmlFor="disable-password" className="text-sm font-medium">Confirm your password to disable MFA</label><Input id="disable-password" type="password" required value={password} onChange={event => setPassword(event.target.value)} className="mt-2 h-11" /></div><Button type="submit" variant="destructive" disabled={pending}>{pending ? "Disabling…" : "Disable MFA"}</Button></form></section>}

    {!backupCodes && status && !status.enabled && !enrollment && <section className="border bg-card p-6"><h2 className="font-heading text-xl font-bold">Not enabled</h2><p className="mt-2 text-sm text-muted-foreground">Add an authenticator app for an extra layer of security on sign-in.</p><Button type="button" className="mt-4" disabled={pending} onClick={() => void startEnroll()}>Set up two-factor authentication</Button></section>}

    {!backupCodes && enrollment && <section className="border bg-card p-6"><h2 className="font-heading text-xl font-bold">Scan this code</h2><p className="mt-2 text-sm text-muted-foreground">Scan with your authenticator app, or enter the secret manually.</p><img src={enrollment.qr_code_data_uri} alt="MFA enrollment QR code" className="mt-4 size-48" /><p className="mt-2 break-all font-mono text-xs text-muted-foreground">{enrollment.secret}</p><form onSubmit={confirmEnroll} className="mt-5 space-y-3"><div><label htmlFor="enroll-code" className="text-sm font-medium">6-digit code</label><Input id="enroll-code" required value={code} onChange={event => setCode(event.target.value)} className="mt-2 h-11" /></div><Button type="submit" disabled={pending}>{pending ? "Confirming…" : "Confirm"}</Button></form></section>}
  </main></WorkspaceShell>;
}
