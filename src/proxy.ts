import { clerkMiddleware, createRouteMatcher, currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { evaluateFirewall } from "./lib/firewall";
import { isAdminUser, verifyAdminSecret } from "./lib/security";
import { applySecurityHeaders } from "./lib/security-headers";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
]);

// CSP and all other security headers live in src/lib/security-headers.ts —
// the single copy shared with next.config.ts so the two can never drift.
function isValidClerkSecretKey(key: string | undefined): boolean {
  if (!key) return false;
  const k = key.trim();
  return (
    (k.startsWith("sk_test_") || k.startsWith("sk_live_")) &&
    !k.includes("dGVzdGtleQ") &&
    !k.includes("YOUR_KEY") &&
    k !== "sk_test_..." &&
    k.length > 30
  );
}

const hasClerkKeys = Boolean(
  (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.CLERK_PUBLISHABLE_KEY) &&
  isValidClerkSecretKey(process.env.CLERK_SECRET_KEY)
);

const middlewareHandler = async (auth: { protect: () => Promise<unknown> }, req: NextRequest) => {
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

  // 2. Protect authenticated pathways (Admin UI and Admin API).
  // verifyAdminSecret enforces the strength gate (length, rejected defaults)
  // before constant-time comparison.
  if (isProtectedRoute(req)) {
    const validSecret = verifyAdminSecret(req);

    if (!validSecret) {
      if (req.nextUrl.pathname.startsWith("/api/")) {
        if (hasClerkKeys) {
          const u = await currentUser().catch(() => null);
          if (!isAdminUser(u)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
        } else {
          return NextResponse.json({ error: "forbidden" }, { status: 403 });
        }
      }
      await auth.protect();
    }
  }
  const response = NextResponse.next();

  const p = req.nextUrl.pathname;
  if (p.startsWith("/_next/") || /\.[a-z0-9]+$/i.test(p)) {
    response.headers.set("Cache-Control", "public, max-age=300, must-revalidate");
  }

  // Defense-in-depth security headers & Anti-Scraping / AI protection
  // (CSP + the shared set, from the single module both entrypoints use).
  applySecurityHeaders(response.headers);
  return response;
};

export default hasClerkKeys
  ? clerkMiddleware(middlewareHandler)
  : async (req: NextRequest) => {
      // If a handshake token was sent while Clerk is unconfigured, strip it to break browser loop
      if (req.nextUrl.searchParams.has("__clerk_handshake") || req.nextUrl.searchParams.has("__clerk_db_jwt")) {
        const url = req.nextUrl.clone();
        url.searchParams.delete("__clerk_handshake");
        url.searchParams.delete("__clerk_db_jwt");
        return NextResponse.redirect(url);
      }

      if (isProtectedRoute(req)) {
        const validSecret = verifyAdminSecret(req);
        if (!validSecret) {
          return new NextResponse(
            JSON.stringify({ error: "Authentication not configured" }),
            { status: 503, headers: { "Content-Type": "application/json" } }
          );
        }
      }
      return middlewareHandler({ protect: async () => {} }, req);
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
