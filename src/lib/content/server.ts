/**
 * Content store — reads and writes the dashboard's edits over the committed
 * defaults, using the same `templates(key, responses)` rows the site already
 * reads (`src/lib/live-content.ts`).
 *
 * Design notes:
 *  - Edits are additive. Whatever the dashboard saves is *merged over* the
 *    committed defaults, and the committed defaults stay in git as the fallback
 *    whenever Supabase is unreachable. The site never goes blank.
 *  - A save replaces a whole collection (desired-state write). Items the editor
 *    removed are recorded in a companion `<key>__deleted` row so the default
 *    they shadow stays hidden. This avoids the last-write-wins races you get
 *    from per-item writes on a JSON blob.
 *  - Nothing here may throw on the read path.
 *
 * Server-only.
 */

import crypto from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { CONTENT_REGISTRY, getSpec, itemId, type CollectionSpec } from "./registry";

const DELETED_SUFFIX = "__deleted";

export interface TemplateRow {
  id: number;
  key: string;
  responses: unknown;
  updated_at: string | null;
}

export interface CollectionPayload<T = unknown> {
  key: string;
  kind: CollectionSpec["kind"];
  items: T[];
  /** Identities of default items the editor hid. */
  hidden: string[];
  /** How many items are live overrides rather than committed defaults. */
  overrideCount: number;
  updatedAt: string | null;
  /** Where the displayed items come from: live edits, or the committed defaults. */
  source: "supabase" | "defaults";
  /** False when Supabase was unreachable and these are the committed defaults. */
  reachable: boolean;
}

/**
 * Service-role client, env-only. The service key must never be hardcoded here:
 * a committed key is a public key, and this one bypasses RLS.
 */
let cached: SupabaseClient | null = null;

function db(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Missing Supabase URL or service-role key for the content store");

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Always read fresh so a dashboard save shows up on the next request, and
      // never let a slow database stall a page render.
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, cache: "no-store", signal: AbortSignal.timeout(4000) }),
    },
  });
  return cached;
}

/** Reads the override rows for one collection. Returns null when offline. */
async function readRows(key: string): Promise<TemplateRow[] | null> {
  try {
    const { data, error } = await db()
      .from("templates")
      .select("id,key,responses,updated_at")
      .in("key", [key, key + DELETED_SUFFIX]);
    if (error || !data) return null;
    return data as TemplateRow[];
  } catch {
    return null;
  }
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/** Merges live overrides over the committed defaults. Pure. */
export function mergeCollection<T>(spec: CollectionSpec, overrides: unknown[], hidden: string[]): T[] {
  if (spec.kind === "string-list") {
    const live = overrides.map(String);
    const seen = new Set(live);
    const rest = spec.defaults.map(String).filter((d) => !seen.has(d) && !hidden.includes(d));
    return [...live, ...rest] as T[];
  }

  const live = overrides as Record<string, unknown>[];
  const liveIds = new Set(live.map((item, i) => itemId(spec, item, i)));
  const hiddenSet = new Set(hidden);
  const rest = (spec.defaults as Record<string, unknown>[]).filter((item, i) => {
    const id = itemId(spec, item, i);
    return !liveIds.has(id) && !hiddenSet.has(id);
  });
  return [...live, ...rest] as T[];
}

/** Live items for one collection, merged over the committed defaults. */
export async function liveItems<T = unknown>(key: string): Promise<T[]> {
  const spec = getSpec(key);
  if (!spec) throw new Error(`Unknown content collection: ${key}`);
  const rows = await readRows(key);
  if (!rows) return spec.defaults as T[];
  const overrides = asArray(rows.find((r) => r.key === key)?.responses);
  const hidden = asArray(rows.find((r) => r.key === key + DELETED_SUFFIX)?.responses).map(String);
  return mergeCollection<T>(spec, overrides, hidden);
}

/** Live single document (singleton) merged over its committed default. */
export async function liveDocument<T = unknown>(key: string): Promise<T> {
  const items = await liveItems<Record<string, unknown>>(key);
  return (items[0] ?? {}) as T;
}

/** Everything the dashboard needs for one collection. */
export async function getCollectionPayload(key: string): Promise<CollectionPayload> {
  const spec = getSpec(key);
  if (!spec) throw new Error(`Unknown content collection: ${key}`);
  const rows = await readRows(key);
  const overrideRaw = rows ? asArray(rows.find((r) => r.key === key)?.responses) : [];
  const hidden = rows
    ? asArray(rows.find((r) => r.key === key + DELETED_SUFFIX)?.responses).map(String)
    : [];
  const updatedAt = rows?.find((r) => r.key === key)?.updated_at ?? null;

  // `source` describes where the *displayed* items come from, so a reachable
  // database with no edits still reads "defaults" — only actual overrides count.
  const edited = overrideRaw.length > 0 || hidden.length > 0;

  return {
    key,
    kind: spec.kind,
    items: mergeCollection(spec, overrideRaw, hidden),
    hidden,
    overrideCount: overrideRaw.length,
    updatedAt,
    source: edited ? "supabase" : "defaults",
    reachable: rows !== null,
  };
}

async function upsertRow(key: string, responses: unknown[]): Promise<void> {
  const client = db();
  const { data, error } = await client.from("templates").select("id").eq("key", key).limit(1);
  if (error) throw new Error(`Lookup failed for "${key}": ${error.message}`);

  const existing = data?.[0]?.id;
  const stamp = new Date().toISOString();

  if (existing !== undefined) {
    const { error: updateError } = await client
      .from("templates")
      .update({ responses, updated_at: stamp })
      .eq("id", existing);
    if (updateError) throw new Error(`Update failed for "${key}": ${updateError.message}`);
    return;
  }

  const { error: insertError } = await client.from("templates").insert({ key, responses, updated_at: stamp });
  if (insertError) throw new Error(`Insert failed for "${key}": ${insertError.message}`);
}

/**
 * Desired-state save. `items` is the complete list the editor wants the site to
 * show; anything in the committed defaults that is missing from it gets hidden.
 */
export async function saveCollection(
  key: string,
  items: unknown[]
): Promise<{ hidden: string[]; updatedAt: string }> {
  const spec = getSpec(key);
  if (!spec) throw new Error(`Unknown content collection: ${key}`);

  const savedIds = new Set(items.map((item, i) => itemId(spec, item, i)));
  // The legacy `deleted_*_ids` row is still written for the three collections
  // the old reader merges by hand, so both readers agree.
  const hidden = (spec.defaults as unknown[])
    .map((item, i) => itemId(spec, item, i))
    .filter((id) => !savedIds.has(id));

  await upsertRow(key, items);
  await upsertRow(spec.deletedKey ?? key + DELETED_SUFFIX, hidden);

  return { hidden, updatedAt: new Date().toISOString() };
}

/** Drops every edit for a collection, restoring the committed defaults. */
export async function resetCollection(key: string): Promise<void> {
  const spec = getSpec(key);
  if (!spec) throw new Error(`Unknown content collection: ${key}`);
  const client = db();
  const keys = [key, spec.deletedKey ?? key + DELETED_SUFFIX];
  const { error } = await client.from("templates").delete().in("key", keys);
  if (error) throw new Error(`Reset failed for "${key}": ${error.message}`);
}

export interface RegistryStatusRow {
  key: string;
  overrideCount: number;
  updatedAt: string | null;
  rowsFound: boolean;
}

/** One query for the dashboard overview: which collections have live edits. */
export async function listRegistryStatus(): Promise<RegistryStatusRow[]> {
  const allKeys = CONTENT_REGISTRY.flatMap((spec) => spec.key);
  try {
    const { data, error } = await db().from("templates").select("key,responses,updated_at").in("key", allKeys);
    if (error || !data) return CONTENT_REGISTRY.map((s) => ({ key: s.key, overrideCount: 0, updatedAt: null, rowsFound: false }));
    return CONTENT_REGISTRY.map((spec) => {
      const row = data.find((r) => r.key === spec.key);
      return {
        key: spec.key,
        overrideCount: asArray(row?.responses).length,
        updatedAt: (row?.updated_at as string | null) ?? null,
        rowsFound: Boolean(row),
      };
    });
  } catch {
    return CONTENT_REGISTRY.map((s) => ({ key: s.key, overrideCount: 0, updatedAt: null, rowsFound: false }));
  }
}

import { safeCompare } from "@/lib/security";

/**
 * Admin guard: constant-time comparison against ADMIN_SECRET, matching
 * /api/admin/applications.
 */
export function isAuthorizedAdmin(req: Request): boolean {
  const secret = req.headers.get("x-admin-secret");
  const expected = process.env.ADMIN_SECRET;
  if (!secret || !expected || expected === "jemo123") return false;
  return safeCompare(secret, expected);
}
