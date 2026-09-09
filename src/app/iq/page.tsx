import MarketTicker from "@/components/iq/MarketTicker";
import CurrencyConverter from "@/components/iq/CurrencyConverter";
import NewsDigest from "@/components/iq/NewsDigest";
import ToolsHub from "@/components/iq/ToolsHub";
import Link from "next/link";

export default function IqPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 2. Live Economic Rates Ticker (Dollar, Gold, Ampere, Gas) */}
      <MarketTicker />

      {/* 3. Middle Two-Column Grid: Converter + News Digest */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column in RTL: Currency Calculator (5 cols) */}
        <div className="lg:col-span-5" id="calculator">
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
      <footer className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#55696a]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#222f30]">منصة هسه العراقية</span>
          <span>·</span>
          <span>مشروع تقني مجتمعي مفتوح المصدر</span>
        </div>

        <div className="flex items-center gap-2">
          <span>مُشغل بواسطة</span>
          <Link
            href="/"
            className="text-[#222f30] hover:underline font-bold transition-colors"
          >
            JEMO LABS — بيت الحكمة الرقمي
          </Link>
        </div>
      </footer>
    </div>
  );
}
