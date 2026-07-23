"use client";

import React from "react";
import { ShieldCheck, Users, Globe, FileText, CheckCircle } from "lucide-react";
import GlowingBorder from "@/components/GlowingBorder";
import MagneticCard from "@/components/MagneticCard";

const termsData = [
  {
    id: 1,
    title: "الخصوصية",
    icon: ShieldCheck,
    description: "نحن في jemo labs نولي أهمية قصوى لحماية بياناتك الشخصية. نلتزم بعدم مشاركة معلوماتك مع أي طرف ثالث دون موافقتك الصريحة.",
    points: ["تشفير البيانات الحساسة", "عدم بيع البيانات للجهات الإعلانية", "حقك في حذف حسابك في أي وقت"]
  },
  {
    id: 2,
    title: "الاستخدام الإجتماعي",
    icon: Users,
    description: "لضمان بيئة مجتمعية آمنة ومحترمة للجميع، يُرجى الالتزام بالآداب العامة عند التفاعل مع المستخدمين الآخرين.",
    points: ["عدم استخدام لغة مسيئة أو عنصرية", "احترام خصوصية الآخرين", "الإبلاغ عن السلوكيات المخالفة"]
  },
  {
    id: 3,
    title: "الاستخدام العام",
    icon: Globe,
    description: "يُسمح باستخدام منصتنا للأغراض المشروعة فقط. أي استخدام للمنصة لإلحاق الضرر بالخدمة أو المستخدمين الآخرين ممنوع تماماً.",
    points: ["يمنع محاولة اختراق أو تعطيل الخدمة", "يمنع استخدام برامج التصفح الآلية", "المسؤولية عن المحتوى المنشور"]
  },
  {
    id: 4,
    title: "الشروط العامة",
    icon: FileText,
    description: "تخضع هذه الاتفاقية للقوانين المعمول بها. نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إعلامك بأي تحديثات جوهرية.",
    points: ["حق المنظومة في تعديل الشروط", "إشعار مسبق قبل تطبيق التغييرات", "إلغاء الخدمة في حال مخالفة الشروط"]
  }
];

export default function TermsClient() {
  return (
    <div dir="rtl" className="min-h-screen bg-[var(--bg)] py-16 px-4 sm:px-6 lg:px-8 font-kufi text-[var(--ink)]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--brand)]/20 bg-[var(--brand)]/5 text-[var(--brand-700)] text-xs font-mono mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            <span className="font-semibold tracking-wider">TERMS & POLICIES</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--ink)] mb-4">
            الشروط <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand)] to-[var(--brand-700)] italic">والأحكام</span>
          </h1>
          <p className="text-lg text-[var(--ink-2)] max-w-xl mx-auto leading-relaxed">
            اتفاقية واضحة وشفافة تضمن حقوقك وتحدد التزاماتنا داخل منصة jemo labs.
          </p>
        </header>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {termsData.map((section) => {
            const Icon = section.icon;
            return (
              <MagneticCard key={section.id} className="h-full">
                <GlowingBorder className="h-full">
                  <div className="bg-[var(--surface)] rounded-2xl p-8 flex flex-col justify-between h-full transition-colors duration-300">
                    <div>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="p-3 rounded-2xl bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] shrink-0 shadow-xs">
                          <Icon size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--ink)]">{section.title}</h3>
                      </div>

                      <p className="text-[var(--ink-2)] leading-relaxed text-sm md:text-base mb-6">
                        {section.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[var(--line)]">
                      <ul className="space-y-3">
                        {section.points.map((point, index) => (
                          <li key={index} className="flex items-center gap-3 text-sm text-[var(--ink-2)] font-medium">
                            <CheckCircle size={16} className="text-[var(--brand)] shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </GlowingBorder>
              </MagneticCard>
            );
          })}
        </div>

        {/* Footer Support Banner */}
        <div className="mt-16 text-center bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-10 relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(14, 165, 233, 0.06) 0%, transparent 70%)" }} />
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] mb-4">لديك استفسار حول الشروط؟</h2>
          <p className="text-[var(--ink-2)] mb-8 max-w-md mx-auto">فريق المنظومة جاهز لتوضيح أي نقطة غير مفهومة بكل شفافية.</p>
          <a
            href="/apply"
            className="inline-flex items-center justify-center bg-[var(--brand)] text-white font-bold py-3.5 px-8 rounded-xl hover:bg-[var(--brand-700)] transition-all shadow-md text-sm cursor-pointer"
          >
            قدّم طلبك الآن
          </a>
        </div>
      </div>
    </div>
  );
}
