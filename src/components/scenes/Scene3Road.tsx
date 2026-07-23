"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "قدّم طلبك",
    desc: "املأ الاستمارة بأساسياتك وخبرتك واستلم رقم مرجعي لمتابعة الحالة.",
    icon: (
      <div className="relative flex items-center justify-center">
        {/* Speed Rays / Jet Trail */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="absolute inset-0 w-5 h-5 text-[var(--gold)] opacity-0 group-hover:opacity-70 transition-all duration-500 ease-out group-hover:-translate-x-3 group-hover:translate-y-3 scale-90 pointer-events-none"
        >
          <line x1="2" y1="22" x2="8" y2="16" strokeDasharray="2 2" />
          <line x1="1" y1="17" x2="5" y2="13" strokeDasharray="1 2" />
        </svg>
        {/* Flying Plane */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 transition-all duration-500 ease-out group-hover:-translate-y-2.5 group-hover:translate-x-2.5 group-hover:rotate-12 group-hover:scale-110 group-hover:text-[var(--gold)] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
        >
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      </div>
    ),
  },
  {
    num: "02",
    title: "المراجعة والتقييم",
    desc: "نراجع مهاراتك ومدى توافقها مع القسم المطلوب وفق معايير شفافة.",
    icon: (
      <div className="relative overflow-hidden flex items-center justify-center">
        {/* Scanning Laser Line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-y-5 transition-all duration-700 ease-in-out pointer-events-none" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 group-hover:text-[var(--gold)] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line
            x1="8"
            y1="13"
            x2="16"
            y2="13"
            className="transition-all duration-300 group-hover:translate-x-1.5 group-hover:stroke-[var(--gold)]"
          />
          <line
            x1="8"
            y1="17"
            x2="14"
            y2="17"
            className="transition-all duration-500 group-hover:translate-x-2 group-hover:stroke-[var(--gold)]"
          />
        </svg>
      </div>
    ),
  },
  {
    num: "03",
    title: "استلام القرار",
    desc: "تنبيه مباشر بقبولك أو الرد بالملاحظات لتحسين الطلب عند الحاجة.",
    icon: (
      <div className="relative flex items-center justify-center">
        {/* Expanding Ripple Ring */}
        <span className="absolute inset-0 rounded-full border border-[var(--gold)]/40 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 ease-out pointer-events-none" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 group-hover:text-[var(--gold)] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <path
            d="M9 12l2 2 4-4"
            className="transition-all duration-700 ease-out [stroke-dasharray:20] [stroke-dashoffset:20] group-hover:[stroke-dashoffset:0]"
          />
        </svg>
      </div>
    ),
  },
  {
    num: "04",
    title: "الانضمام للفريق",
    desc: "تصل لقنوات قسمك وتشرع بمشاريع حقيقية ضمن فرق عمل متخصصة.",
    icon: (
      <div className="relative flex items-center justify-center">
        {/* Radar Pulse Rings */}
        <span className="absolute inset-0 rounded-full bg-[var(--gold)]/20 animate-ping opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-[var(--gold)] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle
            cx="9"
            cy="7"
            r="4"
            className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
          />
          <polyline
            points="16 11 18 13 22 9"
            className="transition-all duration-500 ease-out [stroke-dasharray:16] [stroke-dashoffset:16] group-hover:[stroke-dashoffset:0]"
          />
        </svg>
      </div>
    ),
  },
];

export default function Scene3Road() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      id="road"
      className="w-full min-h-screen relative flex flex-col items-center justify-center py-24 px-6 overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Background Grid Accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-6xl w-full flex flex-col items-center gap-12 text-center">
        {/* Section Header */}
        <div>
          <span className="text-xs font-mono text-[var(--gold)] tracking-widest uppercase">
            CARAVAN ROAD · طريق القافلة
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-kufi text-white mt-2">
            آلية التقديم والعمل
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto mt-3 leading-relaxed">
            مسار شفاف من أربع محطات ينقلك من فكرة التقديم إلى مشاركة الفريق.
          </p>
        </div>

        {/* Bento / Frontier Style Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-right relative z-10">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="group relative p-6 md:p-8 rounded-xl border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-[#121215] hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle top border highlight on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Card Header: Icon box & Number */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/90 group-hover:border-[var(--gold)]/40 group-hover:text-[var(--gold)] group-hover:bg-[var(--gold)]/10 transition-all duration-300">
                    {step.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-white/40 group-hover:text-[var(--gold)] transition-colors duration-300">
                      {step.num}
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-white/20 group-hover:text-[var(--gold)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-bold font-kufi text-white group-hover:text-[var(--gold)] transition-colors duration-300 mb-3">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-white/65 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Step Status Bar */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
                <span>STAGE {step.num}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[var(--gold)] group-hover:shadow-[0_0_8px_var(--gold)] transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
