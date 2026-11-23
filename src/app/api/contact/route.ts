import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, escapeHtml, getClientIp, sanitizeInput } from "@/lib/security";
import { contactEmail } from "@/lib/site";
import { supabaseAdmin } from "@/lib/supabase";

const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey && resendKey !== "re_YOUR_KEY" ? new Resend(resendKey) : null;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`contact:${ip}`, 5, 10 * 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "تم تجاوز الحد. حاول بعد قليل." },
      { status: 429, headers: { "Retry-After": "600" } }
    );
  }

  let body: { name?: unknown; email?: unknown; message?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "تعذر قراءة الرسالة" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? sanitizeInput(body.name, 80) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const message = typeof body.message === "string" ? sanitizeInput(body.message, 2000) : "";

  if (name.trim().length < 2) {
    return NextResponse.json({ error: "الاسم قصير" }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    return NextResponse.json({ error: "البريد غير صالح" }, { status: 400 });
  }
  if (message.trim().length < 5) {
    return NextResponse.json({ error: "الرسالة قصيرة" }, { status: 400 });
  }

  const inbox = contactEmail();
  let stored = false;
  let mailed = false;

  try {
    const insert = await supabaseAdmin()
      .from("inquiries")
      .insert({
        type: "contact",
        name,
        email,
        message,
      } as never);
    stored = !insert.error;
  } catch {
    stored = false;
  }

  if (resend && inbox) {
    try {
      const sent = await resend.emails.send({
        from: process.env.EMAIL_FROM || "JEMO LABS <onboarding@resend.dev>",
        to: inbox,
        replyTo: email,
        subject: `رسالة من ${name}`,
        html: `<p>${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message)}</p>`,
      });
      mailed = !sent.error;
    } catch {
      mailed = false;
    }
  }

  if (!stored && !mailed) {
    return NextResponse.json(
      {
        error: inbox
          ? "تعذر تسليم الرسالة الآن. أعد المحاولة لاحقاً."
          : "لم يُضبط عنوان التواصل (CONTACT_EMAIL) ولا التخزين. لا يمكن تسليم الرسالة.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ success: true, stored, mailed }, { status: 201 });
}
