"use client";

import { motion } from "framer-motion";
import { Cpu, Server, Bot, ShieldCheck } from "lucide-react";

const METRICS = [
  {
    num: "0.12µs",
    label: "زمن تبديل السياق",
    labelEn: "Context Switch Latency",
    desc: "نواة Ziqa صفري النسخ بلغة Rust",
    icon: Cpu,
    accent: "#a7e26e",
  },
  {
    num: "18.2 PFLOPS",
    label: "القدرة الحاسوبية الفائقة",
    labelEn: "Peak Compute Capacity",
    desc: "عنقود بغداد-١ بـ 512 عقدة معزولة",
    icon: Server,
    accent: "#cef79e",
  },
  {
    num: "128K",
    label: "نافذة السياق اللغوي",
    labelEn: "Context Window",
    desc: "نماذج Baghdad-LLM للاستدلال العلمي",
    icon: Bot,
    accent: "#c9cbbe",
  },
  {
    num: "100%",
    label: "استقلال برمجي وسيادة",
    labelEn: "Open Source Sovereignty",
    desc: "شيفرات وبيانات مفتوحة للمجتمع العلمي",
    icon: ShieldCheck,
    accent: "#a7e26e",
  },
];

export default function BioMetricsBand() {
  return (
    <section
      dir="rtl"
      className="py-16 sm:py-20 bg-[#f7f7f5] text-[#222f30] border-b border-[#e4e3e3] relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-white font-mono text-xs uppercase tracking-widest text-[#445e5f] mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
              <span>المقاييس التقنية · TECHNICAL BENCHMARKS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#222f30] font-kufi">
              معايير أداء استثنائية، مُثبتة مخبرياً.
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#445e5f]">
            قياسات موثقة ومتحققة رسمياً على أجهزة عتادية حقيقية.
          </p>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f8f7] border border-[#e4e3e3] flex items-center justify-center text-[#222f30]">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-[#738284]">
                    {m.labelEn}
                  </span>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#222f30] mb-2 dir-ltr text-right">
                    {m.num}
                  </div>
                  <h3 className="text-base font-bold text-[#222f30] mb-1 font-kufi">
                    {m.label}
                  </h3>
                  <p className="text-xs text-[#445e5f] leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
