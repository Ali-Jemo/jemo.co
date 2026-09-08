import { NextRequest, NextResponse } from "next/server";
import { getDynamicSiteInfo, saveDynamicSiteInfo, SiteInfoData } from "@/lib/dynamic-papers";

export async function GET() {
  try {
    const data = await getDynamicSiteInfo();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }

    const payload = body as SiteInfoData;
    const updated = await saveDynamicSiteInfo(payload);
    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
