"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import BioButton from "@/components/BioButton";
import { useAuth } from "@/lib/auth-context";

const PILLARS_PREVIEW = [
  { 
    id: "systems", 
    num: "01", 
    name: "أبحاث النظم والأنوية", 
    spec: "Kernels • OS • Low-Level", 
    field: "نواة Ziqa ومترجمات النظم", 
    desc: "أبحاث برمجية عميقة في معمارية نظم التشغيل، الأنوية المصغرة، والعتاد المباشر مع شفرات قابلة للتشغيل المباشر.", 
    href: "/projects" 
  },
  { 
    id: "ai-eval", 
    num: "02", 
    name: "نماذج الذكاء والاستدلال", 
    spec: "Reasoning • Benchmarks • Debunking", 
    field: "تقييم النماذج وفحص الهلوسة", 
    desc: "اختبارات أداء حقيقية، تفكيك وتصحيح هلوسات النماذج التوليدية، وبناء خطوط استدلال موثقة بالبيانات.", 
    href: "/research" 
  },
  { 
    id: "proof-of-work", 
    num: "03", 
    name: "بروتوكول التحقق الفردي", 
    spec: "Proof of Work • Registry", 
    field: "توثيق الاكتشافات الفردية الفائقة", 
    desc: "أرشيف عام ومفتوح يحفظ الاكتشافات الفردية الفائقة مع إثبات التحقق البشري الصارم وتوثيق السبق الفكري.", 
    href: "/publish" 
  },
];

export default function HeroSection() {
  const { profile } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activePillar, setActivePillar] = useState<number | null>(null);

  const isCoarsePointer = () =>
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  // Mouse Parallax for subtle 3D cinematic depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const mouseRafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isCoarsePointer()) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (mouseRafRef.current !== null) return;

    mouseRafRef.current = requestAnimationFrame(() => {
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 16;
      const y = (clientY / innerHeight - 0.5) * 16;
      mouseX.set(x);
      mouseY.set(y);
      mouseRafRef.current = null;
    });
  }, [mouseX, mouseY]);

  useEffect(() => {
    return () => {
      if (mouseRafRef.current) cancelAnimationFrame(mouseRafRef.current);
    };
  }, []);

  // ponytail: pause video when scrolled out of viewport to eliminate background GPU drain
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const scrollToContent = () => {
    const el = document.querySelector("main")?.children[1];
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <section
      dir="rtl"
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[85dvh] lg:h-[100dvh] bg-[#0c1415] text-white overflow-hidden flex flex-col justify-between py-6 lg:py-0 lg:-mt-16 lg:pt-20 lg:pb-4"
    >
      {/* 1. Looping 3D Sculptural Ribbon Video Background directly from IntegratedBio with Parallax */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          style={{ x: springX, y: springY }}
          className="absolute -inset-[6%] w-[112%] h-[112%]"
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            poster="/hero-bg.png"
            className="w-full h-full object-cover object-center transition-opacity duration-1000 transform-gpu"
          >
            <source src="/hero-loop.webm" type="video/webm" />
            <source src="/hero-loop.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Targeted radial & linear gradient overlays ensuring 100% typography contrast in all frames */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 950px 600px at 72% 50%, rgba(12,20,21,0.75) 0%, rgba(12,20,21,0.3) 60%, transparent 100%)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1415]/90 via-transparent to-[#0c1415]/50" />
        <div className="absolute inset-0 bg-[#0c1415]/15" />
      </div>

      {/* 2. Top Institutional Clearance & Live Audio Telemetry Badge */}
      <div className="relative z-10 w-full px-4 sm:px-10 lg:px-16 pt-3 sm:pt-5 flex items-center justify-between flex-wrap gap-3">
        
        {/* Institutional Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-white/20 bg-[#0c1415]/80 text-xs shadow-xs max-w-full overflow-hidden"
        >
          <span className="w-2 h-2 rounded-full bg-[#bef264] animate-pulse shrink-0" aria-hidden />
          <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-wider text-white/95 uppercase truncate">
            OPEN DISCOVERY ARCHIVE
          </span>
          <span className="h-3 w-px bg-white/20 shrink-0" aria-hidden />
          <span className="text-[10px] sm:text-[11px] text-white/90 font-medium truncate">
            سجل أبحاث النظم والبرمجة والـ AI
          </span>
        </motion.div>

      </div>

      {/* 3. Center: Massive Monumental Display Headline with Line-Mask Entrance */}
      <div className="relative z-10 w-full px-4 sm:px-10 lg:px-16 my-auto py-2 sm:py-3">
        <h1 
          style={{ color: "#ffffff" }}
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4.25rem] font-medium leading-[1.2] sm:leading-[1.14] tracking-tight max-w-4xl font-kufi text-white select-none [text-shadow:0_4px_35px_rgba(0,0,0,0.7)]"
        >
          <span className="block overflow-hidden pb-1 -mb-1">
            <motion.span
              initial={{ y: "115%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              أبحاثٌ تولد في المحادثة،
            </motion.span>
          </span>

          <span className="block overflow-hidden pb-1 -mb-1">
            <motion.span
              initial={{ y: "115%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="block text-white"
            >
              وتُحفظ كمعرفة دائمة<span className="text-[#bef264]">.</span>
            </motion.span>
          </span>
        </h1>
      </div>

      {/* 4. Bottom Row: Subtitle + Pillars Quick-Switcher + Split-Pill Action Button */}
      <div className="relative z-10 w-full px-4 sm:px-10 lg:px-16 pb-8 sm:pb-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
        
        {/* Right side (start in RTL): Subtitle + 3 Research Pillars Navigation Pills */}
        <div className="flex flex-col gap-3.5 max-w-xl relative w-full lg:w-auto">
          {/* Floating Hover Preview Card */}
          <AnimatePresence>
            {activePillar !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="p-4 rounded-2xl bg-[#0c1415]/95 border border-white/20 shadow-2xl flex flex-col gap-2 max-w-md"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#bef264] font-bold">
                    {PILLARS_PREVIEW[activePillar].num}. {PILLARS_PREVIEW[activePillar].name}
                  </span>
                  <span className="text-zinc-400 font-mono">{PILLARS_PREVIEW[activePillar].spec}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                  {PILLARS_PREVIEW[activePillar].desc}
                </p>
                <div className="text-[10px] font-mono text-emerald-400 pt-1.5 border-t border-white/10 flex items-center justify-between">
                  <span>{PILLARS_PREVIEW[activePillar].field}</span>
                  <span className="text-[#bef264]">عرض التفاصيل التقنية ←</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p 
            style={{ color: "rgba(255, 255, 255, 0.95)" }}
            className="text-sm sm:text-lg leading-relaxed font-normal [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]"
          >
            نحن نبحث، نكتشف، ونصل لنتائج غير مسبوقة يومياً داخل شاشات المحادثة. <strong className="text-white font-bold underline decoration-[#bef264]/70 decoration-2 underline-offset-4">JEMO هي المنصة التي تذهب إليها بعد أن بحثت</strong> — لتحويل رحلتك من حوار عابر إلى مرجع تقني نخبوي محمي بمعيار التحقق البشري الصارم <bdi dir="ltr" className="inline-block whitespace-nowrap">(Proof of Work)</bdi>.
          </p>

          {/* 3 Quick Research Pillars Switchers */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {PILLARS_PREVIEW.map((p, idx) => (
              <Link
                key={p.id}
                href={p.href}
                onMouseEnter={() => { if (isCoarsePointer()) return; setActivePillar(idx) }}
                onMouseLeave={() => { if (isCoarsePointer()) return; setActivePillar(null) }}
                className={`group px-3.5 py-2 rounded-full border text-xs font-mono transition-all duration-200 flex items-center gap-2.5 shadow-xs ${
                  activePillar === idx
                    ? "bg-black/90 border-[#bef264] text-white shadow-lg shadow-[#bef264]/15 -translate-y-0.5 scale-[1.02]"
                    : "bg-[#0c1415]/70 border-white/15 text-white/90 hover:bg-black/90 hover:border-white/35 hover:text-white hover:-translate-y-0.5"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#bef264]/20 border border-[#bef264]/40 text-[#bef264] flex items-center justify-center font-bold text-[10px] shadow-xs shrink-0">
                  {p.num}
                </span>
                <span className="font-semibold text-white/95">{p.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 font-mono hidden sm:inline">
                  {p.spec}
                </span>
              </Link>
            ))}
          </div>
        </div>
        {/* Left side (end in RTL): Action Buttons Stack */}
        <div dir="ltr" className="flex flex-col items-start gap-3 shrink-0 w-full sm:w-auto">
          <BioButton
            href="/explain"
            label="لخصلي الموقع"
            secondaryLabel="شني السالفة؟"
            variant="dark-glass"
            dir="ltr"
          />
          <BioButton
            href={profile ? "/publish" : "/login?redirect=/publish"}
            label={profile ? "SHARE DISCOVERY" : "SIGN IN & PUBLISH"}
            secondaryLabel={profile ? "وثّق اكتشافك الآن" : "تسجيل الدخول والنشر"}
            variant="primary"
            dir="ltr"
          />
        </div>
      </div>

      {/* 5. Center-Bottom Scroll Cue Button */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0c1415]/80 border border-white/15 hover:border-[#bef264]/60 hover:bg-black/90 text-[10px] font-mono tracking-wider text-white/80 hover:text-white transition-all shadow-md hover:-translate-y-0.5 cursor-pointer group"
        aria-label="الانتقال للمنظومة المتكاملة"
      >
        <span>اكتشف المنظومة</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#bef264] transition-transform group-hover:translate-y-0.5 animate-[bounce_2s_infinite]" />
      </button>
    </section>
  );
}
