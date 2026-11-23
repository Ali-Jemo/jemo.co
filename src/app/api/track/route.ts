import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkRateLimit, getClientIp, sanitizeInput } from "@/lib/security";

export async function POST(req: NextRequest) {
  // Rate limit tracking calls: max 30 per minute per IP
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`track:${ip}`, 30, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false }, { status: 429 });
  }

  try {
    const body = await req.json();
    const rawPath = body?.path;
    const rawReferrer = body?.referrer;
    const rawUa = req.headers.get("user-agent");

    // Enforce strict length limits and sanitize to prevent database bloat
    const cleanPath = typeof rawPath === "string" ? sanitizeInput(rawPath, 255) : "/";
    const cleanReferrer = typeof rawReferrer === "string" ? sanitizeInput(rawReferrer, 300) : null;
    const cleanUa = typeof rawUa === "string" ? sanitizeInput(rawUa, 300) : null;

    const hasDb = Boolean(
      (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
    );
    if (!hasDb) return NextResponse.json({ success: true, skipped: true });

    const db = supabaseAdmin();
    const insert = db.from("page_views").insert({
      path: cleanPath,
      user_agent: cleanUa,
      referrer: cleanReferrer,
    });
    const { error } = await Promise.race([
      insert,
      new Promise<{ error: { message: string } }>((resolve) =>
        setTimeout(() => resolve({ error: { message: "timeout" } }), 1500)
      ),
    ]);
    if (error) console.error("Page view tracking error:", error.message);

    return NextResponse.json({ success: true });
  } catch {
    // Silent fail for client analytics without revealing database errors
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
