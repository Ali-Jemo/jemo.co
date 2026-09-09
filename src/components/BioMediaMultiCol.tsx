"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import BioButton from "@/components/BioButton";
import { Cpu, Database, ShieldCheck } from "lucide-react";

export default function BioMediaMultiCol() {
  return (
    <section
      dir="rtl"
      className="c-media-wi-multicol py-10 sm:py-16 lg:py-20 bg-[#f7f7f5] text-[#222f30] border-b border-[#e4e3e3] relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 space-y-8 sm:space-y-12">
        
        {/* Top Hero Row: Split Narrative (Right in RTL) + Media Anchor (Left in RTL) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Right Content Area (Col 1 to 7 in RTL = Visual Right): Natural Reading Flow */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Engineering Path Badge */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#e4e3e3] bg-white font-mono text-xs text-[#55696a] shadow-xs w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e]" />
                <span className="tracking-wider uppercase font-semibold text-[#222f30]">[REGISTRY // SPEC_01]</span>
              </div>
            </div>

            {/* 2. Bold Primary Heading & Narrative */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] sm:leading-[1.15] text-[#222f30] font-kufi">
                منصة توثيق وتدقيق للاكتشافات المتقدمة — لا مجرد منتدى مفتوح.
              </h2>
              <p className="text-sm sm:text-lg text-[#445e5f] leading-relaxed max-w-2xl">
                إذا أردت منصة ذات قيمة حقيقية، فالمعركة اليومية هي تصفية الهلوسة والغثاء (AI Slop). وضعنا معياراً هندسياً يركز على أبحاث النظم، البرمجة، والذكاء الاصطناعي — كل نتيجة منشورة مدعومة بكود، واختبارات قياسية، وتدقيق بشري موثق.
              </p>
            </div>

            {/* 3. Primary CTA: Single explicit label, zero collision */}
            <div className="pt-1 flex items-center gap-4">
              <BioButton
                href="/publish"
                label="START PUBLISHING"
                variant="primary"
                dir="ltr"
              />
            </div>

          </div>

          {/* Left Media Area (Col 8 to 12 in RTL = Visual Left): Balanced Complementary Anchor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#e4e3e3] shadow-md min-h-[320px] sm:min-h-[400px] lg:min-h-[440px] bg-[#0c1415] group"
          >
            <Image
              src="/departments-bg.png"
              alt="JEMO LABS — منصة توثيق وتدقيق أبحاث النظم والذكاء الاصطناعي"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover opacity-85 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            
            {/* Overlay badge */}
            <div className="absolute bottom-6 inset-x-6 z-10 text-white space-y-2">
              <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-[#a7e26e] text-[#222f30] font-bold">
                معيار إثبات العمل · PROOF OF WORK
              </span>
              <p className="text-sm font-medium text-white/90 leading-relaxed">
                لا مكان لغثاء الـ AI. المعيار الوحيد: الفرضية الواضحة، التحقق البشري الصارم، والنتائج القابلة للتكرار.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Bottom Full-Width Supporting Pillars: Zero dead space across the entire container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-[#e4e3e3]">
          {/* Pillar 1: Human Verification Template */}
          <div className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] transition-colors">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#cef79e] text-[#222f30] flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#222f30] flex items-center gap-2 flex-wrap">
              <span>قالب التحقق البشري</span>
              <bdi dir="ltr" className="text-xs sm:text-sm font-mono font-semibold text-[#55696a] whitespace-nowrap">
                (Proof of Work)
              </bdi>
            </h4>
            <p className="text-xs sm:text-sm text-[#445e5f] leading-relaxed">
              فصل قاطع بين ما أنتجه النموذج وما دققه الباحث بنفسه: تتبع الفرضيات، تصحيح الهلوسات، وفحص المخرجات ضد بيئات تشغيل فعلية.
            </p>
          </div>

          {/* Pillar 2: Technical Indexing & Intellectual Precedence */}
          <div className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] transition-colors">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#c9cbbe] text-[#222f30] flex items-center justify-center font-bold">
              <Database className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#222f30]">
              فهرسة تقنية نخبوية وسبق فكري
            </h4>
            <p className="text-xs sm:text-sm text-[#445e5f] leading-relaxed">
              رابط مرجعي معتمد وتوثيق للسبق الفكري باسمك، مع شفرات قابلة للتكرار تمنحك سلطة بحثية مستقلة عن الأكاديميا التقليدية.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
