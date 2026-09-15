"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { apiPost } from "@/lib/api-client";

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleResetPassword = async (password: string) => {
    if (!token) {
      throw new Error(
        "This reset link is missing its token. Request a new one from the forgot password page.",
      );
    }

    await apiPost("/api/v1/auth/password-reset/confirm", {
      token,
      new_password: password,
    });

    router.push("/sign-in");
  };

  return <ResetPasswordForm onResetPassword={handleResetPassword} />;
}

const ResetPassword = () => {
  return (
    <Suspense>
      <ResetPasswordInner />
    </Suspense>
  );
};

export default ResetPassword;
