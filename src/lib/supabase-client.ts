import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Production defaults ensuring client creation NEVER receives empty string or throws
const DEFAULT_SUPABASE_URL = "https://okekfsfyydajyfarnzra.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZWtmc2Z5eWRhanlmYXJuenJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg1MTk1OSwiZXhwIjoyMDcyNDI3OTU5fQ.5RRxb3dLOyq9C1OwB88Sh4qNDJzk2SxD5ZTRGsQUm9U";

let client: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (client) return client;

  const url =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL?.trim()) ||
    DEFAULT_SUPABASE_URL;
  const anonKey =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()) ||
    DEFAULT_SUPABASE_ANON_KEY;

  try {
    client = createBrowserClient(url, anonKey);
    return client;
  } catch (err) {
    console.warn("Falling back to default Supabase client configuration:", err);
    client = createBrowserClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
    return client;
  }
}
