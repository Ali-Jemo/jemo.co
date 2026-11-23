/**
 * Clerk is optional. An empty publishable key (the production failure mode,
 * when NEXT_PUBLIC_* was only set as a Worker secret and never inlined at
 * build time) must not mount ClerkProvider or the sign-in skeleton.
 */

const PUBLISHABLE_PREFIXES = ["pk_test_", "pk_live_"] as const;

export function clerkPublishableKey(): string {
  return (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.CLERK_PUBLISHABLE_KEY || "").trim();
}

export function isClerkPublishableKey(key: string | undefined | null): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  if (trimmed.length < 20) return false;
  if (trimmed.includes("YOUR_KEY") || trimmed.endsWith("...")) return false;
  return PUBLISHABLE_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
}

export function isClerkConfigured(): boolean {
  return isClerkPublishableKey(clerkPublishableKey());
}

export function isValidClerkSecretKey(key: string | undefined | null): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  return (
    (trimmed.startsWith("sk_test_") || trimmed.startsWith("sk_live_")) &&
    !trimmed.includes("YOUR_KEY") &&
    trimmed !== "sk_test_..." &&
    trimmed.length > 30
  );
}

/** Server routes (middleware, /admin) need both halves. */
export function isClerkServerConfigured(): boolean {
  return isClerkConfigured() && isValidClerkSecretKey(process.env.CLERK_SECRET_KEY);
}

/**
 * Clerk encodes the Frontend API host in the publishable key:
 * pk_live_<base64(host + "$")>.
 */
export function clerkFrontendApiFromKey(key: string | undefined | null): string | null {
  if (!isClerkPublishableKey(key)) return null;
  const token = key!.trim().replace(/^pk_(test|live)_/, "");
  try {
    const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decoded =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf8");
    const host = decoded.replace(/\$$/, "").trim();
    if (!host || !host.includes(".")) return null;
    return `https://${host}`;
  } catch {
    return null;
  }
}

function pushOrigin(target: Set<string>, value: string | undefined | null) {
  if (!value) return;
  for (const part of value.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const withScheme = trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
    try {
      const url = new URL(withScheme);
      if (url.protocol !== "https:" && url.protocol !== "http:") continue;
      target.add(`${url.protocol}//${url.host}`);
    } catch {
      // ignore malformed config
    }
  }
}

/**
 * Origins allowed to load Clerk JS. Development instances use
 * *.clerk.accounts.dev. Production must add its Frontend API via
 * CLERK_FRONTEND_API / NEXT_PUBLIC_CLERK_FRONTEND_API, or via a publishable
 * key present at build time (the host is decoded from the key).
 */
export function clerkAllowedOrigins(): string[] {
  const origins = new Set<string>(["https://*.clerk.accounts.dev"]);
  pushOrigin(origins, process.env.CLERK_FRONTEND_API);
  pushOrigin(origins, process.env.NEXT_PUBLIC_CLERK_FRONTEND_API);
  const derived = clerkFrontendApiFromKey(clerkPublishableKey());
  if (derived) origins.add(derived);
  return [...origins];
}
