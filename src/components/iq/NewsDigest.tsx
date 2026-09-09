"use client";

import { Newspaper, ShieldCheck } from "lucide-react";

interface NewsItem {
  id: string;
  category: string;
  source: string;
  time: string;
  title: string;
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: "salaries",
    category: "الرواتب",
    source: "المالية",
    time: "قبل 2س",
    title: "استكمال إجراءات تمويل رواتب الموظفين والمتقاعدين لشهر آذار بدون استقطاع",
  },
  {
    id: "traffic",
    category: "المرور",
    source: "المرور العامة",
    time: "قبل 3س",
    title: "انسيابية بحركة جسور الجادرية والسنك مع استمرار صيانة مجسر المعلق",
  },
  {
    id: "gas",
    category: "الوقود",
    source: "توزيع المنتجات",
    time: "قبل 4س",
    title: "استقرار تجهيز أسطوانات الغاز السائل بالسعر الرسمي 7,000 دينار بالساحات",
  },
  {
    id: "weather",
    category: "الطقس",
    source: "الأنواء الجوية",
    time: "اليوم",
    title: "طقس ربيعي معتدل في بغداد والمحافظات والعظمى تسجل 26 مئوية",
  },
  {
    id: "digital-id",
    category: "المعاملات",
    source: "بوابة أور",
    time: "أمس",
    title: "توسيع حجز البطاقة الوطنية الإلكترونية بمراكز إضافية في بغداد",
  },
];

export default function NewsDigest() {
  return (
    <div className="p-4 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[#e4e3e3] text-xs font-mono">
        <div className="flex items-center gap-1.5 font-bold text-[#222f30]">
          <Newspaper className="w-4 h-4 text-[#728825]" />
          <span>موجز الأخبار (5 أحداث سريعة)</span>
        </div>
        <span className="text-[10px] text-[#55696a] flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>مصادر رسمية مؤكدة</span>
        </span>
      </div>

      {/* Ultra-Fast 1-Line News Bullets */}
      <div className="space-y-2">
        {NEWS_ITEMS.map((item, idx) => (
          <div
            key={item.id}
            className="px-3 py-2 rounded-xl bg-[#f7f7f5] hover:bg-[#f0f2f0] border border-[#e4e3e3] flex items-center justify-between gap-3 text-xs transition-colors group cursor-default"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-4 h-4 rounded bg-[#222f30] text-[#cef79e] font-mono font-bold flex items-center justify-center text-[9px] shrink-0">
                0{idx + 1}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#cef79e] text-[#222f30] shrink-0 font-bold">
                {item.category}
              </span>
              <span className="font-kufi font-medium text-[#222f30] group-hover:text-[#162224] transition-colors truncate">
                {item.title}
              </span>
            </div>

            <span className="text-[10px] font-mono text-[#55696a] shrink-0 whitespace-nowrap">
              {item.source} · {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
