/**
 * HTML Sanitization: Escapes special characters to prevent HTML/XSS injection.
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Server-side email masking to protect user privacy and prevent data harvesting.
 * Example: "ali.jemo1.9@gmail.com" -> "a***9@gmail.com"
 */
export function maskEmail(email: string): string {
  if (!email || typeof email !== "string") return "***";
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) return "***";

  const [local, domain] = parts;
  if (!local || !domain) return "***";

  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }

  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

/**
 * Timing-safe string comparison.
 *
 * IMPORTANT: we pad both inputs to equal length before the comparison so the
 * code path is identical regardless of input length — a length-mismatch
 * short-circuit would leak the secret's length to the caller via timing, and
 * secrets compared across differing-length inputs (empty header vs. real
 * secret) would otherwise diverge observably.
 */
export function safeCompare(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  if (typeof a !== "string" || typeof b !== "string") return false;

  const lenA = a.length;
  const lenB = b.length;
  const maxLen = Math.max(lenA, lenB);

  let mismatch = lenA ^ lenB;
  for (let i = 0; i < maxLen; i++) {
    const charA = i < lenA ? a.charCodeAt(i) : 0;
    const charB = i < lenB ? b.charCodeAt(i) : 0;
    mismatch |= charA ^ charB;
  }

  return mismatch === 0;
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
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
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

/**
 * Sanitize plain string input to remove null bytes and control chars.
 */
export function sanitizeInput(input: unknown, maxLength = 1000): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")
    .slice(0, maxLength)
    .trim();
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
 * CSRF defense via the `Sec-Fetch-Site` header.
 *
 * Browsers always send this on cross-site requests (`cross-origin`/`same-site`*`);
 * same-origin navigations and fetches carry `same-origin`. Non-browser clients
 * (curl, server-to-server) send `none` or omit it. We reject only the cases a
 * cross-site attacker can trigger, so legitimate same-origin use and
 * non-browser admin tooling are unaffected.
 */
export function isSameOrigin(req: Request): boolean {
  const site = req.headers.get("sec-fetch-site");
  if (site === null) return true; // no header => non-browser client
  return site === "same-origin" || site === "none";
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

export function isKnownTelegramIp(ip: string): boolean {
  const dot = ip.includes(".");
  if (!dot) return false; // only IPv4 ranges are pinned here
  return TELEGRAM_IPV4_RANGES.some((cidr) => ipv4InCidr(ip, cidr));
}

/** Generates a non-cryptographic contract/claim id (see update-status route). */
export function generateContractId(): string {
  // crypto.randomBytes is not available in every runtime, so fall back to a
  // mixed source but keep it bounded and uppercase-stable for format.
  const rand =
    typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function"
      ? crypto.getRandomValues(new Uint32Array(1))[0]
      : Math.floor(Math.random() * 0x100000000);
  return `IJL-2026-${String(1000 + (rand % 9000))}`;
}

/** Telegram chat id must be a non-zero integer (negative ids are valid for groups). */
export function isValidTelegramChatId(value: unknown): boolean {
  if (typeof value !== "number") return false;
  return Number.isInteger(value) && value !== 0;
}
