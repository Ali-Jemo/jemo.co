"use client";

import { Newspaper, ShieldCheck, Clock } from "lucide-react";

interface NewsItem {
  id: string;
  category: string;
  source: string;
  time: string;
  title: string;
  summary: string;
  tag: string;
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: "salaries",
    category: "الرواتب والمستحقات",
    source: "وزارة المالية العراقية",
    time: "قبل ساعتين",
    title: "استكمال إجراءات تمويل رواتب الموظفين والمتقاعدين لشهر آذار",
    summary:
      "دائرة المحاسبة تؤكد جاهزية الصرف لكافة الوزارات والدوائر وفق الجدول الزمني المعتمد وبدون أي استقطاعات إضافية.",
    tag: "رسمي",
  },
  {
    id: "traffic",
    category: "حركة السير والجسور",
    source: "مديرية المرور العامة",
    time: "قبل 3 ساعات",
    title: "انسيابية في حركة جسور الجادرية والسنك مع استمرار صيانة مجسر المعلق",
    summary:
      "فتح المسارات البديلة باتجاه ساحة النسور وحي الكندي، وحركة السير في سريع الدورة ومحمد القاسم طبيعية بالكامل.",
    tag: "مرور",
  },
  {
    id: "gas",
    category: "الطاقة والخدمات",
    source: "شركة توزيع المنتجات النفطية",
    time: "قبل 4 ساعات",
    title: "استقرار تجهيز أسطوانات الغاز السائل بالسعر الرسمي 7,000 دينار",
    summary:
      "تشديد الرقابة الميدانية على ساحات التعبئة ووكلاء التوزيع في الأحياء السكنية للالتزام بالسعر الحكومي المحدد.",
    tag: "خدمي",
  },
  {
    id: "weather",
    category: "الطقس والتنبيهات",
    source: "الهيئة العامة للأنواء الجوية",
    time: "اليوم 08:00 ص",
    title: "طقس صحو وربيعي مع درجات حرارة معتدلة في بغداد والمحافظات",
    summary:
      "العظمى في العاصمة بغداد تسجل 26 مئوية مع رياح شمالية غربية خفيفة إلى معتدلة السرعة، ولا مؤشرات لأمطار قريبة.",
    tag: "طقس",
  },
  {
    id: "digital-id",
    category: "المعاملات الرقمية",
    source: "بوابة أور الإلكترونية",
    time: "أمس",
    title: "توسيع حجز البطاقة الوطنية الإلكترونية ليشمل مراكز جديدة",
    summary:
      "إتاحة مواعيد إضافية في دوائر أحوال الرصافة والكرخ لتقليل الزخم الصباحي، مع اعتماد باركود الحجز الفوري.",
    tag: "معاملات",
  },
];

export default function NewsDigest() {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-white/10 shadow-md space-y-4">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)]">
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-kufi font-bold text-sm text-white">
              موجز الصباح العراقي (5 أحداث موجزة)
            </h3>
            <p className="text-[10px] font-mono text-white/50">
              أخبار خدمية ورسمية مؤكدة — بدون تهويل ولا شائعات
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[var(--gold)] px-2.5 py-1 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 hidden xs:inline-flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          مصادر معلنة
        </span>
      </div>

      {/* News Cards Stack */}
      <div className="space-y-3">
        {NEWS_ITEMS.map((item, idx) => (
          <article
            key={item.id}
            className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/15 transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--gold)]/15 text-[var(--gold)] font-bold flex items-center justify-center text-[10px]">
                  0{idx + 1}
                </span>
                <span className="text-white/70 font-semibold">{item.source}</span>
                <span className="text-white/30">·</span>
                <span className="text-emerald-400 font-medium">{item.category}</span>
              </div>
              <span className="text-white/40 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {item.time}
              </span>
            </div>

            <h4 className="font-kufi font-bold text-sm text-white/95 group-hover:text-[var(--gold)] transition-colors leading-snug">
              {item.title}
            </h4>

            <p className="text-xs text-white/70 leading-relaxed font-sans">
              {item.summary}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
