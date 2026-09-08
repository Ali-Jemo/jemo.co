"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import BioButton from "@/components/BioButton";
import { Cpu, Database, ShieldCheck } from "lucide-react";

export default function BioMediaMultiCol() {
  return (
    <section
      dir="rtl"
      className="c-media-wi-multicol py-20 sm:py-28 bg-[#f7f7f5] text-[#222f30] border-b border-[#e4e3e3] relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Top Header Tag */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-white font-mono text-xs uppercase tracking-widest text-[#445e5f] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
            <span>المنظومة المتكاملة · INTEGRATED PLATFORM</span>
          </div>
        </div>

        {/* Split Media + Multi-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Media (Col 1 to 5): High-res Research Hardware / Lab Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-[#e4e3e3] shadow-lg min-h-[380px] sm:min-h-[480px] bg-[#0c1415] group"
          >
            <Image
              src="/departments-bg.png"
              alt="JEMO LABS Research Hardware Infrastructure"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover opacity-85 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            
            {/* Overlay badge */}
            <div className="absolute bottom-6 inset-x-6 z-10 text-white space-y-2">
              <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-[#a7e26e] text-[#222f30] font-bold">
                عنقود بغداد-١ HPC
              </span>
              <p className="text-sm font-medium text-white/90 leading-relaxed">
                استدلال وتدريب حوسبي فائق السرعة عبر العنقود الأكاديمي الوطني.
              </p>
            </div>
          </motion.div>

          {/* Right Content (Col 6 to 12): Bold Statement + 2-Column Technical Columns */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-[#222f30] font-kufi">
              أبحاثٌ جريئة تُهندس الذكاء الاصطناعي والنوى السيادية من الأساس.
            </h2>

            <p className="text-base sm:text-lg text-[#445e5f] leading-relaxed">
              نجمع بين علوم النظم الحاسوبية الدقيقة ونماذج الاستدلال اللغوي المتقدمة لبناء بيئة رقمية مستقلة تماماً، قائمة على مبادئ العلم المفتوح والسيادة التقنية الكاملة.
            </p>

            {/* 2-Column Comparative Technical Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#e4e3e3]">
              {/* Column 1: Operating Systems & Microkernel */}
              <div className="space-y-3 p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#cef79e] text-[#222f30] flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-[#222f30]">
                  النواة والأنظمة الحرجة
                </h4>
                <p className="text-xs sm:text-sm text-[#445e5f] leading-relaxed">
                  تطوير نواة Ziqa المصغرة بلغة Rust للأجهزة المدمجة والخوادم السيادية مع بروتوكول IPC محمي رسمياً.
                </p>
              </div>

              {/* Column 2: Foundational AI & Datasets */}
              <div className="space-y-3 p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#c9cbbe] text-[#222f30] flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-[#222f30]">
                  الاستدلال والبيانات المفتوحة
                </h4>
                <p className="text-xs sm:text-sm text-[#445e5f] leading-relaxed">
                  بناء نماذج Baghdad-LLM وتوفير مجموعات البيانات الأكاديمية المفتوحة لتحفيز البحث العلمي العربي.
                </p>
              </div>
            </div>

            {/* Action Button using BioButton */}
            <div className="pt-4 flex items-center gap-4">
              <BioButton
                href="/labs"
                label="EXPLORE PLATFORM"
                secondaryLabel="استكشف المنظومة"
                variant="primary"
                dir="ltr"
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
