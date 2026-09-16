"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Building2 } from "lucide-react";
import { WorkspaceCard, WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import type { ElectionResponse, MembershipResponse, OrganizationResponse } from "@/lib/types";
import { useRequireAuth } from "@/lib/use-require-auth";

const roles = ["ORG_ADMIN", "ELECTION_MANAGER", "OBSERVER", "AUDITOR", "TICKETING_STAFF"] as const;

export default function OrganizationPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading, authGet, authPost, authPatch, authDelete } = useRequireAuth();
  const [org, setOrg] = useState<OrganizationResponse | null>(null);
  const [elections, setElections] = useState<ElectionResponse[]>([]);
  const [members, setMembers] = useState<MembershipResponse[]>([]);
  const [pageError, setPageError] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<(typeof roles)[number]>("ORG_ADMIN");
  const [reason, setReason] = useState("");
  const [memberPending, setMemberPending] = useState(false);
  const [memberError, setMemberError] = useState("");
  const [billingMode, setBillingMode] = useState("FLAT_FEE");
  const [flatFee, setFlatFee] = useState("");
  const [billingReason, setBillingReason] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [statusReason, setStatusReason] = useState("");
  const [settingsPending, setSettingsPending] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");

  const canManage = Boolean(user?.is_super_admin || user?.organizations.some(item => item.id === id && item.role === "ORG_ADMIN"));

  useEffect(() => {
    if (loading || !user) return;
    void Promise.all([
      authGet<OrganizationResponse>(`/api/v1/organizations/${id}`),
      authGet<ElectionResponse[]>(`/api/v1/organizations/${id}/elections`),
      canManage ? authGet<MembershipResponse[]>(`/api/v1/organizations/${id}/members`) : Promise.resolve([]),
    ]).then(([organization, electionRows, memberRows]) => {
      setOrg(organization); setElections(electionRows); setMembers(memberRows);
      setBillingMode(organization.billing_mode); setFlatFee(organization.flat_fee_amount_override ?? ""); setStatus(organization.status); setDataLoading(false);
    }).catch((error: unknown) => {
      setPageError(error instanceof ApiError ? error.message : "Unable to load this organisation."); setDataLoading(false);
    });
  }, [id, loading, user, authGet, canManage, reload]);

  if (loading || !user || dataLoading) return <main className="grid min-h-screen place-items-center"><p className="text-sm text-muted-foreground">Loading organisation…</p></main>;
  if (!org) return <main className="grid min-h-screen place-items-center px-4"><p role="alert" className="text-sm text-destructive">{pageError || "Organisation not found."}</p></main>;

  const invite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setMemberPending(true); setMemberError("");
    try {
      await authPost(`/api/v1/organizations/${id}/members`, { email, role, reason });
      setEmail(""); setReason(""); setReload(value => value + 1);
    } catch (error) { setMemberError(error instanceof ApiError ? error.message : "Unable to add this member."); }
    finally { setMemberPending(false); }
  };

  const remove = async (membershipId: string) => {
    const removalReason = window.prompt("Reason for removing this member (at least 10 characters):");
    if (!removalReason || removalReason.trim().length < 10) { setMemberError("A removal reason of at least 10 characters is required."); return; }
    try { await authDelete(`/api/v1/organizations/${id}/members/${membershipId}?reason=${encodeURIComponent(removalReason.trim())}`); setReload(value => value + 1); }
    catch (error) { setMemberError(error instanceof ApiError ? error.message : "Unable to remove this member."); }
  };

  const saveBilling = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSettingsPending(true); setSettingsMessage("");
    try { await authPatch(`/api/v1/organizations/${id}`, { billing_mode: billingMode, flat_fee_amount_override: flatFee || null, reason: billingReason }); setBillingReason(""); setSettingsMessage("Billing settings saved."); setReload(value => value + 1); }
    catch (error) { setSettingsMessage(error instanceof ApiError ? error.message : "Unable to save billing settings."); }
    finally { setSettingsPending(false); }
  };

  const saveStatus = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSettingsPending(true); setSettingsMessage("");
    try { await authPost(`/api/v1/organizations/${id}/status`, { status, reason: statusReason }); setStatusReason(""); setSettingsMessage("Organisation status saved."); setReload(value => value + 1); }
    catch (error) { setSettingsMessage(error instanceof ApiError ? error.message : "Unable to save organisation status."); }
    finally { setSettingsPending(false); }
  };

  return <WorkspaceShell admin={user.is_super_admin}><main className="mx-auto flex w-full max-w-5xl flex-col gap-9 px-4 py-8 sm:px-6 lg:px-10">
    <header><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{org.slug}</p><h1 className="mt-1 font-heading text-3xl font-bold">{org.name}</h1></div><span className="border bg-secondary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">{org.status}</span></div><Link href={`/organizations/${id}/audit-events`} className="mt-3 inline-block text-sm text-primary underline-offset-4 hover:underline">Audit trail →</Link></header>
    {pageError && <p role="alert" className="text-sm text-destructive">{pageError}</p>}
    <section aria-labelledby="elections-heading"><div className="mb-4 flex flex-wrap items-center justify-between gap-4"><div><h2 id="elections-heading" className="font-heading text-2xl font-bold">Elections</h2><span className="text-sm text-muted-foreground">{elections.length} total</span></div>{canManage && <Button render={<Link href={`/organizations/${id}/elections/new`} />} nativeButton={false}>New election</Button>}</div>{elections.length === 0 ? <div className="border border-dashed bg-card p-8 text-center"><Building2 className="mx-auto size-6 text-muted-foreground" aria-hidden="true" /><p className="mt-3 text-sm font-semibold">No elections yet</p></div> : <div className="grid gap-3 sm:grid-cols-2">{elections.map(election => <WorkspaceCard key={election.id} href={`/elections/${election.id}`} title={election.title} detail={election.voting_mode.replaceAll("_", " ")} badge={election.status} />)}</div>}</section>
    {canManage && <section aria-labelledby="members-heading"><h2 id="members-heading" className="font-heading text-2xl font-bold">Members</h2><div className="mt-4 divide-y border bg-card">{members.length === 0 ? <p className="p-5 text-sm text-muted-foreground">No members yet.</p> : members.map(member => <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"><span><strong>{member.email}</strong><span className="ml-2 text-muted-foreground">{member.role.replaceAll("_", " ")}</span></span><button type="button" onClick={() => void remove(member.id)} className="min-h-11 cursor-pointer px-2 text-xs font-semibold text-destructive hover:underline">Remove</button></div>)}</div>
      <form onSubmit={invite} className="mt-5 grid gap-3 border bg-card p-5 md:grid-cols-2"><div><label htmlFor="member-email" className="text-sm font-medium">Account email</label><Input id="member-email" type="email" required value={email} onChange={event => setEmail(event.target.value)} className="mt-2 h-11" /></div><div><label htmlFor="member-role" className="text-sm font-medium">Role</label><select id="member-role" value={role} onChange={event => setRole(event.target.value as (typeof roles)[number])} className="mt-2 h-11 w-full border bg-background px-3 text-sm">{roles.map(value => <option key={value}>{value}</option>)}</select></div><div className="md:col-span-2"><label htmlFor="member-reason" className="text-sm font-medium">Reason</label><Input id="member-reason" required minLength={10} value={reason} onChange={event => setReason(event.target.value)} className="mt-2 h-11" placeholder="Reason for granting access (minimum 10 characters)" /></div>{memberError && <p role="alert" className="text-sm text-destructive md:col-span-2">{memberError}</p>}<Button type="submit" disabled={memberPending} className="h-11 md:col-span-2">{memberPending ? "Adding…" : "Add member"}</Button></form>
    </section>}
    {user.is_super_admin && <section aria-labelledby="platform-settings-heading"><h2 id="platform-settings-heading" className="font-heading text-2xl font-bold">Platform settings</h2><p className="mt-2 text-sm text-muted-foreground">These changes are audited and may require you to re-enter your password.</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <form onSubmit={saveBilling} className="space-y-4 border bg-card p-5"><h3 className="font-heading text-lg font-semibold">Billing</h3><div><label htmlFor="billing-mode" className="text-sm font-medium">Billing mode</label><select id="billing-mode" value={billingMode} onChange={event => setBillingMode(event.target.value)} className="mt-2 h-11 w-full border bg-background px-3 text-sm"><option value="FLAT_FEE">Flat fee</option><option value="PER_VOTE_COMMISSION">Per-vote commission</option></select></div><div><label htmlFor="flat-fee" className="text-sm font-medium">Flat-fee override (GHS)</label><Input id="flat-fee" type="number" min="0" step="0.01" value={flatFee} onChange={event => setFlatFee(event.target.value)} className="mt-2 h-11" placeholder="Use platform default" /></div><div><label htmlFor="billing-reason" className="text-sm font-medium">Reason</label><Input id="billing-reason" required minLength={10} value={billingReason} onChange={event => setBillingReason(event.target.value)} className="mt-2 h-11" /></div><Button type="submit" disabled={settingsPending} className="h-11 w-full">Save billing</Button></form>
        <form onSubmit={saveStatus} className="space-y-4 border bg-card p-5"><h3 className="font-heading text-lg font-semibold">Lifecycle</h3><p className="text-xs leading-5 text-muted-foreground">Suspending or closing an organisation blocks new elections from being scheduled without deleting existing records.</p><div><label htmlFor="org-status" className="text-sm font-medium">Status</label><select id="org-status" value={status} onChange={event => setStatus(event.target.value)} className="mt-2 h-11 w-full border bg-background px-3 text-sm"><option value="ACTIVE">Active</option><option value="SUSPENDED">Suspended</option><option value="CLOSED">Closed</option></select></div><div><label htmlFor="status-reason" className="text-sm font-medium">Reason</label><Input id="status-reason" required minLength={10} value={statusReason} onChange={event => setStatusReason(event.target.value)} className="mt-2 h-11" /></div><Button type="submit" disabled={settingsPending} className="h-11 w-full">Save status</Button></form>
      </div>{settingsMessage && <p role="status" className="mt-3 text-sm text-muted-foreground">{settingsMessage}</p>}
    </section>}
  </main></WorkspaceShell>;
}
