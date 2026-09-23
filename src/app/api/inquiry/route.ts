import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, escapeHtml, getClientIp, sanitizeInput, escapeMarkdown } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabase";
import { COMPUTE_RESOURCES } from "@/lib/compute-resources";

// ponytail: unified inquiry endpoint for support (sponsorship) and compute requests with Supabase persistence.
const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey && resendKey !== "re_YOUR_KEY" ? new Resend(resendKey) : null;

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const SUPPORT_CATEGORIES = ["institutional", "compute", "grant", "custom"] as const;
const SUPPORT_CATEGORY_AR: Record<string, string> = {
  institutional: "رعاية مؤسسية / جامعة",
  compute: "تبرع بحوسبة أو عتاد",
  grant: "منحة مالية / تحويل بنكي",
  custom: "استفسار أو تعاون آخر",
};



interface InquiryPayload {
  type: "support" | "compute";
  email: string;
  name: string;
  fields: Array<[string, string]>;
}

function typeLabelAr(type: InquiryPayload["type"]): string {
  return type === "support" ? "استفسار رعاية ودعم" : "طلب ساعات حوسبية";
}

async function sendInquirerConfirmation(payload: InquiryPayload) {
  if (!resend) return;

  const rows = payload.fields
    .map(
      ([label, value]) =>
        `<p style="margin:4px 0;"><span style="color:#666;">${escapeHtml(label)}:</span> <strong style="color:#f0f0f0;">${escapeHtml(value)}</strong></p>`
    )
    .join("");

  await resend.emails
    .send({
      from: process.env.EMAIL_FROM || "Jemo <onboarding@resend.dev>",
      to: payload.email,
      subject: "📨 تم استلام استفسارك — JEMO LABS",
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
      <h3 style="color:#e5e5e5;margin-top:0;">عزيزنا ${escapeHtml(payload.name)}،</h3>
      <p style="color:#aaa;line-height:1.8;">
        تم استلام <strong style="color:#ffffff;">${escapeHtml(typeLabelAr(payload.type))}</strong> الذي أرسلته بنجاح.
      </p>
      <div style="background:#1A1714;border:1px solid #2F2924;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0 0 8px;color:#666;font-size:12px;">ملخص بياناتك المسجلة</p>
        ${rows}
        <p style="margin:8px 0 0;color:#666;font-size:12px;">حالة الطلب: <span style="color:#f59e0b;">قيد المراجعة</span></p>
      </div>
      <p style="color:#aaa;line-height:1.8;">
        سيتواصل معك فريق JEMO LABS في أقرب وقت. شكراً لاهتمامك بدعم البحث العلمي المستقل.
      </p>
    </div>
  </div>
</body>
</html>`,
    })
    .catch((err) => console.error("Inquiry confirmation email error:", err));
}

async function sendAdminTelegramAlert(payload: InquiryPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  const lines = payload.fields
    .map(([label, value]) => `• *${escapeMarkdown(label)}:* ${escapeMarkdown(value)}`)
    .join("\n");

  const text = `📨 *${typeLabelAr(payload.type)} جديد!*\n\n👤 *الاسم:* ${escapeMarkdown(payload.name)}\n📧 *البريد:* \`${payload.email}\`\n${lines}`;

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
    }).catch((err) => console.error("Inquiry Telegram alert error:", err));
  }
}

export async function POST(req: NextRequest) {
  // Rate limit: max 5 inquiries per 10 minutes per IP
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`inquiry:${ip}`, 5, 10 * 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "تم تجاوز الحد الأقصى للمحاولات. يرجى الانتظار والمحاولة لاحقاً." },
      { status: 429, headers: { "Retry-After": "600" } }
    );
  }

  try {
    const body = await req.json();

    if (body?.type !== "support" && body?.type !== "compute") {
      return NextResponse.json({ error: "نوع الطلب غير معروف" }, { status: 400 });
    }
    const type: InquiryPayload["type"] = body.type;

    const rawName = typeof body.name === "string" ? body.name : "";
    const rawEmail = typeof body.email === "string" ? body.email.trim() : "";

    if (rawName.trim().length < 2 || rawName.length > 80) {
      return NextResponse.json({ error: "يرجى إدخال اسم صحيح (2–80 حرفاً)" }, { status: 400 });
    }
    if (!rawEmail || !EMAIL_REGEX.test(rawEmail) || rawEmail.length > 254) {
      return NextResponse.json({ error: "يرجى إدخال بريد إلكتروني صالح" }, { status: 400 });
    }

    const cleanName = sanitizeInput(rawName, 80);
    const cleanEmail = rawEmail.toLowerCase().trim();
    const fields: Array<[string, string]> = [];

    if (type === "support") {
      const category =
        typeof body.category === "string" && (SUPPORT_CATEGORIES as readonly string[]).includes(body.category)
          ? body.category
          : "institutional";
      const organization = typeof body.organization === "string" ? sanitizeInput(body.organization, 120) : "";
      const amountOrOffer = typeof body.amountOrOffer === "string" ? sanitizeInput(body.amountOrOffer, 120) : "";
      const message = typeof body.message === "string" ? body.message : "";

      if (message.trim().length < 5 || message.length > 2000) {
        return NextResponse.json(
          { error: "تفاصيل المقترح يجب أن تكون بين 5 و2000 حرف" },
          { status: 400 }
        );
      }

      fields.push(["نوع الرعاية", SUPPORT_CATEGORY_AR[category]]);
      if (organization) fields.push(["المؤسسة", organization]);
      if (amountOrOffer) fields.push(["حجم المساهمة", amountOrOffer]);
      fields.push(["التفاصيل", sanitizeInput(message, 2000)]);
    } else {
      const institution = typeof body.institution === "string" ? body.institution : "";
      const resourceId = typeof body.resource === "string" ? body.resource : "";
      const proposal = typeof body.proposal === "string" ? body.proposal : "";

      if (institution.trim().length < 2 || institution.length > 120) {
        return NextResponse.json({ error: "يرجى إدخال اسم الجامعة أو المؤسسة" }, { status: 400 });
      }
      const matched = COMPUTE_RESOURCES.find((r) => r.id === resourceId);
      if (!matched) {
        return NextResponse.json({ error: "المورد الحوسبي المطلوب غير معروف" }, { status: 400 });
      }
      if (proposal.trim().length < 5 || proposal.length > 2000) {
        return NextResponse.json(
          { error: "ملخص المقترح يجب أن يكون بين 5 و2000 حرف" },
          { status: 400 }
        );
      }

      fields.push(["المؤسسة", sanitizeInput(institution, 120)]);
      fields.push(["المورد المطلوب", matched.label]);
      fields.push(["ملخص المقترح", sanitizeInput(proposal, 2000)]);
    }

    const insertData = type === "support"
      ? {
          type,
          name: cleanName,
          email: cleanEmail,
          organization: (typeof body.organization === "string" ? sanitizeInput(body.organization, 120) : "") || null,
          amount_or_funding: (typeof body.amountOrOffer === "string" ? sanitizeInput(body.amountOrOffer, 120) : "") || null,
          message: sanitizeInput(typeof body.message === "string" ? body.message : "", 2000),
        }
      : {
          type,
          name: cleanName,
          email: cleanEmail,
          institution: sanitizeInput(typeof body.institution === "string" ? body.institution : "", 120),
          resource: COMPUTE_RESOURCES.find((r) => r.id === body.resource)?.label ?? body.resource,
          message: sanitizeInput(typeof body.proposal === "string" ? body.proposal : "", 2000),
          proposal: sanitizeInput(typeof body.proposal === "string" ? body.proposal : "", 2000),
        };

    const insert = await supabaseAdmin().from("inquiries").insert(insertData as never) as unknown as { error: { message?: string } | null };
    if (insert.error) {
      return NextResponse.json({ success: false, error: "تعذر الحفظ الآن، حاول لاحقاً" }, { status: 502 });
    }
    const payload: InquiryPayload = { type, email: cleanEmail, name: cleanName, fields };

    // Notifications without revealing background failures to the caller
    try {
      await sendInquirerConfirmation(payload);
      await sendAdminTelegramAlert(payload);
    } catch (notifErr) {
      console.error("Inquiry notification error:", notifErr);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Unhandled error in inquiry submit:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
