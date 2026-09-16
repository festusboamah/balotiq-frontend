"use client";

import { useRouter } from "next/navigation";
import { SignInForm } from "@/components/forms/signin-form";
import { useAuth } from "@/lib/auth-context";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleSignIn = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.mfaRequired) {
      sessionStorage.setItem("mfa_challenge_token", result.challengeToken);
      router.push("/validate-otp");
      return result;
    }
    router.replace("/dashboard");
    return result;
  };

  return <SignInForm onSignIn={handleSignIn} />;
}
