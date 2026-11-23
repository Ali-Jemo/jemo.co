/**
 * One place for the public site identity.
 *
 * NEXT_PUBLIC_SITE_URL overrides the canonical origin. Contact mail defaults
 * to contact@jemo.dev and can be overridden with CONTACT_EMAIL /
 * NEXT_PUBLIC_CONTACT_EMAIL. Privacy and legal use their own env vars when
 * set, and otherwise the same inbox.
 * Social links default to the accounts that resolve; add others with
 * NEXT_PUBLIC_SOCIAL_LINKS (JSON array of { id, href, label }).
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://lab.jemo.dev"
).replace(/\/$/, "");

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

function readEmail(name: string): string {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

/** Owner inbox. Override with NEXT_PUBLIC_CONTACT_EMAIL or CONTACT_EMAIL. */
export const DEFAULT_CONTACT_EMAIL = "contact@jemo.dev";

export function contactEmail(): string {
  return readEmail("NEXT_PUBLIC_CONTACT_EMAIL") || readEmail("CONTACT_EMAIL") || DEFAULT_CONTACT_EMAIL;
}

export function privacyEmail(): string {
  return readEmail("NEXT_PUBLIC_PRIVACY_EMAIL") || readEmail("PRIVACY_EMAIL") || contactEmail();
}

export function legalEmail(): string {
  return readEmail("NEXT_PUBLIC_LEGAL_EMAIL") || readEmail("LEGAL_EMAIL") || contactEmail();
}

export interface SocialLink {
  id: string;
  href: string;
  label: string;
}

/** Accounts that currently resolve. The old https://x.com/jemolabs URL is a 404. */
const DEFAULT_SOCIAL_LINKS: readonly SocialLink[] = [
  { id: "telegram", href: "https://t.me/jemo_channel", label: "Telegram" },
  { id: "github", href: "https://github.com/Ali-Jemo", label: "GitHub" },
];

export function socialLinks(): SocialLink[] {
  const raw = process.env.NEXT_PUBLIC_SOCIAL_LINKS?.trim();
  if (!raw) return [...DEFAULT_SOCIAL_LINKS];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [...DEFAULT_SOCIAL_LINKS];
    const links = parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const row = item as { id?: unknown; href?: unknown; label?: unknown };
      if (typeof row.href !== "string" || !row.href.startsWith("https://")) return [];
      const id = typeof row.id === "string" && row.id ? row.id : "link";
      const label = typeof row.label === "string" && row.label ? row.label : id;
      return [{ id, href: row.href, label }];
    });
    return links;
  } catch {
    return [...DEFAULT_SOCIAL_LINKS];
  }
}

/**
 * Committed papers and news items are illustrative samples (fictional metrics,
 * co-authors, and at least one partnership claim). They stay in the repo but
 * are hidden in production unless NEXT_PUBLIC_SHOW_UNVERIFIED_SAMPLES=1.
 */
export function showUnverifiedSamples(): boolean {
  const flag = process.env.NEXT_PUBLIC_SHOW_UNVERIFIED_SAMPLES?.trim().toLowerCase();
  if (flag === "1" || flag === "true" || flag === "on") return true;
  if (flag === "0" || flag === "false" || flag === "off") return false;
  return process.env.NODE_ENV !== "production";
}

/** Founder demo login is a local development affordance only. */
export function demoLoginEnabled(): boolean {
  return process.env.NODE_ENV !== "production";
}
