import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json();
    const userAgent = req.headers.get("user-agent") || undefined;

    const db = supabaseAdmin();
    await db.from("page_views").insert({
      path: path || "/",
      user_agent: userAgent,
      referrer: referrer || null,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 200 }); // silent tracking
  }
}
