"use client";

import { PARTNERS } from "@/lib/data/research-data";
import { motion } from "framer-motion";
import { Building2, ExternalLink } from "lucide-react";

export default function BioPartnersGrid() {
  return (
    <section
      dir="rtl"
      className="c-logo-grid py-20 sm:py-28 bg-[#f7f7f5] text-[#222f30] border-b border-[#e4e3e3] relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-white font-mono text-xs uppercase tracking-widest text-[#445e5f] mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
              <span>الشركاء والمؤسسات الأكاديمية · ACADEMIC ALLIANCE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[#222f30] font-kufi">
              شبكة معرفية لكل العلوم.
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#445e5f] max-w-md leading-relaxed">
            تعاون مع الجامعات والمراكز الشرعية والعلمية والتقنية لتكون كل المعرفة مفتوحة للطلبة والباحثين.
          </p>
        </div>

        {/* Partners Grid (IntegratedBio Partner Box Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PARTNERS.map((partner, idx) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] flex items-center justify-center text-[#222f30] group-hover:bg-[#cef79e] transition-colors">
                    <Building2 className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#f5f8f7] border border-[#e4e3e3] text-[11px] font-mono text-[#445e5f]">
                    {partner.type} · {partner.country}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#222f30] mb-2 group-hover:text-[#162021] transition-colors">
                  {partner.name}
                </h3>

                <p className="text-sm text-[#445e5f] leading-relaxed mb-6">
                  شراكة أكاديمية وبحثية تدعم تبادل المعرفة وتطوير البرمجيات المفتوحة وإتاحة حواسيب التدريب للمقررات العلمية.
                </p>
              </div>

              <div className="pt-4 border-t border-[#e4e3e3] flex items-center justify-between">
                <span className="text-xs font-mono text-[#445e5f]">شراكة موثقة ✓</span>
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-[#222f30] hover:text-[#728825] transition-colors"
                >
                  <span>زيارة الموقع</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
