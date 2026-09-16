"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ValidateOTPForm } from "@/components/forms/validateOTP-form";
import { useAuth } from "@/lib/auth-context";

export default function ValidateOTP() {
  const router = useRouter();
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
    router.replace("/dashboard");
  };

  if (!challengeToken) return null;

  return <ValidateOTPForm title="Two-factor verification" description="Enter the 6-digit code from your authenticator app." onValidate={handleValidate} />;
}
