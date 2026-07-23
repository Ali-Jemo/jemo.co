import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import { DEPT_CHANNELS, DEPT_BOT_KEY } from '@/lib/departments';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateContractId() {
  return `IJL-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
}

async function sendAcceptanceEmail(app: {
  name: string; email: string; section: string;
  hours: string; contractId: string;
}) {
  const deptChannel = DEPT_CHANNELS[app.section] ?? 'https://t.me/jemo_channel';
  const deptKey = DEPT_BOT_KEY[app.section] ?? 'research';
  const botLink = `https://t.me/${process.env.TELEGRAM_BOT_USERNAME ?? 'jemo_bot'}?start=accepted_${app.contractId}_${deptKey}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'Jemo <noreply@jemo-labs.com>',
    to: app.email,
    subject: `🎉 تهانينا ${app.name} — تم قبولك في ${app.section}`,
    html: `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#1A171400F;color:#e5e5e5;margin:0;padding:32px;">
  <div style="max-width:560px;margin:0 auto;border:1px solid #2F2924;border-radius:12px;overflow:hidden;">
    <div style="background:#151210;padding:24px;text-align:center;border-bottom:1px solid #2F2924;">
       <h2 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:2px;">Jemo</h2>
      <p style="margin:4px 0 0;color:#666;font-size:12px;">Research &amp; Innovation Branch</p>
    </div>
    <div style="padding:32px;">
      <h3 style="color:#e5e5e5;margin-top:0;">عزيزنا ${app.name}،</h3>
      <p style="color:#aaa;line-height:1.8;">
         يسعدنا إعلامك بقبولك رسمياً في <strong style="color:#ffffff;">${app.section}</strong>
        ضمن منظومة <strong>Jemo</strong>.
      </p>
      <div style="background:#1A1714;border:1px solid #2F2924;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0 0 8px;color:#666;font-size:12px;">تفاصيل عضويتك</p>
         <p style="margin:4px 0;"><span style="color:#666;">الرقم المرجعي:</span> <strong style="color:#ffffff;">${app.contractId}</strong></p>
        <p style="margin:4px 0;"><span style="color:#666;">القسم:</span> <strong>${app.section}</strong></p>
        <p style="margin:4px 0;"><span style="color:#666;">الساعات:</span> ${app.hours}</p>
      </div>
      <p style="color:#aaa;line-height:1.8;">للبدء الفوري، اضغط على زر البوت أدناه للانضمام لقناة قسمك:</p>
      <div style="text-align:center;margin:24px 0;">
         <a href="${botLink}" style="display:inline-block;background:#ffffff;color:#1A171400F;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">
          🤖 فتح البوت والانضمام
        </a>
      </div>
      <p style="color:#555;font-size:13px;">
        أو انضم مباشرة:<br>
         📢 قناة قسمك: <a href="${deptChannel}" style="color:#ffffff;">${deptChannel}</a><br>
         🌐 القناة الرئيسية: <a href="https://t.me/jemo_channel" style="color:#ffffff;">t.me/jemo_channel</a>
      </p>
    </div>
    <div style="background:#1A1714;padding:16px;text-align:center;border-top:1px solid #2F2924;">
      <p style="margin:0;color:#444;font-size:11px;">Jemo © 2026 — Research &amp; Recruitment Division</p>
    </div>
  </div>
</body>
</html>`,
  });
}

async function sendRejectionEmail(app: { name: string; email: string; section: string }) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'Jemo <noreply@jemo-labs.com>',
    to: app.email,
    subject: `Jemo — بخصوص طلب انضمامك لـ ${app.section}`,
    html: `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#1A171400F;color:#e5e5e5;margin:0;padding:32px;">
  <div style="max-width:560px;margin:0 auto;border:1px solid #2F2924;border-radius:12px;overflow:hidden;">
    <div style="background:#151210;padding:24px;text-align:center;border-bottom:1px solid #2F2924;">
      <h2 style="margin:0;color:#a3a858;font-size:22px;letter-spacing:2px;">Jemo</h2>
    </div>
    <div style="padding:32px;">
      <h3 style="color:#e5e5e5;margin-top:0;">عزيزنا ${app.name}،</h3>
      <p style="color:#aaa;line-height:1.8;">
        شكراً لتقديمك للانضمام إلى <strong>${app.section}</strong> في Jemo.<br><br>
        بعد المراجعة، لم نتمكن من قبول طلبك في هذه المرحلة. نشجعك على التقديم مجدداً
        في المستقبل مع المزيد من التجربة.
      </p>
      <p style="color:#555;font-size:13px;">مع التقدير،<br>فريق Jemo</p>
    </div>
  </div>
</body>
</html>`,
  });
}

function escapeMarkdown(text: string) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

async function notifyTelegramBot(app: {
  name: string; section: string; contractId: string; chatId?: string;
}) {
  // ponytail: fire-and-forget via Bot API HTTP, no SDK needed in Next.js route
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !app.chatId) return;

  const botKey = DEPT_BOT_KEY[app.section] ?? 'research';
  const deptChannel = DEPT_CHANNELS[app.section] ?? 'https://t.me/jemo_channel';

  const text = `🎉 *مبروك ${escapeMarkdown(app.name)}!*\n\nتم قبولك رسمياً في *${escapeMarkdown(app.section)}*\n\nرقمك المرجعي: \`${app.contractId}\`\n\n📢 قناة قسمك: ${deptChannel}\n\n/mydept لعرض تفاصيل قسمك`;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: app.chatId,
      text,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: `📢 ${botKey === 'research' ? 'قناة الأبحاث' : botKey === 'code' ? 'قناة البرمجة' : botKey === 'design' ? 'قناة التصميم' : 'قناة المحتوى'}`, url: deptChannel },
          { text: '🌐 القناة الرئيسية', url: 'https://t.me/jemo_channel' },
        ]],
      },
    }),
  });
}

export async function POST(req: NextRequest) {
  // Simple admin auth — header must match ADMIN_SECRET env var
  const secret = req.headers.get('x-admin-secret');
  if (
    !secret ||
    !process.env.ADMIN_SECRET ||
    secret.length !== process.env.ADMIN_SECRET.length ||
    !crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(process.env.ADMIN_SECRET))
  ) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id, status } = body; // status: 'accepted' | 'rejected'

  if (!id || !['accepted', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }
  const db = supabaseAdmin();

  // Fetch the application first
  const { data: app, error: fetchErr } = await db
    .from('applications')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchErr || !app) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const contractId = status === 'accepted' ? generateContractId() : null;

  const { error: updateErr } = await db
    .from('applications')
    .update({ status, contract_id: contractId })
    .eq('id', id);

  if (updateErr) {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  // Fire notifications (don't block on failures)
  try {
    if (status === 'accepted') {
      await sendAcceptanceEmail({ ...app, contractId: contractId! });
      await notifyTelegramBot({ name: app.name, section: app.section, contractId: contractId!, chatId: app.telegram_chat_id });
    } else {
      await sendRejectionEmail(app);
    }
  } catch (err) {
    // Log but don't fail — status is already updated in DB
    console.error('notification error:', err);
  }

  return NextResponse.json({ ok: true, contractId });
}
