"use client";

import Link from "next/link";
import { Newspaper, ShieldCheck, ChevronLeft } from "lucide-react";

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
    <div className="space-y-3 rounded-2xl border border-[#e4e3e3] bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between gap-2 border-b border-[#e4e3e3] pb-2.5 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-[#222f30]">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#222f30]">
            <Newspaper className="h-3.5 w-3.5 text-[#cef79e]" aria-hidden="true" />
          </span>
          <span>موجز اليوم — 5 أحداث تهمك</span>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-[10px] text-[#55696a]">
          <ShieldCheck className="h-3 w-3 text-emerald-600" aria-hidden="true" />
          <span>مصادر رسمية</span>
        </span>
      </div>

      <ol className="space-y-2">
        {NEWS_ITEMS.map((item, idx) => (
          <li
            key={item.id}
            className="group flex items-start justify-between gap-3 rounded-xl border border-[#e4e3e3] bg-[#f7f7f5] px-3 py-2.5 text-xs transition-colors hover:border-[#a7e26e] hover:bg-white"
          >
            <div className="flex min-w-0 items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#222f30] font-mono text-[9px] font-bold text-[#cef79e]"
              >
                {idx + 1}
              </span>
              <div className="min-w-0">
                <span className="mb-1 inline-block rounded-md bg-[#cef79e] px-1.5 py-px text-[10px] font-bold text-[#222f30]">
                  {item.category}
                </span>
                <p className="leading-relaxed font-medium text-[#222f30] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[10px] text-[#55696a]">
                  {item.source} · {item.time}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <Link
        href="/iq/intel"
        className="flex items-center justify-center gap-1 rounded-xl border border-dashed border-[#e4e3e3] py-2 text-[11px] font-bold text-[#55696a] transition-colors hover:border-[#a7e26e] hover:text-[#222f30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30]"
      >
        <span>شوف كل الأدلة والتجارب في دليل هسه</span>
        <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
