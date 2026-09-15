"use client";

import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { apiPost } from "@/lib/api-client";

const ForgotPassword = () => {
  const handleRequestReset = async (email: string) => {
    // Always returns 204 whether or not the email exists — anti-enumeration.
    await apiPost("/api/v1/auth/password-reset/request", { email });
  };

  return (
    <>
      <ForgotPasswordForm onRequestReset={handleRequestReset} />
    </>
  );
};

export default ForgotPassword;
