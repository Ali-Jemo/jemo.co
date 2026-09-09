"use client";

import { useState, useMemo } from "react";
import { getCurrentRafidainSeason } from "@/lib/rafidain-calendar";
import {
  CloudSun,
  Wind,
  Eye,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Calendar,
} from "lucide-react";

interface GovernorateWeather {
  id: string;
  name: string;
  currentTemp: number;
  highTemp: number;
  lowTemp: number;
  condition: string;
  dustLevel: "نقي ومستقر" | "غبار عالق خفيف" | "عاصفة ترابية نشطة";
  visibilityKm: number;
  humidity: number;
  windSpeedKmh: number;
  advisory: string;
}

const WEATHER_DATA: GovernorateWeather[] = [
  {
    id: "bg",
    name: "بغداد",
    currentTemp: 28,
    highTemp: 32,
    lowTemp: 18,
    condition: "صحو وربيعي معتدل",
    dustLevel: "نقي ومستقر",
    visibilityKm: 10,
    humidity: 32,
    windSpeedKmh: 14,
    advisory: "الأجواء ملائمة للحركة والتنقل داخل العاصمة بدون تحذيرات غبار.",
  },
  {
    id: "ba",
    name: "البصرة",
    currentTemp: 33,
    highTemp: 36,
    lowTemp: 22,
    condition: "حار نسبياً ورطب",
    dustLevel: "نقي ومستقر",
    visibilityKm: 9,
    humidity: 58,
    windSpeedKmh: 18,
    advisory: "ارتفاع رطوبة شط العرب مساءً، أجواء مناسبة للجلسات النهرية.",
  },
  {
    id: "ar",
    name: "أربيل",
    currentTemp: 22,
    highTemp: 25,
    lowTemp: 13,
    condition: "غائم جزئياً ولطيف",
    dustLevel: "نقي ومستقر",
    visibilityKm: 12,
    humidity: 45,
    windSpeedKmh: 10,
    advisory: "أجواء جبلية ربيعية نقية ومثالية للسياحة والمصايف.",
  },
  {
    id: "ni",
    name: "الموصل",
    currentTemp: 24,
    highTemp: 27,
    lowTemp: 14,
    condition: "معتدل وصحو",
    dustLevel: "نقي ومستقر",
    visibilityKm: 10,
    humidity: 38,
    windSpeedKmh: 12,
    advisory: "حركة الرياح هادئة وطقس أم الربيعين مستقر على كافة أرجاء نينوى.",
  },
  {
    id: "na",
    name: "النجف الأشرف",
    currentTemp: 29,
    highTemp: 33,
    lowTemp: 19,
    condition: "صحو دافئ",
    dustLevel: "غبار عالق خفيف",
    visibilityKm: 7,
    humidity: 28,
    windSpeedKmh: 24,
    advisory: "نشاط خفيف للرياح الجنوبية الغربية القادمة من البادية قد يثير غباراً خفيفاً على الطرق الخارجية.",
  },
  {
    id: "an",
    name: "الأنبار (الرمادي)",
    currentTemp: 27,
    highTemp: 31,
    lowTemp: 17,
    condition: "صحو جاف",
    dustLevel: "غبار عالق خفيف",
    visibilityKm: 6,
    humidity: 22,
    windSpeedKmh: 28,
    advisory: "تنبيه لسائقي طريق المرور السريع الدولي (طريبيل وعرعر) بسبب تدني مدى الرؤية الأفقية.",
  },
];

export default function WeatherDust() {
  const [selectedCityId, setSelectedCityId] = useState<string>("bg");
  const season = useMemo(() => getCurrentRafidainSeason(), []);
  const current = WEATHER_DATA.find((w) => w.id === selectedCityId) || WEATHER_DATA[0];
  const getDustBadge = (level: GovernorateWeather["dustLevel"]) => {
    switch (level) {
      case "نقي ومستقر":
        return {
          bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
          icon: CheckCircle2,
        };
      case "غبار عالق خفيف":
        return {
          bg: "bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300",
          icon: AlertTriangle,
        };
      case "عاصفة ترابية نشطة":
        return {
          bg: "bg-red-500/15 border-red-500/30 text-red-700 dark:text-red-300",
          icon: AlertTriangle,
        };
    }
  };

  const dustBadge = getDustBadge(current.dustLevel);
  const DustIcon = dustBadge.icon;

  return (
    <div className="rounded-2xl border border-[#e4e3e3] bg-white p-4 sm:p-5 shadow-xs space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e4e3e3]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#728825]">
            <CloudSun className="w-4 h-4" />
            <span className="font-bold">الطقس والتقويم الموسمي الرافديني</span>
            <span className="text-[#e4e3e3]">·</span>
            <span className="text-[#55696a]">تحديث فلكي ومناخي حي</span>
          </div>
          <h3 className="font-kufi font-bold text-base sm:text-lg text-[#222f30]">
            درجات الحرارة، الفصول الرافدينية، وتنبيهات الطرق
          </h3>
        </div>

        {/* City Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-mono">
          {WEATHER_DATA.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCityId(city.id)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer shrink-0 font-bold ${
                selectedCityId === city.id
                  ? "bg-[#222f30] text-white shadow-xs"
                  : "bg-[#f7f7f5] text-[#55696a] hover:text-[#222f30] border border-[#e4e3e3]"
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mesopotamian Seasonal & Agricultural Bar (RFC-2026) */}
      <div className="p-3.5 rounded-xl bg-[#f7f7f5] border border-[#e4e3e3] space-y-2 text-xs font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base" aria-hidden="true">{season.seasonIcon}</span>
            <span className="font-bold text-[#222f30] font-kufi text-sm">{season.seasonName}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#cef79e] text-[#222f30] font-bold text-[11px] border border-[#a7e26e]">
              {season.formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#55696a]">
            <span>المرحلة: <strong className="text-[#222f30]">{season.phaseLabel}</strong></span>
            <span className="text-[#e4e3e3]">·</span>
            <span>المحطة القادمة: <strong className="text-[#728825]">{season.nextQuarterName}</strong></span>
          </div>
        </div>

        <p className="text-xs text-[#55696a] font-sans leading-relaxed pt-1.5 border-t border-[#e4e3e3]">
          <strong className="text-[#222f30] font-bold">الأنواء والموسم الزراعي في العراق: </strong>
          {season.climateNote}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Left: Big Temp & Condition (5 cols) */}
        <div className="md:col-span-5 p-4 rounded-xl bg-[#f7f7f5] border border-[#e4e3e3] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#55696a] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#222f30]" />
              <span>{current.name} الآن</span>
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-kufi font-black text-[#222f30]">
                {current.currentTemp}°
              </span>
              <span className="text-xs font-mono text-[#55696a]">
                (العظمى {current.highTemp}° / الصغرى {current.lowTemp}°)
              </span>
            </div>
            <p className="text-xs font-sans text-emerald-800 font-bold">
              {current.condition}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-[#e4e3e3] text-center shadow-xs">
            <CloudSun className="w-7 h-7 text-amber-500 mx-auto" />
            <span className="text-[10px] font-mono text-[#55696a] block mt-1 font-bold">
              {season.monthName}
            </span>
          </div>
        </div>

        {/* Right: Dust Level, Visibility, Wind (7 cols) */}
        <div className="md:col-span-7 grid grid-cols-3 gap-2.5">
          {/* Dust Status */}
          <div className="p-3 rounded-xl bg-[#f7f7f5] border border-[#e4e3e3] space-y-1">
            <span className="text-[10px] font-mono text-[#55696a] block">مستوى الغبار</span>
            <div className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold inline-flex items-center gap-1 ${dustBadge.bg}`}>
              <DustIcon className="w-3 h-3" />
              <span>{current.dustLevel}</span>
            </div>
          </div>

          {/* Visibility */}
          <div className="p-3 rounded-xl bg-[#f7f7f5] border border-[#e4e3e3] space-y-1">
            <span className="text-[10px] font-mono text-[#55696a] block flex items-center gap-1">
              <Eye className="w-3 h-3 text-[#55696a]" />
              <span>الرؤية الأفقية</span>
            </span>
            <div className="text-xs sm:text-sm font-kufi font-bold text-[#222f30]">
              {current.visibilityKm} كم
            </div>
          </div>

          {/* Wind & Humidity */}
          <div className="p-3 rounded-xl bg-[#f7f7f5] border border-[#e4e3e3] space-y-1">
            <span className="text-[10px] font-mono text-[#55696a] block flex items-center gap-1">
              <Wind className="w-3 h-3 text-[#55696a]" />
              <span>الرياح والرطوبة</span>
            </span>
            <div className="text-[11px] font-mono font-bold text-[#222f30]">
              {current.windSpeedKmh} كم/س · {current.humidity}%
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-900 leading-relaxed font-sans">
          <strong className="font-bold">تنبيه المسافرين وأصحاب الحساسية في {current.name}: </strong>
          {current.advisory}
        </p>
      </div>
    </div>
  );
}
