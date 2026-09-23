import "server-only";

import {
  escapeHtml,
  maskEmail,
  safeCompare,
  sanitizeInput,
  escapeMarkdown,
  generateContractId,
  isValidTelegramChatId,
} from "./security-client";

export {
  escapeHtml,
  maskEmail,
  safeCompare,
  sanitizeInput,
  escapeMarkdown,
  generateContractId,
  isValidTelegramChatId,
};

/** Minimal structural shape of a Clerk user, so this stays framework-agnostic. */
export interface AdminCandidate {
  publicMetadata?: unknown;
  emailAddresses?: Array<{ emailAddress?: string | null }>;
}

/**
 * Authoritative admin check for an authenticated user.
 *
 * Admin status comes ONLY from the server-controlled Clerk
 * `publicMetadata.role` claim. An optional comma-separated `ADMIN_EMAILS` env
 * allowlist bootstraps accounts whose Clerk role has not been assigned yet.
 *
 * Email addresses and usernames are deliberately NOT authorization signals:
 * they are user-visible — this project even publishes its contact address
 * across the marketing pages — so treating one as a credential lets anyone who
 * controls that mailbox escalate to admin.
 */
export function isAdminUser(user: AdminCandidate | null | undefined): boolean {
  if (!user) return false;

  const role = (user.publicMetadata as { role?: unknown } | undefined)?.role;
  if (role === "admin") return true;

  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  if (allowlist.length === 0) return false;

  return (user.emailAddresses ?? []).some(
    (entry) =>
      typeof entry?.emailAddress === "string" && allowlist.includes(entry.emailAddress.toLowerCase())
  );
}

/**
 * Extracts the trusted client IP.
 *
 * Cloudflare sets `cf-connecting-ip` (the real client, unspoofable) and
 * `cf-ray` (a fingerprint that proves we are on the edge). Behind Cloudflare
 * we therefore trust ONLY cf-connecting-ip / x-real-ip and ignore the
 * client-spoofable `x-forwarded-for`. Direct/non-Cloudflare connections fall
 * back to x-forwarded-for, which is only acceptable for local dev.
 */
export function getClientIp(req: Request): string {
  // Only trust edge-provided IPs when the request provably came through
  // Cloudflare (cf-ray present). Otherwise headers are attacker-controlled
  // and must not feed bans, rate-limit keys, or allowlist checks.
  const viaCloudflare = Boolean(req.headers.get("cf-ray"));
  if (viaCloudflare) {
    return (
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1"
    );
  }
  return (
    req.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

/**
 * High-performance sliding-window in-memory rate limiter.
 * Automatically purges expired windows to prevent memory leaks.
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic garbage collection every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 300_000);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if an action by an identifier is within the rate limit.
 * @param identifier Unique key, e.g. `applications:${ip}`
 * @param limit Max requests allowed in the window
 * @param windowMs Window duration in milliseconds (default: 60,000ms = 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(identifier, newRecord);
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: newRecord.resetAt,
    };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetAt,
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: limit - record.count,
    resetTime: record.resetAt,
  };
}

/** Clears all in-memory rate-limit buckets. Intended for tests only. */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}

/**
 * Enforces a request-body size ceiling BEFORE the body is parsed.
 * Returns false when the declared (Content-Length) size already exceeds
 * maxBytes, so callers can short-circuit with a 413 instead of buffering
 * an oversized JSON payload into memory.
 */
export function enforceBodySize(req: Request, maxBytes: number): boolean {
  const declared = req.headers.get("content-length");
  if (declared !== null) {
    const n = Number(declared);
    if (Number.isFinite(n) && n > maxBytes) return false;
  }
  return true;
}

/**
 * Safely reads and parses a JSON request body bounded by actual byte count.
 * Returns null if the payload exceeds maxBytes or is empty (callers return 413 or 400).
 */
export async function readJsonBody(req: Request, maxBytes = 1_048_576): Promise<unknown | null> {
  const buf = new Uint8Array(await req.arrayBuffer());
  if (buf.byteLength > maxBytes) return null;
  if (buf.byteLength === 0) return null;
  return JSON.parse(new TextDecoder().decode(buf));
}

/**
 * Converts a dotted IPv4 address to its 32-bit unsigned integer representation, or null.
 */
function ipv4ToNumber(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const part of parts) {
    const oct = Number(part);
    if (!Number.isInteger(oct) || oct < 0 || oct > 255) return null;
    n = ((n << 8) | oct) >>> 0;
  }
  return n;
}

/** True if an IPv4 address falls inside an IPv4 CIDR (e.g. "149.154.160.0/20"). */
export function ipv4InCidr(ip: string, cidr: string): boolean {
  const [addr, prefixStr] = cidr.split("/");
  const prefix = Number(prefixStr);
  if (!addr || Number.isNaN(prefix)) return false;
  if (prefix < 0 || prefix > 32) return false;
  const ipNum = ipv4ToNumber(ip);
  const cidrNum = ipv4ToNumber(addr);
  if (ipNum === null || cidrNum === null) return false;
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  return (ipNum & mask) === (cidrNum & mask);
}

/**
 * Telegram documents the source IP ranges of its webhook requests.
 * If no `TELEGRAM_WEBHOOK_SECRET` is configured we pin the incoming IP to
 * these ranges so the otherwise-unauthenticated webhook cannot be invoked by
 * arbitrary callers.
 */
const TELEGRAM_IPV4_RANGES = [
  "149.154.160.0/20",
  "91.108.40.0/22",
  "91.108.56.0/22",
] as const;

// Telegram's published IPv6 ranges (https://core.telegram.org/bots/webhooks).
// Previously the check rejected any non-IPv4 caller, which let an attacker
// spoof IPv6 webhook traffic from outside the published ranges.
const TELEGRAM_IPV6_RANGES = [
  "2001:67c:4e8::/48",
  "2001:b28:f23d::/48",
  "2001:b28:f23f::/48",
  "2001:7a8::/32",
] as const;

/** Expands a hex digit to four bits ("f" -> "1111"). */
function hexToBits(hex: string): string {
  let out = "";
  for (let i = 0; i < hex.length; i++) {
    const c = hex.charCodeAt(i);
    let nibble = 0;
    if (c >= 48 && c <= 57) nibble = c - 48;
    else if (c >= 97 && c <= 102) nibble = c - 87; // a-f
    else if (c >= 65 && c <= 70) nibble = c - 55; // A-F
    else return "";
    out += nibble.toString(2).padStart(4, "0");
  }
  return out;
}

/** Normalises an IPv6 address to 128 zero-padded bits. Returns "" on parse error. */
function ipv6ToBits(ip: string): string {
  // Strip zone identifier (e.g. fe80::1%eth0 -> fe80::1)
  const zoneStripped = ip.split("%")[0] ?? ip;
  if (!zoneStripped.includes(":")) return "";
  let parts: string[];
  let embeddedV4 = "";
  if (zoneStripped.includes(".")) {
    // IPv4-mapped suffix — e.g. ::ffff:127.0.0.1
    const lastColon = zoneStripped.lastIndexOf(":");
    const v4 = zoneStripped.slice(lastColon + 1);
    const octets = v4.split(".");
    if (octets.length !== 4) return "";
    const hex =
      (parseInt(octets[0] ?? "0", 10) * 256 + parseInt(octets[1] ?? "0", 10))
        .toString(16)
        .padStart(4, "0") +
      (parseInt(octets[2] ?? "0", 10) * 256 + parseInt(octets[3] ?? "0", 10))
        .toString(16)
        .padStart(4, "0");
    embeddedV4 = hex;
    parts = (zoneStripped.slice(0, lastColon) + ":").split(":");
  } else {
    parts = zoneStripped.split(":");
  }
  // Find "::" run.
  const emptyIdx = parts.indexOf("");
  let head: string[] = [];
  let tail: string[] = [];
  if (emptyIdx !== -1) {
    head = parts.slice(0, emptyIdx);
    tail = parts.slice(emptyIdx + 1).filter((p) => p.length > 0);
  } else {
    head = parts.filter((p) => p.length > 0);
    tail = [];
  }
  if (head.length + tail.length > 8) return "";
  if (emptyIdx === -1 && head.length !== 8) return "";
  const fillCount = 8 - head.length - tail.length;
  const filled = [
    ...head,
    ...Array(fillCount).fill("0"),
    ...tail,
  ];
  if (embeddedV4) filled[filled.length - 1] = embeddedV4;
  if (filled.length !== 8) return "";
  let bits = "";
  for (const group of filled) {
    const expanded = (group.length === 0 ? "0" : group).padStart(4, "0").padStart(4, "0");
    const groupBits = hexToBits(expanded);
    if (!groupBits) return "";
    bits += groupBits;
  }
  return bits;
}

/** True if an IPv6 address (full or compressed) falls inside an IPv6 CIDR. */
export function ipv6InCidr(ip: string, cidr: string): boolean {
  const [addr, prefixStr] = cidr.split("/");
  const prefix = Number(prefixStr);
  if (!addr || Number.isNaN(prefix)) return false;
  if (prefix < 0 || prefix > 128) return false;
  const ipBits = ipv6ToBits(ip);
  const cidrBits = ipv6ToBits(addr);
  if (!ipBits || !cidrBits) return false;
  return ipBits.slice(0, prefix) === cidrBits.slice(0, prefix);
}

export function isKnownTelegramIp(ip: string): boolean {
  if (!ip) return false;
  if (ip.includes(":")) {
    return TELEGRAM_IPV6_RANGES.some((cidr) => ipv6InCidr(ip, cidr));
  }
  return TELEGRAM_IPV4_RANGES.some((cidr) => ipv4InCidr(ip, cidr));
}


/**
 * Returns true when the supplied secret meets the minimum-strength bar for
 * authentication. Rejects:
 *   - empty / non-string values
 *   - well-known weak defaults ("jemo123", "changeme", "password", ...)
 *   - anything shorter than MIN_SECRET_LENGTH (so brute-force or env-not-set
 *     deployments cannot authenticate against a 4-character password)
 *
 * Callers MUST combine this with safeCompare() — the function is a strength
 * gate, not an equality check.
 */
export const MIN_SECRET_LENGTH = 24;
const REJECTED_DEFAULT_SECRETS = new Set([
  "jemo123",
  "changeme",
  "password",
  "admin",
  "secret",
  "12345678",
]);

export function isStrongSecret(secret: unknown): secret is string {
  if (typeof secret !== "string") return false;
  if (!secret) return false;
  if (REJECTED_DEFAULT_SECRETS.has(secret.toLowerCase())) return false;
  if (secret.length < MIN_SECRET_LENGTH) return false;
  return true;
}

/**
 * Verifies an inbound `x-admin-secret` header against ADMIN_SECRET.
 *
 * SECURITY: This is the single chokepoint for admin-secret authentication
 * across the app. Every admin route MUST call this helper instead of doing
 * its own comparison, so that the strength gate is applied consistently and
 * the rejected-default list cannot be bypassed by one-off checks.
 */
export function verifyAdminSecret(req: Request): boolean {
  const provided = req.headers.get("x-admin-secret");
  const expected = process.env.ADMIN_SECRET;
  if (!provided || !isStrongSecret(expected)) return false;
  return safeCompare(provided, expected);
}
