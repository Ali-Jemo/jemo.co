import { NextResponse } from "next/server";
import { CONTENT_REGISTRY, registryGroups } from "@/lib/content/registry";
import { isAuthorizedAdmin, listRegistryStatus } from "@/lib/content/server";
import { checkRateLimit, getClientIp } from "@/lib/security";
import { validateApiKey, publishResearchObject } from "@/lib/research/store";
/**
 * The dashboard's bootstrap call: every editable collection with its field
 * schema, wiring state, and how many live overrides it currently has.
 *
 * Deliberately excludes the committed defaults — they ship inside the merged
 * items from /api/content/[key] and would otherwise bloat this response.
 */
export async function GET(req: Request) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`content_schema:${ip}`, 30, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const status = await listRegistryStatus();
    const statusByKey = new Map(status.map((s) => [s.key, s]));

    const groups = registryGroups().map(({ group, collections }) => ({
      group,
      collections: collections.map((spec) => {
        const row = statusByKey.get(spec.key);
        return {
          key: spec.key,
          label: spec.label,
          labelEn: spec.labelEn,
          kind: spec.kind,
          description: spec.description,
          wired: spec.wired,
          fields: spec.fields,
          idField: spec.idField ?? "id",
          identityFields: spec.identityFields ?? null,
          defaultCount: spec.defaults.length,
          overrideCount: row?.overrideCount ?? 0,
          updatedAt: row?.updatedAt ?? null,
          editing: Boolean(row?.rowsFound),
        };
      }),
    }));

    return NextResponse.json({
      groups,
      totals: {
        collections: CONTENT_REGISTRY.length,
        wired: CONTENT_REGISTRY.filter((c) => c.wired).length,
        edited: status.filter((s) => s.rowsFound).length,
      },
    });
  } catch (err) {
    console.error("Content schema GET error:", err);
    return NextResponse.json({ error: "Failed to retrieve schema" }, { status: 500 });
  }
}

/**
 * POST /api/content/schema
 * Handles programmatic research object registration matching CLI & cURL examples.
 */
export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`content_schema_post:${ip}`, 60, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const authHeader = req.headers.get("Authorization");
  const xApiKey = req.headers.get("X-API-Key");
  const auth = validateApiKey(authHeader, xApiKey);

  if (!auth.valid && !isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { error: "unauthorized", message: auth.error || "Valid Bearer API key required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    if (body?.type === "research_object" || body?.title) {
      const paper = publishResearchObject(
        {
          title: body.title || "Automated Benchmark Discovery",
          field: body.field || "Systems & AI",
          findings: body.findings || body.abstract || "Auto-registered research object",
          question: body.question,
          researchType: body.researchType || body.research_type || "Experiment",
        },
        auth.researcher
      );

      return NextResponse.json(
        {
          success: true,
          message: "Research object registered successfully",
          id: paper.id,
          slug: paper.slug,
          url: `https://jemo.co/research/${paper.slug}`,
          data: paper,
        },
        { status: 201 }
      );
    }

    return NextResponse.json({ error: "Unsupported schema type" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: "Failed to process schema registration", message }, { status: 500 });
  }
}
