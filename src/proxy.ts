import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { evaluateFirewall } from "./lib/firewall";
import { safeCompare } from "./lib/security";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
]);

const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.clerk.accounts.dev https://okekfsfyydajyfarnzra.supabase.co https://api.telegram.org https://*.supabase.co",
  "frame-src 'self' https://challenges.cloudflare.com https://*.clerk.accounts.dev",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");
export default clerkMiddleware(async (auth, req) => {
  // 1. Edge Firewall & WAF: block malicious attack tools, scrapers, exploit probes, and injections
  const decision = evaluateFirewall(req);
  if (decision.action === "BLOCK") {
    return new NextResponse(
      JSON.stringify({
        error: decision.reason,
        code: decision.code,
      }),
      {
        status: decision.status || 403,
        headers: {
          "Content-Type": "application/json",
          "X-Firewall-Status": "BLOCKED",
          "X-Firewall-Reason": decision.code || "VIOLATION",
          "Retry-After": "60",
        },
      }
    );
  }

  // 2. Protect authenticated pathways (Admin UI and Admin API)
  if (isProtectedRoute(req)) {
    const adminSecret = req.headers.get("x-admin-secret");
    const validSecret =
      adminSecret &&
      process.env.ADMIN_SECRET &&
      process.env.ADMIN_SECRET !== "jemo123" &&
      safeCompare(adminSecret, process.env.ADMIN_SECRET);

    if (!validSecret) {
      await auth.protect();
    }
  }

  const response = NextResponse.next();

  // Defense-in-depth security headers & Anti-Scraping / AI protection
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), browsing-topics=()");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Robots-Tag", "noai, noimageai");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
