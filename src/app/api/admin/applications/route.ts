import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, getClientIp, safeCompare } from '@/lib/security';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  // Brute-force protection: max 15 requests per minute per IP
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`admin_apps:${ip}`, 15, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  // Dual auth: Check either secret header OR verified Clerk admin session
  const secret = req.headers.get('x-admin-secret');
  const hasValidSecret = secret && process.env.ADMIN_SECRET && safeCompare(secret, process.env.ADMIN_SECRET);

  let isClerkAdmin = false;
  if (!hasValidSecret) {
    try {
      const user = await currentUser();
      if (user) {
        const role = (user.publicMetadata as { role?: string })?.role;
        isClerkAdmin = role === 'admin' || user.emailAddresses.some((e) => e.emailAddress === 'ali.jemo1.9@gmail.com');
      }
    } catch {
      // Ignore clerk failure
    }
  }

  if (!hasValidSecret && !isClerkAdmin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Admin fetch applications error:', error.message);
      return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Admin route unhandled error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
