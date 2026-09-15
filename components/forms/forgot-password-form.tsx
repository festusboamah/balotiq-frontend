"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type ForgotPasswordFormProps = React.ComponentProps<"form"> & {
  onRequestReset?: (email: string) => Promise<void> | void;
};

export function ForgotPasswordForm({
  className,
  onRequestReset,
  ...props
}: ForgotPasswordFormProps) {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      await onRequestReset?.(email);
      setSubmitted(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to send reset email.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto flex flex-col items-center justify-center max-w-md space-y-4 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Check your email
        </h1>

        <p className="text-balance text-sm text-muted-foreground">
          If an account exists for <span className="font-medium">{email}</span>,
          we&apos;ve sent a link to reset your password. It expires in 30 minutes.
        </p>

        <Link
          href="/sign-in"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      className={cn(
        "mx-auto flex flex-col gap-6 items-center justify-center max-w-md",
        className,
      )}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col space-y-1 text-center">
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Forgot your password?
          </h1>

          <p className="text-balance text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            autoComplete="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            className="h-11 border-2 border-primary"
            required
          />
        </Field>

        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}

        <Field>
          <Button
            type="submit"
            className="h-11 w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Remember your password?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
