// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { authenticateAdmin, requireAdmin, type AdminAuth } from "@/lib/admin-guard";

const { currentUserMock } = vi.hoisted(() => ({ currentUserMock: vi.fn() }));

vi.mock("@clerk/nextjs/server", () => ({
  currentUser: () => currentUserMock(),
}));

const STRONG_SECRET = "s3cret-2f9a4c7e1b6d8035a1c0e4f7";

/**
 * Each test uses its own source IP so the guard's in-memory counters (per-route
 * bucket and the shared failure counter) start clean without a reset hook.
 */
function req(ip: string, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest("https://jemo.co/api/admin/applications", {
    headers: { "x-forwarded-for": ip, ...headers },
  });
}

function granted(result: AdminAuth) {
  if (!result.ok) {
    throw new Error(`expected a grant, got ${result.response.status} (${result.reason})`);
  }
  return result.session;
}

function denied(result: AdminAuth) {
  if (result.ok) throw new Error("expected a denial, got a grant");
  return result;
}

const originalSecret = process.env.ADMIN_SECRET;

beforeEach(() => {
  currentUserMock.mockReset();
  currentUserMock.mockResolvedValue(null);
  delete process.env.ADMIN_EMAILS;
  process.env.ADMIN_SECRET = STRONG_SECRET;
});

afterEach(() => {
  if (originalSecret === undefined) delete process.env.ADMIN_SECRET;
  else process.env.ADMIN_SECRET = originalSecret;
});

describe("admin-guard: the two authentication paths", () => {
  it("grants the shared-secret path and attributes the actor", async () => {
    const session = granted(
      await requireAdmin(req("10.1.0.1", { "x-admin-secret": STRONG_SECRET }), {
        bucket: "applications",
      })
    );

    expect(session.actor).toBe("admin-secret");
    expect(session.userId).toBeNull();
    expect(session.ip).toBe("10.1.0.1");
  });

  it("grants the Clerk path for a user carrying the admin role claim", async () => {
    // The secret path must not be doing the work here.
    process.env.ADMIN_SECRET = "jemo123";
    currentUserMock.mockResolvedValue({
      id: "user_2abc",
      publicMetadata: { role: "admin" },
      emailAddresses: [],
    });

    const session = granted(
      await requireAdmin(req("10.1.0.2"), { bucket: "applications" })
    );

    expect(session.actor).toBe("clerk-admin");
    expect(session.userId).toBe("user_2abc");
  });

  it("refuses a signed-in user who is not an admin", async () => {
    currentUserMock.mockResolvedValue({
      id: "user_2plain",
      publicMetadata: {},
      emailAddresses: [{ emailAddress: "someone@example.com" }],
    });

    const result = denied(await requireAdmin(req("10.1.0.3"), { bucket: "applications" }));
    expect(result.reason).toBe("unauthenticated");
    expect(result.response.status).toBe(401);
  });

  it("treats a Clerk outage as unauthenticated rather than a 500", async () => {
    currentUserMock.mockRejectedValue(new Error("clerk unavailable"));

    const result = denied(await requireAdmin(req("10.1.0.4"), { bucket: "applications" }));
    expect(result.response.status).toBe(401);
  });
});

describe("admin-guard: the secret strength gate", () => {
  it.each(["jemo123", "changeme", "short", ""])(
    "rejects the weak/default secret %j even when sent verbatim",
    async (weak) => {
      process.env.ADMIN_SECRET = weak;

      const result = denied(
        await requireAdmin(req("10.2.0.1", { "x-admin-secret": weak }), {
          bucket: "applications",
        })
      );
      expect(result.response.status).toBe(401);
    }
  );

  it("rejects a well-formed but wrong secret", async () => {
    const result = denied(
      await requireAdmin(
        req("10.2.0.2", { "x-admin-secret": "s3cret-2f9a4c7e1b6d8035a1c0e4f7x" }),
        { bucket: "applications" }
      )
    );
    expect(result.response.status).toBe(401);
  });
});

describe("admin-guard: rate limiting", () => {
  it("throttles one route after its own budget, with a Retry-After", async () => {
    const ip = "10.3.0.1";
    for (let i = 0; i < 3; i++) {
      granted(await requireAdmin(req(ip, { "x-admin-secret": STRONG_SECRET }), {
        bucket: "applications",
        limit: 3,
      }));
    }

    const result = denied(
      await requireAdmin(req(ip, { "x-admin-secret": STRONG_SECRET }), {
        bucket: "applications",
        limit: 3,
      })
    );
    expect(result.reason).toBe("throttled");
    expect(result.response.status).toBe(429);
    expect(Number(result.response.headers.get("Retry-After"))).toBeGreaterThan(0);
  });

  it("throttles brute force across routes, not per route", async () => {
    const ip = "10.3.0.2";
    // Ten wrong guesses, deliberately spread over different buckets — exactly
    // the pattern that used to multiply an attacker's budget by the number of
    // admin endpoints, because each kept its own counter.
    const buckets = ["applications", "update-status", "content", "schema"];
    for (let i = 0; i < 10; i++) {
      const result = denied(
        await requireAdmin(req(ip, { "x-admin-secret": `guess-${i}` }), {
          bucket: buckets[i % buckets.length]!,
          limit: 15,
        })
      );
      expect(result.reason).toBe("unauthenticated");
      expect(result.response.status).toBe(401);
    }

    // The eleventh attempt is refused for the whole surface, on a bucket it has
    // never touched before.
    const result = denied(
      await requireAdmin(req(ip, { "x-admin-secret": "guess-final" }), {
        bucket: "applications",
        limit: 15,
      })
    );
    expect(result.reason).toBe("throttled");
    expect(result.response.status).toBe(429);
  });

  it("does not penalise a valid admin who mistypes first", async () => {
    const ip = "10.3.0.3";
    for (let i = 0; i < 5; i++) {
      denied(
        await requireAdmin(req(ip, { "x-admin-secret": `typo-${i}` }), {
          bucket: "applications",
        })
      );
    }

    granted(
      await requireAdmin(req(ip, { "x-admin-secret": STRONG_SECRET }), {
        bucket: "applications",
      })
    );
  });

  it("keeps failures on one IP from locking out another", async () => {
    for (let i = 0; i < 12; i++) {
      await authenticateAdmin(req("10.3.0.4", { "x-admin-secret": `guess-${i}` }));
    }

    granted(
      await requireAdmin(req("10.3.0.5", { "x-admin-secret": STRONG_SECRET }), {
        bucket: "applications",
      })
    );
  });
});

describe("admin-guard: route integration", () => {
  it("protects /api/admin/applications without a session or secret", async () => {
    process.env.ADMIN_SECRET = "jemo123";
    const { GET } = await import("@/app/api/admin/applications/route");

    const res = await GET(req("10.4.0.1"));
    expect(res.status).toBe(401);
  });

  it("switches to 429 once the shared failure counter is exhausted", async () => {
    process.env.ADMIN_SECRET = "jemo123";
    const { GET } = await import("@/app/api/admin/applications/route");
    const ip = "10.4.0.2";

    // The route's own bucket allows 15, so only the shared counter can stop it.
    for (let i = 0; i < 10; i++) {
      expect((await GET(req(ip, { "x-admin-secret": `guess-${i}` }))).status).toBe(401);
    }
    expect((await GET(req(ip, { "x-admin-secret": "guess-final" }))).status).toBe(429);
  });
});
