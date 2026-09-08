"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ChevronDown } from "lucide-react";
import BioButton from "@/components/BioButton";

const PILLARS_PREVIEW = [
  { 
    id: "ai", 
    num: "01", 
    name: "الذكاء الاصطناعي والحوسبة", 
    spec: "AI • Systems • Data", 
    field: "نماذج عربية وأنظمة مفتوحة", 
    desc: "أبحاث الذكاء الاصطناعي، النماذج اللغوية العربية، نواة Ziqa، والحوسبة الفائقة — بنية معرفية رقمية مفتوحة.",
    href: "/research" 
  },
  { 
    id: "islamic", 
    num: "02", 
    name: "العلوم الشرعية والتراث", 
    spec: "Islamic • Heritage", 
    field: "فقه • لغة • مخطوطات", 
    desc: "العلوم الشرعية، الدراسات القرآنية والحديثية، الفقه والأصول، اللغة العربية، وتحقيق التراث والمخطوطات.",
    href: "/initiatives" 
  },
  { 
    id: "natural", 
    num: "03", 
    name: "العلوم الطبيعية والكونية", 
    spec: "Physics • Bio • Med", 
    field: "فيزياء • طب • فلك", 
    desc: "الفيزياء والكيمياء والرياضيات، علوم الحياة والطب، الفلك والبيئة، والعلوم الإنسانية والاجتماعية.",
    href: "/labs" 
  },
];

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePillar, setActivePillar] = useState<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscNodesRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null>(null);

  // Mouse Parallax for subtle 3D cinematic depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 16;
    const y = (e.clientY / innerHeight - 0.5) * 16;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Ambient Web Audio Synthesizer (harmonic ambient chime)
  const toggleAudio = () => {
    if (isPlayingAudio) {
      if (oscNodesRef.current) {
        oscNodesRef.current.gain.gain.setTargetAtTime(0, audioCtxRef.current!.currentTime, 0.3);
        setTimeout(() => {
          oscNodesRef.current?.osc1.stop();
          oscNodesRef.current?.osc2.stop();
          oscNodesRef.current = null;
        }, 400);
      }
      setIsPlayingAudio(false);
    } else {
      try {
        const ctx = audioCtxRef.current ?? new window.AudioContext();
        audioCtxRef.current = ctx;

        if (ctx.state === "suspended") ctx.resume();

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(108, ctx.currentTime); // Deep A2 harmonic

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(216, ctx.currentTime); // Octave overtone

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 1.2);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        oscNodesRef.current = { osc1, osc2, gain };
        setIsPlayingAudio(true);
      } catch {
        setIsPlayingAudio(false);
      }
    }
  };

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
      className="relative w-full min-h-[100dvh] lg:h-[100dvh] bg-[#0c1415] text-white overflow-hidden flex flex-col justify-between -mt-16 pt-20 pb-4"
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
            className="w-full h-full object-cover object-center opacity-90 scale-105 transition-opacity duration-1000"
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
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 pt-3 sm:pt-5 flex items-center justify-between flex-wrap gap-4">
        
        {/* Institutional Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-xs shadow-xs"
        >
          <span className="w-2 h-2 rounded-full bg-[#bef264] animate-pulse" aria-hidden />
          <span className="font-mono text-[11px] font-bold tracking-wider text-white/95 uppercase">
            ALL SCIENCES · OPEN KNOWLEDGE
          </span>
          <span className="h-3 w-px bg-white/20" aria-hidden />
          <span className="text-[11px] text-white/90 font-medium">
            مختبرات JEMO · لجميع العلوم
          </span>
        </motion.div>

        {/* Live Audio Stream Micro-Indicator with Web Audio Synthesizer */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-white/15 bg-black/35 backdrop-blur-md text-[11px] font-mono text-zinc-300"
        >
          <div className="flex items-center gap-1 h-3.5">
            {[0.35, 0.85, 0.5, 0.95, 0.6].map((h, i) => (
              <span
                key={i}
                style={{ height: `${h * 14}px` }}
                className={`w-0.5 rounded-full transition-all duration-300 ${
                  isPlayingAudio ? "bg-[#bef264] animate-pulse" : "bg-zinc-500"
                }`}
              />
            ))}
          </div>
          <span>Baghdad-Voice STT · 24kHz</span>
          <button
            onClick={toggleAudio}
            className="hover:text-white transition-colors p-0.5"
            aria-label={isPlayingAudio ? "كتم الصوت التوليدي" : "تشغيل الصوت التوليدي"}
            title={isPlayingAudio ? "إيقاف الصوت التوليدي" : "تشغيل التردد الصوتي السيادي"}
          >
            {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 text-[#bef264]" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-400" />}
          </button>
        </motion.div>

      </div>

      {/* 3. Center: Massive Monumental Display Headline with Line-Mask Entrance */}
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 my-auto py-2 sm:py-4">
        <h1 
          style={{ color: "#ffffff" }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-medium leading-[1.04] tracking-tight max-w-6xl font-kufi text-white select-none [text-shadow:0_4px_35px_rgba(0,0,0,0.7)]"
        >
          <span className="block overflow-hidden pb-1.5 -mb-1.5">
            <motion.span
              initial={{ y: "115%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              هندسة المعرفة
            </motion.span>
          </span>

          <span className="block overflow-hidden pb-1.5 -mb-1.5">
            <motion.span
              initial={{ y: "115%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              لجميع العلوم<span className="text-[#bef264]">.</span>
            </motion.span>
          </span>
        </h1>
      </div>

      {/* 4. Bottom Row: Subtitle + Pillars Quick-Switcher + Split-Pill Action Button */}
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 pb-8 sm:pb-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
        
        {/* Right side (start in RTL): Subtitle + 3 Research Pillars Navigation Pills */}
        <div className="flex flex-col gap-3.5 max-w-xl relative">
          {/* Floating Hover Preview Card */}
          <AnimatePresence>
            {activePillar !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="p-4 rounded-2xl bg-black/85 border border-white/20 backdrop-blur-xl shadow-2xl flex flex-col gap-2 max-w-md"
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
            className="text-base sm:text-lg leading-relaxed font-normal [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]"
          >
            مؤسسة علمية مستقلة لجميع العلوم — من <strong className="text-white font-bold underline decoration-[#bef264]/70 decoration-2 underline-offset-4">العلوم الشرعية والإسلامية</strong> إلى <strong className="text-white font-bold underline decoration-[#bef264]/70 decoration-2 underline-offset-4">الذكاء الاصطناعي</strong> والعلوم الطبيعية والطبية والإنسانية — من <strong className="text-white font-bold underline decoration-[#bef264]/70 decoration-2 underline-offset-4">بغداد</strong> إلى العالم.
          </p>

          {/* 3 Quick Research Pillars Switchers */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {PILLARS_PREVIEW.map((p, idx) => (
              <Link
                key={p.id}
                href={p.href}
                onMouseEnter={() => setActivePillar(idx)}
                onMouseLeave={() => setActivePillar(null)}
                className={`group px-3.5 py-2 rounded-full border text-xs font-mono transition-all duration-200 flex items-center gap-2.5 backdrop-blur-md shadow-xs ${
                  activePillar === idx
                    ? "bg-black/75 border-[#bef264] text-white shadow-lg shadow-[#bef264]/15 -translate-y-0.5 scale-[1.02]"
                    : "bg-black/40 border-white/15 text-white/90 hover:bg-black/60 hover:border-white/35 hover:text-white hover:-translate-y-0.5"
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
        {/* Left side (end in RTL): The Iconic IntegratedBio Chamfered BioButtons (Image #2) */}
        <div className="flex flex-wrap items-center gap-3.5 shrink-0">
          <BioButton
            href="/research"
            label="EXPLORE PLATFORM"
            secondaryLabel="استكشف المنظومة"
            variant="primary"
            dir="ltr"
          />
          <BioButton
            href="/labs"
            label="WHAT WE DO"
            secondaryLabel="المختبرات والأنظمة"
            variant="secondary"
            iconType="arrow-up-right"
            dir="ltr"
          />
        </div>
      </div>

      {/* 5. Center-Bottom Scroll Cue Button */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/15 hover:border-[#bef264]/60 hover:bg-black/60 text-[10px] font-mono tracking-wider text-white/80 hover:text-white transition-all shadow-md backdrop-blur-md hover:-translate-y-0.5 cursor-pointer group"
        aria-label="الانتقال للمنظومة المتكاملة"
      >
        <span>اكتشف المنظومة</span>
        <motion.div
          animate={{ y: [0, 3, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-[#bef264] transition-transform group-hover:translate-y-0.5" />
        </motion.div>
      </button>
    </section>
  );
}
