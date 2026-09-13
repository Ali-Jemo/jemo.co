import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { evaluateFirewall } from "./lib/firewall";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
]);

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

  // 2. Protect authenticated pathways
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  const response = NextResponse.next();

  // Defense-in-depth security headers & Anti-Scraping / AI protection
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
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
