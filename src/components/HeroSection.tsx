"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, Clock, ArrowUpLeft } from "lucide-react";

const FEATURED_NEWS = [
  {
    id: "news-1",
    title: "إطلاق نموذج Baghdadi-1 للغة والرياضيات",
    description: "نموذج سيادي بـ 7 مليارات معلم، مُدرب خصيصاً على البيانات الدقيقة لحل المعضلات الرياضية في السياق العربي.",
    category: "نماذج سيادية",
    date: "٢٤ يوليو ٢٠٢٦",
    href: "/research",
  },
  {
    id: "news-2",
    title: "نواة Ziqa v1.0 — استدلال فائق السرعة",
    description: "بنية تحتية برمجية جديدة تسرّع عمليات الاستدلال بنسسبة ٤٠٪ مع تقليل استهلاك الطاقة.",
    category: "نواة تشغيلية",
    date: "١٨ يوليو ٢٠٢٦",
    href: "/labs",
  },
  {
    id: "news-3",
    title: "افتتاح عنقود بغداد-١ للحوسبة الفائقة",
    description: "مركب بيانيات متطور لتوفير قوة حواسيب هائلة للفئات الأكاديمية والبحثية.",
    category: "بنية تحتية",
    date: "٠٥ يوليو ٢٠٢٦",
    href: "/infrastructure",
  },
];

const AUTOPLAY_INTERVAL = 6000;

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeNews, setActiveNews] = useState(0);
  const [isHoveringNews, setIsHoveringNews] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

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

  // Content fades on scroll
  const contentOpacity = useTransform(smoothScroll, [0, 0.3], [1, 0]);
  const contentY = useTransform(smoothScroll, [0, 0.3], [0, -30]);

  return (
    <section
      ref={containerRef}
      dir="rtl"
      className="relative w-full min-h-[180dvh] bg-[var(--bg)] text-[var(--ink)]"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'linear-gradient(to right, var(--ink) 1px, transparent 1px), linear-gradient(to bottom, var(--ink) 1px, transparent 1px)', backgroundSize: '64px 64px' }} 
      />

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Hero — The King */}
        <motion.div 
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32"
        >
          <div className="max-w-5xl">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="inline-flex items-center gap-2 dir-ltr text-xs font-mono font-bold tracking-[0.2em] text-[var(--brand)] bg-[var(--brand)]/5 px-4 py-1.5 rounded-full uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
                SOVEREIGN AI
              </span>
              <div className="h-px bg-[var(--line)] w-16" />
            </motion.div>

            {/* Headline */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black text-[var(--ink)] leading-[1.05] tracking-tight mb-8">
              <motion.span 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                className="block"
              >
                العلم بين
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                className="block"
              >
                ايدينك.
              </motion.span>
            </h1>
            
            {/* Description */}
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-[var(--ink-2)] font-medium leading-relaxed max-w-2xl mb-12"
            >
              مؤسسة بحثية مستقلة تُهندس الذكاء الاصطناعي العربي والمقررات السيادية — من <strong className="text-[var(--ink)] border-b-2 border-[var(--brand)]/30 pb-0.5">بغداد</strong> إلى العالم.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-4"
            >
              <a href="/research" className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--brand)] text-[var(--brand-ink)] font-bold text-sm rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[var(--brand)]/20">
                استكشف الأبحاث
                <ArrowLeft className="w-4 h-4" />
              </a>
              <a href="/about" className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--surface)] text-[var(--ink)] font-bold text-sm rounded-xl border border-[var(--line)] hover:border-[var(--brand)]/40 transition-colors">
                عن المؤسسة
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Sidebar — Compact, doesn't steal focus */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="absolute top-0 left-0 bottom-0 w-[320px] bg-[var(--surface)] border-r border-[var(--line)] flex flex-col z-10"
        >
          {/* News Header */}
          <div className="p-6 border-b border-[var(--line)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--brand)]" />
                <h3 className="text-sm font-bold text-[var(--ink)]">الموجز البحثي</h3>
              </div>
              <div className="flex items-center gap-1 dir-ltr">
                <span className="text-[10px] font-mono text-[var(--ink-2)] mr-2">
                  {activeNews + 1}/{FEATURED_NEWS.length}
                </span>
                <button
                  onClick={() => handleManualNav('prev')}
                  className="w-6 h-6 rounded border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)] flex items-center justify-center transition-colors"
                  aria-label="السابق"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleManualNav('next')}
                  className="w-6 h-6 rounded border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)] flex items-center justify-center transition-colors"
                  aria-label="التالي"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* News Content */}
          <div 
            className="flex-1 p-6 flex flex-col"
            onMouseEnter={() => setIsHoveringNews(true)}
            onMouseLeave={() => setIsHoveringNews(false)}
          >
            <AnimatePresence mode="wait">
              <motion.a
                key={activeNews}
                href={FEATURED_NEWS[activeNews].href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="block group flex-1 flex flex-col"
              >
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-semibold text-[var(--brand)] bg-[var(--brand)]/10 w-fit mb-4">
                  {FEATURED_NEWS[activeNews].category}
                </span>
                
                <h4 className="text-base font-bold text-[var(--ink)] leading-snug mb-3 group-hover:text-[var(--brand)] transition-colors">
                  {FEATURED_NEWS[activeNews].title}
                </h4>
                
                <p className="text-xs text-[var(--ink-2)] leading-relaxed line-clamp-3 mb-4 flex-grow">
                  {FEATURED_NEWS[activeNews].description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-[var(--line)]">
                  <span className="text-[10px] font-mono text-[var(--ink-2)] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {FEATURED_NEWS[activeNews].date}
                  </span>
                  <span className="text-xs font-bold text-[var(--ink-2)] group-hover:text-[var(--brand)] transition-colors flex items-center gap-1">
                    اقرأ
                    <ArrowUpLeft className="w-3 h-3" />
                  </span>
                </div>
              </motion.a>
            </AnimatePresence>
            
            {/* Progress */}
            <div className="mt-4 pt-4 border-t border-[var(--line)]">
              <div className="h-1 bg-[var(--line)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--brand)] rounded-full transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-[var(--line)]">
            <a href="/about" className="group flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[var(--ink-2)] block mb-0.5">القسم البحثي</span>
                <span className="text-xs font-bold text-[var(--ink)] group-hover:text-[var(--brand)] transition-colors">استكشف القدرات</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-[var(--line)] group-hover:border-[var(--brand)] flex items-center justify-center transition-colors">
                <ArrowLeft className="w-3.5 h-3.5 text-[var(--ink-2)] group-hover:text-[var(--brand)]" />
              </div>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
