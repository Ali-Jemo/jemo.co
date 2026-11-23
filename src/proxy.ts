import { clerkMiddleware, createRouteMatcher, currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { isClerkServerConfigured, isValidClerkSecretKey } from "./lib/clerk-config";
import { evaluateFirewall } from "./lib/firewall";
import { isAdminUser, verifyAdminSecret } from "./lib/security";
import { applySecurityHeaders } from "./lib/security-headers";
import { SITE_URL } from "./lib/site";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
]);

// CSP and the other security headers are attached here only. next.config used
// to emit the same list, which duplicated every header on the wire.
const hasClerkKeys = isClerkServerConfigured() && isValidClerkSecretKey(process.env.CLERK_SECRET_KEY);

function withSecurity(response: NextResponse): NextResponse {
  applySecurityHeaders(response.headers);
  return response;
}

function redirectToHttps(req: NextRequest): NextResponse | null {
  const proto = req.headers.get("x-forwarded-proto");
  if (proto !== "http") return null;
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (!host) return null;
  const hostname = host.split(":")[0].toLowerCase();
  // Local `next dev` / `next start` is plain HTTP and often reports
  // x-forwarded-proto=http. Redirecting those hosts loops onto a TLS port
  // that is not listening. Production hosts still upgrade.
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]" || hostname === "::1") {
    return null;
  }
  const destination = new URL(req.nextUrl.pathname + req.nextUrl.search, `https://${host}`);
  return withSecurity(NextResponse.redirect(destination, 308));
}

const middlewareHandler = async (auth: { protect: () => Promise<unknown> }, req: NextRequest) => {
  const httpsRedirect = redirectToHttps(req);
  if (httpsRedirect) return httpsRedirect;

  // 1. Edge Firewall & WAF: block malicious attack tools, scrapers, exploit probes, and injections
  const decision = evaluateFirewall(req);
  if (decision.action === "BLOCK") {
    return withSecurity(new NextResponse(
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
      })
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

  const path = req.nextUrl.pathname === "/" ? "" : req.nextUrl.pathname;
  response.headers.set("Link", `<${SITE_URL}${path}>; rel="canonical"`);

  // Defense-in-depth security headers. This is the only place they are set;
  // Cloudflare dashboard header transforms should be removed or they duplicate.
  return withSecurity(response);
};

export default hasClerkKeys
  ? clerkMiddleware(middlewareHandler)
  : async (req: NextRequest) => {
      // If a handshake token was sent while Clerk is unconfigured, strip it to break browser loop
      if (req.nextUrl.searchParams.has("__clerk_handshake") || req.nextUrl.searchParams.has("__clerk_db_jwt")) {
        const url = req.nextUrl.clone();
        url.searchParams.delete("__clerk_handshake");
        url.searchParams.delete("__clerk_db_jwt");
        return withSecurity(NextResponse.redirect(url));
      }

      if (isProtectedRoute(req) && req.nextUrl.pathname.startsWith("/api/")) {
        const validSecret = verifyAdminSecret(req);
        if (!validSecret) {
          return withSecurity(new NextResponse(
            JSON.stringify({ error: "Authentication not configured" }),
            { status: 503, headers: { "Content-Type": "application/json" } }
          ));
        }
      }
      // /admin itself renders an explanation when Clerk is not configured.
      return middlewareHandler({ protect: async () => {} }, req);
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
