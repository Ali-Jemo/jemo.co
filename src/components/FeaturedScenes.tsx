"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { RESEARCH_PROJECTS, RESEARCH_LABS } from "@/lib/data/research-data";
import { ArrowUpLeft, ArrowLeft, ArrowRight, FolderGit2, Cpu, FlaskConical, Layers } from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  Active: "bg-emerald-400/15 text-emerald-200 border-emerald-300/30",
  Research: "bg-sky-400/15 text-sky-200 border-sky-300/30",
  Prototype: "bg-amber-400/15 text-amber-200 border-amber-300/30",
  Completed: "bg-zinc-400/15 text-zinc-200 border-zinc-300/30",
};

const STATUS_AR: Record<string, string> = {
  Active: "نشط",
  Research: "بحثي",
  Prototype: "نموذج أولي",
  Completed: "مكتمل",
};

// Sovereign layer labels — editorial numbering, not data-driven.
const LAYER_AR = ["طبقة النواة", "طبقة الذكاء", "طبقة التراث"];
const LAYER_EN = ["KERNEL LAYER", "INTELLIGENCE LAYER", "HERITAGE LAYER"];

const SIDE_ICONS = [Cpu, FlaskConical, Layers];

function labName(slug: string) {
  return RESEARCH_LABS.find((l) => l.slug === slug)?.name ?? slug;
}

const AUTOPLAY_MS = 7000;

// Bento interactive v2: single selector (side list), crossfading hero,
// autoplay with pause, prev/next + arrow-key navigation.
export default function FeaturedScenes() {
  const scenes = RESEARCH_PROJECTS.filter((p) => p.featured).slice(0, 3);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0); // restarts progress bar each switch

  const go = useCallback(
    (dir: 1 | -1) => {
      setActive((a) => (a + dir + scenes.length) % scenes.length);
      setCycle((c) => c + 1);
    },
    [scenes.length]
  );

  const select = useCallback((i: number) => {
    setActive(i);
    setCycle((c) => c + 1);
  }, []);

  useEffect(() => {
    if (paused || scenes.length < 2) return;
    const t = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [paused, cycle, go, scenes.length]);

  if (scenes.length === 0) return null;
  const hero = scenes[active] ?? scenes[0];

  return (
    <div
      dir="rtl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(1); // forward in RTL
        if (e.key === "ArrowRight") go(-1);
      }}
    >
      {/* control strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[var(--ink-2)] dir-ltr">
            {String(active + 1).padStart(2, "0")} <span className="text-[var(--j-line-2)]">/</span> {String(scenes.length).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1" aria-hidden>
            {scenes.map((s, i) => (
              <span key={s.id} className="relative h-[2px] w-10 overflow-hidden bg-[var(--j-line-2)]">
                {i === active && (
                  <motion.span
                    key={cycle}
                    className="absolute inset-0 origin-right bg-[var(--gold)]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: paused ? 0.15 : 1 }}
                    transition={{ duration: paused ? 0.3 : AUTOPLAY_MS / 1000, ease: "linear" }}
                  />
                )}
                {i < active && <span className="absolute inset-0 bg-[var(--ink)]" />}
              </span>
            ))}
          </div>
          <span className="text-[11px] font-mono text-[var(--ink-2)]">{LAYER_AR[active] ?? ""}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/projects" className="j-link text-xs ml-2">
            عرض كل المشاريع <ArrowUpLeft className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => go(-1)}
            aria-label="المشروع السابق"
            className="w-9 h-9 grid place-items-center border border-[var(--j-line)] bg-[var(--j-cream)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="المشروع التالي"
            className="w-9 h-9 grid place-items-center border border-[var(--j-line)] bg-[var(--j-cream)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-px bg-[var(--j-line)] border border-[var(--j-line)]">
        {/* Hero — visual first, crossfades on switch */}
        <article className="lg:col-span-3 relative overflow-hidden bg-[#0c0c0f] group min-h-[400px] sm:min-h-[460px] lg:min-h-[560px]">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={hero.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={hero.image}
                alt={hero.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover opacity-90 transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/40 to-black/5 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* top meta */}
          <div className="absolute top-0 inset-x-0 p-4 sm:p-5 md:p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono px-2.5 py-1 border backdrop-blur-sm ${STATUS_STYLE[hero.status] ?? STATUS_STYLE.Research}`}>
                {STATUS_AR[hero.status] ?? hero.status}
              </span>
              <span className="hidden sm:inline text-[10px] font-mono tracking-[0.14em] px-2.5 py-1 border border-white/20 bg-white/5 text-white/70 backdrop-blur-sm dir-ltr">
                {LAYER_EN[active] ?? ""}
              </span>
            </div>
            <span className="font-mono text-[26px] md:text-[32px] font-bold text-white/15 leading-none select-none dir-ltr">
              {String(active + 1).padStart(2, "0")}
            </span>
          </div>

          {/* bottom content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={hero.id + "-cap"}
              className="absolute bottom-0 inset-x-0 p-4 sm:p-5 md:p-8"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[11px] font-mono text-amber-200/90 mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                {labName(hero.labSlug)}
                <span className="text-white/30">·</span>
                <span className="text-white/55 dir-ltr">{hero.titleEn}</span>
              </p>
              <h3 className="text-xl sm:text-2xl md:text-[40px] font-black text-white leading-[1.2] mb-2 text-balance">
                <Link href={`/projects/${hero.slug}`} className="hover:text-amber-100 transition-colors">
                  {hero.title}
                </Link>
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl line-clamp-2 mb-3 sm:mb-4">{hero.description}</p>
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-5">
                {hero.techStack.slice(0, 5).map((t) => (
                  <span key={t} className="text-[11px] font-mono px-2 py-1 bg-white/10 border border-white/15 text-white/80 backdrop-blur-sm">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Link
                  href={`/projects/${hero.slug}`}
                  className="inline-flex items-center gap-1.5 bg-white text-[var(--ink)] font-bold text-xs sm:text-sm px-3.5 py-2 sm:px-5 sm:py-2.5 hover:bg-amber-50 transition-colors"
                >
                  استكشاف المشروع <ArrowUpLeft className="w-4 h-4" />
                </Link>
                {hero.githubUrl && (
                  <a
                    href={hero.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white/10 border border-white/25 text-white font-bold text-xs sm:text-sm px-3.5 py-2 sm:px-5 sm:py-2.5 hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    <FolderGit2 className="w-4 h-4" /> GitHub
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </article>

        {/* Side list — the single selector */}
        <div className="lg:col-span-2 grid sm:grid-cols-3 lg:grid-cols-1 lg:grid-rows-3 gap-px bg-[var(--j-line)]" role="tablist" aria-label="المشاريع السيادية">
          {scenes.map((p, i) => {
            const isActive = i === active;
            const Icon = SIDE_ICONS[i % SIDE_ICONS.length];
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => select(i)}
                className={`relative overflow-hidden text-right cursor-pointer transition-colors duration-300 min-h-[190px] ${
                  isActive ? "bg-[#0c0c0f]" : "bg-[var(--j-cream)] hover:bg-white"
                }`}
              >
                {isActive && (
                  <>
                    <Image src={p.image} alt="" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/55 to-black/25" />
                  </>
                )}
                <span
                  className={`absolute top-0 right-0 h-full w-[3px] bg-[var(--gold)] transition-transform duration-300 origin-top ${
                    isActive ? "scale-y-100" : "scale-y-0"
                  }`}
                />
                <span className="relative p-5 flex flex-col h-full min-h-[190px]">
                  <span className="flex items-center justify-between mb-3">
                    <span className={`font-mono text-xs font-bold dir-ltr ${isActive ? "text-white/50" : "text-[var(--ink-2)]"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`j-tag !text-[10px] ${isActive ? "!bg-white/10 !border-white/25 !text-white/90" : ""}`}>
                      {STATUS_AR[p.status] ?? p.status}
                    </span>
                  </span>
                  <span className={`text-[15px] md:text-base font-bold leading-snug mb-1 ${isActive ? "text-white" : "text-[var(--ink)]"}`}>
                    {p.title}
                  </span>
                  <span className={`text-[10px] font-mono mb-2 dir-ltr text-right ${isActive ? "text-amber-200/90" : "text-[var(--brand)]"}`}>
                    {p.titleEn}
                  </span>
                  <span className={`text-xs leading-relaxed line-clamp-2 mt-auto ${isActive ? "text-white/65" : "text-[var(--ink-2)]"}`}>
                    {p.description}
                  </span>
                  <span className={`flex items-center gap-1.5 mt-3 text-[11px] font-mono ${isActive ? "text-amber-200/80" : "text-[var(--ink-2)]"}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {isActive ? "يُعرض الآن" : labName(p.labSlug)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* bottom meta strip — clean IntegratedBio pill container */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 p-3.5 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] text-xs font-mono text-[#445e5f]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#a7e26e] animate-pulse" />
          <span className="font-bold text-[#222f30]">سيادة من النواة · SOVEREIGN PLATFORM</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span>فريق: {hero.team.map((m) => m.name).join(" ، ")}</span>
          <span className="dir-ltr text-[#222f30] font-bold">{hero.techStack.join(" · ")}</span>
        </div>
      </div>
    </div>
  );
}
