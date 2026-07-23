"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Microscope, Code2, BookOpen, DraftingCompass, Gamepad2, X, ArrowUpLeft } from "lucide-react";
import Button from "@/components/ui/Button";

interface Dept {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  details: string;
}

const DEPARTMENTS: Dept[] = [
  {
    id: "01",
    title: "أبحاث علمية",
    desc: "تحليل بيانات، أوراق بحثية منشورة، ودراسات ميدانية.",
    icon: <Microscope size={28} strokeWidth={1.5} />,
     color: "#FFFFFF",
    details: "نركز على إنتاج المعرفة العلمية المفتوحة المصدر ودراسة ظواهر العالم الرقمي وتحليل البيانات الضخمة بمناهج دقيقة.",
  },
  {
    id: "02",
    title: "ابتكار برمجي",
    desc: "بناء منصات ويب، بوتات، وأدوات أتمتة مفتوحة المصدر.",
    icon: <BookOpen size={28} strokeWidth={1.5} />,
     color: "#E4E4E7",
    details: "نبني برمجيات وأدوات بنية تحتية رقمية تخدم المجتمع التقني، مع التركيز على الأداء، الأمان، والحلول المفتوحة المصدر.",
  },
  {
    id: "03",
    title: "التصميم والهوية",
    desc: "تصميم واجهات وهوية بصرية متكاملة للمشاريع التقنية.",
    icon: <DraftingCompass size={28} strokeWidth={1.5} />,
     color: "#D4D4D8",
    details: "نصمم تجارب رقمية وهويات بصرية تدمج بين الأصالة والتعبير العصر الحديث، لخدمة المشاريع البحثية والتقنية.",
  },
  {
    id: "04",
    title: "المحتوى والألعاب",
    desc: "إنتاج محتوى تحليلي تحريري وأعمال رقمية تعليمية.",
    icon: <Gamepad2 size={28} strokeWidth={1.5} />,
     color: "#A1A1AA",
    details: "نصنع محتوى معرفياً رزيناً وألعاباً تفاعلية تعليمية تنقل المفاهيم المعقدة بسلاسة ومتعة.",
  },
];

export default function Scene2Wisdom() {
  const [selectedDept, setSelectedDept] = useState<Dept | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!selectedDept) return;
    triggerRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedDept(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [selectedDept]);
  return (
    <div
      ref={containerRef}
      id="wisdom"
      className="w-full min-h-screen relative flex flex-col items-center justify-center py-20 px-6 overflow-hidden"
      style={{ background: "var(--ink-dark)" }}
    >
      {/* Background Islamic geometric tiling grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle, var(--gold) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Background House of Wisdom Image with Theme Gradient */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <Image
          src="/wisdom-bg-new.png"
          alt="بيت الحكمة — House of Wisdom"
          fill
          priority
          className="object-cover object-left -translate-x-8 md:-translate-x-24 scale-105 opacity-65 md:opacity-75 filter brightness-90 contrast-105"
        />
        {/* Dark Vignette & Theme Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink-dark,#0a0a0a)] via-black/20 to-[var(--ink-dark,#0a0a0a)] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink-dark,#0a0a0a)] via-transparent to-[var(--ink-dark,#0a0a0a)] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,var(--ink-dark,#0a0a0a)_90%)] opacity-80" />
      </div>

      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-10 text-center">
        {/* Section Header */}
        <div>
          <span className="text-xs font-mono text-white/50 tracking-widest uppercase">
            ROUND CITY OF BAGHDAD · جولة في بيت الحكمة
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-kufi text-white mt-2">
            الأقسام التخصصية الأربعة
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto mt-3">
            منظومة متكاملة تنطلق من أركان معرفية تدمج بين البحث، البرمجة، التصميم، والإعلام الرقمي.
          </p>
        </div>

        {/* 2D Round City Diagram */}
        <div className="relative w-full max-w-[340px] sm:max-w-xl lg:max-w-[640px] aspect-square flex items-center justify-center my-8">

          {/* Center Hub */}
          <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/5 bg-[#0a0a0a] flex flex-col items-center justify-center z-20 shadow-2xl">
            <span className="text-[10px] sm:text-xs font-mono text-white">jemo</span>
            <span className="text-[8px] sm:text-[10px] text-white/50">hub</span>
          </div>
          {/* 4 Quadrants */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full h-full p-2 sm:p-6">
            {DEPARTMENTS.map((dept, idx) => {
              const isHovered = hoveredId === dept.id;
              const isDimmed = hoveredId !== null && !isHovered;

              const sweepY = idx < 2 ? "0" : "100%";
              const sweepX = idx % 2 === 0 ? "100%" : "0";

              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept)}
                  onMouseEnter={() => setHoveredId(dept.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`sweeperCard ${
                    isDimmed ? "opacity-40 scale-95" : "opacity-100 scale-100"
                  }`}
                  style={{
                    "--sweeper-accent": dept.color,
                    "--sweeper-bg": dept.color,
                    "--sweep-y": sweepY,
                    "--sweep-x": sweepX,
                    borderColor: isHovered ? dept.color : "rgba(255,255,255,0.08)",
                  } as React.CSSProperties}
                >
                  <div className="flex flex-col items-center text-center justify-center w-full h-full">
                    <div className="iconBox mb-4">
                      {dept.icon}
                    </div>
                    <h3 className="cardTitle font-kufi leading-snug">{dept.title}</h3>
                    <p className="cardSubtitle mt-2 hidden sm:line-clamp-2 max-w-[90%]">{dept.desc}</p>
                    <div className="linkMore mt-4">
                      <span>تفاصيل أكثر</span>
                      <ArrowUpLeft className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
         </div>
       </div>
 
      {selectedDept && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedDept(null);
          }}
        >
          <div
            className="max-w-lg w-full p-8 rounded-2xl border bg-black/90 relative text-right flex flex-col gap-4"
            style={{ borderColor: selectedDept.color }}
          >
            <button
              onClick={() => setSelectedDept(null)}
              className="absolute top-4 left-4 p-2 text-white/60 hover:text-white"
              aria-label="إغلاق"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3">
              <span style={{ color: selectedDept.color }}>{selectedDept.icon}</span>
              <h3 id="modal-title" className="text-2xl font-bold font-kufi text-white">{selectedDept.title}</h3>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">{selectedDept.details}</p>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
              <Button href="/apply" variant="primary" size="sm">
                قدّم لهذا القسم
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
