"use client";

import { Cpu, GitPullRequest, FileCheck, HardDrive, ArrowUpLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export interface NonFinancialSupportProps {
  onOpenInquiry: (category?: string) => void;
}

export default function NonFinancialSupport({ onOpenInquiry }: NonFinancialSupportProps) {
  const ways = [
    {
      id: "compute",
      icon: Cpu,
      title: "التبرع بالقدرة الحوسبية (Compute & Cloud)",
      desc: "تبرع بأرصدة سحابية (RunPod, Lambda, AWS, Hetzner) أو توفير وصول لخوادم GPU لدعم تدريب النماذج اللغوية والأبحاث المعقدة.",
      badge: "أثر فوري حاسم",
      action: {
        label: "تقديم أرصدة أو خوادم حوسبية",
        type: "modal",
        category: "compute",
      },
    },
    {
      id: "code",
      icon: GitPullRequest,
      title: "المساهمة البرمجية والهندسية (Code Contributions)",
      desc: "المساهمة في بناء نواة الأنظمة المكتوبة بـ Rust، تطوير برامج التشغيل، كتابة الاختبارات، وتحسين خوارزميات الاستدلال.",
      badge: "مفتوح المصدر",
      action: {
        label: "تصفح مستودعات GitHub",
        type: "link",
        href: "https://github.com/Ali-Jemo",
      },
    },
    {
      id: "peer-review",
      icon: FileCheck,
      title: "مراجعة الأقران والتحكيم العلمي (Peer Review)",
      desc: "انضم إلى شبكة المحكمين والعلماء المستقلين لمراجعة مسودات الأوراق والتحقق من المنهجية وقابلية إعادة إنتاج النتائج.",
      badge: "أكاديمي مستقل",
      action: {
        label: "الاطلاع على سياسة المراجعة",
        type: "link",
        href: "/peer-review",
      },
    },
    {
      id: "hardware",
      icon: HardDrive,
      title: "التبرع بالعتاد والمعدات المعملية (Hardware)",
      desc: "تزويد مختبراتنا الميدانية في بغداد ببوردات RISC-V، شرائح FPGA، أجهزة راسم إشارة، ومستلزمات القياس والاختبار الفيزيائي.",
      badge: "معدات فيزيائية",
      action: {
        label: "تنسيق شحن أو تبرع بالعتاد",
        type: "modal",
        category: "compute",
      },
    },
  ];

  return (
    <section className="py-16">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cef79e]/30 text-[#222f30] text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#728825]" />
          <span>الدعم غير المالي والعيني</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[var(--ink-1)] font-kufi">
          طرق أخرى للمساهمة في نهضة البحث
        </h2>
        <p className="text-sm sm:text-base text-[var(--ink-2)]">
          ليس الدعم مقتصراً على التمويل النقدي؛ عقولكم، ساعات حوسبتكم، ومعداتكم التقنية تشكل وقوداً أساسياً لاستمرار أبحاثنا.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ways.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-7 rounded-3xl bg-[var(--surface)] border border-[var(--line)] hover:border-[#a7e26e] hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#cef79e]/30 text-[#222f30] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#728825]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--line)] text-[11px] font-mono font-bold text-[var(--ink-2)]">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[var(--ink-1)] font-kufi mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--line)]/60">
                {item.action.type === "modal" ? (
                  <button
                    onClick={() => onOpenInquiry(item.action.category)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#728825] hover:text-[var(--brand)] transition-colors"
                  >
                    <span>{item.action.label}</span>
                    <ArrowUpLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href={item.action.href!}
                    target={item.action.href!.startsWith("http") ? "_blank" : undefined}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#728825] hover:text-[var(--brand)] transition-colors"
                  >
                    <span>{item.action.label}</span>
                    <ArrowUpLeft className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
