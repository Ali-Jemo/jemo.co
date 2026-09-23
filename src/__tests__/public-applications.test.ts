// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * The public application surface must be aggregates-only.
 *
 * `/api/public/applications` used to list every applicant. It was first
 * hardened behind admin auth, then deleted outright — the admin listing at
 * `/api/admin/applications` already serves the full rows, so a second,
 * differently-authorized route reading the same table was pure blast radius.
 * These tests pin both halves of that decision.
 */

const statusCounts: Record<string, number> = {
  pending: 3,
  accepted: 2,
  rejected: 2,
};

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: () => ({
    from: () => {
      let status: string | null = null;
      const query: Record<string, unknown> = {
        select: () => query,
        eq: (_column: string, value: string) => {
          status = value;
          return query;
        },
        // Stands in for PostgREST's thenable query builder.
        then: (resolve: (value: unknown) => unknown) =>
          resolve({ count: status ? statusCounts[status] : 7, error: null }),
      };
      return query;
    },
  }),
}));

describe("/api/public/applications", () => {
  it("is deleted, not merely admin-gated", () => {
    // A route named "public" that can return applicant PII is one refactor
    // away from being un-gated again.
    const routeFile = path.join(
      process.cwd(),
      "src/app/api/public/applications/route.ts"
    );
    expect(existsSync(routeFile)).toBe(false);
  });

  it("exposes only non-PII aggregates through the feed", async () => {
    const { GET } = await import("@/app/api/public/applications/feed/route");

    const res = await GET(
      new NextRequest("http://localhost:3000/api/public/applications/feed")
    );
    expect(res.status).toBe(200);

    const body: Record<string, unknown> = await res.json();
    expect(Object.keys(body).sort()).toEqual([
      "accepted",
      "pending",
      "rejected",
      "total",
      "updatedAt",
    ]);
    expect(body).toMatchObject({
      total: 7,
      pending: 3,
      accepted: 2,
      rejected: 2,
    });
  });

  it("never carries applicant fields, even in the serialized payload", async () => {
    const { GET } = await import("@/app/api/public/applications/feed/route");

    const res = await GET(
      new NextRequest("http://localhost:3000/api/public/applications/feed")
    );
    const raw = await res.text();

    for (const leaked of [
      "contract_id",
      "email",
      "portfolio",
      "experience",
      "hours",
      "name",
    ]) {
      expect(raw).not.toContain(leaked);
    }
  });
});
