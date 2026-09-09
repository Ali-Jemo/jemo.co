"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Clock, ShieldCheck, Flame, Zap, DollarSign, Coins, MapPin } from "lucide-react";

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
    usdSell: 153250,
    usdBuy: 152750,
    ampereAvg: 14000,
    gasOfficial: 7000,
    gasStreet: 10000,
  },
  basra: {
    name: "البصرة",
    usdSell: 153400,
    usdBuy: 152900,
    ampereAvg: 15000,
    gasOfficial: 7000,
    gasStreet: 9500,
  },
  erbil: {
    name: "أربيل",
    usdSell: 153100,
    usdBuy: 152600,
    ampereAvg: 16000,
    gasOfficial: 7500,
    gasStreet: 11000,
  },
  najaf: {
    name: "النجف الأشرف",
    usdSell: 153200,
    usdBuy: 152700,
    ampereAvg: 13500,
    gasOfficial: 7000,
    gasStreet: 9000,
  },
  nineveh: {
    name: "نينوى (الموصل)",
    usdSell: 153350,
    usdBuy: 152800,
    ampereAvg: 14500,
    gasOfficial: 7000,
    gasStreet: 10000,
  },
  kirkuk: {
    name: "كركوك",
    usdSell: 153300,
    usdBuy: 152750,
    ampereAvg: 14000,
    gasOfficial: 7000,
    gasStreet: 9500,
  },
};

export default function MarketTicker() {
  const [selectedProvince, setSelectedProvince] = useState<string>("baghdad");
  const data = PROVINCES[selectedProvince] ?? PROVINCES.baghdad;

  return (
    <section className="space-y-4" aria-label="شريط الأسعار الحية والمؤشرات الاقتصادية">
      {/* Province Switcher & Update Stamp */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/60 inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#bef264]" /> المحافظة:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {Object.entries(PROVINCES).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setSelectedProvince(key)}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-all cursor-pointer shrink-0 ${
                  selectedProvince === key
                    ? "bg-[#bef264] text-[#0c1415] font-bold shadow-xs"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 text-white/50 text-[11px]">
          <Clock className="w-3 h-3 text-[#bef264]" />
          <span>تحديث صباحي حي: اليوم</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Main Rates Grid (Bourse Dollar, Gold, Ampere & Gas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* 1. USD / IQD — The Core Daily Magnet */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#141e20] to-[#0d1517] border border-[#bef264]/30 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#bef264]">
              <DollarSign className="w-4 h-4 text-[#bef264]" />
              <span>الدولار / 100$</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#bef264]/10 text-[#bef264] border border-[#bef264]/20">
              <TrendingUp className="w-3 h-3" />
              +250 د.ع
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-mono font-black text-white tracking-tight">
                {data.usdSell.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-white/60">بيع الصيرفات</span>
            </div>
            <div className="flex items-baseline justify-between text-xs font-mono text-white/60 border-t border-white/10 pt-1.5 mt-1.5">
              <span>شراء: {data.usdBuy.toLocaleString()}</span>
              <span className="text-[10px] text-white/40">الرسمي: 131,000</span>
            </div>
          </div>
          <div className="text-[9px] font-mono text-white/40 mt-2 flex items-center justify-between">
            <span>بورصة الكفاح والحارثية</span>
            <span className="text-[#bef264] font-semibold">مباشر</span>
          </div>
        </div>

        {/* 2. Gold & Silver Market */}
        <div className="p-4 rounded-2xl bg-[#0e1618] border border-white/10 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
              <Coins className="w-4 h-4 text-amber-300" />
              <span>مثقال الذهب (21)</span>
            </div>
            <span className="text-[10px] font-mono text-white/50">سوق الصاغة</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-mono font-black text-amber-300 tracking-tight">
                575,000
              </span>
              <span className="text-[11px] font-mono text-white/60">دينار / مثقال</span>
            </div>
            <div className="flex items-baseline justify-between text-xs font-mono text-white/60 border-t border-white/10 pt-1.5 mt-1.5">
              <span>عيار 18: 492,000</span>
              <span className="text-white/40">الفضة: 2,150/غرام</span>
            </div>
          </div>
          <div className="text-[9px] font-mono text-white/40 mt-2 flex items-center justify-between">
            <span>الخليجي والتركي والأوروبي</span>
            <span className="text-amber-300/80">عيار 21</span>
          </div>
        </div>

        {/* 3. Generator Ampere Rate (أمبير المولد) */}
        <div className="p-4 rounded-2xl bg-[#0e1618] border border-white/10 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
              <Zap className="w-4 h-4 text-cyan-300" />
              <span>أمبير المولد ({data.name})</span>
            </div>
            <span className="text-[10px] font-mono text-white/50">الخط الذهبي</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-mono font-black text-cyan-300 tracking-tight">
                {data.ampereAvg.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-white/60">دينار / أمبير</span>
            </div>
            <div className="flex items-baseline justify-between text-xs font-mono text-white/60 border-t border-white/10 pt-1.5 mt-1.5">
              <span>التشغيل: 24 ساعة</span>
              <span className="text-white/40">تسعيرة آذار</span>
            </div>
          </div>
          <div className="text-[9px] font-mono text-white/40 mt-2 flex items-center justify-between">
            <span>متوسط الأحياء السكنية</span>
            <span className="text-cyan-300/80">بدون قطع</span>
          </div>
        </div>

        {/* 4. Gas Cylinder Rate (أسطوانة الغاز) */}
        <div className="p-4 rounded-2xl bg-[#0e1618] border border-white/10 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-300">
              <Flame className="w-4 h-4 text-orange-300" />
              <span>أسطوانة الغاز</span>
            </div>
            <span className="text-[10px] font-mono text-white/50">منزلي</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-mono font-black text-orange-300 tracking-tight">
                {data.gasStreet.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-white/60">واصل للبيت</span>
            </div>
            <div className="flex items-baseline justify-between text-xs font-mono text-white/60 border-t border-white/10 pt-1.5 mt-1.5">
              <span>الساحة الرسمية: {data.gasOfficial.toLocaleString()}</span>
              <span className="text-emerald-400">متوفر</span>
            </div>
          </div>
          <div className="text-[9px] font-mono text-white/40 mt-2 flex items-center justify-between">
            <span>وكلاء التوزيع بالأحياء</span>
            <span className="text-orange-300/80">أسطوانة حديد</span>
          </div>
        </div>

      </div>
    </section>
  );
}
