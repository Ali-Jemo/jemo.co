"use client";

import { motion } from "framer-motion";
import { TIMELINE_EVENTS } from "@/lib/data/research-data";
import { Compass, Sparkles, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface LivingMuseumTimelineProps {
  showFull?: boolean;
  hideHeader?: boolean;
}

export default function LivingMuseumTimeline({ showFull = false, hideHeader = false }: LivingMuseumTimelineProps) {
  const events = showFull ? TIMELINE_EVENTS : TIMELINE_EVENTS.slice(0, 4);

  return (
    <div className="relative">
      {!hideHeader && (
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] text-xs font-mono mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>المتحف الحي للعلم — مسار المؤسسة</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--ink-1)]">
            من <span className="text-[var(--brand)]">بيت الحكمة</span> إلى المستقبل
          </h2>
          <p className="text-[var(--ink-2)] leading-relaxed text-sm md:text-base">
            سجل نمو JEMO LABS خطوة بخطوة. كل ورقة بحثية، كل مشروعي، وكل باحث يضيف قطعة في قصة إعمار البيئة البحثية العراقية الحديثة.
          </p>
        </div>
      )}

      <div className="relative border-r-2 border-[var(--line)] pr-5 md:pr-10 space-y-6 sm:space-y-12 max-w-4xl mx-auto ms-4 md:ms-auto">
        {events.map((evt, idx) => (
          <motion.div
            key={evt.year}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="relative group"
          >
            {/* Timeline node icon */}
            <div
              className={`absolute -right-[13px] md:-right-[25px] top-1.5 w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                evt.highlight
                  ? "bg-[var(--gold)] border-white text-white shadow-lg shadow-[var(--gold)]/30 scale-110"
                  : "bg-[var(--surface)] border-[var(--line)] text-[var(--ink-2)] group-hover:border-[var(--brand)] group-hover:text-[var(--brand)]"
              }`}
            >
              {evt.highlight ? <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </div>

            <div className={`bg-[var(--bg)] border p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all shadow-sm ${evt.highlight ? 'border-[var(--gold)]/50 hover:border-[var(--gold)] shadow-[var(--gold)]/10' : 'border-[var(--line)] group-hover:border-[var(--brand)]/50'}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className={`font-mono text-lg sm:text-2xl font-extrabold ${evt.highlight ? 'text-[var(--gold)]' : 'text-[var(--brand)]'}`}>
                  {evt.year}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)]">
                  {evt.subtitle}
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-[var(--ink-1)] mb-1.5 sm:mb-2 group-hover:text-[var(--brand)] transition-colors">
                {evt.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                {evt.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {!showFull && (
        <div className="text-center mt-12">
          <Link
            href="/timeline"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--surface)] border border-[var(--line)] text-sm font-bold text-[var(--ink-1)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-all shadow-xs"
          >
            <span>استكشف الخط الزمني الكامل للمؤسسة</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
