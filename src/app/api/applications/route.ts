import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, escapeHtml, getClientIp, sanitizeInput } from "@/lib/security";

const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey && resendKey !== "re_YOUR_KEY" ? new Resend(resendKey) : null;

async function sendSubmissionConfirmationEmail(app: {
  name: string;
  email: string;
  section: string;
  hours: string;
}) {
  if (!resend) return;
  const safeName = escapeHtml(app.name);
  const safeSection = escapeHtml(app.section);
  const safeHours = escapeHtml(app.hours);

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "Jemo <onboarding@resend.dev>",
    to: app.email,
    subject: `📥 تم استلام طلب انضمامك لـ ${safeSection} — JEMO LABS`,
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
         تم استلام طلب انضمامك رسمياً إلى قسم <strong style="color:#ffffff;">${safeSection}</strong>.
      </p>
      <div style="background:#1A1714;border:1px solid #2F2924;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0 0 8px;color:#666;font-size:12px;">ملخص بياناتك المسجلة</p>
        <p style="margin:4px 0;"><span style="color:#666;">الاسم:</span> <strong>${safeName}</strong></p>
        <p style="margin:4px 0;"><span style="color:#666;">القسم:</span> <strong>${safeSection}</strong></p>
        <p style="margin:4px 0;"><span style="color:#666;">ساعات التفرغ:</span> ${safeHours}</p>
        <p style="margin:4px 0;"><span style="color:#666;">حالة الطلب:</span> <span style="color:#f59e0b;">قيد المراجعة</span></p>
      </div>
      <p style="color:#aaa;line-height:1.8;">
        سيقوم فريق المراجعة بتقييم طلبك والرد عليك. يمكنك متابعة حالة طلبك مباشرة عبر المنصة.
      </p>
    </div>
  </div>
</body>
</html>`,
  }).catch((err) => console.error("Email send error:", err));
}

function escapeMarkdown(text: string) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

async function sendNewSubmissionTelegramAlert(app: {
  name: string;
  email: string;
  section: string;
  hours: string;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  const text = `📥 *طلب انضمام جديد!*\n\n👤 *الاسم:* ${escapeMarkdown(app.name)}\n📧 *البريد:* \`${app.email}\`\n📂 *القسم:* ${escapeMarkdown(app.section)}\n⏳ *الساعات:* ${escapeMarkdown(app.hours)}\n\n🔍 يمكنك مراجعة الطلب من لوحة التحكم.`;

  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (adminChatId) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: adminChatId,
        text,
        parse_mode: "Markdown",
      }),
    }).catch((err) => console.error("Telegram alert send error:", err));
  }
}

export async function POST(req: NextRequest) {
  // Rate limit: max 5 application submissions per 10 minutes per IP
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`submit_app:${ip}`, 5, 10 * 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "تم تجاوز الحد الأقصى للمحاولات. يرجى الانتظار والمحاولة لاحقاً." },
      { status: 429, headers: { "Retry-After": "600" } }
    );
  }

  try {
    const body = await req.json();
    const { name, email, telegram, section, experience, hours, portfolio, motivation } = body;

    // Validate required fields
    if (!name || !email || !section || !experience || !hours || !motivation) {
      return NextResponse.json({ error: "جميع الحقول المطلوبة يجب ملؤها" }, { status: 400 });
    }

    // Strict type and length bounds checking
    if (
      typeof name !== 'string' || name.trim().length < 2 || name.length > 80 ||
      typeof motivation !== 'string' || motivation.trim().length < 5 || motivation.length > 3000 ||
      typeof experience !== 'string' || experience.trim().length < 5 || experience.length > 1500 ||
      typeof section !== 'string' || section.length > 80 ||
      typeof hours !== 'string' || hours.length > 50 ||
      (telegram && (typeof telegram !== 'string' || telegram.length > 50)) ||
      (portfolio && (typeof portfolio !== 'string' || portfolio.length > 200))
    ) {
      return NextResponse.json({ error: "المدخلات غير صالحة أو تتجاوز الحد المسموح" }, { status: 400 });
    }

    // RFC-compliant safe email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "بريد إلكتروني غير صالح" }, { status: 400 });
    }

    const cleanName = sanitizeInput(name, 80);
    const cleanEmail = email.toLowerCase().trim().slice(0, 100);
    const cleanSection = sanitizeInput(section, 80);
    const cleanExperience = sanitizeInput(experience, 1500);
    const cleanHours = sanitizeInput(hours, 50);
    const cleanPortfolio = portfolio ? sanitizeInput(portfolio, 200) : null;
    const cleanMotivation = sanitizeInput(motivation, 3000);
    const cleanTelegram = telegram ? sanitizeInput(telegram, 50) : null;

    const db = supabaseAdmin();

    const insertPayload: Record<string, unknown> = {
      name: cleanName,
      email: cleanEmail,
      section: cleanSection,
      experience: cleanExperience,
      hours: cleanHours,
      portfolio: cleanPortfolio,
      motivation: cleanMotivation,
      status: "pending",
    };

    if (cleanTelegram) {
      insertPayload.telegram_username = cleanTelegram;
    }

    const { data, error } = await db
      .from("applications")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("Supabase application insert error:", error.message);
      return NextResponse.json(
        { error: "حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مجدداً." },
        { status: 500 }
      );
    }

    // Fire notifications asynchronously without revealing background failures
    try {
      await sendSubmissionConfirmationEmail({
        name: data.name,
        email: data.email,
        section: data.section,
        hours: data.hours,
      });
      await sendNewSubmissionTelegramAlert({
        name: data.name,
        email: data.email,
        section: data.section,
        hours: data.hours,
      });
    } catch (notifErr) {
      console.error("Notification trigger error:", notifErr);
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Unhandled error in application submit:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
