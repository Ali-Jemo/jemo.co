import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (typeof window === "undefined") {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://okekfsfyydajyfarnzra.supabase.co";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy";
    return createBrowserClient(url, anonKey);
  }

  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://okekfsfyydajyfarnzra.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  client = createBrowserClient(url, anonKey);
  return client;
}
