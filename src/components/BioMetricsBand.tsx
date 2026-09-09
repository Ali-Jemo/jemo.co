"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Building2, Layers, ShieldCheck } from "lucide-react";

const STATS = [
  {
    num: "2026",
    label: "عصر بحث المواطن الرقمي",
    labelEn: "CITIZEN RESEARCH",
    desc: "أدوات البحث والذكاء الاصطناعي أصبحت تمكّن أي شخص من إنتاج بحث واستقصاء رصين وتوثيق نتائجه.",
    icon: Users,
    highlight: false,
  },
  {
    num: "100%",
    label: "سجل مفتوح للجميع",
    labelEn: "OPEN DISCOVERY LOGS",
    desc: "لا رسوم على النشر ولا قيود تجارية، وتوثيق شفاف للأدوات والتحقق البشري من الهلوسة.",
    icon: ShieldCheck,
    highlight: true,
  },
  {
    num: "0 دقيقة",
    label: "ضياع للمعارف بعد اليوم",
    labelEn: "PRESERVED KNOWLEDGE",
    desc: "حفظ جلسات المحادثة العميقة وتحويلها إلى سجلات دائمة قابلة للمشاركة والاستشهاد والتحدي.",
    icon: Layers,
    highlight: false,
  },
  {
    num: "كل العلوم",
    label: "مجالات معرفية غير محدودة",
    labelEn: "ALL KNOWLEDGE DOMAINS",
    desc: "من البرمجة والذكاء الاصطناعي، إلى اللغة والتراث، إلى العلوم الطبيعية والإنسانية — مساحة للجميع.",
    icon: Building2,
    highlight: false,
  },
];

export default function BioMetricsBand() {
  return (
    <section
      dir="rtl"
      className="py-12 sm:py-24 bg-[#f7f7f5] text-[#222f30] border-b border-[#e4e3e3] relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16">
        {/* Academic Section Header */}
        <div className="mb-8 sm:mb-14 pb-6 sm:pb-8 border-b border-[#e4e3e3]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-12">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2.5 text-xs font-mono text-[#55696a]">
                <span className="font-bold text-[#222f30] text-sm tracking-normal">04</span>
                <span className="w-5 h-px bg-[#c9cbbe]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e]" />
                <span className="tracking-widest uppercase text-[11px] font-semibold text-[#738284]">
                  هوية المؤسسة · INSTITUTIONAL BENCHMARKS
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.2] text-[#222f30] font-kufi">
                بيت حكمةٍ لجميع العلوم،{" "}
                <span className="text-[#738284] font-normal">
                  يُبنى بسواعد باحثيه ومساهميه.
                </span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#55696a] max-w-md leading-relaxed lg:pb-1">
              من العلوم الشرعية إلى الذكاء الاصطناعي إلى الطب والفلك — منظومة معرفية موحدة ومفتوحة للجميع دون احتكار.
            </p>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border ${
                  s.highlight
                    ? "border-[#a7e26e] shadow-md ring-1 ring-[#a7e26e]/30"
                    : "border-[#e4e3e3] shadow-xs"
                } hover:border-[#a7e26e] hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f8f7] border border-[#e4e3e3] flex items-center justify-center text-[#222f30]">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-[#738284]">
                    {s.labelEn}
                  </span>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#222f30] mb-2 dir-ltr text-right">
                    <bdi dir="rtl">{s.num}</bdi>
                  </div>
                  <h3 className="text-base font-bold text-[#222f30] mb-1 font-kufi">
                    {s.label}
                  </h3>
                  <p className="text-xs text-[#445e5f] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section Framing Footer — Anchors the 4 cards and frames the section closure */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#e4e3e3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[#55696a]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
            <span className="font-bold text-[#222f30]">سجل الاكتشاف المفتوح (OPEN DISCOVERY ARCHIVE)</span>
            <span className="text-[#848c8e]">·</span>
            <span>توثيق فوري ومحمي بالتحقق البشري الصارم</span>
          </div>
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#222f30] hover:text-[#728825] transition-colors group"
          >
            <span>استعراض أرشيف الأبحاث والاكتشافات</span>
            <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
