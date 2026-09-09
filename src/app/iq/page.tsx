import MarketTicker from "@/components/iq/MarketTicker";
import CurrencyConverter from "@/components/iq/CurrencyConverter";
import NewsDigest from "@/components/iq/NewsDigest";
import ToolsHub from "@/components/iq/ToolsHub";
import IqHero from "@/components/iq/IqHero";
import Link from "next/link";

export default function IqPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Time-aware greeting + quick actions */}
      <IqHero />

      {/* 2. Live Economic Rates Ticker (Dollar, Gold, Ampere, Gas) */}
      <MarketTicker />

      {/* 3. Middle Two-Column Grid: Converter + News Digest */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left column in RTL: Currency Calculator (5 cols) */}
        <div className="lg:col-span-5 scroll-mt-20" id="calculator">
          <CurrencyConverter />
        </div>

        {/* Right column in RTL: 5 Sourced News Digest (7 cols) */}
        <div className="lg:col-span-7">
          <NewsDigest />
        </div>
      </div>

      {/* 4. Iraqi Tools Hub (6 Curated Gateways & Services) */}
      <ToolsHub />

      {/* 5. Institutional Footer Bridge to Jemo Labs */}
      <footer className="flex flex-col items-center justify-between gap-2 rounded-2xl border border-[#e4e3e3] bg-white p-4 text-[11px] text-[#55696a] shadow-xs sm:flex-row sm:p-5 sm:text-xs">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-md bg-[#222f30] text-[11px] font-black text-[#cef79e]"
          >
            هـ
          </span>
          <span className="font-bold text-[#222f30]">منصة هسه العراقية</span>
          <span aria-hidden="true">·</span>
          <span>مشروع تقني مجتمعي مفتوح المصدر</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span>مُشغل بواسطة</span>
          <Link
            href="/"
            className="rounded font-bold text-[#222f30] underline decoration-[#a7e26e] decoration-2 underline-offset-4 transition-colors hover:decoration-[#222f30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30]"
          >
            JEMO LABS — بيت الحكمة الرقمي
          </Link>
        </div>
      </footer>
    </div>
  );
}
