export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.balotiq.com";

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  accessToken?: string;
  // Only auth endpoints need the browser to send/receive the httpOnly
  // refresh_token cookie — every other request is authenticated purely by
  // the bearer access token, so this defaults to off.
  withCredentials?: boolean;
  headers?: Record<string, string>;
};

function _buildHeaders(options: RequestOptions): Record<string, string> {
  const headers: Record<string, string> = { ...options.headers };
  const isFormData = options.body instanceof FormData;
  if (options.body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (options.accessToken) {
    headers["Authorization"] = `Bearer ${options.accessToken}`;
  }
  return headers;
}

async function _fetchRaw(path: string, options: RequestOptions): Promise<Response> {
  const isFormData = options.body instanceof FormData;
  return fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: _buildHeaders(options),
    body: isFormData
      ? (options.body as FormData)
      : options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
    credentials: options.withCredentials ? "include" : "same-origin",
  });
}

async function apiRequestBlob(path: string, options: RequestOptions = {}): Promise<Blob> {
  const response = await _fetchRaw(path, options);
  if (!response.ok) return _throwApiError(path, response);
  return response.blob();
}

// The backend's error envelope is always {error: {code, message, details}}
// — surface it as a typed ApiError so callers can branch on `code` (e.g.
// ACCOUNT_LOCKED) instead of parsing message strings.
async function _throwApiError(path: string, response: Response): Promise<never> {
  let code = "UNKNOWN_ERROR";
  let message = `Request to ${path} failed with status ${response.status}`;
  try {
    const body = await response.json();
    if (body?.error) {
      code = body.error.code ?? code;
      message = body.error.message ?? message;
    }
  } catch {
    // Response body wasn't JSON (e.g. a proxy error page) — fall back to
    // the generic message above.
  }
  throw new ApiError(response.status, code, message);
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await _fetchRaw(path, options);
  if (response.status === 204) {
    return undefined as T;
  }
  if (!response.ok) {
    return _throwApiError(path, response);
  }
  return (await response.json()) as T;
}

export function apiGet<T>(path: string, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "GET" });
}

export function apiGetBlob(path: string, options?: RequestOptions): Promise<Blob> {
  return apiRequestBlob(path, { ...options, method: "GET" });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function apiPost<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "POST", body });
}

export function apiPatch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "PATCH", body });
}

export function apiDelete<T>(path: string, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "DELETE" });
}
