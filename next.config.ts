import type { NextConfig } from "next";

// docs/planning-reference/10 §11: "Content Security Policy and secure
// browser headers." The backend's own SecurityHeadersMiddleware covers the
// API; this covers pages Next.js serves directly.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

// CSP is production-only: `next dev`'s HMR client opens its own same-origin
// WebSocket, and CSP's connect-src rules for ws:// vs 'self' aren't
// consistent enough across browsers to risk silently breaking the dev
// server. 'unsafe-inline' on script-src and style-src is needed because
// Next's own hydration payload and critical CSS are inlined with no nonce.
if (process.env.NODE_ENV === "production") {
  securityHeaders.push({
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // static.cloudflareinsights.com: Cloudflare's own analytics beacon,
      // auto-injected at the edge for any zone proxied through Cloudflare --
      // harmless to allow even on origins (like Vercel) that aren't behind it.
      "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.balotiq.com https://cloudflareinsights.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
    ].join("; "),
  });
}

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
