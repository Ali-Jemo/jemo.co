"use client";

import { ShieldCheck, CheckCircle2, FileText, ArrowUpLeft, Lock } from "lucide-react";
import Link from "next/link";

export interface SupportCommitmentsProps {
  commitments: string[];
}

export default function SupportCommitments({ commitments }: SupportCommitmentsProps) {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#cef79e]/30 text-[#222f30] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#728825]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--ink-1)] font-kufi">
                  ميثاق الشفافية والاستقلالية العلمية
                </h2>
                <p className="text-xs text-[var(--ink-2)] font-mono">
                  ETHICAL CHARTER & SCIENTIFIC INTEGRITY
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-mono font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>ميثاق غير قابل للتنازل</span>
            </span>
          </div>

          <p className="text-sm sm:text-base text-[var(--ink-2)] leading-relaxed">
            تأسست JEMO LABS على مبدأ السيادة التقنية الحقيقية؛ ولا يمكن تحقيق سيادة حقيقية دون استقلالية كاملة في القرار العلمي. نلتزم أمام المجتمع الأكاديمي والتقني والجمهور بالبنود التالية:
          </p>

          <div className="space-y-4">
            {commitments.map((commitment, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] flex items-start gap-3.5 hover:border-[#a7e26e] transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#cef79e] text-[#222f30] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#728825]" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-[var(--ink-1)] leading-relaxed">
                    {commitment}
                  </p>
                  <p className="text-[11px] text-[var(--ink-2)]">
                    {idx === 0 && "يتم التدقيق المالي من قبل محاسبين قانونيين معتمدين وتُنشر الوثائق سنوياً للجمهور."}
                    {idx === 1 && "لا يحق لأي جهة مانحة تعديل النتائج العلمية أو الاعتراض على نشر الثغرات أو نتائج التقييم."}
                    {idx === 2 && "الشيفرات تطلق تحت رخص GPLv3 أو MIT، والأوراق تنشر تحت CC-BY للوصول المفتوح الدائم."}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Annual report banner */}
          <div className="p-6 rounded-2xl bg-[#cef79e]/15 border border-[#a7e26e]/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#728825]" />
              <div>
                <h4 className="font-bold text-sm text-[var(--ink-1)]">التقرير المالي والأكاديمي السنوي</h4>
                <p className="text-xs text-[var(--ink-2)]">تابع إصداراتنا الدورية ونشرات الشفافية السنوية</p>
              </div>
            </div>

            <Link
              href="/newsletter"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--brand)] text-white text-xs font-bold hover:bg-[#162021] transition-all"
            >
              <span>الاطلاع على النشرة والتقارير</span>
              <ArrowUpLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
