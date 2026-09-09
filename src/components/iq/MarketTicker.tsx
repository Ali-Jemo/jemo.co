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

export default function MarketTicker() {
  const [selectedProvince, setSelectedProvince] = useState<string>("baghdad");
  const [liveDollar, setLiveDollar] = useState<DollarLiveInfo | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadDollar() {
      try {
        const res = await fetch("/api/iq/dollar");
        if (res.ok) {
          const json = await res.json();
          setLiveDollar(json);
        }
      } catch (err) {
        console.error("Failed to load live dollar data:", err);
      }
    }
    loadDollar();
    const interval = setInterval(loadDollar, 60000);
    return () => clearInterval(interval);
  }, []);

  const baseProvinceData = PROVINCES[selectedProvince] ?? PROVINCES.baghdad;
  const currentSell =
    selectedProvince === "baghdad" && liveDollar
      ? liveDollar.sellRate
      : baseProvinceData.usdSell;
  const currentBuy =
    selectedProvince === "baghdad" && liveDollar
      ? liveDollar.buyRate
      : baseProvinceData.usdBuy;

  const handleCopyRate = () => {
    navigator.clipboard?.writeText?.(
      `سعر صرف الدولار في بغداد: بيع ${currentSell.toLocaleString()} — شراء ${currentBuy.toLocaleString()} د.ع / 100$`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-3" aria-label="شريط الأسعار الحية والمؤشرات الاقتصادية">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[#55696a] text-[11px] flex items-center gap-1 shrink-0 ml-1">
            <MapPin className="w-3.5 h-3.5 text-[#222f30]" /> المحافظة:
          </span>
          {Object.entries(PROVINCES).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedProvince(key)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                selectedProvince === key
                  ? "bg-[#222f30] text-white shadow-xs"
                  : "bg-white text-[#55696a] hover:bg-[#f0f2f0] hover:text-[#222f30] border border-[#e4e3e3]"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="inline-flex items-center gap-1.5 text-[#55696a] text-[11px] shrink-0 self-end sm:self-auto">
          <Clock className="w-3 h-3 text-[#222f30]" />
          <span>تحديث مباشر</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* 4 Core Essential Rate Cards (Jemo Labs Theme) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        
        {/* 1. Dollar */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border-2 border-[#a7e26e]/80 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-mono font-bold text-[#222f30] flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#728825]" /> الدولار / $100
            </span>
            <button
              onClick={handleCopyRate}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#cef79e] text-[#222f30] border border-[#a7e26e] hover:bg-[#a7e26e] transition-colors cursor-pointer flex items-center gap-1 font-bold"
            >
              {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
              <span>{copied ? "تم" : "+750"}</span>
            </button>
          </div>

          <div>
            <div className="text-xl sm:text-2xl font-mono font-black text-[#222f30] tracking-tight">
              {currentSell.toLocaleString()}
            </div>
            <div className="text-[11px] font-mono text-[#55696a] font-medium pt-0.5">
              شراء: {currentBuy.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 2. Gold */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs flex flex-col justify-between space-y-2">
          <span className="text-xs font-mono font-bold text-[#222f30] flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-600" /> الذهب (مثقال 21)
          </span>

          <div>
            <div className="text-xl sm:text-2xl font-mono font-black text-amber-700 tracking-tight">
              575,000
            </div>
            <div className="text-[11px] font-mono text-[#55696a] pt-0.5">
              عيار 18: 492,000 · فضة: 2,150
            </div>
          </div>
        </div>

        {/* 3. Ampere */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs flex flex-col justify-between space-y-2">
          <span className="text-xs font-mono font-bold text-[#222f30] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-sky-600" /> أمبير المولد ({baseProvinceData.name})
          </span>

          <div>
            <div className="text-xl sm:text-2xl font-mono font-black text-sky-800 tracking-tight">
              {baseProvinceData.ampereAvg.toLocaleString()}
            </div>
            <div className="text-[11px] font-mono text-[#55696a] pt-0.5">
              تشغيل 24 ساعة (خط ذهبي)
            </div>
          </div>
        </div>

        {/* 4. Gas */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs flex flex-col justify-between space-y-2">
          <span className="text-xs font-mono font-bold text-[#222f30] flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-600" /> أسطوانة الغاز
          </span>

          <div>
            <div className="text-xl sm:text-2xl font-mono font-black text-orange-700 tracking-tight">
              {baseProvinceData.gasStreet.toLocaleString()}
            </div>
            <div className="text-[11px] font-mono text-[#55696a] pt-0.5">
              الساحة الرسمية: {baseProvinceData.gasOfficial.toLocaleString()}
            </div>
          </div>
        </div>

      </div>

      {/* Slim 1-Line Status Banner */}
      <div className="px-3.5 py-2 rounded-xl bg-white border border-[#e4e3e3] shadow-xs flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-[#222f30]">حالة السوق:</span>
          <span className="px-2 py-0.5 rounded bg-[#cef79e] text-[#222f30] font-bold text-[10px]">
            {liveDollar?.status ?? "مرتفع — أعلى من متوسط الأسبوع"}
          </span>
          <span className="text-[#e4e3e3]">·</span>
          <span className="text-[#55696a]">
            متوسط 7 أيام: <strong className="text-[#222f30]">{(liveDollar?.avg7Days ?? 155290).toLocaleString()}</strong>
          </span>
          <span className="text-[#e4e3e3] hidden sm:inline">·</span>
          <span className="text-[#55696a] hidden sm:inline">
            الأعلى: <strong className="text-[#222f30]">{(liveDollar?.high7Days ?? 156000).toLocaleString()}</strong>
          </span>
          <span className="text-[#e4e3e3] hidden sm:inline">·</span>
          <span className="text-[#55696a] hidden sm:inline">
            الأدنى: <strong className="text-[#222f30]">{(liveDollar?.low7Days ?? 154900).toLocaleString()}</strong>
          </span>
        </div>
      </div>
    </section>
  );
}
