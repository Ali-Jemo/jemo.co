"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, useSpring } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Cpu, Microscope, Globe, Sparkles, Clock, ArrowUpLeft } from "lucide-react";
// import BaghdadBabylonSlideshow from "./BaghdadBabylonSlideshow";

const FEATURED_NEWS = [
  {
    id: "news-1",
    title: "إطلاق نموذج Baghdadi-1 للغة والرياضيات",
    description: "نموذج سيادي بـ 7 مليارات معلم، مُدرب خصيصاً على البيانات الدقيقة لحل المعضلات الرياضية في السياق العربي.",
    category: "نماذج سيادية",
    date: "٢٤ يوليو ٢٠٢٦",
    href: "/research",
    theme: "emerald",
    image: "/hero-bg.png"
  },
  {
    id: "news-2",
    title: "نواة Ziqa v1.0 — استدلال فائق السرعة",
    description: "بنية تحتية برمجية جديدة تسرّع عمليات الاستدلال بنسسبة ٤٠٪ مع تقليل استهلاك الطاقة.",
    category: "نواة تشغيلية",
    date: "١٨ يوليو ٢٠٢٦",
    href: "/labs",
    theme: "blue",
    image: "/hero-bg-rtl.png"
  },
  {
    id: "news-3",
    title: "افتتاح عنقود بغداد-١ للحوسبة الفائقة",
    description: "مركب بيانيات متطور لتوفير قوة حواسيب هائلة للفئات الأكاديمية والبحثية.",
    category: "بنية تحتية",
    date: "٠٥ يوليو ٢٠٢٦",
    href: "/infrastructure",
    theme: "amber",
    image: "/departments-bg.png"
  },
];

const AUTOPLAY_INTERVAL = 6000;

const SimpleButton = ({ children, onClick, className, ariaLabel }: { children: React.ReactNode, onClick: () => void, className?: string, ariaLabel?: string }) => (
  <motion.button
    aria-label={ariaLabel}
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
    className={`flex items-center justify-center transition-colors duration-200 ${className}`}
  >
    {children}
  </motion.button>
);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeNews, setActiveNews] = useState(0);
  const [isHoveringNews, setIsHoveringNews] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let startTime = Date.now();
    let animationFrameId: number;

    const animate = () => {
      if (isHoveringNews) {
        startTime = Date.now() - (progressRef.current / 100) * AUTOPLAY_INTERVAL;
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min((elapsedTime / AUTOPLAY_INTERVAL) * 100, 100);
      
      progressRef.current = currentProgress;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        setActiveNews((prev) => (prev + 1) % FEATURED_NEWS.length);
        startTime = Date.now();
        progressRef.current = 0;
        setProgress(0);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeNews, isHoveringNews]);

  const handleManualNav = useCallback((direction: 'next' | 'prev') => {
    setActiveNews((prev) => {
      if (direction === 'next') return (prev + 1) % FEATURED_NEWS.length;
      return (prev - 1 + FEATURED_NEWS.length) % FEATURED_NEWS.length;
    });
    progressRef.current = 0;
    setProgress(0);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Main content fade and parallax
  const mainOpacity = useTransform(smoothScroll, [0, 0.4], [1, 0]);
  const mainY = useTransform(smoothScroll, [0, 0.4], [0, -50]);
  const bottomSectionOpacity = useTransform(smoothScroll, [0, 0.2], [1, 0]);

  // Expandable card logic
  const cardWidth = useTransform(smoothScroll, [0.3, 0.7], ["30%", "100%"]);
  const cardHeight = useTransform(smoothScroll, [0.3, 0.7], ["100dvh", "100dvh"]);
  const cardBorderRadius = useTransform(smoothScroll, [0.3, 0.6], ["24px", "0px"]);
  const cardMargin = useTransform(smoothScroll, [0.3, 0.6], ["24px", "0px"]);
  
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsExpanded(v > 0.5);
  });

  return (
    <section
      ref={containerRef}
      dir="rtl"
      className="relative w-full min-h-[250dvh] bg-[var(--bg)] text-[var(--ink)]"
    >
      {/* Subtle Micro-Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(to right, var(--ink) 1px, transparent 1px), linear-gradient(to bottom, var(--ink) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <div className={`sticky top-0 h-screen w-full overflow-hidden transition-all duration-500 ${isExpanded ? "z-50" : "z-10"}`}>
        
        {/* Main Grid Layout */}
        <div className="w-full h-full max-w-[1920px] mx-auto flex flex-col lg:grid lg:grid-cols-[70%_30%] relative">
          
          {/* Left Side: Main Content & Bottom Sections */}
          <div className="flex flex-col h-full border-l border-[var(--line)] relative z-10 bg-[var(--bg)]">
            
            {/* Top Row: Hero Headline (approx 65% height) */}
            <motion.div 
              style={{ opacity: mainOpacity, y: mainY }}
              className="flex-grow flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-20 pb-12 border-b border-[var(--line)]"
            >
              <div className="max-w-4xl space-y-8">
                
                {/* Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                  className="flex items-center gap-4"
                >
                  <span className="inline-flex items-center gap-2 dir-ltr text-xs font-mono font-bold tracking-[0.2em] text-[var(--brand)] bg-[var(--brand)]/10 border border-[var(--brand)]/20 px-4 py-1.5 rounded-full uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
                    Sovereign AI
                  </span>
                  <div className="h-px bg-[var(--line)] flex-grow max-w-[100px]" />
                </motion.div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-[var(--ink)] leading-[1.1] tracking-tight">
                  <motion.span 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                    className="block"
                  >
                    العلم بين
                  </motion.span>
                  <motion.span 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                    className="block text-[var(--ink)]"
                  >
                    ايدينك.
                  </motion.span>
                </h1>
                
                {/* Description */}
                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-lg md:text-xl text-[var(--ink-2)] font-medium leading-relaxed max-w-2xl"
                >
                  مؤسسة بحثية مستقلة تُهندس الذكاء الاصطناعي العربي والمقررات السيادية بأعلى معايير الدقة والخصوصية — من <strong className="text-[var(--ink)] border-b-2 border-[var(--brand)]/50 pb-0.5">بغداد</strong> إلى العالم.
                </motion.p>
              </div>
            </motion.div>

            {/* Bottom Row: Slideshow Alt & News (approx 35% height) */}
            <motion.div 
              style={{ opacity: bottomSectionOpacity }}
              className="h-[35vh] min-h-[300px] flex flex-row relative z-0"
            >
              
              {/* Slideshow Image Container (Left) */}
              <div className="w-1/2 h-full bg-slate-100 overflow-hidden relative">
                 <img 
                    src={FEATURED_NEWS[activeNews].image} 
                    alt={FEATURED_NEWS[activeNews].title}
                    className="w-full h-full object-cover"
                 />
              </div>

              {/* News Section (Right) */}
              <div className="w-full md:w-1/2 h-full p-5 md:p-6 flex flex-col bg-[var(--bg)] border-l border-[var(--line)]">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--brand)] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[var(--brand-ink)]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--ink)] tracking-tight">الموجز البحثي</h3>
                      <span className="text-[9px] font-mono uppercase text-[var(--ink-2)] tracking-widest">آخر الإصدارات</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 dir-ltr">
                    <span className="text-[10px] font-mono text-[var(--ink-2)] mr-2">
                      {activeNews + 1}/{FEATURED_NEWS.length}
                    </span>
                    <SimpleButton onClick={() => handleManualNav('prev')} ariaLabel="السابق" className="w-7 h-7 rounded-md border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)]">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </SimpleButton>
                    <SimpleButton onClick={() => handleManualNav('next')} ariaLabel="التالي" className="w-7 h-7 rounded-md border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)]">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </SimpleButton>
                  </div>
                </div>

                {/* News Card */}
                <div 
                  className="relative flex-grow flex flex-col"
                  onMouseEnter={() => setIsHoveringNews(true)}
                  onMouseLeave={() => setIsHoveringNews(false)}
                >
                  <AnimatePresence mode="wait">
                    <motion.a
                      key={activeNews}
                      href={FEATURED_NEWS[activeNews].href}
                      initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="block group h-full flex flex-col p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--brand)]/40 transition-all duration-300"
                    >
                      {/* Top: Badge + Date */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold border border-[var(--brand)]/20 bg-[var(--brand)]/10 text-[var(--brand)]">
                          {FEATURED_NEWS[activeNews].category}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--ink-2)] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {FEATURED_NEWS[activeNews].date}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h4 className="text-base lg:text-lg font-bold text-[var(--ink)] leading-snug mb-2 group-hover:text-[var(--brand)] transition-colors duration-300">
                        {FEATURED_NEWS[activeNews].title}
                      </h4>
                      
                      {/* Description */}
                      <p className="text-xs text-[var(--ink-2)] font-medium leading-relaxed line-clamp-2 mb-3 flex-grow">
                         {FEATURED_NEWS[activeNews].description}
                      </p>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--line)]">
                        <span className="text-xs font-bold text-[var(--ink-2)] group-hover:text-[var(--brand)] transition-colors flex items-center gap-1.5">
                          اقرأ التفاصيل
                          <ArrowUpLeft className="w-3.5 h-3.5 transform group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </motion.a>
                  </AnimatePresence>
                  
                  {/* Progress Bar */}
                  <div className="mt-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="flex-grow h-1 bg-[var(--line)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--brand)] rounded-full transition-all duration-100 ease-linear"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-[var(--ink-2)] tabular-nums">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

          {/* Right Side: Expandable Sidebar Card */}
          <motion.div
            style={{
              width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? cardWidth : "100%",
              height: typeof window !== 'undefined' && window.innerWidth >= 1024 ? cardHeight : "auto",
              borderRadius: typeof window !== 'undefined' && window.innerWidth >= 1024 ? cardBorderRadius : "0px",
              marginTop: typeof window !== 'undefined' && window.innerWidth >= 1024 ? cardMargin : "0px",
              marginBottom: typeof window !== 'undefined' && window.innerWidth >= 1024 ? cardMargin : "0px",
              marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? cardMargin : "0px",
            }}
            className="order-first lg:order-none relative lg:absolute lg:top-0 lg:left-0 z-40 bg-[var(--brand-700)] text-[var(--brand-ink)] overflow-hidden flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] origin-right"
          >
            {/* Subtle Inner Gradient for Depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand)]/50 to-[var(--brand-700)] pointer-events-none" />
            
            <div className="relative z-10 p-8 md:p-12 lg:p-16 h-full flex flex-col">
              
              {/* Icons Top */}
              <div className="flex gap-4 mb-16 lg:mb-auto">
                <div className="w-12 h-12 rounded-2xl bg-[var(--brand-ink)]/10 border border-[var(--brand-ink)]/20 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-[var(--gold)]" strokeWidth={1.5} />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[var(--brand-ink)]/5 border border-[var(--brand-ink)]/10 flex items-center justify-center">
                  <Microscope className="w-6 h-6 text-[var(--brand-ink)]/60" strokeWidth={1.5} />
                </div>
              </div>

              {/* Center Content */}
              <motion.div 
                className="space-y-4 my-8 lg:my-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-[1.2] tracking-tight">
                  نبني منظومات<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-[var(--gold)] to-[var(--brand-ink)]">
                    ذكاء اصطناعي سيادية
                  </span>
                </h2>
                <p className="text-[var(--brand-ink)]/60 text-lg max-w-md leading-relaxed font-medium">
                  لحل أعقد التحديات الوطنية والعلمية من خلال نماذج متخصصة وبنية تحتية سيادية بالكامل.
                </p>
              </motion.div>

              {/* Footer Interactive */}
              <a href="/about" className="group mt-auto pt-8 border-t border-[var(--brand-ink)]/10 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-[11px] font-mono text-[var(--brand-ink)]/60 block mb-1">القسم البحثي</span>
                  <span className="text-base font-bold text-[var(--brand-ink)] group-hover:text-[var(--gold)] transition-colors">استكشف القدرات المتقدمة</span>
                </div>
                <div className="w-12 h-12 rounded-full border border-[var(--brand-ink)]/20 group-hover:border-[var(--gold)] group-hover:bg-[var(--gold)]/10 flex items-center justify-center transition-all duration-300">
                  <ArrowLeft className="w-5 h-5 text-[var(--brand-ink)] group-hover:text-[var(--gold)] transform group-hover:-translate-x-1 transition-transform" />
                </div>
              </a>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
