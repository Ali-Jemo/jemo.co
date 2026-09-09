import MarketTicker from "@/components/iq/MarketTicker";
import CurrencyConverter from "@/components/iq/CurrencyConverter";
import NewsDigest from "@/components/iq/NewsDigest";
import ToolsHub from "@/components/iq/ToolsHub";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";

export default function IqPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 2. Live Economic Rates Ticker (Dollar, Gold, Ampere, Gas) */}
      <MarketTicker />

      {/* 3. Middle Two-Column Grid: Converter + News Digest */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column in RTL: Currency Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6" id="calculator">
          <CurrencyConverter />

          {/* Micro-Community CTA Card */}
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--brand)]/10 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--gold)]">
              <HeartHandshake className="w-4 h-4 text-[var(--gold)]" />
              <span>مجتمع يصنع خريطته بنفسه</span>
            </div>
            <p className="text-xs text-[var(--ink-2)]/70 leading-relaxed">
              تعرف محل كوزمتك بضاعته أصلية؟ أسواق يوصل للبيت؟ مصلح سبالت ثقة وما ينصب؟ ساهم بتوثيقهم في خريطة هسه لخدمة جيرانك ومحلتك.
            </p>
            <div className="pt-1">
              <Link
                href="/iq/map"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--gold)] hover:underline"
              >
                <span>أضف مكاناً في منطقتك الآن</span>
                <span>←</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right column in RTL: 5 Sourced News Digest (7 cols) */}
        <div className="lg:col-span-7">
          <NewsDigest />
        </div>
      </div>

      {/* 4. Iraqi Tools Hub (6 Curated Gateways & Services) */}
      <ToolsHub />

      {/* 5. Institutional Footer Bridge to Jemo Labs */}
      <footer className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-[var(--brand)]/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[var(--ink)]/50">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[var(--ink)]/80">منصة هسه العراقية</span>
          <span>·</span>
          <span>مشروع تقني مجتمعي مفتوح المصدر</span>
        </div>

        <div className="flex items-center gap-2">
          <span>مُشغل بواسطة</span>
          <Link
            href="/"
            className="text-[var(--gold)] hover:underline font-bold transition-colors"
          >
            JEMO LABS — بيت الحكمة الرقمي
          </Link>
        </div>
      </footer>
    </div>
  );
}
