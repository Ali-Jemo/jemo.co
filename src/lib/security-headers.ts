/**
 * Single source of truth for every security header the site sets.
 *
 * Applied once, from src/proxy.ts, on the way out of the Worker. next.config
 * used to set the same list again, so every document carried two copies
 * (and Cloudflare's dashboard may add a third — remove that transform rule).
 *
 * Clerk production hosts are not hardcoded. *.clerk.accounts.dev stays for
 * development instances; CLERK_FRONTEND_API and the publishable key add the
 * real Frontend API. See src/lib/clerk-config.ts.
 */

import { clerkAllowedOrigins } from "@/lib/clerk-config";

/**
 * Supabase project origins. connect-src previously allowed ANY *.supabase.co
 * account, so an injected script could talk to an attacker-chosen project.
 */
const SUPABASE_ORIGIN = "https://okekfsfyydajyfarnzra.supabase.co";

/**
 * script-src keeps 'unsafe-inline' because Next.js 16 requires site-wide
 * dynamic rendering when nonces are used, which would disable static pages.
 * 'unsafe-eval' stays absent on purpose.
 */
export function buildCspHeader(): string {
  const clerk = clerkAllowedOrigins().join(" ");
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${clerk} https://challenges.cloudflare.com https://static.cloudflareinsights.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    `img-src 'self' data: blob: https://img.clerk.com ${clerk}`,
    `connect-src 'self' ${clerk} ${SUPABASE_ORIGIN} wss://${SUPABASE_ORIGIN.replace("https://", "")} https://cloudflareinsights.com`,
    `frame-src 'self' https://challenges.cloudflare.com ${clerk}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/** Build-time snapshot. Prefer buildCspHeader() at request time. */
export const cspHeader = buildCspHeader();

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
  "X-XSS-Protection": "0",
  "X-Robots-Tag": "noai, noimageai",
  "X-Permitted-Cross-Domain-Policies": "none",
};

/** The only response path that should attach these headers. */
export function applySecurityHeaders(headers: Headers): Headers {
  headers.set("Content-Security-Policy", buildCspHeader());
  for (const [key, value] of Object.entries(securityHeaders)) {
    headers.set(key, value);
  }
  return headers;
}
