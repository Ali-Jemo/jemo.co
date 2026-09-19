import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/security";
import {
  validateApiKey,
  publishResearchObject,
  listResearchObjects,
  type PublishResearchInput,
} from "@/lib/research/store";

/**
 * GET /api/research
 * Lists and searches research objects with pagination and filtering.
 */
export async function GET(req: Request) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`research_get:${ip}`, 120, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || undefined)?.slice(0, 200);
  const field = (searchParams.get("field") || undefined)?.slice(0, 100);
  const type = (searchParams.get("type") || undefined)?.slice(0, 100);
  const rawLimit = parseInt(searchParams.get("limit") || "20", 10);
  const rawOffset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 100) : 20;
  const offset = Number.isFinite(rawOffset) ? Math.max(rawOffset, 0) : 0;

  const result = listResearchObjects({ q, field, type, limit, offset });

  return NextResponse.json({
    success: true,
    ...result,
  });
}

/**
 * POST /api/research
 * Publishes a new Research Object via automated client, agent, or CLI.
 * Requires Bearer API key or X-API-Key header.
 */
export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`research_post:${ip}`, 60, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please throttle your API requests." },
      { status: 429 }
    );
  }

  // Authenticate API key
  const authHeader = req.headers.get("Authorization");
  const xApiKey = req.headers.get("X-API-Key");
  const auth = validateApiKey(authHeader, xApiKey);

  if (!auth.valid) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: auth.error || "Valid API key required in 'Authorization: Bearer <key>' or 'X-API-Key' header.",
      },
      { status: 401 }
    );
  }

  try {
    const body = (await req.json()) as PublishResearchInput;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    if (!body.title || typeof body.title !== "string" || !body.title.trim() || body.title.length > 500) {
      return NextResponse.json(
        { error: "Missing required field", message: "Field 'title' must be a non-empty string (max 500 chars)." },
        { status: 400 }
      );
    }

    const paper = publishResearchObject(body, auth.researcher);

    return NextResponse.json(
      {
        success: true,
        message: "Research object successfully registered in JEMO Discovery Registry.",
        id: paper.id,
        slug: paper.slug,
        url: `https://jemo.co/research/${paper.slug}`,
        data: paper,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to publish research object";
    console.error("API /api/research POST error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
