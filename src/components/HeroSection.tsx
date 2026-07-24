"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, Clock, ArrowUpLeft, ChevronDown } from "lucide-react";

const FEATURED_NEWS = [
  {
    id: "news-1",
    title: "إطلاق نموذج Baghdadi-1 للغة والرياضيات",
    description: "نموذج سيادي بـ 7 مليارات معلم، مُدرب على البيانات الدقيقة لحل المعضلات الرياضية في السياق العربي.",
    category: "نماذج سيادية",
    date: "٢٤ يوليو ٢٠٢٦",
    href: "/research",
  },
  {
    id: "news-2",
    title: "نواة Ziqa v1.0 — استدلال فائق السرعة",
    description: "بنية تحتية برمجية تسرّع عمليات الاستدلال بـ ٤٠٪ مع تقليل استهلاك الطاقة.",
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

// Knowledge Network — Baghdad's circular city layout meets neural network
// The nodes follow the historical circular plan of Abbasid Baghdad
const KnowledgeNetwork = () => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 700" fill="none">
    <defs>
      {/* Glow filter for key nodes */}
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Concentric rings — Baghdad's circular city */}
    <g opacity="0.03" stroke="var(--brand)" strokeWidth="0.5">
      <circle cx="450" cy="320" r="120" />
      <circle cx="450" cy="320" r="200" />
      <circle cx="450" cy="320" r="280" />
    </g>

    {/* Radial lines — knowledge flowing outward from center */}
    <g opacity="0.04" stroke="var(--brand)" strokeWidth="0.5">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 450 + Math.cos(rad) * 60;
        const y1 = 320 + Math.sin(rad) * 60;
        const x2 = 450 + Math.cos(rad) * 300;
        const y2 = 320 + Math.sin(rad) * 300;
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </g>

    {/* Connections — flowing knowledge paths */}
    <g opacity="0.06" stroke="var(--brand)" strokeWidth="0.8">
      {/* Inner ring connections */}
      <path d="M450 200 Q500 260 530 320" />
      <path d="M530 320 Q500 380 450 440" />
      <path d="M450 440 Q400 380 370 320" />
      <path d="M370 320 Q400 260 450 200" />
      {/* Outer ring connections */}
      <path d="M450 120 Q550 200 620 320" />
      <path d="M620 320 Q550 440 450 520" />
      <path d="M450 520 Q350 440 280 320" />
      <path d="M280 320 Q350 200 450 120" />
      {/* Cross connections — knowledge transfer */}
      <path d="M350 220 L550 420" />
      <path d="M550 220 L350 420" />
      <path d="M280 320 L620 320" />
      <path d="M450 120 L450 520" />
    </g>

    {/* Connection flowing TO the headline — the key interaction */}
    <g opacity="0.08">
      <path d="M620 320 Q680 320 750 320" stroke="var(--brand)" strokeWidth="1" strokeDasharray="4 4">
        <animate attributeName="strokeDashoffset" values="8;0" dur="1s" repeatCount="indefinite" />
      </path>
      {/* Arrow pointing to headline */}
      <polygon points="745,315 755,320 745,325" fill="var(--brand)" opacity="0.15" />
    </g>

    {/* Nodes — varied sizes for hierarchy */}
    <g>
      {/* Center node — House of Wisdom (largest, glowing) */}
      <circle cx="450" cy="320" r="8" fill="var(--brand)" opacity="0.2" filter="url(#glowStrong)">
        <animate attributeName="opacity" values="0.15;0.25;0.15" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="450" cy="320" r="4" fill="var(--brand)" opacity="0.4" />

      {/* Inner ring nodes — medium, some breathing */}
      {[
        { cx: 450, cy: 200, r: 5, delay: 0 },
        { cx: 530, cy: 320, r: 5, delay: 1 },
        { cx: 450, cy: 440, r: 5, delay: 2 },
        { cx: 370, cy: 320, r: 5, delay: 3 },
      ].map((node, i) => (
        <g key={`inner-${i}`}>
          <circle cx={node.cx} cy={node.cy} r={node.r} fill="var(--brand)" opacity="0.12" filter="url(#glow)">
            <animate attributeName="opacity" values="0.08;0.18;0.08" dur={`${3 + node.delay}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={node.cx} cy={node.cy} r={node.r * 0.5} fill="var(--brand)" opacity="0.25" />
        </g>
      ))}

      {/* Outer ring nodes — smaller, subtle */}
      {[
        { cx: 450, cy: 120 },
        { cx: 620, cy: 320 },
        { cx: 450, cy: 520 },
        { cx: 280, cy: 320 },
        { cx: 350, cy: 220 },
        { cx: 550, cy: 220 },
        { cx: 350, cy: 420 },
        { cx: 550, cy: 420 },
      ].map((node, i) => (
        <circle key={`outer-${i}`} cx={node.cx} cy={node.cy} r="3" fill="var(--brand)" opacity="0.1" />
      ))}

      {/* Satellite nodes — scattered, smallest */}
      {[
        { cx: 180, cy: 180 },
        { cx: 720, cy: 180 },
        { cx: 180, cy: 460 },
        { cx: 720, cy: 460 },
        { cx: 350, cy: 580 },
        { cx: 550, cy: 580 },
      ].map((node, i) => (
        <circle key={`sat-${i}`} cx={node.cx} cy={node.cy} r="2" fill="var(--brand)" opacity="0.06" />
      ))}
    </g>

    {/* Flowing light animation along the path to headline */}
    <circle r="2" fill="var(--brand)" opacity="0.3">
      <animateMotion dur="4s" repeatCount="indefinite" path="M620,320 Q680,320 750,320" />
    </circle>
  </svg>
);

// Subtle Sumerian pattern — corner accent
const SumerianAccent = () => (
  <svg className="absolute bottom-8 right-8 w-32 h-32 opacity-[0.025]" viewBox="0 0 100 100" fill="none">
    <g stroke="var(--gold)" strokeWidth="0.8">
      {/* Minimal cuneiform-inspired marks */}
      <line x1="10" y1="10" x2="30" y2="30" />
      <line x1="20" y1="10" x2="40" y2="30" />
      <line x1="50" y1="10" x2="70" y2="30" />
      <line x1="60" y1="10" x2="80" y2="30" />
      <line x1="10" y1="50" x2="30" y2="70" />
      <line x1="20" y1="50" x2="40" y2="70" />
      <line x1="50" y1="50" x2="70" y2="70" />
      <line x1="60" y1="50" x2="80" y2="70" />
      <circle cx="50" cy="50" r="20" />
      <circle cx="50" cy="50" r="10" />
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

  const contentOpacity = useTransform(smoothScroll, [0, 0.3], [1, 0]);
  const contentY = useTransform(smoothScroll, [0, 0.3], [0, -30]);
  const nextSectionOpacity = useTransform(smoothScroll, [0.15, 0.25], [0, 1]);

  return (
    <section
      ref={containerRef}
      dir="rtl"
      className="relative w-full min-h-[150dvh] bg-[var(--bg)] text-[var(--ink)]"
    >
      {/* Grid — barely visible, just texture */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.012]" 
           style={{ backgroundImage: 'linear-gradient(to right, var(--ink) 1px, transparent 1px), linear-gradient(to bottom, var(--ink) 1px, transparent 1px)', backgroundSize: '64px 64px' }} 
      />

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Knowledge Network — the signature visual */}
        <KnowledgeNetwork />

        {/* Sumerian accent — Iraqi identity */}
        <SumerianAccent />

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
                className="flex items-center gap-3 mb-5"
              >
                <span className="inline-flex items-center gap-2 dir-ltr text-xs font-mono font-bold tracking-[0.2em] text-[var(--brand)] bg-[var(--brand)]/5 px-4 py-1.5 rounded-full uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
                  SOVEREIGN AI
                </span>
                <div className="h-px bg-[var(--line)] w-12" />
              </motion.div>

              {/* Headline — one tight block */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-[var(--ink)] leading-[1.08] tracking-tight mb-4">
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
              
              {/* Description — close to headline, larger */}
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl lg:text-[1.3rem] text-[var(--ink-2)] font-medium leading-relaxed max-w-2xl mb-8"
              >
                مؤسسة بحثية مستقلة تُهندس الذكاء الاصطناعي العربي والمقررات السيادية — من <strong className="text-[var(--ink)] border-b-2 border-[var(--brand)]/30 pb-0.5">بغداد</strong> إلى العالم.
              </motion.p>

              {/* CTA — stronger personality */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap items-center gap-4"
              >
                <a href="/research" className="group inline-flex items-center gap-3 px-8 py-4 bg-[var(--brand)] text-[var(--brand-ink)] font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-[var(--brand)]/25 hover:-translate-y-0.5 transition-all duration-300">
                  اقرأ الأبحاث
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </a>
                <a href="/labs" className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--surface)] text-[var(--ink)] font-bold text-sm rounded-xl border border-[var(--line)] hover:border-[var(--brand)]/40 hover:bg-[var(--brand)]/5 transition-all duration-300">
                  استكشف المختبرات
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar — visually connected to network */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="absolute top-0 left-0 bottom-0 w-[340px] flex flex-col z-10"
        >
          {/* Gradient bleed from network into sidebar */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand)]/[0.02] to-transparent pointer-events-none" />
          
          <div className="relative h-full bg-[var(--surface)]/60 backdrop-blur-sm border-r border-[var(--line)]/40 flex flex-col">
            {/* News Header */}
            <div className="p-5 border-b border-[var(--line)]/40">
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
                  
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--line)]/40">
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
              <div className="mt-3 pt-3 border-t border-[var(--line)]/40">
                <div className="h-0.5 bg-[var(--line)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--brand)] rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Footer — part of the story */}
            <div className="p-5 border-t border-[var(--line)]/40">
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
