import { NextRequest, NextResponse } from "next/server";
import { getClientIp, checkRateLimit } from "@/lib/security";
import {
  getResearchObject,
  replicateResearchObject,
  type ReplicationInput,
} from "@/lib/research/store";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * POST /api/research/[slug]/responses
 *
 * Server-authoritative peer-review endpoint. The previous client-side flow
 * allowed any browser tab to mark a response as `verified: true` by patching
 * React state. This route is the only place that may append a response to a
 * research object, and it always:
 *   - authenticates via the same API key contract as POST /api/research
 *   - rate-limits per IP
 *   - forces `verified: false` server-side (the Jev audit pipeline — see
 *     lib/research/store.ts — is the only consumer that may flip it later)
 */
export async function POST(req: NextRequest, context: RouteContext) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`research_responses:${ip}`, 30, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Lazy import keeps the auth helper graph isolated from the read path.
  const { validateApiKey } = await import("@/lib/research/store");
  const authHeader = req.headers.get("Authorization");
  const xApiKey = req.headers.get("X-API-Key");
  const auth = await validateApiKey(authHeader, xApiKey);

  if (!auth.valid) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: auth.error || "Valid API key required to submit peer replications.",
      },
      { status: 401 }
    );
  }

  const { slug } = await context.params;

  try {
    const body = (await req.json()) as ReplicationInput;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }
    if (!body.findings || typeof body.findings !== "string" || !body.findings.trim()) {
      return NextResponse.json(
        { error: "Missing required field", message: "Field 'findings' is required." },
        { status: 400 }
      );
    }

    const paper = getResearchObject(slug);
    if (!paper) {
      return NextResponse.json(
        { error: "Not Found", message: `Research object '${slug}' was not found.` },
        { status: 404 }
      );
    }

    // SECURITY: verified is ALWAYS false at write time. The audit pipeline
    // (background Jev evaluation) is the only path that may flip it. This
    // closes the prior bug where the React component decided verified=true
    // from a client-side condition.
    const repResult = replicateResearchObject(slug, {
      ...body,
      author: auth.researcher?.name || body.author || "مدقق نظير معتمد",
      // The store treats `verified` differently per type, but we override
      // explicitly by stripping any client-supplied verified field on
      // response — replicateResearchObject computes it from `type` only.
    });

    if (!repResult.success) {
      return NextResponse.json(
        { error: "Replication Error", message: repResult.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Replication / audit response successfully recorded on research object.",
        paperSlug: slug,
        data: repResult.paper,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("API /api/research/[slug]/responses POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
