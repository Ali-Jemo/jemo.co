"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, useSpring } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, Shield, Globe2, Clock, ArrowUpLeft } from "lucide-react";
// import BaghdadBabylonSlideshow from "./BaghdadBabylonSlideshow";

const FEATURED_NEWS = [
  {
    id: "news-1",
    title: "إطلاق نموذج Baghdadi-1 للغة والرياضيات مع قدرات تحليلية متقدمة",
    description: "نموذج سيادي بـ 7 مليارات معلم، مُدرب خصيصاً على البيانات الدقيقة لحل المعضلات الرياضية المعقدة في السياق العربي.",
    category: "نماذج سيادية",
    date: "٢٤ يوليو ٢٠٢٦",
    href: "/research",
    theme: "emerald"
  },
  {
    id: "news-2",
    title: "نواة Ziqa v1.0 — استدلال فائق السرعة يعيد تعريف معايير الأداء",
    description: "بنية تحتية برمجية جديدة تسرّع عمليات الاستدلال بنسسبة ٤٠٪ مقارنة بالأنظمة التقليدية، مع تقليل استهلاك الطاقة.",
    category: "نواة تشغيلية",
    date: "١٨ يوليو ٢٠٢٦",
    href: "/labs",
    theme: "blue"
  },
  {
    id: "news-3",
    title: "افتتاح عنقود بغداد-١ للحوسبة الفائقة لخدمة الباحثين والمؤسسات",
    description: "مركب بيانيات متطور بأحد أحدث مراكز الذكاء الاصطناعي لتوفير قوة حواسيب هائلة للفئات الأكاديمية والبحثية.",
    category: "بنية تحتية",
    date: "٠٥ يوليو ٢٠٢٦",
    href: "/infrastructure",
    theme: "amber"
  },
];

const AUTOPLAY_INTERVAL = 6000;

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
  const [expanding, setExpanding] = useState(false);

  useEffect(() => {
    let startTime = Date.now();
    let animationFrameId: number;

    const animate = () => {
      if (isHoveringNews) {
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

  const smoothScrollY = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 });

  const contentOpacity = useTransform(smoothScrollY, [0, 0.3], [1, 0]);
  const contentY = useTransform(smoothScrollY, [0, 0.3], [0, -30]);
  
  const cardWidth = useTransform(smoothScrollY, [0.2, 0.8], ["32%", "100%"]);
  const cardHeight = useTransform(smoothScrollY, [0.2, 0.8], ["60dvh", "100dvh"]);
  const cardBorderRadius = useTransform(smoothScrollY, [0.2, 0.8], ["1.5rem", "0rem"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setExpanding(v > 0.5);
  });

  const headlineWords = "العلم بين ايدينك".split(" ");

  const getThemeColors = (theme: string) => {
    switch(theme) {
      case 'emerald': return { badge: 'text-emerald-700 bg-emerald-50 border-emerald-200/60', hover: 'group-hover:text-emerald-700' };
      case 'blue': return { badge: 'text-blue-700 bg-blue-50 border-blue-200/60', hover: 'group-hover:text-blue-700' };
      case 'amber': return { badge: 'text-amber-700 bg-amber-50 border-amber-200/60', hover: 'group-hover:text-amber-700' };
      default: return { badge: 'text-slate-700 bg-slate-50 border-slate-200/60', hover: 'group-hover:text-slate-700' };
    }
  };

  return (
    <section
      ref={containerRef}
      dir="rtl"
      className="relative w-full min-h-[220dvh] bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-[0.015] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '64px 64px' }} 
      />

      <div
        className={`sticky top-0 h-screen w-full flex justify-center items-center transition-all duration-700 ${
          expanding ? "z-50" : "z-10"
        }`}
      >
        <div className="relative w-full h-full max-w-[1920px] mx-auto flex flex-col lg:grid lg:grid-cols-[68%_32%] lg:grid-rows-[60dvh_40dvh] border-x border-slate-100 bg-white">
          
          {/* Cell [1,1]: Headline */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="order-1 lg:order-none relative border-b lg:border-l border-slate-100 p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-end"
          >
            <div className="relative z-10 flex flex-col gap-6 max-w-4xl">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[6.5rem] font-black text-slate-900 leading-[1.05] tracking-tight">
                {headlineWords.map((word, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: idx * 0.12, ease: "easeOut" }}
                    className="inline-block mr-3 first:mr-0"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              
              <motion.div 
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                className="flex items-center gap-4"
              >
                <span className="inline-flex items-center gap-2 dir-ltr text-xs md:text-sm font-mono font-bold tracking-widest text-emerald-800 bg-emerald-50/80 border border-emerald-100/60 px-5 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  SOVEREIGN AI
                </span>
                <div className="h-px bg-slate-200 w-16 md:w-28 rounded-full" />
              </motion.div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                className="text-base md:text-lg lg:text-xl text-slate-600 max-w-2xl font-medium leading-relaxed mt-2"
              >
                مؤسسة بحثية مستقلة تُهندس الذكاء الاصطناعي العربي والمقررات السيادية بأعلى معايير الدقة والخصوصية — من <span className="text-slate-900 font-bold border-b-[1.5px] border-emerald-400/40 pb-0.5">بغداد</span> إلى العالم.
              </motion.p>
            </div>
          </motion.div>

          {/* Cell [1,2]: Expanding Card */}
          <motion.div
            style={{
              width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? cardWidth : "100%",
              height: typeof window !== 'undefined' && window.innerWidth >= 1024 ? cardHeight : "auto",
              borderRadius: typeof window !== 'undefined' && window.innerWidth >= 1024 ? cardBorderRadius : "0",
            }}
            className="order-2 lg:order-none relative lg:absolute lg:top-0 lg:left-0 z-40 border-b lg:border-l-0 lg:border-r border-slate-100/80 flex flex-col justify-between overflow-hidden bg-slate-50 lg:bg-white shadow-[inset_0_0_0_1px_rgba(241,245,249,0.6)] lg:shadow-none lg:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-shadow duration-500"
          >
            <div className="w-full h-full p-8 md:p-10 lg:p-12 xl:p-16 flex flex-col relative z-10">
              <div className="flex items-center gap-5 shrink-0 mb-10 lg:mb-auto">
                {[{ Icon: Sparkles, color: "text-emerald-600", bg: "bg-emerald-50/80 border-emerald-100" },
                  { Icon: Shield, color: "text-blue-600", bg: "bg-blue-50/80 border-blue-100" },
                  { Icon: Globe2, color: "text-orange-600", bg: "bg-orange-50/80 border-orange-100" }
                ].map(({ Icon, color, bg }, idx) => (
                  <div key={idx} className={`relative w-14 h-14 rounded-xl ${bg} border flex items-center justify-center shadow-sm ${color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                ))}
              </div>

              <motion.div 
                className="space-y-3 my-8 lg:my-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
                  نبني منظومات ذكاء اصطناعي سيادية
                </h2>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-l from-emerald-700 to-teal-600 leading-[1.15] tracking-tight pb-1">
                  لحل أعقد التحديات الوطنية والعلمية.
                </h2>
              </motion.div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between w-full shrink-0 mt-auto group cursor-pointer">
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-mono text-slate-500 font-medium mb-1">القسم البحثي للمنظومات السيادية</span>
                  <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">استكشف القدرات المتقدمة</span>
                </div>
                <div className="w-11 h-11 rounded-full bg-white border border-slate-200 group-hover:border-emerald-300 group-hover:bg-emerald-50/50 flex items-center justify-center transition-all duration-300 shadow-sm">
                  <ArrowLeft className="w-5 h-5 text-slate-700 group-hover:text-emerald-700 transform group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cell [2,1]: Slideshow Placeholder */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="order-3 lg:order-none relative p-6 md:p-8 flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-l border-slate-100 bg-slate-50"
          >
            <div className="w-full h-full min-h-[300px] lg:min-h-0 relative rounded-2xl bg-white overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] group border border-slate-100/80">
              {/* <BaghdadBabylonSlideshow /> */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")' }} />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 rounded-full border-2 border-slate-100/80 flex items-center justify-center mb-5"
                >
                  <div className="w-14 h-14 rounded-full border-t-2 border-l-2 border-emerald-500/80 animate-spin" style={{ animationDuration: '2.5s' }} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-wide">البيانات قيدالمعالجة</h3>
                <p className="text-slate-500 font-mono text-sm max-w-xs leading-relaxed">جاري تهيئة العرض المرئي لنماذج بغداد وبغداد التوليدية...</p>
              </div>
            </div>
          </motion.div>

          {/* Cell [2,2]: News + Arrows */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="order-4 lg:order-none relative flex flex-col p-6 md:p-8 lg:p-10 bg-white z-10"
          >
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4 shrink-0">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">الموجز البحثي</h3>
                <span className="text-[11px] font-mono uppercase text-slate-400 tracking-widest mt-1 block">آخر الإصدارات</span>
              </div>
              
              <div className="flex gap-2 dir-ltr">
                <SimpleButton 
                  onClick={() => handleManualNav('prev')} 
                  ariaLabel="السابق" 
                  className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 hover:text-slate-900 shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </SimpleButton>
                <SimpleButton 
                  onClick={() => handleManualNav('next')} 
                  ariaLabel="التالي" 
                  className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 hover:text-slate-900 shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </SimpleButton>
              </div>
            </div>

            <div 
              className="relative flex-grow flex flex-col"
              onMouseEnter={() => setIsHoveringNews(true)}
              onMouseLeave={() => setIsHoveringNews(false)}
            >
              <AnimatePresence mode="wait">
                <motion.a
                  key={activeNews}
                  href={FEATURED_NEWS[activeNews].href}
                  initial={{ opacity: 0, x: -15, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: 15, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="block group h-full flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border shadow-sm ${getThemeColors(FEATURED_NEWS[activeNews].theme).badge}`}>
                      {FEATURED_NEWS[activeNews].category}
                    </span>
                    
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {FEATURED_NEWS[activeNews].date}
                    </span>
                  </div>
                  
                  <h4 className={`text-lg lg:text-xl font-bold text-slate-800 leading-tight mb-3 transition-colors duration-300 ${getThemeColors(FEATURED_NEWS[activeNews].theme).hover}`}>
                    {FEATURED_NEWS[activeNews].title}
                  </h4>
                  
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 lg:line-clamp-3 mb-4 flex-grow">
                     {FEATURED_NEWS[activeNews].description}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-slate-900 transition-colors pt-2">
                    <span>اقرأ التفاصيل</span>
                    <ArrowUpLeft className="w-4 h-4 transform group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                </motion.a>
              </AnimatePresence>
              
              <div className="mt-4 shrink-0">
                <LinearProgress progress={progress} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
