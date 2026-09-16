"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function useRequireAuth() {
  const router = useRouter();
  const auth = useAuth();
  useEffect(() => {
    if (!auth.loading && !auth.user) router.replace("/sign-in");
  }, [auth.loading, auth.user, router]);
  return auth;
}
