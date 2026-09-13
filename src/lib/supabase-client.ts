import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://okekfsfyydajyfarnzra.supabase.co";
// Safe public fallback: NEVER use service_role keys on the client
const SAFE_FALLBACK_ANON_KEY = "public-anon-key-placeholder";

let client: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (client) return client;

  const url =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL?.trim()) ||
    DEFAULT_SUPABASE_URL;
  const anonKey =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()) ||
    SAFE_FALLBACK_ANON_KEY;

  try {
    client = createBrowserClient(url, anonKey);
    return client;
  } catch (err) {
    console.warn("Falling back to safe Supabase client configuration:", err);
    client = createBrowserClient(DEFAULT_SUPABASE_URL, SAFE_FALLBACK_ANON_KEY);
    return client;
  }
}
