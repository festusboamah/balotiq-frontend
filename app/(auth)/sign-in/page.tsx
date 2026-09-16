"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignInForm } from "@/components/forms/signin-form";
import { useAuth } from "@/lib/auth-context";

// Only an in-app relative path is ever honored -- an absolute/external
// `next` value would let a crafted link redirect a freshly authenticated
// session off-site (open redirect).
function safeNext(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

function SignInInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const { login } = useAuth();

  const handleSignIn = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.mfaRequired) {
      sessionStorage.setItem("mfa_challenge_token", result.challengeToken);
      router.push(`/validate-otp?next=${encodeURIComponent(next)}`);
      return result;
    }
    router.replace(next);
    return result;
  };

  return <SignInForm onSignIn={handleSignIn} />;
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInInner />
    </Suspense>
  );
}
