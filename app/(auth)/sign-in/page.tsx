"use client";

import { useRouter } from "next/navigation";
import { SignInForm, type SignInResult } from "@/components/forms/signin-form";
import { apiPost } from "@/lib/api-client";

const SignInPage = () => {
  const router = useRouter();

  const handleSignIn = async (
    email: string,
    password: string,
  ): Promise<SignInResult> => {
    const result = await apiPost<{
      mfa_required: boolean;
      access_token: string | null;
      mfa_challenge_token: string | null;
    }>("/api/v1/auth/login", { email, password }, { withCredentials: true });

    if (result.mfa_required) {
      sessionStorage.setItem("mfa_challenge_token", result.mfa_challenge_token!);
      router.push("/validate-otp");
      return { mfaRequired: true, challengeToken: result.mfa_challenge_token! };
    }

    // Not /dashboard: the httpOnly refresh cookie api.balotiq.com just set
    // is blocked by third-party cookie protections here, since this site
    // and balotiq.com aren't the same site to the browser. Landing on
    // balotiq.com itself (same-site with api.balotiq.com) lets the real
    // login work normally instead of silently failing the session check.
    window.location.href = "https://balotiq.com/login";
    return { mfaRequired: false };
  };

  return (
    <>
      <SignInForm onSignIn={handleSignIn} />
    </>
  );
};

export default SignInPage;
