import "server-only";

/**
 * Server-side API key management.
 *
 * Keys are bearer credentials for the public research API. Only a SHA-256 hash
 * is persisted; the plaintext token is returned exactly once, at creation, and
 * can never be read back. Revocation is a row update, so a leaked key dies
 * immediately — unlike the static `JEMO_API_KEYS` env allowlist, which can only
 * be rotated by redeploying.
 *
 * Server-only: import from route handlers, never from a client component.
 */

import { supabaseAdmin } from "@/lib/supabase";

export const API_KEY_PREFIX = "jemo_live_res_";

/** 16 random bytes → 32 hex characters. */
const TOKEN_BYTES = 16;
const MAX_ACTIVE_KEYS = 10;
const MAX_NAME_LENGTH = 60;

export interface ApiKeyRecord {
  id: string;
  name: string;
  prefix: string;
  last4: string;
  created_at: string;
  last_used_at: string | null;
}

export interface CreatedApiKey extends ApiKeyRecord {
  /** Plaintext token. Returned once and never stored. */
  token: string;
}

/** Identity captured at key creation, used as the published author. */
export interface ApiKeyOwner {
  userId: string;
  userName: string;
  userHandle: string;
  role?: string;
}

/** Thrown when a user already holds the maximum number of active keys. */
export class ApiKeyLimitError extends Error {
  constructor() {
    super(`A researcher may hold at most ${MAX_ACTIVE_KEYS} active API keys.`);
    this.name = "ApiKeyLimitError";
  }
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Cryptographically random bearer token. */
export function generateToken(): string {
  const bytes = new Uint8Array(TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  return `${API_KEY_PREFIX}${toHex(bytes)}`;
}

/**
 * SHA-256 of the token.
 *
 * Deliberately unsalted: tokens are 128 bits of CSPRNG output, so there is no
 * dictionary or rainbow-table attack to slow down the way there is for a
 * user-chosen password. A per-key salt would only add a lookup column.
 */
export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return toHex(new Uint8Array(digest));
}

function toRecord(row: Record<string, unknown>): ApiKeyRecord {
  return {
    id: String(row.id),
    name: String(row.name ?? "Default"),
    prefix: String(row.prefix ?? ""),
    last4: String(row.last4 ?? ""),
    created_at: String(row.created_at ?? ""),
    last_used_at: (row.last_used_at as string | null) ?? null,
  };
}

/** Issues a new key for the owner. The plaintext token is returned only here. */
export async function createApiKey(
  owner: ApiKeyOwner,
  name?: string
): Promise<CreatedApiKey> {
  const db = supabaseAdmin();

  const { count, error: countError } = await db
    .from("api_keys")
    .select("id", { count: "exact", head: true })
    .eq("user_id", owner.userId)
    .is("revoked_at", null);
  if (countError) throw new Error(`Could not count existing keys: ${countError.message}`);
  if ((count ?? 0) >= MAX_ACTIVE_KEYS) throw new ApiKeyLimitError();

  const token = generateToken();
  const tokenHash = await hashToken(token);

  const { data, error } = await db
    .from("api_keys")
    .insert({
      user_id: owner.userId,
      name: (name ?? "").trim().slice(0, MAX_NAME_LENGTH) || "Default",
      token_hash: tokenHash,
      // Non-secret fragments the dashboard can show in place of the token.
      prefix: token.slice(0, API_KEY_PREFIX.length + 8),
      last4: token.slice(-4),
      user_name: owner.userName.slice(0, 120),
      user_handle: owner.userHandle.slice(0, 120),
      role: (owner.role ?? "باحث مستقل مسجل").slice(0, 120),
    })
    .select("id,name,prefix,last4,created_at,last_used_at")
    .single();

  if (error || !data) {
    throw new Error(`Could not create API key: ${error?.message ?? "no row returned"}`);
  }

  return { ...toRecord(data), token };
}

/** Active (non-revoked) keys for one user. Never includes tokens or hashes. */
export async function listApiKeys(userId: string): Promise<ApiKeyRecord[]> {
  const { data, error } = await supabaseAdmin()
    .from("api_keys")
    .select("id,name,prefix,last4,created_at,last_used_at")
    .eq("user_id", userId)
    .is("revoked_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) throw new Error(`Could not list API keys: ${error?.message ?? "no data"}`);
  return data.map(toRecord);
}

/**
 * Revokes a key. Scoped to `userId` so one researcher can never revoke
 * another's credential, even with a guessed key id.
 */
export async function revokeApiKey(userId: string, id: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin()
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .is("revoked_at", null)
    .select("id");

  if (error) throw new Error(`Could not revoke API key: ${error.message}`);
  return (data?.length ?? 0) > 0;
}

export interface ResolvedApiKey {
  name: string;
  handle: string;
  id: string;
  role: string;
}

/**
 * Resolves a presented token to its owner, or null.
 *
 * Never throws: on a database outage the caller falls back to the env allowlist
 * and otherwise fails closed, so a broken database cannot crash every request.
 */
export async function resolveApiKey(token: string): Promise<ResolvedApiKey | null> {
  if (!token || !token.startsWith(API_KEY_PREFIX)) return null;

  try {
    const db = supabaseAdmin();
    const tokenHash = await hashToken(token);

    const { data, error } = await db
      .from("api_keys")
      .select("id,user_name,user_handle,role,last_used_at")
      .eq("token_hash", tokenHash)
      .is("revoked_at", null)
      .maybeSingle();

    if (error || !data) return null;

    // Best-effort telemetry for the dashboard's "last used" column. Never let
    // it block or fail authentication.
    try {
      await db
        .from("api_keys")
        .update({ last_used_at: new Date().toISOString() })
        .eq("id", data.id);
    } catch {
      // ignored
    }

    return {
      name: String(data.user_name || "باحث معتمد"),
      handle: String(data.user_handle || "@researcher"),
      id: String(data.id),
      role: String(data.role || "باحث مستقل مسجل"),
    };
  } catch {
    return null;
  }
}
