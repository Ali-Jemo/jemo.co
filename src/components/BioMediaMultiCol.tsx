"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import BioButton from "@/components/BioButton";
import { Cpu, Database, ShieldCheck } from "lucide-react";

export default function BioMediaMultiCol() {
  return (
    <section
      dir="rtl"
      className="c-media-wi-multicol py-8 sm:py-16 bg-[#f7f7f5] text-[#222f30] border-b border-[#e4e3e3] relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16">
        
        {/* Academic Section Header */}
        <div className="mb-8 sm:mb-14 pb-6 sm:pb-8 border-b border-[#e4e3e3]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-12">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2.5 text-xs font-mono text-[#55696a]">
                <span className="font-bold text-[#222f30] text-sm tracking-normal">03</span>
                <span className="w-5 h-px bg-[#c9cbbe]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e]" />
                <span className="tracking-widest uppercase text-[11px] font-semibold text-[#738284]">
                  معمارية التحقق · VERIFICATION ARCHITECTURE
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.2] text-[#222f30] font-kufi">
                منظومة توثيق وتدقيق رصينة —{" "}
                <span className="text-[#738284] font-normal">
                  لحماية المحتوى من الهلوسات والادعاءات.
                </span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#55696a] max-w-md leading-relaxed lg:pb-1">
              معيار هندسي صارم يفرض تقديم الكود، والاختبارات القياسية، وخطوات التدقيق البشري كشرط أساسي للأرشفة والاعتراف.
            </p>
          </div>
        </div>

        {/* Split Media + Multi-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-center">
          
          {/* Left Media (Col 1 to 5): High-res Research Hardware / Lab Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#e4e3e3] shadow-md min-h-[220px] sm:min-h-[440px] bg-[#0c1415] group"
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

          {/* Right Content (Col 6 to 12): Bold Statement + 2-Column Technical Columns */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-8">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] sm:leading-[1.15] text-[#222f30] font-kufi">
              منصة توثيق وتدقيق للاكتشافات المتقدمة — لا مجرد منتدى مفتوح.
            </h2>

            <p className="text-sm sm:text-lg text-[#445e5f] leading-relaxed">
              إذا أردت منصة ذات قيمة حقيقية، فالمعركة اليومية هي تصفية الهلوسة والغثاء (AI Slop). وضعنا معياراً هندسياً يركز على أبحاث النظم، البرمجة، والذكاء الاصطناعي — كل نتيجة منشورة مدعومة بكود، واختبارات قياسية، وتدقيق بشري موثق.
            </p>

            {/* 2-Column Comparative Technical Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-6 pt-3 sm:pt-4 border-t border-[#e4e3e3]">
              {/* Column 1: Operating Systems & Microkernel */}
              <div className="space-y-2 sm:space-y-3 p-4 sm:p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#cef79e] text-[#222f30] flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#222f30]">
                  قالب التحقق البشري (Proof of Work)
                </h4>
                <p className="text-xs sm:text-sm text-[#445e5f] leading-relaxed">
                  فصل قاطع بين ما أنتجه النموذج وما دققه الباحث بنفسه: تتبع الفرضيات، تصحيح الهلوسات، وفحص المخرجات ضد بيئات تشغيل فعلية.
                </p>
              </div>

              {/* Column 2: Foundational AI & Datasets */}
              <div className="space-y-2 sm:space-y-3 p-4 sm:p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] transition-colors">
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

            {/* Action Button using BioButton */}
            <div className="pt-2 sm:pt-4 flex items-center gap-4">
              <BioButton
                href="/publish"
                label="START PUBLISHING"
                secondaryLabel="وثّق بحثك الآن"
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
