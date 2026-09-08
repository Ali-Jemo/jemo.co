"use client";

import Link from "next/link";
import { Terminal, Bot, Server, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const PILLARS_DATA = [
  {
    id: "kernel",
    index: "01.",
    tag: "KERNEL LAYER / طبقة النواة",
    title: "نواة Ziqa التشغيلية",
    titleEn: "Ziqa Microkernel",
    desc: "نواة دقيقة سيادية مكتوبة بلغة Rust للأنظمة المدمجة الحرجة، بزمن تبديل سياق 0.12µs وبروتوكول IPC آمن ومتحقق رسمياً.",
    icon: Terminal,
    bg: "#cef79e",
    textColor: "#222f30",
    href: "/labs",
    cta: "استكشف النواة",
  },
  {
    id: "llm",
    index: "02.",
    tag: "INTELLIGENCE LAYER / طبقة الذكاء",
    title: "نماذج Baghdad-LLM",
    titleEn: "Sovereign Foundation Models",
    desc: "نماذج ذكاء اصطناعي عربي مفتوحة المصدر مدربة على أضخم مدونة أكاديمية علمية للاستدلال والتفكير الرياضي المتقدم.",
    icon: Bot,
    bg: "#c9cbbe",
    textColor: "#222f30",
    href: "/benchmarks",
    cta: "استكشف النماذج",
  },
  {
    id: "hpc",
    index: "03.",
    tag: "INFRASTRUCTURE / البنية التحتية",
    title: "عنقود بغداد-١ للحوسبة الفائقة",
    titleEn: "Baghdad-1 HPC Cluster",
    desc: "بنية حوسبة وطنية فائقة الأداء بقدرة 18.2 PFLOPS و512 عقدة معزولة لتأمين استدلال وتدريب النماذج والبيانات الأكاديمية.",
    icon: Server,
    bg: "#f5f8f7",
    textColor: "#222f30",
    href: "/infrastructure",
    cta: "استكشف العنقود",
  },
];

export default function USPCards() {
  return (
    <section className="c-usp-cards py-20 sm:py-28 bg-[#f7f7f5] text-[#222f30] relative overflow-hidden border-b border-[#e4e3e3]" dir="rtl">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Header with IntegratedBio style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e4e3e3] bg-white font-mono text-xs uppercase tracking-widest text-[#445e5f] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
              <span>ما نبنيه · What We Build</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[#222f30] font-kufi">
              نواة واحدة، منظوماتٌ سيادية متكاملة.
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#445e5f] max-w-md leading-relaxed">
            محرك اكتشاف وتطوير تقني متكامل يجمع هندسة النوى، الذكاء الاصطناعي، والحوسبة الفائقة في منظومة واحدة.
          </p>
        </div>

        {/* 3 IntegratedBio Numbered Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 rounded-3xl overflow-hidden border border-[#e4e3e3] shadow-xs">
          {PILLARS_DATA.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative p-8 sm:p-12 min-h-[380px] sm:min-h-[440px] flex flex-col justify-between transition-all duration-500 hover:shadow-2xl border-b lg:border-b-0 lg:border-l last:border-l-0 border-[#222f30]/10"
                style={{ backgroundColor: card.bg, color: card.textColor }}
              >
                {/* Top: Large Monospace Index Numeral */}
                <div className="flex items-start justify-between">
                  <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">
                    {card.index}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#222f30]/10 flex items-center justify-center text-[#222f30] group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 stroke-[1.8]" />
                  </div>
                </div>

                {/* Bottom: Tag + Heading + Desc + Action link */}
                <div className="mt-auto pt-10">
                  <span className="inline-block text-[11px] font-mono tracking-wider uppercase opacity-75 mb-3">
                    {card.tag}
                  </span>
                  
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 leading-snug">
                    {card.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base opacity-80 leading-relaxed mb-6 font-normal">
                    {card.desc}
                  </p>

                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold font-mono tracking-wider uppercase border-b border-[#222f30] pb-1 hover:gap-3 transition-all duration-300"
                  >
                    <span>{card.cta}</span>
                    <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
