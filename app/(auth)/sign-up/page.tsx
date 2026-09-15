"use client";

import { SignUpForm } from "@/components/forms/signup-form";
import { apiPost, ApiError } from "@/lib/api-client";

const SignUpPage = () => {
  const handleSignUp = async (email: string, password: string) => {
    // /register doesn't issue tokens itself — chain straight into login so
    // signing up feels like one step. It also never reveals whether the
    // email was already taken (anti-enumeration); when it was, this login
    // attempt is what actually fails.
    await apiPost("/api/v1/auth/register", {
      email,
      password,
      terms_accepted: true,
    });

    try {
      const result = await apiPost<{
        mfa_required: boolean;
        access_token: string | null;
      }>("/api/v1/auth/login", { email, password }, { withCredentials: true });

      if (result.mfa_required) {
        // Only reachable if the email belonged to an existing, MFA-enabled
        // account — a brand-new account never has MFA enabled yet.
        throw new ApiError(
          409,
          "ACCOUNT_EXISTS",
          "An account with this email already exists and requires a verification code to sign in. Try signing in instead.",
        );
      }
    } catch (error) {
      if (error instanceof ApiError && error.code === "ACCOUNT_EXISTS") {
        throw error;
      }
      throw new ApiError(
        409,
        "SIGN_IN_FAILED",
        "An account with this email may already exist. Try signing in instead, or use a different email.",
      );
    }

    // Not /dashboard: the httpOnly refresh cookie from the login above is
    // blocked by third-party cookie protections on this site, since it
    // isn't the same site as api.balotiq.com. balotiq.com/login is
    // same-site, so a real login there works normally.
    window.location.href = "https://balotiq.com/login";
  };

  return (
    <>
      <SignUpForm onSignUp={handleSignUp} />
    </>
  );
};

export default SignUpPage;
