import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  if (
    !secret ||
    !process.env.ADMIN_SECRET ||
    secret.length !== process.env.ADMIN_SECRET.length ||
    !crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(process.env.ADMIN_SECRET))
  ) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const db = supabaseAdmin();
  const { data, error } = await db
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'db error' }, { status: 500 });

  return NextResponse.json(data);
}
