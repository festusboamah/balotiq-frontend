"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ValidateOTPForm } from "@/components/forms/validateOTP-form";
import { useAuth } from "@/lib/auth-context";

function safeNext(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

function ValidateOTPInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const { completeMfaLogin } = useAuth();
  const [challengeToken] = useState<string | null>(() =>
    typeof window === "undefined" ? null : sessionStorage.getItem("mfa_challenge_token"),
  );

  useEffect(() => {
    if (!challengeToken) router.replace("/sign-in");
  }, [challengeToken, router]);

  const handleValidate = async (code: string) => {
    if (!challengeToken) return;
    await completeMfaLogin(challengeToken, code);
    sessionStorage.removeItem("mfa_challenge_token");
    router.replace(next);
  };

  if (!challengeToken) return null;

  return <ValidateOTPForm title="Two-factor verification" description="Enter the 6-digit code from your authenticator app." onValidate={handleValidate} />;
}

export default function ValidateOTP() {
  return (
    <Suspense>
      <ValidateOTPInner />
    </Suspense>
  );
}
