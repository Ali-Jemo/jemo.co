import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, escapeHtml, getClientIp, sanitizeInput } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabase";

// ponytail: newsletter subscription endpoint with rate limiting, Supabase persistence, & Resend confirmation
const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey && resendKey !== "re_YOUR_KEY" ? new Resend(resendKey) : null;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendWelcomeEmail(to: string, topics: string[], format: "html" | "markdown") {
  if (!resend) return;

  const safeEmail = escapeHtml(to);
  const safeTopics = topics.length > 0
    ? topics.map((t) => `<li style="margin: 4px 0;">${escapeHtml(t)}</li>`).join("")
    : "<li>جميع المحاور البحثية والتقنية</li>";

  await resend.emails
    .send({
      from: process.env.EMAIL_FROM || "JEMO LABS <newsletter@jemo-labs.com>",
      to,
      subject: "✨ مرحباً بك في نشرة JEMO DISPATCH العلمية",
      html: `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"></head>
<body style="font-family: 'Noto Kufi Arabic', Arial, sans-serif; background: #08090d; color: #f7f7f5; margin: 0; padding: 32px 16px;">
  <div style="max-width: 580px; margin: 0 auto; background: #162021; border: 1px solid #222f30; border-radius: 16px; overflow: hidden;">
    <div style="padding: 24px 32px; border-bottom: 1px solid #222f30; background: #0c1213; text-align: center;">
      <h1 style="margin: 0; font-size: 20px; color: #a7e26e; letter-spacing: 1px;">JEMO DISPATCH</h1>
      <p style="margin: 4px 0 0; font-size: 11px; color: #8fa6a7;">النشرة العلمية والتقنية لمؤسسة JEMO LABS</p>
    </div>
    <div style="padding: 32px 28px; font-size: 14px; line-height: 1.8; color: #d0d7d8;">
      <p style="margin-top: 0;">أهلاً بك،</p>
      <p>
        تم تأكيد اشتراك بريدك الإلكتروني (<strong style="color: #ffffff;">${safeEmail}</strong>) في نشرة 
        <strong style="color: #a7e26e;">JEMO DISPATCH</strong> الدورية.
      </p>
      <div style="background: #0c1213; border: 1px solid #222f30; border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
        <p style="margin: 0 0 8px; font-size: 12px; color: #8fa6a7; font-weight: bold;">تفضيلات المحتوى المسجلة:</p>
        <ul style="margin: 0; padding-right: 20px; font-size: 13px; color: #f7f7f5;">
          ${safeTopics}
        </ul>
        <p style="margin: 12px 0 0; font-size: 11px; color: #8fa6a7;">
          صيغة الاستلام المعتمدة: <strong>${format.toUpperCase()}</strong>
        </p>
      </div>
      <p>
        تصدر نشرتنا نصف شهرياً متضمنة إيداعات الأبحاث مسبقة النشر، أكواد النوى والنظم السيادية، وتحليلات معماريات الذكاء الاصطناعي، بدون أي إعلانات أو تتبع.
      </p>
      <div style="text-align: center; margin: 28px 0 12px;">
        <a href="https://jemo.co/newsletter" style="display: inline-block; background: #a7e26e; color: #08090d; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 13px;">
          تصفح أرشيف الأعداد والأكواد
        </a>
      </div>
    </div>
    <div style="padding: 16px 28px; border-top: 1px solid #222f30; font-size: 11px; color: #647d7e; text-align: center;">
      JEMO LABS • بغداد • معرفة مفتوحة ومستقلة • يمكنك تعديل خياراتك في أي وقت
    </div>
  </div>
</body>
</html>`,
    })
    .catch((err) => {
      console.error("Resend newsletter confirmation error:", err);
    });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`newsletter:${ip}`, 5, 60_000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "طلبات متكررة، يرجى المحاولة بعد قليل" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.max(1, Math.ceil((rateLimit.resetTime - Date.now()) / 1000))),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
    const format = body.format === "markdown" ? "markdown" : "html";
    const topics: string[] = Array.isArray(body.topics)
      ? body.topics.map((t: unknown) => sanitizeInput(String(t))).slice(0, 10)
      : [];

    if (!rawEmail || !EMAIL_REGEX.test(rawEmail) || rawEmail.length > 254) {
      return NextResponse.json(
        { error: "يرجى إدخال بريد إلكتروني صالح" },
        { status: 400 }
      );
    }

    const email = sanitizeInput(rawEmail);

    const upsert = await supabaseAdmin()
      .from("newsletter_subscribers")
      .upsert(
        { email, format, topics },
        { onConflict: "email", ignoreDuplicates: true }
      );
    if (upsert.error) {
      return NextResponse.json({ success: false, error: "تعذر الحفظ الآن، حاول لاحقاً" }, { status: 502 });
    }

    // ponytail: fire welcome email asynchronously without blocking the response
    sendWelcomeEmail(email, topics, format);
    return NextResponse.json({
      success: true,
      email,
      message: "تم تسجيل اشتراكك بنجاح في نشرة JEMO DISPATCH",
    });
  } catch {
    return NextResponse.json(
      { error: "تعذر معالجة الطلب، يرجى التأكد من صحة البيانات" },
      { status: 400 }
    );
  }
}
