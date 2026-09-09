"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Flame,
  Zap,
  DollarSign,
  Coins,
  MapPin,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface ProvinceData {
  name: string;
  usdSell: number;
  usdBuy: number;
  ampereAvg: number;
  gasOfficial: number;
  gasStreet: number;
}

const PROVINCES: Record<string, ProvinceData> = {
  baghdad: {
    name: "بغداد",
    usdSell: 155650,
    usdBuy: 155000,
    ampereAvg: 14000,
    gasOfficial: 7000,
    gasStreet: 10000,
  },
  basra: {
    name: "البصرة",
    usdSell: 155800,
    usdBuy: 155100,
    ampereAvg: 15000,
    gasOfficial: 7000,
    gasStreet: 9500,
  },
  erbil: {
    name: "أربيل",
    usdSell: 155500,
    usdBuy: 154900,
    ampereAvg: 16000,
    gasOfficial: 7500,
    gasStreet: 11000,
  },
  najaf: {
    name: "النجف",
    usdSell: 155600,
    usdBuy: 154950,
    ampereAvg: 13500,
    gasOfficial: 7000,
    gasStreet: 9000,
  },
  nineveh: {
    name: "الموصل",
    usdSell: 155700,
    usdBuy: 155050,
    ampereAvg: 14500,
    gasOfficial: 7000,
    gasStreet: 10000,
  },
  kirkuk: {
    name: "كركوك",
    usdSell: 155650,
    usdBuy: 155000,
    ampereAvg: 14000,
    gasOfficial: 7000,
    gasStreet: 9500,
  },
};

interface DollarLiveInfo {
  sellRate: number;
  buyRate: number;
  sourceName: string;
  sourceUrl: string;
  avg7Days: number;
  high7Days: number;
  low7Days: number;
  change7Days: number;
  status: string;
}

const cardBase =
  "p-3.5 sm:p-4 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs flex flex-col justify-between gap-2 transition-all hover:-translate-y-0.5 hover:shadow-sm focus-within:border-[#a7e26e]";

export default function MarketTicker() {
  const [selectedProvince, setSelectedProvince] = useState<string>("baghdad");
  const [liveDollar, setLiveDollar] = useState<DollarLiveInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadDollar() {
      try {
        const res = await fetch("/api/iq/dollar");
        if (res.ok && mounted) {
          const json = await res.json();
          setLiveDollar(json);
        }
      } catch (err) {
        console.error("Failed to load live dollar data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadDollar();
    const interval = setInterval(loadDollar, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const baseProvinceData = PROVINCES[selectedProvince] ?? PROVINCES.baghdad;
  const isLive = selectedProvince === "baghdad" && !!liveDollar;
  const currentSell = isLive
    ? (liveDollar as DollarLiveInfo).sellRate
    : baseProvinceData.usdSell;
  const currentBuy = isLive
    ? (liveDollar as DollarLiveInfo).buyRate
    : baseProvinceData.usdBuy;

  const change = liveDollar?.change7Days ?? 360;
  const TrendIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const trendLabel =
    change > 0
      ? `صاعد +${change.toLocaleString("ar-IQ")}`
      : change < 0
        ? `هابط ${change.toLocaleString("ar-IQ")}`
        : "مستقر";

  const handleCopyRate = () => {
    navigator.clipboard?.writeText?.(
      `سعر صرف الدولار في ${baseProvinceData.name}: بيع ${currentSell.toLocaleString("ar-IQ")} — شراء ${currentBuy.toLocaleString("ar-IQ")} د.ع / 100$`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-3" aria-label="شريط الأسعار الحية والمؤشرات الاقتصادية">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="اختيار المحافظة"
        >
          <span className="flex shrink-0 items-center gap-1 text-[11px] text-[#55696a]">
            <MapPin className="h-3.5 w-3.5 text-[#222f30]" aria-hidden="true" />
            المحافظة:
          </span>
          {Object.entries(PROVINCES).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedProvince(key)}
              aria-pressed={selectedProvince === key}
              className={`shrink-0 cursor-pointer rounded-lg px-3 py-1 text-[11px] font-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30] ${
                selectedProvince === key
                  ? "bg-[#222f30] text-white shadow-xs"
                  : "border border-[#e4e3e3] bg-white text-[#55696a] hover:bg-[#f0f2f0] hover:text-[#222f30]"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="inline-flex shrink-0 items-center gap-1.5 self-end text-[11px] text-[#55696a] sm:self-auto">
          <Clock className="h-3 w-3 text-[#222f30]" aria-hidden="true" />
          <span>{isLive ? "مباشر — بورصة بغداد" : "أسعار استرشادية"}</span>
          <span
            className={`h-1.5 w-1.5 rounded-full ${isLive ? "animate-pulse bg-emerald-500" : "bg-amber-400"}`}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* 4 Core Essential Rate Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {/* 1. Dollar — hero card */}
        <div
          className={`${cardBase} border-2 border-[#a7e26e]/80 bg-gradient-to-b from-[#f8fdf2] to-white`}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="flex items-center gap-1 text-xs font-bold text-[#222f30]">
              <DollarSign className="h-3.5 w-3.5 text-[#728825]" aria-hidden="true" />
              الدولار / $100
            </span>
            <button
              onClick={handleCopyRate}
              aria-live="polite"
              className="flex cursor-pointer items-center gap-1 rounded border border-[#a7e26e] bg-[#cef79e] px-2 py-0.5 text-[10px] font-bold text-[#222f30] transition-colors hover:bg-[#a7e26e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30]"
            >
              {copied ? (
                <Check className="h-2.5 w-2.5" aria-hidden="true" />
              ) : (
                <Copy className="h-2.5 w-2.5" aria-hidden="true" />
              )}
              <span>{copied ? "تم النسخ" : "نسخ"}</span>
            </button>
          </div>

          <div aria-live="polite">
            {loading ? (
              <div className="h-7 w-28 animate-pulse rounded-lg bg-[#eef2ea]" />
            ) : (
              <div className="text-xl font-black tracking-tight text-[#222f30] tabular-nums sm:text-2xl">
                {currentSell.toLocaleString("ar-IQ")}
                <span className="mr-1 text-[11px] font-bold text-[#55696a]">د.ع</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 pt-0.5 text-[11px] text-[#55696a]">
              <span>شراء: {currentBuy.toLocaleString("ar-IQ")}</span>
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-px text-[10px] font-bold ${
                  change > 0
                    ? "bg-red-50 text-red-700"
                    : change < 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-[#f0f2f0] text-[#55696a]"
                }`}
              >
                <TrendIcon className="h-2.5 w-2.5" aria-hidden="true" />
                {trendLabel}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Gold */}
        <div className={cardBase}>
          <span className="flex items-center gap-1 text-xs font-bold text-[#222f30]">
            <Coins className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
            الذهب (مثقال 21)
          </span>
          <div>
            <div className="text-xl font-black tracking-tight text-amber-700 tabular-nums sm:text-2xl">
              {(575000).toLocaleString("ar-IQ")}
              <span className="mr-1 text-[11px] font-bold text-[#55696a]">د.ع</span>
            </div>
            <div className="pt-0.5 text-[11px] text-[#55696a]">
              عيار 18: {(492000).toLocaleString("ar-IQ")} · فضة: {(2150).toLocaleString("ar-IQ")}
            </div>
          </div>
        </div>

        {/* 3. Ampere */}
        <div className={cardBase}>
          <span className="flex items-center gap-1 text-xs font-bold text-[#222f30]">
            <Zap className="h-3.5 w-3.5 text-sky-600" aria-hidden="true" />
            أمبير المولد ({baseProvinceData.name})
          </span>
          <div>
            <div className="text-xl font-black tracking-tight text-sky-800 tabular-nums sm:text-2xl">
              {baseProvinceData.ampereAvg.toLocaleString("ar-IQ")}
              <span className="mr-1 text-[11px] font-bold text-[#55696a]">د.ع</span>
            </div>
            <div className="pt-0.5 text-[11px] text-[#55696a]">
              تشغيل 24 ساعة (خط ذهبي)
            </div>
          </div>
        </div>

        {/* 4. Gas */}
        <div className={cardBase}>
          <span className="flex items-center gap-1 text-xs font-bold text-[#222f30]">
            <Flame className="h-3.5 w-3.5 text-orange-600" aria-hidden="true" />
            أسطوانة الغاز
          </span>
          <div>
            <div className="text-xl font-black tracking-tight text-orange-700 tabular-nums sm:text-2xl">
              {baseProvinceData.gasStreet.toLocaleString("ar-IQ")}
              <span className="mr-1 text-[11px] font-bold text-[#55696a]">د.ع</span>
            </div>
            <div className="pt-0.5 text-[11px] text-[#55696a]">
              الساحة الرسمية: {baseProvinceData.gasOfficial.toLocaleString("ar-IQ")}
            </div>
          </div>
        </div>
      </div>

      {/* Slim status banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#e4e3e3] bg-white px-3.5 py-2 text-[11px] shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="font-bold text-[#222f30]">حالة السوق:</span>
          <span className="rounded bg-[#cef79e] px-2 py-0.5 text-[10px] font-bold text-[#222f30]">
            {liveDollar?.status ?? "مرتفع — أعلى من متوسط الأسبوع"}
          </span>
          <span className="text-[#e4e3e3]" aria-hidden="true">·</span>
          <span className="text-[#55696a]">
            متوسط 7 أيام:{" "}
            <strong className="text-[#222f30] tabular-nums">
              {(liveDollar?.avg7Days ?? 155290).toLocaleString("ar-IQ")}
            </strong>
          </span>
          <span className="hidden text-[#e4e3e3] sm:inline" aria-hidden="true">·</span>
          <span className="hidden text-[#55696a] sm:inline">
            الأعلى:{" "}
            <strong className="text-[#222f30] tabular-nums">
              {(liveDollar?.high7Days ?? 156000).toLocaleString("ar-IQ")}
            </strong>
          </span>
          <span className="hidden text-[#e4e3e3] sm:inline" aria-hidden="true">·</span>
          <span className="hidden text-[#55696a] sm:inline">
            الأدنى:{" "}
            <strong className="text-[#222f30] tabular-nums">
              {(liveDollar?.low7Days ?? 154900).toLocaleString("ar-IQ")}
            </strong>
          </span>
        </div>
        {liveDollar?.sourceName && (
          <span className="text-[10px] text-[#55696a]">
            المصدر: {liveDollar.sourceName}
          </span>
        )}
      </div>
    </section>
  );
}
