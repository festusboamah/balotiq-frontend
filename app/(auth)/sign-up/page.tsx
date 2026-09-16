"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignUpForm } from "@/components/forms/signup-form";
import { useAuth } from "@/lib/auth-context";

function safeNext(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

function SignUpInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const { register } = useAuth();

  const handleSignUp = async (email: string, password: string, termsAccepted: boolean) => {
    await register(email, password, termsAccepted);
    router.replace(next);
  };

  return <SignUpForm onSignUp={handleSignUp} />;
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpInner />
    </Suspense>
  );
}
