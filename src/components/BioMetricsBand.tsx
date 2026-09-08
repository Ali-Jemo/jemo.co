"use client";

import { motion } from "framer-motion";
import { Users, Building2, Layers, ShieldCheck } from "lucide-react";

const STATS = [
  {
    num: "+50",
    label: "باحث وعالم في كل المجالات",
    labelEn: "SCHOLARS · ALL FIELDS",
    desc: "نخبة من علماء الشريعة، ومهندسي الذكاء الاصطناعي، وأطباء وطبيعيين وإنسانيين — لا تخصص واحد فقط.",
    icon: Users,
    highlight: false,
  },
  {
    num: "12+",
    label: "مجالاً علمياً مفتوحاً",
    labelEn: "SCIENTIFIC DOMAINS",
    desc: "شرعية وإسلامية، ذكاء اصطناعي وحاسوب، فيزياء وكيمياء ورياضيات، طب وأحياء، فلك وبيئة، وعلوم إنسانية.",
    icon: Building2,
    highlight: false,
  },
  {
    num: "14+",
    label: "مبادرة ومشروع معرفي",
    labelEn: "ACTIVE INITIATIVES",
    desc: "موسوعات ومكتبات، مخطوطات مرممة، نماذج مفتوحة، ودراسات شرعية وطبيعية وتقنية لخدمة الجميع.",
    icon: Layers,
    highlight: true,
  },
  {
    num: "100%",
    label: "معرفة مفتوحة للجميع",
    labelEn: "OPEN · NON-PROFIT",
    desc: "كيان علمي مستقل غير ربحي، كل الأبحاث والكتب والدروس والشيفرات متاحة مجاناً وبلا احتكار.",
    icon: ShieldCheck,
    highlight: false,
  },
];

export default function BioMetricsBand() {
  return (
    <section
      dir="rtl"
      className="py-16 sm:py-24 bg-[#f7f7f5] text-[#222f30] border-b border-[#e4e3e3] relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-white font-mono text-xs uppercase tracking-widest text-[#445e5f] mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
              <span>هوية المؤسسة · ABOUT JEMO LABS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#222f30] font-kufi">
              بيت حكمةٍ لجميع العلوم، يُبنى بسواعد علمائه.
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#445e5f] max-w-md leading-relaxed">
            من العلوم الشرعية إلى الذكاء الاصطناعي إلى الطب والفلك — منظومة معرفية واحدة مفتوحة للجميع.
          </p>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`p-6 sm:p-8 rounded-3xl bg-white border ${
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
                    {s.num}
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
      </div>
    </section>
  );
}
