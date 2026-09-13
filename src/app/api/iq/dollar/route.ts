import { NextResponse } from "next/server";

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const [latestRes, historyRes] = await Promise.all([
      fetch(
        "https://ayanadollar-dhkgohtw.manus.space/api/trpc/prices.marketLatest?batch=1&input=%7B%7D",
        {
          headers: { "User-Agent": "JemoHassaApp/1.0" },
          next: { revalidate: 60 },
          signal: AbortSignal.timeout(8000),
        }
      ),
      fetch(
        "https://ayanadollar-dhkgohtw.manus.space/api/trpc/prices.marketHistory?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22days%22%3A7%7D%7D%7D",
        {
          headers: { "User-Agent": "JemoHassaApp/1.0" },
          next: { revalidate: 60 },
          signal: AbortSignal.timeout(8000),
        }
      ),
    ]);

    if (!latestRes.ok) {
      throw new Error(`Failed to fetch latest prices: ${latestRes.status}`);
    }

    const latestJson = await latestRes.json();
    const historyJson = await historyRes.json();

    const latest = latestJson?.[0]?.result?.data?.json;
    const history = (historyJson?.[0]?.result?.data?.json as Array<{ sellRate: number }>) ?? [];

    const buyRatePer100 = Math.round((latest?.buyRate ?? 1550) * 100);
    const sellRatePer100 = Math.round((latest?.sellRate ?? 1556.5) * 100);

    // 7-day stats calculation
    const validSellRates = history
      .map((h) => Number(h.sellRate))
      .filter((r) => Number.isFinite(r) && r > 0);

    const avgRate = validSellRates.length
      ? Math.round((validSellRates.reduce((a, b) => a + b, 0) / validSellRates.length) * 100)
      : 155290;

    const highRate = validSellRates.length
      ? Math.round(Math.max(...validSellRates) * 100)
      : 156000;

    const lowRate = validSellRates.length
      ? Math.round(Math.min(...validSellRates) * 100)
      : 154900;

    const firstRate = validSellRates[0] ? Math.round(validSellRates[0] * 100) : 154900;
    const change7Days = sellRatePer100 - firstRate;

    return NextResponse.json({
      success: true,
      sellRate: sellRatePer100,
      buyRate: buyRatePer100,
      marketName: latest?.marketName || "سوق بغداد المحلي",
      location: latest?.location || "Baghdad",
      sourceName: "@dollariraqi",
      sourceFullTitle: "سعر الدولار في العراق — Telegram dollariraqi",
      sourceUrl: latest?.sourceUrl || "https://t.me/dollariraqi",
      sourcePublishedAt: latest?.sourcePublishedAt || "2026-09-07T15:56:34.000Z",
      fetchedAt: latest?.fetchedAt || new Date().toISOString(),
      avg7Days: avgRate,
      high7Days: highRate,
      low7Days: lowRate,
      change7Days: change7Days,
      status:
        sellRatePer100 > avgRate
          ? "مرتفع — أعلى من متوسط الأسبوع"
          : "منخفض — أقل من متوسط الأسبوع",
      platform: {
        name: "آيا نصير — منصة متابعة الدولار",
        url: "https://ayanadollar-dhkgohtw.manus.space/dashboard",
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    // Resilient fallback with authentic baseline
    return NextResponse.json({
      success: false,
      fallback: true,
      error: errorMsg,
      sellRate: 155650,
      buyRate: 155000,
      marketName: "سوق بغداد المحلي",
      location: "Baghdad",
      sourceName: "@dollariraqi",
      sourceFullTitle: "سعر الدولار في العراق — Telegram dollariraqi",
      sourceUrl: "https://t.me/dollariraqi",
      sourcePublishedAt: "2026-09-07T15:56:34.000Z",
      fetchedAt: new Date().toISOString(),
      avg7Days: 155290,
      high7Days: 156000,
      low7Days: 154900,
      change7Days: 750,
      status: "مرتفع — أعلى من متوسط الأسبوع",
      platform: {
        name: "آيا نصير — منصة متابعة الدولار",
        url: "https://ayanadollar-dhkgohtw.manus.space/dashboard",
      },
    });
  }
}
