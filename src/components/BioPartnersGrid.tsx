"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpLeft, ShieldCheck } from "lucide-react";

interface PeerInstitution {
  id: string;
  name: string;
  code: string;
  field: string;
  type: string;
  website: string;
  metrics: string;
}

const PEER_INSTITUTIONS: PeerInstitution[] = [
  {
    id: "uot",
    name: "الجامعة التكنولوجية",
    code: "IRQ-UOT",
    field: "الحوسبة الفائقة، هندسة النظم الموزعة، وتطوير النوى منخفضة المستوى",
    type: "جامعات حكومية",
    website: "https://uotechnology.edu.iq",
    metrics: "عقدة تشغيل مستقلة · Hマト-01",
  },
  {
    id: "uob",
    name: "جامعة بغداد",
    code: "IRQ-UOB",
    field: "تدقيق الخوارزميات، تدريب نماذج المعرفة التراثية، ونظم المعالجة اللغوية",
    type: "جامعات حكومية",
    website: "https://uobaghdad.edu.iq",
    metrics: "مجموعة تدقيق النماذج · BAGHDAD-LLM",
  },
  {
    id: "src",
    name: "مركز الأبحاث السيادية",
    code: "REG-SRC",
    field: "المعايير الوطنية لأمن الشيفرات المصدرية، الأنظمة السيادية، وفحص الاعتمادية",
    type: "مراكز سيادية",
    website: "https://jemo.co/labs",
    metrics: "معايير التدقيق السيادي · SEC-CORE",
  },
  {
    id: "uom",
    name: "جامعة الموصل",
    code: "IRQ-UOM",
    field: "رقمنة المخطوطات والذكاء الاصطناعي في فحص وتحقيق الوثائق التاريخية",
    type: "جامعات حكومية",
    website: "https://uomisan.edu.iq",
    metrics: "أرشيف النصوص المحققة · DOC-ARCHIVE",
  },
  {
    id: "osn",
    name: "شبكة العلوم المفتوحة الدولية",
    code: "INT-OSN",
    field: "بروتوكولات المراجعة اللامركزية والأرشفة الرقمية المفتوحة للاكتشافات",
    type: "تحالفات دولية",
    website: "https://open-science.org",
    metrics: "بروتوكول التحقق الموزع · PoW-FED",
  },
  {
    id: "uon",
    name: "جامعة النهرين",
    code: "IRQ-UON",
    field: "أبحاث التشفير ما بعد الكمي، الذكاء الاصطناعي الحيوي، وشبكات الحوسبة الحافة",
    type: "جامعات حكومية",
    website: "https://nahrainuniv.edu.iq",
    metrics: "مختبر التشفير الكمي · PQ-CRYPTO",
  },
];

export default function BioPartnersGrid() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDesktopMouse, setIsDesktopMouse] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isHoveringRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // 1. Detect pointer type for desktop mouse hover
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsDesktopMouse(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktopMouse(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // 2. Optical Center Scroll-Spy:
  // Works reliably across all devices (Mobile touch, DevTools responsive emulation, tablets, and desktop scroll).
  // Calculates which institution is closest to the optical center (45% of viewport height) during scroll.
  useEffect(() => {
    const updateScrollSpotlight = () => {
      // If user is actively hovering with mouse on desktop, let mouse hover take precedence
      if (isHoveringRef.current && isDesktopMouse) return;

      if (!containerRef.current) return;
      const sectionRect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Only activate if section is currently visible in viewport
      if (sectionRect.bottom < 100 || sectionRect.top > viewportHeight - 100) {
        setActiveIdx(null);
        return;
      }

      const opticalCenter = viewportHeight * 0.46;
      let closestIdx = 0;
      let minDistance = Infinity;

      rowsRef.current.forEach((row, idx) => {
        if (!row) return;
        const rect = row.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const distance = Math.abs(rowCenter - opticalCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      // Only lock focus if the closest row is within reasonable view (not far off)
      if (minDistance < viewportHeight * 0.42) {
        setActiveIdx(closestIdx);
      }
    };

    const onScroll = () => {
      isHoveringRef.current = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(updateScrollSpotlight);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial check on mount
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isDesktopMouse]);

  // 3. Desktop Mouse Movement
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  // 4. Keyboard Navigation (Arrow keys)
  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (idx + 1) % PEER_INSTITUTIONS.length;
      setActiveIdx(next);
      rowsRef.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (idx - 1 + PEER_INSTITUTIONS.length) % PEER_INSTITUTIONS.length;
      setActiveIdx(prev);
      rowsRef.current[prev]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setExpandedIdx(expandedIdx === idx ? null : idx);
    }
  };

  return (
    <section
      dir="rtl"
      ref={containerRef}
      className="c-kinetic-typo-wall py-10 sm:py-20 lg:py-28 bg-[#f7f7f5] text-[#222f30] border-b border-[#e4e3e3] relative overflow-hidden select-none"
      aria-label="الحائط الطباعي للشركاء والمؤسسات الأكاديمية"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16">
        
        {/* Academic Section Header */}
        <div className="mb-8 sm:mb-14 pb-6 sm:pb-8 border-b border-[#e4e3e3]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-12">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2.5 text-xs font-mono text-[#55696a]">
                <span className="font-bold text-[#222f30] text-sm tracking-normal">08</span>
                <span className="w-5 h-px bg-[#c9cbbe]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e]" />
                <span className="tracking-widest uppercase text-[11px] font-semibold text-[#738284]">
                  التحالف الأكاديمي والبحثي · ACADEMIC ALLIANCE
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.2] text-[#222f30] font-kufi">
                شبكة معرفية لكل العلوم،{" "}
                <span className="text-[#738284] font-normal">
                  تعاون مفتوح مع الجامعات والمراكز البحثية.
                </span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#55696a] max-w-md leading-relaxed lg:pb-1">
              حائط الشراكات الأكاديمية والمؤسسات البحثية المستقلة — تعاون مفتوح في النظم، الخوارزميات، والعتاد.
            </p>
          </div>
        </div>
        {/* 3. The Wall (Interactive Kinetic Typo-Grid with Optical Scroll-Spy) */}
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            isHoveringRef.current = false;
            if (isDesktopMouse) setActiveIdx(null);
          }}
          className="relative divide-y divide-[#e4e3e3] border-y border-[#e4e3e3] transition-all"
        >
          {/* Subtle Ambient Spotlight Cursor Glow (Desktop Fine Pointer Only) */}
          {isDesktopMouse && activeIdx !== null && (
            <div
              className="pointer-events-none absolute -inset-px transition-opacity duration-500 opacity-100 hidden sm:block"
              style={{
                background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(167, 226, 110, 0.12), transparent 75%)`,
              }}
            />
          )}

          {PEER_INSTITUTIONS.map((item, idx) => {
            const isActive = activeIdx === idx;
            const isDimmed = activeIdx !== null && !isActive;

            return (
              <div
                key={item.id}
                ref={(el) => { rowsRef.current[idx] = el; }}
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
                onMouseEnter={() => {
                  if (isDesktopMouse) {
                    isHoveringRef.current = true;
                    setActiveIdx(idx);
                  }
                }}
                onFocus={() => {
                  isHoveringRef.current = true;
                  setActiveIdx(idx);
                }}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onClick={() => {
                  setExpandedIdx(expandedIdx === idx ? null : idx);
                }}
                className={`group relative py-4 sm:py-7 lg:py-9 transition-all duration-300 outline-none cursor-pointer px-2 sm:px-4 rounded-xl ${
                  isActive
                    ? "bg-white/75 shadow-xs border-r-4 border-r-[#a7e26e]"
                    : "bg-transparent hover:bg-white/30"
                }`}
              >
                {/* Text Row Container — No truncate, fluid responsive wrapping */}
                <div className="flex items-center justify-between gap-3 sm:gap-6 relative z-10">
                  
                  {/* Right side: Ordinal Index + Institutional Name */}
                  <div className="flex items-center gap-2.5 sm:gap-6 min-w-0 flex-1">
                    <span 
                      className={`font-mono text-xs sm:text-sm font-bold tracking-wider transition-colors duration-300 shrink-0 ${
                        isActive ? "text-[#728825]" : isDimmed ? "text-[#94a3b8]/25" : "text-[#94a3b8]/60"
                      }`}
                    >
                      0{idx + 1}
                    </span>

                    {/* Institutional Name: Fluid Typography without truncation */}
                    <h3
                      className={`font-black font-kufi tracking-tight leading-snug transition-all duration-300 text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl ${
                        isActive
                          ? "text-[#0f172a] translate-x-1 sm:translate-x-2"
                          : isDimmed
                          ? "text-[#94a3b8]/30"
                          : "text-[#64748b]/65 group-hover:text-[#0f172a]"
                      }`}
                    >
                      {item.name}
                    </h3>
                  </div>

                  {/* Left side: Monospace Code Pill */}
                  <div className="shrink-0 font-mono text-xs sm:text-sm">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wider transition-all duration-300 ${
                        isActive
                          ? "bg-[#222f30] text-[#cef79e] shadow-xs"
                          : isDimmed
                          ? "opacity-25 text-[#94a3b8]"
                          : "text-[#738284] bg-black/[0.04]"
                      }`}
                    >
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e] animate-pulse" />}
                      <span>{item.code}</span>
                    </span>
                  </div>
                </div>

                {/* 4. Context Ribbon (Accordion Reveal) */}
                <AnimatePresence>
                  {(expandedIdx === idx || (isDesktopMouse && activeIdx === idx)) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -4 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden relative z-10"
                    >
                      <div className="pt-3 sm:pt-4 pb-1 pr-5 sm:pr-12 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-[#445e5f]">
                        <span className="text-[#a7e26e] font-bold text-sm">↳</span>
                        
                        <span className="px-2 py-0.5 rounded bg-white border border-[#e4e3e3] text-[#222f30] text-[10px] sm:text-xs font-bold font-mono shadow-2xs">
                          {item.type}
                        </span>

                        <span className="font-sans text-xs sm:text-sm text-[#222f30] font-medium leading-relaxed">
                          {item.field}
                        </span>

                        <span className="text-[#94a3b8] hidden md:inline">·</span>

                        <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-[#738284] font-mono">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{item.metrics}</span>
                        </span>

                        <span className="text-[#94a3b8] hidden sm:inline">·</span>

                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#222f30] hover:text-[#728825] font-bold text-xs underline underline-offset-4 decoration-[#a7e26e] decoration-2 transition-colors py-1 group/link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>الرابط التوثيقي</span>
                          <ArrowUpLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:-translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
