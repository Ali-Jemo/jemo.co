import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, getClientIp, maskEmail } from '@/lib/security';

export async function GET(req: NextRequest) {
  // Rate limiting: max 30 requests per minute per IP to prevent scraping
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`public_apps:${ip}`, 30, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from('applications')
      .select('id, name, email, created_at, section, status, experience, hours, portfolio, contract_id')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error("Public applications fetch error:", error.message);
      return NextResponse.json({ error: 'Failed to load applications' }, { status: 500 });
    }

    // Sanitize and mask sensitive fields on the server before sending to the client
    const sanitized = (data || []).map((app) => ({
      id: app.id,
      name: app.name,
      email: maskEmail(app.email), // Never expose raw applicant emails publicly
      created_at: app.created_at,
      section: app.section,
      status: app.status,
      experience: app.experience,
      hours: app.hours,
      portfolio: app.portfolio,
      contract_id: app.contract_id,
    }));

    return NextResponse.json(sanitized, {
      headers: {
        "Cache-Control": "public, s-maxage=15, stale-while-revalidate=45",
      },
    });
  } catch (err) {
    console.error("Error in public applications route:", err);
    return NextResponse.json({ error: 'Failed to load applications' }, { status: 500 });
  }
}