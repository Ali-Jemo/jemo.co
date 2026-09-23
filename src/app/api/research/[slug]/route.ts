import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/security";
import {
  validateApiKey,
  getResearchObject,
  replicateResearchObject,
  type ReplicationInput,
} from "@/lib/research/store";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/research/[slug]
 * Retrieves a single research object by slug or id.
 */
export async function GET(req: Request, context: RouteContext) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`research_slug_get:${ip}`, 120, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { slug } = await context.params;
  const paper = getResearchObject(slug);

  if (!paper) {
    return NextResponse.json(
      { error: "Not Found", message: `Research object '${slug}' was not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: paper,
  });
}

/**
 * POST /api/research/[slug]
 * Records a peer replication or challenge against this research object.
 */
export async function POST(req: Request, context: RouteContext) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`research_replicate:${ip}`, 60, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Authenticate API key
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

    const repResult = replicateResearchObject(slug, {
      ...body,
      author: auth.researcher?.name || body.author || "مدقق نظير معتمد",
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
    console.error("API /api/research/[slug] POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
