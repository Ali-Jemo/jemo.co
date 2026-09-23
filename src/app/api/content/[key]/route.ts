import { NextResponse } from "next/server";
import { getSpec } from "@/lib/content/registry";
import {
  getCollectionPayload,
  resetCollection,
  saveCollection,
} from "@/lib/content/server";
import { requireAdmin } from "@/lib/admin-guard";
import { isSafeHttpUrl } from "@/lib/security-client";
interface RouteContext {
  params: Promise<{ key: string }>;
}

async function guard(req: Request, context: RouteContext) {
  // Same rate limiting and dual auth as /api/admin/*, from the same module.
  const auth = await requireAdmin(req, { bucket: "content", limit: 30 });
  if (!auth.ok) return { error: auth.response };

  const { key } = await context.params;
  const spec = getSpec(key);
  if (!spec) {
    return { error: NextResponse.json({ error: `unknown collection` }, { status: 404 }) };
  }
  return { spec, key };
}

/** Merged items for one collection: live overrides on top of the defaults. */
export async function GET(req: Request, context: RouteContext) {
  const resolved = await guard(req, context);
  if ("error" in resolved) return resolved.error;

  try {
    const payload = await getCollectionPayload(resolved.key);
    return NextResponse.json({
      ...payload,
      label: resolved.spec.label,
      kind: resolved.spec.kind,
      wired: resolved.spec.wired,
      fields: resolved.spec.fields,
    });
  } catch (err) {
    console.error("Content GET error:", err);
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}

/**
 * Desired-state save. Body: { items: [...] } — the complete list the site
 * should render. Omitted defaults are hidden rather than deleted.
 */
export async function PUT(req: Request, context: RouteContext) {
  const resolved = await guard(req, context);
  if ("error" in resolved) return resolved.error;

  try {
    const body = await req.json();
    const items = body?.items;
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "body.items must be an array" }, { status: 400 });
    }
    // Prevent payload memory bombs: max 200 items, max total stringified size 500KB
    if (items.length > 200) {
      return NextResponse.json({ error: "too many items" }, { status: 400 });
    }
    let byteSize = 0;
    for (const item of items) {
      byteSize += typeof item === "string" ? item.length : JSON.stringify(item)?.length ?? 0;
      if (byteSize > 512_000) {
        return NextResponse.json({ error: "payload too large" }, { status: 413 });
      }
    }
    if (resolved.spec.kind === "document" && items.length !== 1) {
      return NextResponse.json({ error: "a document takes exactly one item" }, { status: 400 });
    }

    const urlFields = resolved.spec.fields.filter((f) => f.type === "url");
    if (urlFields.length > 0) {
      for (const item of items) {
        if (!item || typeof item !== "object") continue;
        for (const field of urlFields) {
          const val = (item as Record<string, unknown>)[field.key];
          if (val !== undefined && val !== null && val !== "") {
            if (!isSafeHttpUrl(val)) {
              return NextResponse.json(
                { error: "invalid_url_field", field: field.key },
                { status: 400 }
              );
            }
          }
        }
      }
    }
    const result = await saveCollection(resolved.key, items);
    return NextResponse.json({ ok: true, saved: items.length, ...result });
  } catch (err) {
    console.error("Content PUT error:", err);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}

/** Drops every edit and restores the committed defaults. */
export async function DELETE(req: Request, context: RouteContext) {
  const resolved = await guard(req, context);
  if ("error" in resolved) return resolved.error;

  try {
    await resetCollection(resolved.key);
    return NextResponse.json({ ok: true, message: "restored committed defaults" });
  } catch (err) {
    console.error("Content DELETE error:", err);
    return NextResponse.json({ error: "Failed to reset content" }, { status: 500 });
  }
}
