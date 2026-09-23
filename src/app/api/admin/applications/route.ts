import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET(req: NextRequest) {
  // Rate limiting plus dual auth (x-admin-secret OR verified Clerk admin) all
  // live in one place now — see src/lib/admin-guard.ts.
  const auth = await requireAdmin(req, { bucket: 'applications', limit: 15 });
  if (!auth.ok) return auth.response;

  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from('applications')
      .select('id, name, email, section, status, hours, experience, portfolio, contract_id, created_at')
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
