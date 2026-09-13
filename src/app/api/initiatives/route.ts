import { NextRequest, NextResponse } from "next/server";
import { INITIATIVES } from "@/lib/data/research-data";
import { checkRateLimit, getClientIp, sanitizeInput } from "@/lib/security";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const status = searchParams.get("status");

  try {
    let result = [...INITIATIVES];

    if (slug) {
      result = result.filter((i) => i.slug === slug);
      if (result.length === 0) {
        return NextResponse.json({ error: "المبادرة غير موجودة" }, { status: 404 });
      }
    }

    if (status && status !== "all") {
      result = result.filter((i) => i.status === status);
    }

    return NextResponse.json({ data: result }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Rate limit: max 10 submissions per 10 minutes per IP
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`initiative_interest:${ip}`, 10, 10 * 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "تم تجاوز الحد الأقصى للمحاولات. يرجى الانتظار والمحاولة لاحقاً." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, initiative, message } = body;

    if (!name || !email || !initiative) {
      return NextResponse.json(
        { error: "الاسم والبريد والمبادرة المطلوبة يجب ملؤها" },
        { status: 400 }
      );
    }

    if (
      typeof name !== "string" || name.length > 100 ||
      typeof email !== "string" || email.length > 100 ||
      typeof initiative !== "string" || initiative.length > 100 ||
      (message && (typeof message !== "string" || message.length > 2000))
    ) {
      return NextResponse.json({ error: "المدخلات غير صالحة" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "بريد إلكتروني غير صالح" }, { status: 400 });
    }

    const cleanInitiative = sanitizeInput(initiative, 100);
    const found = INITIATIVES.find((i) => i.slug === cleanInitiative);
    if (!found) {
      return NextResponse.json({ error: "المبادرة غير موجودة" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, initiative: found.title, message: "تم تسجيل اهتمامك بنجاح" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
