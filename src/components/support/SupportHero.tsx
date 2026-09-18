"use client";

import { HeartHandshake, ShieldCheck, Sparkles, Cpu, ArrowDown, Building2 } from "lucide-react";

export interface SupportHeroProps {
  quote: string;
  onOpenInquiry: (category?: string) => void;
}

export default function SupportHero({ quote, onOpenInquiry }: SupportHeroProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-12 pb-16 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-2)] text-xs font-mono shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#a7e26e] animate-pulse" />
          <HeartHandshake className="w-3.5 h-3.5 text-[#728825]" />
          <span>رعاية البحث العلمي والسيادة التقنية · SOVEREIGN RESEARCH PATRONAGE</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--ink-1)] tracking-tight leading-tight font-kufi">
          استثمر في استقلال العقول وتطوير النظم المفتوحة.
        </h1>

        {/* Lead paragraph / quote */}
        <p className="text-base sm:text-xl text-[var(--ink-2)] leading-relaxed max-w-2xl mx-auto font-medium">
          {quote}
        </p>
        <p className="text-sm text-[var(--ink-2)]/80 max-w-2xl mx-auto leading-relaxed">
          نعمل في JEMO LABS كمؤسسة بحثية مستقلة تماماً؛ نطور أنظمة التشغيل الآمنة، نماذج الذكاء الاصطناعي السيادية، ومعماريات الحوسبة الحرة. دعمكم يضمن تفرغ الباحثين، تجهيز الخوادم الفائقة، وإتاحة كافة المخرجات للعامة بدون قيود.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => scrollToSection("payment-methods")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--brand)] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#162021] transition-all"
          >
            <span>التبرع الفوري (كريبتو ومحلي)</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollToSection("sponsorship-tiers")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-1)] text-xs sm:text-sm font-bold shadow-xs hover:border-[#a7e26e] hover:bg-[#cef79e]/15 transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#728825]" />
            <span>باقات الرعاية وحاسبة الأثر</span>
          </button>

          <button
            onClick={() => onOpenInquiry("institutional")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[var(--line)] text-[var(--ink-1)] text-xs sm:text-sm font-bold shadow-xs hover:bg-[var(--surface-hover)] transition-all"
          >
            <Building2 className="w-4 h-4 text-[#445e5f]" />
            <span>رعاية مؤسسية / جامعية</span>
          </button>
        </div>

        {/* Pillar badges strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-[var(--line)]/60 text-right">
          <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] flex items-start gap-2.5 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-[#cef79e]/40 text-[#222f30] flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-[#728825]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--ink-1)]">100% مفتوح المصدر</div>
              <div className="text-[11px] text-[var(--ink-2)] font-mono">Open Access & GPL/MIT</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] flex items-start gap-2.5 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-[#cef79e]/40 text-[#222f30] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-[#728825]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--ink-1)]">شفافية وتدقيق سنوي</div>
              <div className="text-[11px] text-[var(--ink-2)] font-mono">Audited Financials</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] flex items-start gap-2.5 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-[#cef79e]/40 text-[#222f30] flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-[#728825]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--ink-1)]">0% تمويل مشروط</div>
              <div className="text-[11px] text-[var(--ink-2)] font-mono">Zero Commercial Bias</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] flex items-start gap-2.5 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-[#cef79e]/40 text-[#222f30] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cpu className="w-4 h-4 text-[#728825]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--ink-1)]">حوسبة سيادية مستقلة</div>
              <div className="text-[11px] text-[var(--ink-2)] font-mono">Sovereign High-Compute</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
