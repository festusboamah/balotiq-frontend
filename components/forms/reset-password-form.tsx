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

type ResetPasswordFormProps = React.ComponentProps<"form"> & {
  onResetPassword?: (password: string) => Promise<void> | void;
};

export function ResetPasswordForm({
  className,
  onResetPassword,
  ...props
}: ResetPasswordFormProps) {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await onResetPassword?.(password);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to reset password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Create a new password
          </h1>

          <p className="text-balance text-sm text-muted-foreground">
            Choose a new password for your Balotiq account.
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>

          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            className="h-11 border-2 border-primary"
            minLength={8}
            required
          />

          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>

          <Input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.target.value)}
            className="h-11 border-2 border-primary"
            minLength={8}
            required
          />
        </Field>

        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}

        <Field>
          <Button
            type="submit"
            className="h-11 w-full cursor-pointer bg-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating password..." : "Reset Password"}
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
