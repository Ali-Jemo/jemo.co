import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS: Record<string, true> = {
  "share.gemini.google": true,
  "gemini.google.com": true,
  "g.co": true,
  "chatgpt.com": true,
  "chat.openai.com": true,
};
function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, "/")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)));
}

function extractText(html: string) {
  const jsonLd = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1])
    .join("\n");
  const metadata = [...html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:description|description)["'][^>]+content=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1])
    .join("\n");
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return decodeHtml(`${metadata}\n${jsonLd}\n${body}`).replace(/\s+/g, " ").trim();
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) return NextResponse.json({ error: "رابط المشاركة مفقود." }, { status: 400 });

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "الرابط غير صالح." }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        accept: "text/html,application/xhtml+xml,application/json",
        "user-agent": "JEMO-Public-Conversation-Importer/1.0",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(8000),
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return NextResponse.json({ error: "رابط المشاركة أعاد تحويلاً غير صالح." }, { status: 502 });
      const redirected = new URL(location, url);
      if (redirected.protocol !== "https:" || !ALLOWED_HOSTS[redirected.hostname]) {
        return NextResponse.json({ error: "رفضنا التحويل إلى نطاق غير مسموح." }, { status: 400 });
      }
      return NextResponse.json({ error: "الرابط يحتاج تحويلاً من مزود الخدمة. أعد نسخ رابط المشاركة من جديد." }, { status: 409 });
    }
    if (!response.ok) {
      return NextResponse.json({ error: "لم يفتح مزود الخدمة رابط المشاركة." }, { status: 502 });
    }
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml") && !contentType.includes("application/json")) {
      return NextResponse.json({ error: "رابط المشاركة لا يعيد صفحة نصية قابلة للقراءة." }, { status: 415 });
    }
    const rawBody = await response.text();
    const text = extractText(rawBody);
    if (text.length < 40) {
      return NextResponse.json({ error: "الرابط لا يحتوي على نص عام قابل للقراءة. ألصق نسخة المحادثة بدلاً منه." }, { status: 422 });
    }
    return NextResponse.json({ text: text.slice(0, 120_000) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "تعذر الوصول إلى رابط المشاركة حالياً. ألصق النص مباشرة." }, { status: 502 });
  }
}
