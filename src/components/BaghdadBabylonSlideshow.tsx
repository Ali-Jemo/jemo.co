"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Landmark } from "lucide-react";

interface Slide {
  id: string;
  title: string;
  location: string;
  era: string;
  image: string;
  gradient: string;
  patternSvg: string;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: "baghdad-wisdom",
    title: "دار الحكمة — بغداد العباسية",
    location: "بغداد، العراق",
    era: "منارة العلوم والفلسفة والترجمة ٨٠٠ م",
    image: "/wisdom-bg-new.png",
    gradient: "from-amber-950/80 via-black/60 to-transparent",
    patternSvg: "M0 0h24v24H0z",
  },
  {
    id: "babylon-ishtar",
    title: "بوابة عشتار — بابل العظيمة",
    location: "بابل، العراق",
    era: "مهد الحضارة والتشفير الأول ٥٧٥ ق.م",
    image: "/covenant-bg.png",
    gradient: "from-blue-950/80 via-black/60 to-transparent",
    patternSvg: "M0 0h24v24H0z",
  },
  {
    id: "mustansiriya",
    title: "المدرسة المستنصرية — دجلة",
    location: "بغداد القديمة",
    era: "أقدم جامعة علمية متكاملة ١٢٢٧ م",
    image: "/diwan-bg-astrolabe.png",
    gradient: "from-amber-900/80 via-black/60 to-transparent",
    patternSvg: "M0 0h24v24H0z",
  },
  {
    id: "samarra",
    title: "ملوية سامراء — العمارة الإسلامية",
    location: "سامراء، العراق",
    era: "قمة الهندسة والنسب الموزونة ٨٤٨ م",
    image: "/hero-bg-rtl.png",
    gradient: "from-stone-900/80 via-black/60 to-transparent",
    patternSvg: "M0 0h24v24H0z",
  },
];

export default function BaghdadBabylonSlideshow({
  slides = DEFAULT_SLIDES,
}: {
  slides?: Slide[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, slides.length]);

  const currentSlide = slides[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full rounded-2xl overflow-hidden border border-[var(--j-line)] bg-neutral-900 text-white shadow-xl aspect-[16/9] md:aspect-[21/9]"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0"
        >
          {/* Background image & gradient */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out scale-105"
            style={{ backgroundImage: `url(${currentSlide.image})` }}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${currentSlide.gradient}`}
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

          {/* Decorative Grid Lines overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Slide Info */}
          <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-8 z-10 dir-rtl">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-amber-300/90 bg-black/50 backdrop-blur-md border border-amber-500/20 px-3 py-1 rounded-full">
                <Landmark className="w-3.5 h-3.5" />
                {currentSlide.location}
              </span>
              <span className="text-[11px] font-mono text-neutral-400 bg-black/40 px-2.5 py-1 rounded border border-white/10">
                {currentIndex + 1} / {slides.length}
              </span>
            </div>

            <div className="space-y-1 max-w-xl">
              <h3 className="text-xl md:text-2xl font-bold font-kufi text-white tracking-wide">
                {currentSlide.title}
              </h3>
              <p className="text-xs md:text-sm text-neutral-300 font-mono">
                {currentSlide.era}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 z-20">
        <motion.div
          key={currentIndex}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: isHovered ? 0 : 5, ease: "linear" }}
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 dir-ltr">
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 grid place-items-center text-white transition-all hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 grid place-items-center text-white transition-all hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
