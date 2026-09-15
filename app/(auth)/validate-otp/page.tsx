"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ValidateOTPForm } from "@/components/forms/validateOTP-form";
import { apiPost } from "@/lib/api-client";

const ValidateOTP = () => {
  const router = useRouter();
  const [challengeToken] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : sessionStorage.getItem("mfa_challenge_token"),
  );

  useEffect(() => {
    // Landed here without going through sign-in first — nothing to verify.
    if (!challengeToken) {
      router.replace("/sign-in");
    }
  }, [challengeToken, router]);

  const handleValidate = async (code: string) => {
    if (!challengeToken) return;

    await apiPost(
      "/api/v1/auth/mfa/login-verify",
      { mfa_challenge_token: challengeToken, code },
      { withCredentials: true },
    );

    sessionStorage.removeItem("mfa_challenge_token");
    // Not /dashboard: see the same note in sign-in/page.tsx — the refresh
    // cookie this call just set is blocked here by third-party cookie
    // protections, since this site isn't the same site as api.balotiq.com.
    window.location.href = "https://balotiq.com/login";
  };

  const handleResend = async () => {
    throw new Error(
      "This code comes from your authenticator app, not an email — check the app for your current code.",
    );
  };

  if (!challengeToken) {
    return null;
  }

  return (
    <ValidateOTPForm
      title="Two-factor verification"
      description="Enter the 6-digit code from your authenticator app."
      onValidate={handleValidate}
      onResend={handleResend}
    />
  );
};

export default ValidateOTP;
