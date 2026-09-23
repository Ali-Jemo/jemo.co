/**
 * Client-safe security and sanitization utilities.
 * This file contains pure helper functions that do not access any secrets,
 * environment variables, or server-only modules, and can safely be imported
 * in both client and server components.
 */

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
 * Email masking to protect user privacy and prevent data harvesting.
 * Example: "admin@jemo.co" -> "a***n@jemo.co"
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
 * Pads both inputs to equal length before comparing to prevent timing leaks.
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
 * Sanitizes generic user text input.
 */
export function sanitizeInput(input: unknown, maxLength = 1000): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")
    .slice(0, maxLength)
    .trim();
}

/**
 * Escapes Telegram Markdown control characters to prevent formatting injection.
 */
export function escapeMarkdown(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

/** Generates a cryptographically strong contract/claim id. */
export function generateContractId(): string {
  let randHex = "";
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const arr = new Uint8Array(4);
    crypto.getRandomValues(arr);
    randHex = Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  } else {
    randHex = Math.floor(0x10000000 + Math.random() * 0xefffffff).toString(16).toUpperCase();
  }
  return `IJL-2026-${randHex}`;
}

/** Telegram chat id must be a non-zero integer (negative ids are valid for groups). */
export function isValidTelegramChatId(value: unknown): boolean {
  if (typeof value !== "number") return false;
  return Number.isInteger(value) && value !== 0;
}

/**
 * URL safety gate for user-supplied links (pdfUrl/codeUrl/datasetUrl/evidenceUrl).
 * Allows only http:/https: URLs, blocks javascript:/data:/vbscript:/file:.
 * Client-safe: usable in both server validation and client render guards.
 */
export function isSafeHttpUrl(value: unknown, maxLength = 2048): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return false;
  if (trimmed === "#") return false;
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:") ||
    lower.startsWith("blob:")
  ) {
    return false;
  }
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Returns trimmed URL if safe, otherwise undefined. */
export function normalizeSafeHttpUrl(value: unknown, maxLength = 2048): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, maxLength);
  return isSafeHttpUrl(trimmed, maxLength) ? trimmed : undefined;
}
