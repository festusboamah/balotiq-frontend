"use client";

import { useRouter } from "next/navigation";
import { SignUpForm } from "@/components/forms/signup-form";
import { useAuth } from "@/lib/auth-context";

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();

  const handleSignUp = async (email: string, password: string, termsAccepted: boolean) => {
    await register(email, password, termsAccepted);
    router.replace("/dashboard");
  };

  return <SignUpForm onSignUp={handleSignUp} />;
}
