import { NextRequest, NextResponse } from "next/server";
import { INITIATIVES } from "@/lib/data/research-data";

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
  try {
    const body = await req.json();
    const { name, email, initiative, message } = body;

    if (!name || !email || !initiative) {
      return NextResponse.json(
        { error: "الاسم والبريد والمبادرة المطلوبة يجب ملؤها" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "بريد إلكتروني غير صالح" }, { status: 400 });
    }

    const found = INITIATIVES.find((i) => i.slug === initiative);
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
