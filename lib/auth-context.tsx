"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { apiDelete, apiGet, apiGetBlob, apiPatch, apiPost, ApiError, type RequestOptions } from "@/lib/api-client";

export type MyOrganization = { id: string; name: string; slug: string; role: string };
export type CurrentUser = { id: string; email: string; is_super_admin: boolean; mfa_enabled: boolean; organizations: MyOrganization[] };
export type LoginResult = { mfaRequired: false } | { mfaRequired: true; challengeToken: string };

type AuthContextValue = {
  user: CurrentUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  completeMfaLogin: (challengeToken: string, code: string) => Promise<void>;
  register: (email: string, password: string, termsAccepted: boolean) => Promise<void>;
  logout: () => Promise<void>;
  authGet: <T>(path: string) => Promise<T>;
  authGetBlob: (path: string) => Promise<Blob>;
  authPost: <T>(path: string, body?: unknown, headers?: Record<string, string>) => Promise<T>;
  authPatch: <T>(path: string, body?: unknown) => Promise<T>;
  authDelete: <T>(path: string) => Promise<T>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshPromise = useRef<Promise<string> | null>(null);

  const loadUser = useCallback(async (token: string) => {
    setUser(await apiGet<CurrentUser>("/api/v1/auth/me", { accessToken: token }));
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshPromise.current) {
      refreshPromise.current = apiPost<{ access_token: string }>("/api/v1/auth/refresh", undefined, { withCredentials: true })
        .then(({ access_token }) => {
          setAccessToken(access_token);
          return access_token;
        })
        .finally(() => { refreshPromise.current = null; });
    }
    return refreshPromise.current;
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const token = await refreshAccessToken();
        if (active) await loadUser(token);
      } catch {
        if (active) { setAccessToken(null); setUser(null); }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [loadUser, refreshAccessToken]);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    const result = await apiPost<{ mfa_required: boolean; access_token: string | null; mfa_challenge_token: string | null }>(
      "/api/v1/auth/login", { email, password }, { withCredentials: true },
    );
    if (result.mfa_required) return { mfaRequired: true, challengeToken: result.mfa_challenge_token! };
    setAccessToken(result.access_token!);
    await loadUser(result.access_token!);
    return { mfaRequired: false };
  }, [loadUser]);

  const completeMfaLogin = useCallback(async (challengeToken: string, code: string) => {
    const result = await apiPost<{ access_token: string }>("/api/v1/auth/mfa/login-verify", { mfa_challenge_token: challengeToken, code }, { withCredentials: true });
    setAccessToken(result.access_token);
    await loadUser(result.access_token);
  }, [loadUser]);

  const register = useCallback(async (email: string, password: string, termsAccepted: boolean) => {
    await apiPost("/api/v1/auth/register", { email, password, terms_accepted: termsAccepted });
    try {
      const result = await login(email, password);
      if (result.mfaRequired) throw new Error("Existing account requires MFA");
    } catch {
      throw new ApiError(409, "REGISTER_SIGN_IN_FAILED", "An account with this email may already exist. Try signing in instead, or use a different email.");
    }
  }, [login]);

  const logout = useCallback(async () => {
    try { await apiPost("/api/v1/auth/logout", undefined, { withCredentials: true }); }
    finally { setAccessToken(null); setUser(null); }
  }, []);

  const authRequest = useCallback(async <T,>(call: (options: RequestOptions) => Promise<T>) => {
    if (!accessToken) throw new ApiError(401, "NOT_AUTHENTICATED", "Not signed in.");
    try {
      return await call({ accessToken });
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;
      if (error.status === 403 && error.code === "STEP_UP_REQUIRED") {
        const password = window.prompt("Re-enter your password to continue:");
        if (password === null) throw error;
        const mfaCode = user?.mfa_enabled ? window.prompt("Enter your authenticator code:") : null;
        if (user?.mfa_enabled && mfaCode === null) throw error;
        await apiPost("/api/v1/auth/step-up/verify", { password, mfa_code: mfaCode }, { accessToken });
        return await call({ accessToken });
      }
      if (error.status !== 401) throw error;
      try {
        const token = await refreshAccessToken();
        return await call({ accessToken: token });
      } catch {
        setAccessToken(null); setUser(null);
        throw error;
      }
    }
  }, [accessToken, refreshAccessToken, user]);

  const authGet = useCallback(<T,>(path: string) => authRequest<T>((options) => apiGet(path, options)), [authRequest]);
  const authGetBlob = useCallback((path: string) => authRequest((options) => apiGetBlob(path, options)), [authRequest]);
  const authPost = useCallback(<T,>(path: string, body?: unknown, headers?: Record<string, string>) => authRequest<T>((options) => apiPost(path, body, { ...options, headers })), [authRequest]);
  const authPatch = useCallback(<T,>(path: string, body?: unknown) => authRequest<T>((options) => apiPatch(path, body, options)), [authRequest]);
  const authDelete = useCallback(<T,>(path: string) => authRequest<T>((options) => apiDelete(path, options)), [authRequest]);

  return <AuthContext.Provider value={{ user, accessToken, loading, login, completeMfaLogin, register, logout, authGet, authGetBlob, authPost, authPatch, authDelete }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within an AuthProvider");
  return value;
}
