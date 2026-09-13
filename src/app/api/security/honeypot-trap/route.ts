import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/security";
import { banIp } from "@/lib/firewall";

/**
 * Honeypot Trap Route
 * Legitimate human visitors and search engines will never request this URL.
 * Any client requesting this endpoint is an unauthorized crawler/scraper
 * and is immediately blacklisted across the entire site for 24 hours.
 */
export async function GET(req: Request) {
  const ip = getClientIp(req);
  banIp(ip, "Honeypot crawler trap triggered", 86_400_000);

  return NextResponse.json(
    {
      error: "Automated scraper or crawler detected. Your IP has been permanently blacklisted.",
    },
    { status: 403 }
  );
}

export async function POST(req: Request) {
  return GET(req);
}
