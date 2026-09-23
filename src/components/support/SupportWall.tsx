"use client";

import { Award, Shield, CheckCircle } from "lucide-react";

export interface SupportWallProps {
  onOpenInquiry: (category?: string) => void;
}

export default function SupportWall({ onOpenInquiry }: SupportWallProps) {
  const recognitionLevels = [
    {
      level: "الرعاة السياديون والمؤسسيون",
      levelEn: "Sovereign & Enterprise Patrons",
      criteria: "الرعايات الكبرى للمختبرات وعناقيد الخوادم ($5,000+)",
      perks: "تسمية عناقيد حوسبية، شكر دائم في متن الأوراق المنشورة، دعوات شرفية للمؤتمرات.",
      color: "border-[#728825] bg-gradient-to-b from-[#cef79e]/15 to-transparent",
    },
    {
      level: "رعاة الباحثين والأوراق العلمية",
      levelEn: "Research & Publication Fellows",
      criteria: "رعاية منح الباحثين ونشر الأوراق المفتوحة ($300 - $1,500)",
      perks: "إدراج الاسم في ملحق الشكر والتقدير للأوراق، وصول مبكر لمسودات النماذج والأكواد.",
      color: "border-[var(--line)] bg-[var(--surface)]",
    },
    {
      level: "مساهمو المجتمع والأنظمة الحرة",
      levelEn: "Community & Open Source Advocates",
      criteria: "الدعم الشهري المستمر والتبرعات الفردية ($25 - $250)",
      perks: "شارة داعم رسمية على المستودعات، إدراج الاسم في لوحة الشرف، والنشرة البريدية البحثية.",
      color: "border-[var(--line)] bg-[var(--surface)]",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cef79e]/30 text-[#222f30] text-xs font-mono font-bold">
            <Award className="w-3.5 h-3.5 text-[#728825]" />
            <span>لوحة الشرف وتقدير المساهمين</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--ink-1)] font-kufi">
            كيف نكرّم ونقدّر شركاء مسيرتنا العلمية؟
          </h2>
          <p className="text-sm sm:text-base text-[var(--ink-2)]">
            كل مساهمة، مهما كانت قيمتها، تترك بصمة لا تُمحى في بناء صرح السيادة التكنولوجية.
          </p>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recognitionLevels.map((lvl) => (
            <div
              key={lvl.level}
              className={`p-6 sm:p-7 rounded-3xl border shadow-xs flex flex-col justify-between space-y-5 ${lvl.color}`}
            >
              <div className="space-y-3">
                <div className="text-[11px] font-mono text-[#728825] font-bold uppercase">
                  {lvl.levelEn}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--ink-1)] font-kufi">
                  {lvl.level}
                </h3>
                <p className="text-xs font-mono text-[var(--ink-2)] bg-[var(--surface-2)] p-2.5 rounded-xl border border-[var(--line)]">
                  {lvl.criteria}
                </p>
                <div className="text-xs text-[var(--ink-2)] leading-relaxed">
                  <strong>التقدير:</strong> {lvl.perks}
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--line)]/60 text-xs font-bold text-[var(--ink-1)] flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#728825]" />
                <span>توثيق دائم في المستودعات</span>
              </div>
            </div>
          ))}
        </div>

        {/* Anonymous and privacy notice */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#728825] flex-shrink-0" />
            <div className="text-[var(--ink-2)]">
              <strong>حق الخصوصية الكامل:</strong> إذا كنت تفضل التبرع باسم مجهول (Anonymous Patron)، نحترم رغبتك بالكامل ولن يظهر اسمك في أي سجل عام.
            </div>
          </div>

          <button
            onClick={() => onOpenInquiry("custom")}
            className="px-5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] font-bold text-[var(--ink-1)] hover:bg-[var(--surface-hover)] transition-all flex-shrink-0"
          >
            تنسيق إدراج اسمك أو البقاء مجهولاً
          </button>
        </div>
      </div>
    </section>
  );
}
