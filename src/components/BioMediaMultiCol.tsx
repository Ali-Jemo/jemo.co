"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import BioButton from "@/components/BioButton";
import EditorialSectionHeader from "@/components/EditorialSectionHeader";
import { Cpu, Database } from "lucide-react";

export default function BioMediaMultiCol() {
  return (
    <section
      dir="rtl"
      className="c-media-wi-multicol py-12 sm:py-20 lg:py-24 bg-[#f7f7f5] text-[#222f30] border-b border-[#e4e3e3] relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16">
        <EditorialSectionHeader
          num="03"
          kickerAr="بنية المنصة"
          kickerEn="PLATFORM REGISTRY"
          title="منصة توثيق وتدقيق للاكتشافات المتقدمة"
          titleAccent="— لا مجرد منتدى مفتوح."
          lede="إذا أردت منصة ذات قيمة حقيقية، فالمعركة اليومية هي تصفية الهلوسة والغثاء (AI Slop). وضعنا معياراً هندسياً يركز على أبحاث النظم، البرمجة، والذكاء الاصطناعي — كل نتيجة منشورة مدعومة بكود، واختبارات قياسية، وتدقيق بشري موثق."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch">
          {/* Media anchor — the standard, visualised */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#e4e3e3] shadow-md min-h-[320px] sm:min-h-[400px] lg:min-h-[440px] bg-[#0c1415] group"
          >
            <Image
              src="/departments-bg.png"
              alt="JEMO LABS — منصة توثيق وتدقيق أبحاث النظم والذكاء الاصطناعي"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover opacity-85 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {/* Overlay badge */}
            <div className="absolute bottom-6 inset-x-6 z-10">
              <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-[#a7e26e] text-[#222f30] font-bold">
                معيار إثبات العمل · PROOF OF WORK
              </span>
            </div>
          </motion.div>

          {/* Spec rail — the two pillars that make the standard enforceable */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-4">
            <div className="space-y-3">
              <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-md border border-[#e4e3e3] bg-white font-mono text-xs text-[#55696a] shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e]" aria-hidden />
                <span className="tracking-wider uppercase font-semibold text-[#222f30]">[REGISTRY // SPEC_01]</span>
              </div>
              <p className="text-sm text-[#445e5f] leading-relaxed">
                لا مكان لغثاء الـ AI. المعيار الوحيد: الفرضية الواضحة، التحقق البشري الصارم، والنتائج القابلة للتكرار.
              </p>
            </div>

            {/* Pillar 1: Human Verification Template */}
            <div className="space-y-3 p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#cef79e] text-[#222f30] flex items-center justify-center font-bold">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#222f30] flex items-center gap-2 flex-wrap">
                <span>قالب التحقق البشري</span>
                <bdi dir="ltr" className="text-xs font-mono font-semibold text-[#55696a] whitespace-nowrap">
                  (Proof of Work)
                </bdi>
              </h3>
              <p className="text-xs text-[#445e5f] leading-relaxed">
                فصل قاطع بين ما أنتجه النموذج وما دققه الباحث بنفسه: تتبع الفرضيات، تصحيح الهلوسات، وفحص المخرجات ضد بيئات تشغيل فعلية.
              </p>
            </div>

            {/* Pillar 2: Technical Indexing & Intellectual Precedence */}
            <div className="space-y-3 p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#c9cbbe] text-[#222f30] flex items-center justify-center font-bold">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#222f30]">
                فهرسة تقنية نخبوية وسبق فكري
              </h3>
              <p className="text-xs text-[#445e5f] leading-relaxed">
                رابط مرجعي معتمد وتوثيق للسبق الفكري باسمك، مع شفرات قابلة للتكرار تمنحك سلطة بحثية مستقلة عن الأكاديميا التقليدية.
              </p>
            </div>

            <div className="pt-1">
              <BioButton href="/publish" label="START PUBLISHING" variant="primary" dir="ltr" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
