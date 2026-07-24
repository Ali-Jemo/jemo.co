"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, useSpring } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Cpu, Microscope, Globe } from "lucide-react";
// import BaghdadBabylonSlideshow from "./BaghdadBabylonSlideshow";

const FEATURED_NEWS = [
  {
    id: "news-1",
    title: "إطلاق نموذج Baghdadi-1 للغة والرياضيات مع قدرات تحليلية متقدمة",
    category: "نماذج سيادية",
    href: "/research",
    theme: "emerald"
  },
  {
    id: "news-2",
    title: "نواة Ziqa v1.0 — استدلال فائق السرعة يعيد تعريف معايير الأداء",
    category: "نواة تشغيلية",
    href: "/labs",
    theme: "blue"
  },
  {
    id: "news-3",
    title: "افتتاح عنقود بغداد-١ للحوسبة الفائقة لخدمة الباحثين والمؤسسات",
    category: "بنية تحتية",
    href: "/infrastructure",
    theme: "amber"
  },
];

const AUTOPLAY_INTERVAL = 7000;

const SimpleButton = ({ children, onClick, className, ariaLabel }: { children: React.ReactNode, onClick: () => void, className?: string, ariaLabel?: string }) => (
  <motion.button
    aria-label={ariaLabel}
    onClick={onClick}
    whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
    className={`flex items-center justify-center transition-colors duration-200 ${className}`}
  >
    {children}
  </motion.button>
);

const LinearProgress = ({ progress }: { progress: number }) => (
  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-4">
    <motion.div
      className="h-full bg-slate-800 rounded-full"
      style={{ width: `${progress}%` }}
      transition={{ duration: 0.1, ease: "linear" }}
    />
  </div>
);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeNews, setActiveNews] = useState(0);
  const [isHoveringNews, setIsHoveringNews] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let startTime = Date.now();
    let animationFrameId: number;

    const animate = () => {
      if (isHoveringNews) {
        // Keep start time relative to current progress when paused
        startTime = Date.now() - (progress / 100) * AUTOPLAY_INTERVAL;
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min((elapsedTime / AUTOPLAY_INTERVAL) * 100, 100);
      
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        setActiveNews((prev) => (prev + 1) % FEATURED_NEWS.length);
        startTime = Date.now();
        setProgress(0);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeNews, isHoveringNews, progress]);

  const handleManualNav = useCallback((direction: 'next' | 'prev') => {
    setActiveNews((prev) => {
      if (direction === 'next') return (prev + 1) % FEATURED_NEWS.length;
      return (prev - 1 + FEATURED_NEWS.length) % FEATURED_NEWS.length;
    });
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

  const getThemeColors = (theme: string) => {
    switch(theme) {
      case 'emerald': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'blue': return 'text-blue-700 bg-blue-50 border-blue-100';
      case 'amber': return 'text-amber-700 bg-amber-50 border-amber-100';
      default: return 'text-slate-700 bg-slate-50 border-slate-100';
    }
  };

  return (
    <section
      ref={containerRef}
      dir="rtl"
      className="relative w-full min-h-[250dvh] bg-[#FAFAFA] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900"
    >
      {/* Subtle Micro-Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <div className={`sticky top-0 h-screen w-full overflow-hidden transition-all duration-500 ${isExpanded ? "z-50" : "z-10"}`}>
        
        {/* Main Grid Layout */}
        <div className="w-full h-full max-w-[1920px] mx-auto flex flex-col lg:grid lg:grid-cols-[70%_30%] relative">
          
          {/* Left Side: Main Content & Bottom Sections */}
          <div className="flex flex-col h-full border-l border-slate-200/60 relative z-10 bg-[#FAFAFA]">
            
            {/* Top Row: Hero Headline (approx 65% height) */}
            <motion.div 
              style={{ opacity: mainOpacity, y: mainY }}
              className="flex-grow flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-20 pb-12 border-b border-slate-200/60"
            >
              <div className="max-w-4xl space-y-8">
                
                {/* Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                  className="flex items-center gap-4"
                >
                  <span className="inline-flex items-center gap-2 dir-ltr text-xs font-mono font-bold tracking-[0.2em] text-emerald-800 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full uppercase shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Sovereign AI
                  </span>
                  <div className="h-px bg-slate-300 flex-grow max-w-[100px]" />
                </motion.div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-slate-900 leading-[1.1] tracking-tight">
                  <motion.span 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                    className="block"
                  >
                    العلم بين
                  </motion.span>
                  <motion.span 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                    className="block text-slate-800"
                  >
                    ايدينك.
                  </motion.span>
                </h1>
                
                {/* Description */}
                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl"
                >
                  مؤسسة بحثية مستقلة تُهندس الذكاء الاصطناعي العربي والمقررات السيادية بأعلى معايير الدقة والخصوصية — من <strong className="text-slate-900 border-b-2 border-emerald-400/50 pb-0.5">بغداد</strong> إلى العالم.
                </motion.p>
              </div>
            </motion.div>

            {/* Bottom Row: Slideshow Alt & News (approx 35% height) */}
            <motion.div 
              style={{ opacity: bottomSectionOpacity }}
              className="h-[35vh] min-h-[300px] flex flex-col md:flex-row relative z-0"
            >
              
              {/* Slideshow Alt Component (Left) */}
              <div className="w-full md:w-1/2 h-full border-b md:border-b-0 md:border-l border-slate-200/60 p-6 md:p-8 bg-slate-50/50 flex items-center justify-center">
                <div className="w-full h-full rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
                  {/* <BaghdadBabylonSlideshow /> */}
                  <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Globe className="w-8 h-8 text-slate-300 mb-4 group-hover:text-emerald-500 transition-colors duration-500" strokeWidth={1.5} />
                  <h3 className="text-sm font-bold text-slate-700 mb-1 relative z-10">استكشاف النماذج التوليدية</h3>
                  <p className="text-xs text-slate-500 font-mono relative z-10">جاري تحميل واجهة العرض...</p>
                </div>
              </div>

              {/* News Section (Right) */}
              <div className="w-full md:w-1/2 h-full p-6 md:p-8 flex flex-col justify-between bg-white">
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">الموجز البحثي</h3>
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-widest mt-0.5 block">آخر الإصدارات</span>
                  </div>
                  
                  <div className="flex gap-1.5 dir-ltr">
                    <SimpleButton onClick={() => handleManualNav('prev')} ariaLabel="السابق" className="w-8 h-8 rounded-full border border-slate-200 text-slate-500">
                      <ChevronLeft className="w-4 h-4" />
                    </SimpleButton>
                    <SimpleButton onClick={() => handleManualNav('next')} ariaLabel="التالي" className="w-8 h-8 rounded-full border border-slate-200 text-slate-500">
                      <ChevronRight className="w-4 h-4" />
                    </SimpleButton>
                  </div>
                </div>

                <div 
                  className="relative flex-grow flex flex-col justify-end"
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
                      transition={{ duration: 0.4 }}
                      className="block group"
                    >
                      <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-mono font-bold mb-2 border ${getThemeColors(FEATURED_NEWS[activeNews].theme)}`}>
                        {FEATURED_NEWS[activeNews].category}
                      </span>
                      <p className="text-sm lg:text-base font-bold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-3">
                        {FEATURED_NEWS[activeNews].title}
                      </p>
                    </motion.a>
                  </AnimatePresence>
                  
                  <LinearProgress progress={progress} />
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
            className="order-first lg:order-none relative lg:absolute lg:top-0 lg:left-0 z-40 bg-slate-900 text-white overflow-hidden flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] origin-right"
          >
            {/* Subtle Inner Gradient for Depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900 pointer-events-none" />
            
            <div className="relative z-10 p-8 md:p-12 lg:p-16 h-full flex flex-col">
              
              {/* Icons Top */}
              <div className="flex gap-4 mb-16 lg:mb-auto">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Microscope className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
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
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-teal-200">
                    ذكاء اصطناعي سيادية
                  </span>
                </h2>
                <p className="text-slate-400 text-lg max-w-md leading-relaxed font-medium">
                  لحل أعقد التحديات الوطنية والعلمية من خلال نماذج متخصصة وبنية تحتية سيادية بالكامل.
                </p>
              </motion.div>

              {/* Footer Interactive */}
              <a href="/about" className="group mt-auto pt-8 border-t border-white/10 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">القسم البحثي</span>
                  <span className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">استكشف القدرات المتقدمة</span>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/20 group-hover:border-emerald-400 group-hover:bg-emerald-400/10 flex items-center justify-center transition-all duration-300">
                  <ArrowLeft className="w-5 h-5 text-white group-hover:text-emerald-400 transform group-hover:-translate-x-1 transition-transform" />
                </div>
              </a>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}