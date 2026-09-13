import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import { DEPT_CHANNELS, DEPT_BOT_KEY } from '@/lib/departments';
import { checkRateLimit, escapeHtml, getClientIp, safeCompare } from '@/lib/security';
import { currentUser } from '@clerk/nextjs/server';

const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey && resendKey !== 're_YOUR_KEY' ? new Resend(resendKey) : null;

function generateContractId() {
  return `IJL-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
}

async function sendAcceptanceEmail(app: {
  name: string; email: string; section: string;
  hours: string; contractId: string;
}) {
  const safeName = escapeHtml(app.name);
  const safeSection = escapeHtml(app.section);
  const safeHours = escapeHtml(app.hours);
  const safeContractId = escapeHtml(app.contractId);

  const deptChannel = DEPT_CHANNELS[app.section] ?? 'https://t.me/jemo_channel';
  const deptKey = DEPT_BOT_KEY[app.section] ?? 'research';
  const botLink = `https://t.me/${process.env.TELEGRAM_BOT_USERNAME ?? 'jemo_bot'}?start=accepted_${encodeURIComponent(app.contractId)}_${encodeURIComponent(deptKey)}`;

  if (!resend) return;
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'Jemo <noreply@jemo-labs.com>',
    to: app.email,
    subject: `🎉 تهانينا ${safeName} — تم قبولك في ${safeSection}`,
    html: `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#1A1714;color:#e5e5e5;margin:0;padding:32px;">
  <div style="max-width:560px;margin:0 auto;border:1px solid #2F2924;border-radius:12px;overflow:hidden;">
    <div style="background:#151210;padding:24px;text-align:center;border-bottom:1px solid #2F2924;">
       <h2 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:2px;">Jemo</h2>
      <p style="margin:4px 0 0;color:#666;font-size:12px;">Research &amp; Innovation Branch</p>
    </div>
    <div style="padding:32px;">
      <h3 style="color:#e5e5e5;margin-top:0;">عزيزنا ${safeName}،</h3>
      <p style="color:#aaa;line-height:1.8;">
         يسعدنا إعلامك بقبولك رسمياً في <strong style="color:#ffffff;">${safeSection}</strong>
        ضمن منظومة <strong>Jemo</strong>.
      </p>
      <div style="background:#1A1714;border:1px solid #2F2924;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0 0 8px;color:#666;font-size:12px;">تفاصيل عضويتك</p>
         <p style="margin:4px 0;"><span style="color:#666;">الرقم المرجعي:</span> <strong style="color:#ffffff;">${safeContractId}</strong></p>
        <p style="margin:4px 0;"><span style="color:#666;">القسم:</span> <strong>${safeSection}</strong></p>
        <p style="margin:4px 0;"><span style="color:#666;">الساعات:</span> ${safeHours}</p>
      </div>
      <p style="color:#aaa;line-height:1.8;">للبدء الفوري، اضغط على زر البوت أدناه للانضمام لقناة قسمك:</p>
      <div style="text-align:center;margin:24px 0;">
         <a href="${botLink}" style="display:inline-block;background:#ffffff;color:#1A1714;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">
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
  if (!resend) return;
  const safeName = escapeHtml(app.name);
  const safeSection = escapeHtml(app.section);

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'Jemo <noreply@jemo-labs.com>',
    to: app.email,
    subject: `Jemo — بخصوص طلب انضمامك لـ ${safeSection}`,
    html: `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#1A1714;color:#e5e5e5;margin:0;padding:32px;">
  <div style="max-width:560px;margin:0 auto;border:1px solid #2F2924;border-radius:12px;overflow:hidden;">
    <div style="background:#151210;padding:24px;text-align:center;border-bottom:1px solid #2F2924;">
      <h2 style="margin:0;color:#a3a858;font-size:22px;letter-spacing:2px;">Jemo</h2>
    </div>
    <div style="padding:32px;">
      <h3 style="color:#e5e5e5;margin-top:0;">عزيزنا ${safeName}،</h3>
      <p style="color:#aaa;line-height:1.8;">
        شكراً لتقديمك للانضمام إلى <strong>${safeSection}</strong> في Jemo.<br><br>
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
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !app.chatId) return;

  const botKey = DEPT_BOT_KEY[app.section] ?? 'research';
  const deptChannel = DEPT_CHANNELS[app.section] ?? 'https://t.me/jemo_channel';

  const text = `🎉 *مبروك ${escapeMarkdown(app.name)}!*\n\nتم قبولك رسمياً في *${escapeMarkdown(app.section)}*\n\nرقمك المرجعي: \`${escapeMarkdown(app.contractId)}\`\n\n📢 قناة قسمك: ${deptChannel}\n\n/mydept لعرض تفاصيل قسمك`;

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
  // Rate limit: max 15 status update attempts per minute per IP
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`admin_status:${ip}`, 15, 60_000);
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
    const body = await req.json();
    const { id, status } = body; // status: 'accepted' | 'rejected'

    if (!id || typeof id !== 'string' || !['accepted', 'rejected'].includes(status)) {
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
      console.error("Failed to update application status:", updateErr.message);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    // Fire notifications asynchronously (don't block status update)
    try {
      if (status === 'accepted') {
        await sendAcceptanceEmail({ ...app, contractId: contractId! });
        const rawTel = String(app.telegram || app.telegram_chat_id || '');
        const tgChatId = rawTel.includes('|') ? rawTel.split('|')[0].trim() : rawTel.trim();
        await notifyTelegramBot({ name: app.name || app.full_name, section: app.section || app.track, contractId: contractId!, chatId: tgChatId });
      } else {
        await sendRejectionEmail(app);
      }
    } catch (err) {
      console.error('Notification dispatch error:', err);
    }

    return NextResponse.json({ ok: true, contractId });
  } catch (err) {
    console.error('Update status unhandled error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
