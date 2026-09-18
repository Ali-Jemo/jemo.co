"use client";

import { DollarSign, ShieldCheck, PieChart, Users, Cpu, BookOpen, Server } from "lucide-react";

export interface BreakdownItem {
  title: string;
  percentage: number;
  desc: string;
}

export interface SupportAllocationProps {
  breakdown: BreakdownItem[];
}

export default function SupportAllocation({ breakdown }: SupportAllocationProps) {
  // Map icons based on titles or indices
  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return Users;
      case 1:
        return Cpu;
      case 2:
        return BookOpen;
      default:
        return Server;
    }
  };

  const colors = [
    { bar: "bg-[#728825]", text: "text-[#728825]", bg: "bg-[#cef79e]/40" },
    { bar: "bg-[#445e5f]", text: "text-[#445e5f]", bg: "bg-[#445e5f]/10" },
    { bar: "bg-emerald-600", text: "text-emerald-700", bg: "bg-emerald-100" },
    { bar: "bg-slate-700", text: "text-slate-700", bg: "bg-slate-100" },
  ];

  return (
    <section className="py-16">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cef79e]/30 text-[#222f30] text-xs font-mono font-bold">
          <PieChart className="w-3.5 h-3.5 text-[#728825]" />
          <span>حوكمة وتوزيع التمويل</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[var(--ink-1)] font-kufi">
          أين يذهب كل دولار يتلقاه المختبر؟
        </h2>
        <p className="text-sm sm:text-base text-[var(--ink-2)]">
          شفافية مطلقة وغير مشروطة تضمن توجيه الموارد للعقول المنتجة والبنية التحتية الصلبة، دون هدر إداري.
        </p>
      </div>

      {/* Visual Multi-Segment Bar */}
      <div className="max-w-4xl mx-auto mb-10 p-6 rounded-3xl bg-[var(--surface)] border border-[var(--line)] space-y-4">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--ink-2)]">
          <span className="flex items-center gap-1.5 text-[var(--ink-1)]">
            <DollarSign className="w-4 h-4 text-[#728825]" />
            <span>مخطط تخصيص الميزانية التشغيلية 100%</span>
          </span>
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            0% تكاليف تسويق أو أرباح خاصة
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-5 w-full rounded-full overflow-hidden flex bg-[var(--surface-2)] border border-[var(--line)] shadow-inner">
          {breakdown.map((item, idx) => {
            const color = colors[idx % colors.length];
            return (
              <div
                key={item.title}
                style={{ width: `${item.percentage}%` }}
                className={`${color.bar} transition-all duration-500 hover:opacity-90 relative group`}
                title={`${item.title}: ${item.percentage}%`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {breakdown.map((item, idx) => {
            const color = colors[idx % colors.length];
            return (
              <div key={item.title} className="flex items-center gap-2 text-xs">
                <span className={`w-3 h-3 rounded-full ${color.bar} flex-shrink-0`} />
                <span className="font-mono font-bold text-[var(--ink-1)]">{item.percentage}%</span>
                <span className="text-[var(--ink-2)] truncate text-[11px]">{item.title.split(" ")[0]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {breakdown.map((item, idx) => {
          const Icon = getIcon(idx);
          const color = colors[idx % colors.length];

          return (
            <div
              key={item.title}
              className="p-6 sm:p-7 rounded-3xl bg-[var(--surface)] border border-[var(--line)] hover:border-[#a7e26e] hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl ${color.bg} ${color.text} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className={`font-mono text-3xl font-extrabold ${color.text}`}>
                    {item.percentage}%
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--ink-1)] font-kufi mb-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
