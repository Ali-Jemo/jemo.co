import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey && resendKey !== "re_YOUR_KEY" ? new Resend(resendKey) : null;

async function sendSubmissionConfirmationEmail(app: {
  name: string;
  email: string;
  section: string;
  hours: string;
}) {
  if (!resend) return;
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "Jemo <onboarding@resend.dev>",
    to: app.email,
    subject: `📥 تم استلام طلب انضمامك لـ ${app.section} — iraqjemo labs`,
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
         تم استلام طلب انضمامك رسمياً إلى قسم <strong style="color:#ffffff;">${app.section}</strong>.
      </p>
      <div style="background:#1A1714;border:1px solid #2F2924;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0 0 8px;color:#666;font-size:12px;">ملخص بياناتك المسجلة</p>
        <p style="margin:4px 0;"><span style="color:#666;">الاسم:</span> <strong>${app.name}</strong></p>
        <p style="margin:4px 0;"><span style="color:#666;">القسم:</span> <strong>${app.section}</strong></p>
        <p style="margin:4px 0;"><span style="color:#666;">ساعات التفرغ:</span> ${app.hours}</p>
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
  try {
    const body = await req.json();
    const { name, email, telegram, section, experience, hours, portfolio, motivation } = body;

    // Validate
    if (!name || !email || !section || !experience || !hours || !motivation) {
      return NextResponse.json({ error: "جميع الحقول المطلوبة يجب ملؤها" }, { status: 400 });
    }

    if (
      typeof name !== 'string' || name.length > 100 ||
      typeof motivation !== 'string' || motivation.length > 5000 ||
      typeof experience !== 'string' || experience.length > 2000 ||
      typeof section !== 'string' || section.length > 100 ||
      typeof hours !== 'string' || hours.length > 100 ||
      (telegram && (typeof telegram !== 'string' || telegram.length > 100))
    ) {
      return NextResponse.json({ error: "المدخلات غير صالحة أو تتجاوز الحد المسموح" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "بريد إلكتروني غير صالح" }, { status: 400 });
    }

    const db = supabaseAdmin();

    // Insert
    const insertPayload: Record<string, unknown> = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      section,
      experience: experience.trim(),
      hours,
      portfolio: portfolio?.trim() || null,
      motivation: motivation.trim(),
      status: "pending",
    };

    if (telegram && typeof telegram === "string" && telegram.trim()) {
      insertPayload.telegram_username = telegram.trim();
    }

    const { data, error } = await db
      .from("applications")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "حدث خطأ أثناء حفظ الطلب", details: error.message, code: error.code },
        { status: 500 }
      );
    }

    // Fire notifications
    try {
      await sendSubmissionConfirmationEmail({ name: data.name, email: data.email, section: data.section, hours: data.hours });
      await sendNewSubmissionTelegramAlert({ name: data.name, email: data.email, section: data.section, hours: data.hours });
    } catch {
      // Ignore background errors
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
