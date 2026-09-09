import AmpereTracker from "@/components/iq/AmpereTracker";
import MarketTicker from "@/components/iq/MarketTicker";
import CurrencyConverter from "@/components/iq/CurrencyConverter";
import GoldCalculator from "@/components/iq/GoldCalculator";
import NewsDigest from "@/components/iq/NewsDigest";
import PaydayTracker from "@/components/iq/PaydayTracker";
import ToolsHub from "@/components/iq/ToolsHub";
import IqHero from "@/components/iq/IqHero";
import WeatherDust from "@/components/iq/WeatherDust";
import TrafficBridges from "@/components/iq/TrafficBridges";
import { FuelStationTracker } from "@/components/iq/FuelStationTracker";
import CarCustomsCalculator from "@/components/iq/CarCustomsCalculator";
import Link from "next/link";

export default function IqPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Time-aware greeting + quick actions */}
      <IqHero />

      {/* 2. Live Economic Rates Ticker (Dollar, Gold, Ampere, Gas) */}
      <MarketTicker />

      {/* 3. Real-time Weather, Dust Storm & Air Quality Advisory */}
      <WeatherDust />

      {/* 4. Middle Two-Column Grid: Calculators + News & Paydays */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left column in RTL: Currency & Gold Calculators (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5 scroll-mt-20" id="calculator">
          <CurrencyConverter />
          <GoldCalculator />
        </div>

        {/* Right column in RTL: News Digest & Payday Tracker (7 cols) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          <NewsDigest />
          <PaydayTracker />
        </div>
      </div>

      {/* 5. Live Traffic, Bridges & Security Checkpoints Status */}
      <TrafficBridges />

      {/* 6. Neighborhood Generator Ampere Community Index & Calculator */}
      <AmpereTracker />

      {/* 7. Fuel & Gas Station Tracker & Car Customs Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        <div className="lg:col-span-6">
          <FuelStationTracker />
        </div>
        <div className="lg:col-span-6">
          <CarCustomsCalculator />
        </div>
      </div>

      {/* 8. Iraqi Tools Hub (Curated Gateways & Services) */}
      <ToolsHub />

      {/* 9. Institutional Footer Bridge to Jemo Labs */}
      <footer className="flex flex-col items-center justify-between gap-2 rounded-2xl border border-[#e4e3e3] dark:border-white/10 bg-white dark:bg-[#0e1618] p-4 text-[11px] text-[#55696a] dark:text-white/60 shadow-xs sm:flex-row sm:p-5 sm:text-xs">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-md bg-[#222f30] text-[11px] font-black text-[#cef79e]"
          >
            هـ
          </span>
          <span className="font-bold text-[#222f30] dark:text-white">منصة هسه العراقية</span>
          <span aria-hidden="true">·</span>
          <span>مشروع تقني مجتمعي لخدمة المواطن العراقي</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span>مُشغل بواسطة</span>
          <Link
            href="/"
            className="rounded font-bold text-[#222f30] dark:text-[#bef264] underline decoration-[#a7e26e] decoration-2 underline-offset-4 transition-colors hover:decoration-[#222f30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30]"
          >
            JEMO LABS — بيت الحكمة الرقمي
          </Link>
        </div>
      </footer>
    </div>
  );
}
