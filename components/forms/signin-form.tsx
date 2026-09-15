"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import Link from "next/link";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export type SignInResult =
  | { mfaRequired: false }
  | { mfaRequired: true; challengeToken: string };

type SignInFormProps = {
  onSignIn?: (email: string, password: string) => Promise<SignInResult>;
};

export function SignInForm({ onSignIn }: SignInFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      await onSignIn?.(email, password);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto space-y-4 sm:w-sm">
      <div className="flex flex-col space-y-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Welcome back
        </h1>

        <p className="text-balance text-sm text-muted-foreground">
          Sign in to your Balotiq account to manage your elections.
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
                Enter the email address associated with your account.
              </FieldDescription>
            </Field>

            {/* Password */}
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="h-11 border-2 border-primary"
              />
            </Field>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            {/* Submit */}
            <Field>
              <Button
                type="submit"
                className="h-11 w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </Field>

            {/* Sign up */}
            <Field>
              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Create an account
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
