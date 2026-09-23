import { safeCompare } from "@/lib/security-client";

/**
 * Generates an HMAC-SHA256 signature for Telegram action deep links.
 * Token shape: `${value}.${sigHex}`
 */
async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signActionLink(kind: "accepted" | "link", value: string): Promise<string> {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("TELEGRAM_WEBHOOK_SECRET is not configured");
  }

  const key = await getHmacKey(secret);
  const data = new TextEncoder().encode(`${kind}:${value}`);
  const sigBuf = await crypto.subtle.sign("HMAC", key, data);
  const sigHex = Array.from(new Uint8Array(sigBuf), (b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);

  return `${value}.${sigHex}`;
}

export async function verifyActionLink(token: string, kind: "accepted" | "link"): Promise<string | null> {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) return null;

  const dotIdx = token.lastIndexOf(".");
  if (dotIdx === -1) return null;

  const value = token.slice(0, dotIdx);
  const presentedSig = token.slice(dotIdx + 1);
  if (!value || presentedSig.length !== 32) return null;

  try {
    const key = await getHmacKey(secret);
    const data = new TextEncoder().encode(`${kind}:${value}`);
    const sigBuf = await crypto.subtle.sign("HMAC", key, data);
    const expectedSig = Array.from(new Uint8Array(sigBuf), (b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 32);

    if (safeCompare(presentedSig, expectedSig)) {
      return value;
    }
  } catch {
    return null;
  }

  return null;
}
