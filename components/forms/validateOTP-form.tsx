"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ValidateOTPProps = {
  email?: string;
  title?: string;
  description?: string;
  onValidate?: (otp: string) => Promise<void> | void;
  onResend?: () => Promise<void> | void;
  className?: string;
};

export function ValidateOTPForm({
  email,
  title = "Verify your account",
  description = "Enter the 6-digit code we sent to your email.",
  onValidate,
  onResend,
  className,
}: ValidateOTPProps) {
  const [otp, setOtp] = React.useState("");
  const [seconds, setSeconds] = React.useState(30);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (seconds <= 0) return;

    const timer = window.setInterval(() => {
      setSeconds(current => current - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [seconds]);

  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);

    setOtp(value);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await onValidate?.(otp);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Invalid verification code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (seconds > 0 || isResending) return;

    try {
      setIsResending(true);
      setError("");

      await onResend?.();

      setSeconds(30);
      setOtp("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to resend the code.",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={cn("mx-auto space-y-4 sm:w-sm", className)}>
      <div className="flex flex-col space-y-1 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          {title}
        </h1>

        <p className="text-balance text-sm text-muted-foreground">
          {description}
        </p>

        {email && <p className="pt-2 text-sm font-medium">{email}</p>}
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="otp">Verification Code</FieldLabel>

            <Input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              className="h-12 border-2 border-primary text-center font-mono text-lg tracking-[0.5em]"
              autoFocus
              required
            />

            <FieldDescription className="text-center">
              Enter the 6-digit verification code sent to your email.
            </FieldDescription>
          </Field>

          {error && (
            <p className="text-center text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <Field>
            <Button
              type="submit"
              className="h-11 w-full border-primary cursor-pointer"
              disabled={isSubmitting || otp.length !== 6}
            >
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </Button>
          </Field>

          <FieldDescription className="text-center">
            Didn&apos;t receive the code?
          </FieldDescription>

          <Button
            type="button"
            variant="ghost"
            className="h-9 cursor-pointer"
            disabled={seconds > 0 || isResending}
            onClick={handleResend}
          >
            {isResending
              ? "Sending..."
              : seconds > 0
                ? `Resend code in ${seconds}s`
                : "Resend OTP"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
