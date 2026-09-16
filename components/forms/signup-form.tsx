"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import Link from "next/link";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

type SignUpFormProps = {
  onSignUp?: (email: string, password: string, termsAccepted: boolean) => Promise<void>;
};

export function SignUpForm({ onSignUp }: SignUpFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await onSignUp?.(email, password, termsAccepted);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to create your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto space-y-4 sm:w-sm">
      <div className="flex flex-col space-y-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Create your account
        </h1>

        <p className="text-balance text-sm text-muted-foreground">
          Create your Balotiq account to start running secure elections.
        </p>
      </div>
      <div className="space-y-2">
        <form className={cn("flex flex-col gap-6")} onSubmit={handleSubmit}>
          <FieldGroup>
            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="h-11 border-2 border-primary"
              />

              <FieldDescription>
                We&apos;ll use this email for account notifications.
              </FieldDescription>
            </Field>

            {/* Password */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="h-11 border-2 border-primary"
              />

              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            {/* Confirm Password */}
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>

              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={event => setConfirmPassword(event.target.value)}
                className="h-11 border-2 border-primary"
              />
            </Field>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            <Field>
              <label className="flex items-start gap-3 text-sm leading-6">
                <input type="checkbox" checked={termsAccepted} onChange={event => setTermsAccepted(event.target.checked)} required className="mt-1 size-4 accent-primary" />
                <span>I agree to the <Link href="/terms" className="font-medium text-primary underline">Terms of Service</Link> and <Link href="/privacy" className="font-medium text-primary underline">Privacy Policy</Link>.</span>
              </label>
            </Field>

            {/* Submit */}
            <Field>
              <Button
                type="submit"
                className="h-11 w-full cursor-pointer"
                disabled={isSubmitting || !termsAccepted}
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
            </Field>

            {/* Sign in */}
            <Field>
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
