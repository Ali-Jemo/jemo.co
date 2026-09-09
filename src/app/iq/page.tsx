import MarketTicker from "@/components/iq/MarketTicker";
import CurrencyConverter from "@/components/iq/CurrencyConverter";
import NewsDigest from "@/components/iq/NewsDigest";
import ToolsHub from "@/components/iq/ToolsHub";
import Link from "next/link";
import { Sparkles, MapPin, ArrowLeft, ShieldCheck, HeartHandshake } from "lucide-react";

export default function IqPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Header Welcome & Mission Strip */}
      <section className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#121c1e] via-[#0d1618] to-[#0a1012] border border-white/10 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#bef264]">
              <span className="w-2 h-2 rounded-full bg-[#bef264] animate-pulse" />
              <span>نبض اليوم في العراق · DAILY IRAQI PULSE</span>
              <span className="text-white/30 hidden sm:inline">·</span>
              <span className="text-white/60 hidden sm:inline">تحديثات حية ومجتمعية</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-kufi font-black text-white tracking-tight leading-tight">
              كل صباح: الأرقام الحقيقية، الأخبار الموثوقة، وأدلة محلتك.
            </h1>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              منصة عراقيّة صُممت لتختصر عليك 5 تطبيقات وقنوات تليغرام مشتتة. سعر البورصة الفعلي، الذهب، أمبير المولد، وأماكن محلتك التي يتجاهلها غوغل ماب.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2.5">
            <Link
              href="/iq/map"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#bef264] hover:bg-[#a3e635] text-[#0c1415] font-kufi font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <MapPin className="w-4 h-4" />
              <span>استكشف خريطة محلتك</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-[#bef264]/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. Live Economic Rates Ticker (Dollar, Gold, Ampere, Gas) */}
      <MarketTicker />

      {/* 3. Middle Two-Column Grid: Converter + News Digest */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column in RTL: Currency Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6" id="calculator">
          <CurrencyConverter />

          {/* Micro-Community CTA Card */}
          <div className="p-4 rounded-2xl bg-[#0e1618] border border-white/10 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <HeartHandshake className="w-4 h-4 text-[#bef264]" />
              <span>مجتمع يصنع خريطته بنفسه</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              تعرف محل كوزمتك بضاعته أصلية؟ أسواق يوصل للبيت؟ مصلح سبالت ثقة وما ينصب؟ ساهم بتوثيقهم في خريطة هسه لخدمة جيرانك ومحلتك.
            </p>
            <div className="pt-1">
              <Link
                href="/iq/map"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#bef264] hover:underline"
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
      <footer className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-white/50">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white/80">منصة هسه العراقية</span>
          <span>·</span>
          <span>مشروع تقني مجتمعي مفتوح المصدر</span>
        </div>

        <div className="flex items-center gap-2">
          <span>مُشغل بواسطة</span>
          <Link
            href="/"
            className="text-[#bef264] hover:underline font-bold transition-colors"
          >
            JEMO LABS — بيت الحكمة الرقمي
          </Link>
        </div>
      </footer>
    </div>
  );
}
