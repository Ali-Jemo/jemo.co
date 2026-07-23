import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('applications')
    .select('id, name, email, created_at, section, status, experience, hours, portfolio, motivation, contract_id')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'db error' }, { status: 500 });

  return NextResponse.json(data);
}