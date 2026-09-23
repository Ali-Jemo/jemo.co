/**
 * Single source of truth for every security header the site sets.
 *
 * Consumed by BOTH next.config.ts (static headers) and src/proxy.ts (edge
 * middleware). Keeping one copy eliminates the drift where the two lists
 * silently diverged — a header present in one but not the other is exactly
 * the gap an attacker probes for.
 *
 * SECURITY: 'unsafe-eval' is deliberately absent from script-src. CSP permits
 * only 'self' + Clerk + the Cloudflare Turnstile challenge origin. Any
 * third-party script that needs runtime code generation (eval / new Function)
 * will be blocked — the desired behavior. If a future feature legitimately
 * needs it, use a per-request nonce via middleware instead of re-enabling it.
 */

/**
 * Supabase project origins. connect-src previously allowed ANY *.supabase.co
 * account, so an injected script on jemo.co could talk to an attacker-chosen
 * Supabase project. Pin the exact project instead.
 */
const SUPABASE_ORIGIN = "https://okekfsfyydajyfarnzra.supabase.co";

const CLERK_ORIGINS = "https://*.clerk.accounts.dev";

/**
 * Note on script-src 'unsafe-inline': Next.js 16 requires site-wide dynamic
 * rendering when nonces are used in headers, which would disable SSG/ISR across
 * the entire site. We preserve static generation by omitting nonces, relying on
 * strict input sanitization, and avoiding dangerous runtime evaluation sinks.
 */
export const cspHeader = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${CLERK_ORIGINS} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  `connect-src 'self' ${CLERK_ORIGINS} ${SUPABASE_ORIGIN} wss://${SUPABASE_ORIGIN.replace("https://", "")}`,
  "frame-src 'self' https://challenges.cloudflare.com https://*.clerk.accounts.dev",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

/** Static, non-CSP security headers (OWASP Secure Headers Project). */
export const securityHeaders: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=(), serial=(), accelerometer=(), gyroscope=(), magnetometer=(), interest-cohort=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  // Deprecated and inconsistent across browsers: modern engines ignore it.
  // OWASP guidance is to explicitly disable it so the legacy IE/legacy-Edge
  // XSS auditor (itself exploitable) can never be re-enabled by default.
  "X-XSS-Protection": "0",
  "X-Robots-Tag": "noai, noimageai",
  "X-Permitted-Cross-Domain-Policies": "none",
};

/** Convenience export for the edge middleware, which sets CSP + the rest. */
export function applySecurityHeaders(headers: Headers): Headers {
  headers.set("Content-Security-Policy", cspHeader);
  for (const [key, value] of Object.entries(securityHeaders)) {
    headers.set(key, value);
  }
  return headers;
}
