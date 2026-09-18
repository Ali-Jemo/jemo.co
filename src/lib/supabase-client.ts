import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://okekfsfyydajyfarnzra.supabase.co";
// Safe public fallback: NEVER use service_role keys on the client
const SAFE_FALLBACK_ANON_KEY = "public-anon-key-placeholder";

function isServiceRoleKey(token?: string | null): boolean {
  if (!token || typeof token !== "string") return false;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return false;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr =
      typeof atob === "function"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8");
    const payload = JSON.parse(jsonStr);
    return payload?.role === "service_role";
  } catch {
    return false;
  }
}

let client: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (client) return client;

  const url =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL?.trim()) ||
    DEFAULT_SUPABASE_URL;
  const rawKey =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()) ||
    SAFE_FALLBACK_ANON_KEY;

  // Security guard: Never allow a service_role key to be passed to browser client
  const anonKey = isServiceRoleKey(rawKey) ? SAFE_FALLBACK_ANON_KEY : rawKey;
  if (anonKey !== rawKey) {
    console.error("Security violation blocked: service_role key was provided in NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  try {
    client = createBrowserClient(url, anonKey);
    return client;
  } catch (err) {
    console.warn("Falling back to safe Supabase client configuration:", err);
    client = createBrowserClient(DEFAULT_SUPABASE_URL, SAFE_FALLBACK_ANON_KEY);
    return client;
  }
}
