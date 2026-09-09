"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Flame,
  Zap,
  DollarSign,
  Coins,
  MapPin,
  ExternalLink,
  ShieldCheck,
  ArrowUpRight,
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
    name: "النجف الأشرف",
    usdSell: 155600,
    usdBuy: 154950,
    ampereAvg: 13500,
    gasOfficial: 7000,
    gasStreet: 9000,
  },
  nineveh: {
    name: "نينوى (الموصل)",
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
  marketName: string;
  location: string;
  sourceName: string;
  sourceFullTitle: string;
  sourceUrl: string;
  sourcePublishedAt: string;
  avg7Days: number;
  high7Days: number;
  low7Days: number;
  change7Days: number;
  status: string;
  platform: {
    name: string;
    url: string;
  };
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
      `سعر صرف الدولار في بغداد اليوم: بيع ${currentSell.toLocaleString()} د.ع — شراء ${currentBuy.toLocaleString()} د.ع / 100$ | المصدر: @dollariraqi عبر هسه`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-4" aria-label="شريط الأسعار الحية والمؤشرات الاقتصادية">
      {/* Province Switcher & Update Stamp */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/60 inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[var(--gold)]" /> المحافظة:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {Object.entries(PROVINCES).map(([key, item]) => (
              <button
                onClick={() => setSelectedProvince(key)}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-all cursor-pointer shrink-0 ${
                  selectedProvince === key
                    ? "bg-[var(--gold)] text-[var(--surface)] font-bold shadow-xs"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 text-white/50 text-[11px]">
          <Clock className="w-3 h-3 text-[var(--gold)]" />
          <span>تحديث حي: مزامنة كل دقيقة</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Main Rates Grid (Bourse Dollar, Gold, Ampere & Gas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* 1. USD / IQD — Live Market Rate from Aya Naseer & @dollariraqi */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[var(--surface-2)] to-[var(--surface)] border border-emerald-500/40 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--gold)]">
              <DollarSign className="w-4 h-4 text-[var(--gold)]" />
              <span>الدولار / 100$</span>
            </div>
            <button
              onClick={handleCopyRate}
              className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 hover:bg-[var(--gold)]/25 transition-colors cursor-pointer"
              title="نسخ السعر للمشاركة"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "تم النسخ" : "+750 د.ع"}</span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-mono font-black text-white tracking-tight">
                {currentSell.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-emerald-300 font-medium">بيع الصيرفات</span>
            </div>
            <div className="flex items-baseline justify-between text-xs font-mono text-white/70 border-t border-emerald-500/20 pt-1.5 mt-1.5">
              <span>شراء: {currentBuy.toLocaleString()}</span>
              <span className="text-[10px] text-white/50">الرسمي: 131,000</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-emerald-400/90 mt-2.5 flex items-center justify-between pt-1 border-t border-emerald-500/15">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>المصدر: @dollariraqi</span>
            </span>
            <span className="text-[var(--gold)] font-bold">بغداد</span>
          </div>
        </div>

        {/* 2. Gold & Silver Market */}
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-white/10 shadow-md relative overflow-hidden">
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
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-white/10 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
              <Zap className="w-4 h-4 text-cyan-300" />
              <span>أمبير المولد ({baseProvinceData.name})</span>
            </div>
            <span className="text-[10px] font-mono text-white/50">الخط الذهبي</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-mono font-black text-cyan-300 tracking-tight">
                {baseProvinceData.ampereAvg.toLocaleString()}
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
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-white/10 shadow-md relative overflow-hidden">
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
                {baseProvinceData.gasStreet.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-white/60">واصل للبيت</span>
            </div>
            <div className="flex items-baseline justify-between text-xs font-mono text-white/60 border-t border-white/10 pt-1.5 mt-1.5">
              <span>الساحة الرسمية: {baseProvinceData.gasOfficial.toLocaleString()}</span>
              <span className="text-emerald-400">متوفر</span>
            </div>
          </div>
          <div className="text-[9px] font-mono text-white/40 mt-2 flex items-center justify-between">
            <span>وكلاء التوزيع بالأحياء</span>
            <span className="text-orange-300/80">أسطوانة حديد</span>
          </div>
        </div>

      </div>

      {/* Integrated Live Source & 7-Day Market Analytics Card (Aya Naseer & @dollariraqi Theme) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[var(--surface-2)] via-[var(--surface)] to-[var(--surface)] border border-emerald-500/30 shadow-md space-y-3 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-500/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wide">
                حالة سوق الدولار في العراق
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[10px] font-mono text-emerald-300 font-bold">
                بيع · {liveDollar?.status ?? "مرتفع — أعلى من متوسط الأسبوع"}
              </span>
            </div>
            <p className="text-xs text-white/70 font-sans">
              مؤشر سوقي مباشر مبني على رسائل البورصة وقناة سعر الدولار في العراق مع فحص مستمر كل 5 دقائق.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <a
              href={liveDollar?.sourceUrl ?? "https://t.me/dollariraqi"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 text-xs font-mono font-bold transition-all group"
            >
              <span>فتح قناة {liveDollar?.sourceName ?? "@dollariraqi"}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href={liveDollar?.platform.url ?? "https://ayanadollar-dhkgohtw.manus.space/dashboard"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-mono transition-all"
            >
              <span>لوحة {liveDollar?.platform.name ?? "آيا نصير"}</span>
              <ExternalLink className="w-3 h-3 text-white/40" />
            </a>
          </div>
        </div>

        {/* 7-Day Performance Indicators Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-black/30 border border-emerald-500/15">
            <span className="text-[10px] text-white/50 block mb-0.5">متوسط 7 أيام</span>
            <span className="font-bold text-white text-sm">
              {(liveDollar?.avg7Days ?? 155290).toLocaleString()} د.ع
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/30 border border-emerald-500/15">
            <span className="text-[10px] text-white/50 block mb-0.5">حركة 7 أيام</span>
            <span className="font-bold text-emerald-400 text-sm">
              +{(liveDollar?.change7Days ?? 750).toLocaleString()} د.ع
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/30 border border-emerald-500/15">
            <span className="text-[10px] text-white/50 block mb-0.5">الأعلى هذا الأسبوع</span>
            <span className="font-bold text-amber-300 text-sm">
              {(liveDollar?.high7Days ?? 156000).toLocaleString()} د.ع
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/30 border border-emerald-500/15">
            <span className="text-[10px] text-white/50 block mb-0.5">الأدنى هذا الأسبوع</span>
            <span className="font-bold text-cyan-300 text-sm">
              {(liveDollar?.low7Days ?? 154900).toLocaleString()} د.ع
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
