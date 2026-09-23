import "server-only";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { checkRateLimit, getClientIp, isAdminUser, verifyAdminSecret } from "@/lib/security";
import { reportSecurityEvent } from "@/lib/security-audit";

/**
 * The single admin authentication chokepoint.
 *
 * Every admin route must call `requireAdmin` (or, in the composite case,
 * `authenticateAdmin`) rather than assembling its own checks. Before this
 * module existed the same 15-line "secret header OR verified Clerk admin"
 * block was copy-pasted into /api/admin/applications and
 * /api/admin/update-status, while the content routes used a third, secret-only
 * helper of their own. Each copy was a chance to drift, and one of them had
 * already drifted: the content API was unreachable with a Clerk session.
 *
 * Two independent defences live here:
 *   1. A per-route request budget (`checkRateLimit`), so one endpoint cannot be
 *      hammered.
 *   2. A *shared* failed-authentication counter keyed on IP across every admin
 *      route. Without it, an attacker's guesses-per-minute multiplied by the
 *      number of admin endpoints, since each route kept its own bucket.
 *
 * Lockout safety: the failure counter is keyed per IP, so an attacker can only
 * throttle themselves — never a legitimate admin at a different address. A
 * successful authentication short-circuits before the counter is consulted, so
 * a fat-fingered retry followed by a correct secret is never penalised.
 */

export type AdminActor = "admin-secret" | "clerk-admin";

export interface AdminSession {
  actor: AdminActor;
  /** Clerk user id. Null on the shared-secret path, which has no user. */
  userId: string | null;
  /** Trusted client IP, already consumed by the rate-limit decision. */
  ip: string;
}

export type AdminDenialReason = "unauthenticated" | "throttled";

export type AdminAuth =
  | { ok: true; session: AdminSession }
  | { ok: false; reason: AdminDenialReason; response: NextResponse };

export interface AdminGuardLimits {
  /** Short, stable route name — becomes the rate-limit bucket. */
  bucket: string;
  /** Requests allowed per window for this route. Defaults to 15. */
  limit?: number;
  /** Window length in milliseconds. Defaults to 60s. */
  windowMs?: number;
}

const DEFAULT_LIMIT = 15;
const DEFAULT_WINDOW_MS = 60_000;

/**
 * Shared across every admin route: 10 failed authentications per IP per
 * 5 minutes (~2 guesses/minute for the whole admin surface).
 */
const FAILURE_LIMIT = 10;
const FAILURE_WINDOW_MS = 5 * 60_000;

function tooManyRequests(resetTime: number): NextResponse {
  const retryAfter = Math.max(1, Math.ceil((resetTime - Date.now()) / 1000));
  return NextResponse.json(
    { error: "Too many requests" },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}

/**
 * Authenticates a request as admin WITHOUT applying a per-route rate limit.
 *
 * Prefer `requireAdmin`. Reach for this only when the route layers a second
 * scheme on top — /api/content/schema accepts an API key OR an admin, so it
 * rate-limits the request once and only then picks a scheme.
 *
 * Failure paths still record into the shared counter, so the brute-force
 * ceiling is identical however a route reaches this function.
 */
export async function authenticateAdmin(req: Request): Promise<AdminAuth> {
  const ip = getClientIp(req);

  if (verifyAdminSecret(req)) {
    return { ok: true, session: { actor: "admin-secret", userId: null, ip } };
  }

  try {
    const user = await currentUser();
    if (user && isAdminUser(user)) {
      return { ok: true, session: { actor: "clerk-admin", userId: user.id, ip } };
    }
  } catch {
    // Clerk unreachable or the session expired: treat it as unauthenticated
    // rather than surfacing a 500 from an auth check.
  }

  const failures = checkRateLimit(`admin_auth_fail:${ip}`, FAILURE_LIMIT, FAILURE_WINDOW_MS);
  if (!failures.allowed) {
    // Shared brute-force ceiling hit: an active attack signal worth pushing
    // to the admin chat (budget-limited so it cannot be spammed).
    void reportSecurityEvent({
      event: "security.admin_brute_force",
      title: "محاولات دخول متكررة فاشلة على واجهة الإدارة",
      details: { ip },
    });
    console.warn(
      JSON.stringify({
        audit: "admin.auth_throttled",
        at: new Date().toISOString(),
        ip,
      })
    );
    return { ok: false, reason: "throttled", response: tooManyRequests(failures.resetTime) };
  }

  return {
    ok: false,
    reason: "unauthenticated",
    response: NextResponse.json({ error: "unauthorized" }, { status: 401 }),
  };
}

/**
 * Rate limit then authenticate. The shape every admin route should use:
 *
 *   const auth = await requireAdmin(req, { bucket: "applications" });
 *   if (!auth.ok) return auth.response;
 */
export async function requireAdmin(
  req: Request,
  limits: AdminGuardLimits
): Promise<AdminAuth> {
  const ip = getClientIp(req);
  const perRoute = checkRateLimit(
    `admin:${limits.bucket}:${ip}`,
    limits.limit ?? DEFAULT_LIMIT,
    limits.windowMs ?? DEFAULT_WINDOW_MS
  );
  if (!perRoute.allowed) {
    return { ok: false, reason: "throttled", response: tooManyRequests(perRoute.resetTime) };
  }

  return authenticateAdmin(req);
}
