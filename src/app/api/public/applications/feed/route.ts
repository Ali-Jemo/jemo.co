import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/security';

/**
 * Public, NON-PII aggregate of the applications table for the /applications
 * transparency page.
 *
 * SECURITY: This route deliberately returns COUNT and timestamp data only.
 * No names, emails, experience text, portfolio URLs, or contract IDs ever
 * leave Supabase through this endpoint.
 *
 * This is the ONLY public route under /api/public/applications. A sibling
 * `./route.ts` used to list every applicant and was deleted rather than
 * hidden behind admin auth — applicant PII has no public representation, so
 * the correct shape is aggregates here and full rows under /api/admin.
 *
 * Aggregates refresh at most every 60 seconds. Cached responses live in the
 * shared edge cache (no `private`) — there is no per-user data to vary on.
 */
export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`public_apps_feed:${ip}`, 60, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    const db = supabaseAdmin();
    // Single COUNT-only query — never pulls the full row set.
    const { count, error } = await db
      .from('applications')
      .select('id', { count: 'exact', head: true });

    if (error) {
      console.error("Public applications feed count error:", error.message);
      return NextResponse.json({ error: 'Failed to load applications' }, { status: 500 });
    }

    // Status breakdown via head:true + a server-side filter. We avoid
    // .select('status') because the result would carry every row's status
    // payload even if we only counted.
    const [pending, accepted, rejected] = await Promise.all([
      db.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      db.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'accepted'),
      db.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'rejected'),
    ]);

    return NextResponse.json(
      {
        total: count ?? 0,
        pending: pending.count ?? 0,
        accepted: accepted.count ?? 0,
        rejected: rejected.count ?? 0,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          // Public aggregate — safe to cache on the edge for 60s.
          "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (err) {
    console.error("Error in public applications feed route:", err);
    return NextResponse.json({ error: 'Failed to load applications' }, { status: 500 });
  }
}
