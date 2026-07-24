"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, Clock, ArrowUpLeft, ChevronDown } from "lucide-react";

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

// Subtle Neural Network SVG — represents AI identity
const NeuralNetwork = () => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Neural connections */}
    <g opacity="0.06" stroke="var(--brand)" strokeWidth="1">
      {/* Layer 1 to Layer 2 */}
      <line x1="100" y1="150" x2="300" y2="100" />
      <line x1="100" y1="150" x2="300" y2="200" />
      <line x1="100" y1="150" x2="300" y2="300" />
      <line x1="100" y1="300" x2="300" y2="200" />
      <line x1="100" y1="300" x2="300" y2="300" />
      <line x1="100" y1="300" x2="300" y2="400" />
      <line x1="100" y1="450" x2="300" y2="300" />
      <line x1="100" y1="450" x2="300" y2="400" />
      <line x1="100" y1="450" x2="300" y2="500" />
      {/* Layer 2 to Layer 3 */}
      <line x1="300" y1="100" x2="500" y2="150" />
      <line x1="300" y1="100" x2="500" y2="250" />
      <line x1="300" y1="200" x2="500" y2="150" />
      <line x1="300" y1="200" x2="500" y2="250" />
      <line x1="300" y1="200" x2="500" y2="350" />
      <line x1="300" y1="300" x2="500" y2="250" />
      <line x1="300" y1="300" x2="500" y2="350" />
      <line x1="300" y1="300" x2="500" y2="450" />
      <line x1="300" y1="400" x2="500" y2="350" />
      <line x1="300" y1="400" x2="500" y2="450" />
      <line x1="300" y1="500" x2="500" y2="450" />
      {/* Layer 3 to Layer 4 */}
      <line x1="500" y1="150" x2="700" y2="200" />
      <line x1="500" y1="150" x2="700" y2="300" />
      <line x1="500" y1="250" x2="700" y2="200" />
      <line x1="500" y1="250" x2="700" y2="300" />
      <line x1="500" y1="350" x2="700" y2="300" />
      <line x1="500" y1="350" x2="700" y2="400" />
      <line x1="500" y1="450" x2="700" y2="300" />
      <line x1="500" y1="450" x2="700" y2="400" />
    </g>
    {/* Nodes */}
    <g opacity="0.08" fill="var(--brand)">
      {/* Layer 1 */}
      <circle cx="100" cy="150" r="4" />
      <circle cx="100" cy="300" r="4" />
      <circle cx="100" cy="450" r="4" />
      {/* Layer 2 */}
      <circle cx="300" cy="100" r="4" />
      <circle cx="300" cy="200" r="4" />
      <circle cx="300" cy="300" r="4" />
      <circle cx="300" cy="400" r="4" />
      <circle cx="300" cy="500" r="4" />
      {/* Layer 3 */}
      <circle cx="500" cy="150" r="4" />
      <circle cx="500" cy="250" r="4" />
      <circle cx="500" cy="350" r="4" />
      <circle cx="500" cy="450" r="4" />
      {/* Layer 4 */}
      <circle cx="700" cy="200" r="4" />
      <circle cx="700" cy="300" r="4" />
      <circle cx="700" cy="400" r="4" />
    </g>
  </svg>
);

// Sumerian Pattern — Iraqi identity
const SumerianPattern = () => (
  <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.03]" viewBox="0 0 200 200" fill="none">
    {/* Cuneiform-inspired geometric pattern */}
    <g stroke="var(--gold)" strokeWidth="1.5">
      {/* Vertical lines */}
      <line x1="20" y1="20" x2="20" y2="180" />
      <line x1="40" y1="20" x2="40" y2="180" />
      <line x1="60" y1="20" x2="60" y2="180" />
      <line x1="80" y1="20" x2="80" y2="180" />
      <line x1="100" y1="20" x2="100" y2="180" />
      <line x1="120" y1="20" x2="120" y2="180" />
      <line x1="140" y1="20" x2="140" y2="180" />
      <line x1="160" y1="20" x2="160" y2="180" />
      <line x1="180" y1="20" x2="180" y2="180" />
      {/* Horizontal lines */}
      <line x1="20" y1="40" x2="180" y2="40" />
      <line x1="20" y1="80" x2="180" y2="80" />
      <line x1="20" y1="120" x2="180" y2="120" />
      <line x1="20" y1="160" x2="180" y2="160" />
      {/* Diagonal cuneiform strokes */}
      <line x1="30" y1="30" x2="50" y2="50" />
      <line x1="70" y1="30" x2="90" y2="50" />
      <line x1="110" y1="30" x2="130" y2="50" />
      <line x1="150" y1="30" x2="170" y2="50" />
      <line x1="30" y1="90" x2="50" y2="110" />
      <line x1="70" y1="90" x2="90" y2="110" />
      <line x1="110" y1="90" x2="130" y2="110" />
      <line x1="150" y1="90" x2="170" y2="110" />
      <line x1="30" y1="150" x2="50" y2="170" />
      <line x1="70" y1="150" x2="90" y2="170" />
      <line x1="110" y1="150" x2="130" y2="170" />
      <line x1="150" y1="150" x2="170" y2="170" />
    </g>
  </svg>
);

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

  // Next section preview (appears at bottom)
  const nextSectionOpacity = useTransform(smoothScroll, [0.15, 0.25], [0, 1]);

  return (
    <section
      ref={containerRef}
      dir="rtl"
      className="relative w-full min-h-[150dvh] bg-[var(--bg)] text-[var(--ink)]"
    >
      {/* Ultra-subtle grid — feels it, doesn't see it */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.015]" 
           style={{ backgroundImage: 'linear-gradient(to right, var(--ink) 1px, transparent 1px), linear-gradient(to bottom, var(--ink) 1px, transparent 1px)', backgroundSize: '64px 64px' }} 
      />

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Neural Network Background — AI Identity */}
        <NeuralNetwork />

        {/* Sumerian Pattern — Iraqi Identity */}
        <SumerianPattern />

        {/* Hero Content */}
        <motion.div 
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute inset-0 flex items-center"
        >
          <div className="w-full max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24 xl:px-32">
            <div className="max-w-4xl">
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="inline-flex items-center gap-2 dir-ltr text-xs font-mono font-bold tracking-[0.2em] text-[var(--brand)] bg-[var(--brand)]/5 px-4 py-1.5 rounded-full uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
                  SOVEREIGN AI
                </span>
                <div className="h-px bg-[var(--line)] w-12" />
              </motion.div>

              {/* Headline — balanced, not oversized */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-[var(--ink)] leading-[1.08] tracking-tight mb-6">
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
              
              {/* Description — slightly larger for balance */}
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl lg:text-[1.35rem] text-[var(--ink-2)] font-medium leading-relaxed max-w-2xl mb-10"
              >
                مؤسسة بحثية مستقلة تُهندس الذكاء الاصطناعي العربي والمقررات السيادية — من <strong className="text-[var(--ink)] border-b-2 border-[var(--brand)]/30 pb-0.5">بغداد</strong> إلى العالم.
              </motion.p>

              {/* Strong CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap items-center gap-4"
              >
                <a href="/research" className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--brand)] text-[var(--brand-ink)] font-bold text-sm rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[var(--brand)]/20">
                  اقرأ الأبحاث
                  <ArrowLeft className="w-4 h-4" />
                </a>
                <a href="/labs" className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--surface)] text-[var(--ink)] font-bold text-sm rounded-xl border border-[var(--line)] hover:border-[var(--brand)]/40 transition-colors">
                  استكشف المختبرات
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar — Integrated, not a widget */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="absolute top-0 left-0 bottom-0 w-[340px] bg-[var(--surface)]/80 backdrop-blur-sm border-r border-[var(--line)]/50 flex flex-col z-10"
        >
          {/* News Header */}
          <div className="p-5 border-b border-[var(--line)]/50">
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
            className="flex-1 p-5 flex flex-col"
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
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-semibold text-[var(--brand)] bg-[var(--brand)]/10 w-fit mb-3">
                  {FEATURED_NEWS[activeNews].category}
                </span>
                
                <h4 className="text-sm font-bold text-[var(--ink)] leading-snug mb-2 group-hover:text-[var(--brand)] transition-colors">
                  {FEATURED_NEWS[activeNews].title}
                </h4>
                
                <p className="text-xs text-[var(--ink-2)] leading-relaxed line-clamp-2 mb-3 flex-grow">
                  {FEATURED_NEWS[activeNews].description}
                </p>
                
                <div className="flex items-center justify-between pt-3 border-t border-[var(--line)]/50">
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
            <div className="mt-3 pt-3 border-t border-[var(--line)]/50">
              <div className="h-0.5 bg-[var(--line)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--brand)] rounded-full transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Footer — Integrated into story */}
          <div className="p-5 border-t border-[var(--line)]/50">
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

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: nextSectionOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        >
          <span className="text-[10px] font-mono text-[var(--ink-2)] tracking-widest uppercase">اكتشف المزيد</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-[var(--ink-2)]" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
