"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";

// ponytail: single client component, all animation self-contained, no extra deps

const ease = [0.22, 1, 0.36, 1] as const;

const paragraphs = [
  "بعد أكثر من عقدين في عالم التكنولوجيا والبحث العلمي، أدركنا أن المعرفة العربية المفتوحة ليست مجرد حاجة أكاديمية — بل ضرورة سيادية. لاحظنا أن الباحث العربي يمر بأربع منصات مختلفة قبل أن يجد ما يحتاجه، وهذا كان غير مقبول. أردنا بناء حل أفضل.",
  "في عام ٢٠٢٦، أطلقنا JEMO LABS بهدف جعل البحث العلمي العربي المفتوح أسهل وأكثر متعة لباحثينا. منصتنا تجمع بين الأبحاث السيادية في الذكاء الاصطناعي وأنظمة التشغيل والرؤية الحاسوبية، مع إتاحة كل شيء مجاناً للعموم عبر ١٨٠ دولة. النتيجة: معرفة مفتوحة بلا قيود.",
  "نسعى باستمرار لجعل JEMO LABS أفضل، وندعوكم للانضمام إلى نشرتنا لمتابعة آخر التطورات. نفخر بما بنيناه ونتطلع لقيادة المستقبل العلمي العربي.",
];

const stats = [
  { value: "٦", label: "مختبرات بحثية", suffix: "" },
  { value: "٢٠", label: "سنة خبرة", suffix: "+" },
  { value: "١٨٠", label: "دولة", suffix: "" },
  { value: "١٠٠", label: "مفتوح المصدر", suffix: "%" },
];

const quoteWords = "نؤمن أن المعرفة يجب أن تكون مفتوحة، وأن العراق قادر على إنتاج العلم لا استهلاكه فقط.".split(" ");

const marqueeText = "بيت الحكمة الرقمي · JEMO LABS · البحث العلمي المفتوح · السيادة الرقمية · الذكاء الاصطناعي · أنظمة التشغيل · الرؤية الحاسوبية · ";

/* ── Scroll-driven paragraph — text brightens as it enters viewport ── */
function ScrollParagraph({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.4"],
  });
  const brightness = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  const textOpacity = useSpring(brightness, { stiffness: 100, damping: 20 });

  return (
    <motion.p
      ref={ref}
      className="text-[#a1a1aa] relative"
      style={{ opacity: textOpacity }}
      initial={{ y: 28, filter: "blur(8px)" }}
      animate={
        inView
          ? { y: 0, filter: "blur(0px)" }
          : { y: 28, filter: "blur(8px)" }
      }
      transition={{ duration: 0.9, delay: index * 0.15, ease }}
    >
      {text}
    </motion.p>
  );
}

/* ── Animated stat counter ── */
function AnimatedStat({
  value,
  label,
  suffix,
  index,
}: {
  value: string;
  label: string;
  suffix: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      className="text-center relative group"
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 24, scale: 0.9 }
      }
      transition={{ duration: 0.6, delay: 0.1 + index * 0.12, ease }}
    >
      {/* Hover glow behind stat */}
      <div className="absolute inset-0 rounded-xl bg-[var(--accent)]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -m-3" />
      <div className="relative">
        <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tabular-nums leading-none mb-2">
          {value}
          {suffix && (
            <span className="text-[var(--accent)] text-xl sm:text-2xl">
              {suffix}
            </span>
          )}
        </div>
        <div className="text-xs sm:text-sm text-[#52525b] font-mono group-hover:text-[#71717a] transition-colors">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Constellation dots — deterministic to avoid hydration mismatch ── */
function seeded(i: number) {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
const dots = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: `${5 + seeded(i * 3) * 90}%`,
  y: `${5 + seeded(i * 3 + 1) * 90}%`,
  size: 1 + seeded(i * 3 + 2) * 2.5,
  delay: seeded(i * 5) * 5,
  duration: 3 + seeded(i * 7) * 5,
}));

/* ── Magnetic avatar with hover tilt ── */
function MagneticAvatar() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(springY, [-20, 20], [8, -8]);
  const rotateY = useTransform(springX, [-20, 20], [-8, 8]);

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * 0.15);
      y.set((e.clientY - cy) * 0.15);
    },
    [x, y]
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className="relative cursor-pointer"
      style={{
        x: springX,
        y: springY,
        rotateX,
        rotateY,
        transformPerspective: 600,
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease }}
    >
      {/* Outer glow pulse */}
      <motion.div
        className="absolute -inset-10 rounded-full transform-gpu"
        style={{
          background:
            "radial-gradient(circle, rgba(167,226,110,0.08) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.15, 0.5],
        }}
        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
      />
      {/* Rotating conic ring */}
      <motion.div
        className="absolute -inset-4 rounded-full transform-gpu"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, rgba(167,226,110,0.3) 12%, transparent 25%, rgba(167,226,110,0.1) 45%, transparent 58%, rgba(167,226,110,0.2) 78%, transparent 100%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, ease: "linear", repeat: Infinity }}
      />
      {/* Second counter-rotating ring */}
      <motion.div
        className="absolute -inset-6 rounded-full transform-gpu opacity-40"
        style={{
          background:
            "conic-gradient(from 180deg, transparent 0%, rgba(167,226,110,0.1) 20%, transparent 40%, rgba(167,226,110,0.05) 60%, transparent 80%)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, ease: "linear", repeat: Infinity }}
      />
      {/* Pulsing border ring */}
      <motion.div
        className="absolute -inset-4 rounded-full border border-[var(--accent)]/15 transform-gpu"
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.4, 0.08, 0.4],
        }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
      />
      {/* Avatar circle */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-[#131316] to-[#1e1e24] border border-[#2a2a30] flex items-center justify-center text-4xl sm:text-5xl font-bold text-white/90 font-mono shadow-2xl shadow-black/50 overflow-hidden">
        ع.ج
        {/* Inner shimmer on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700" />
      </div>
    </motion.div>
  );
}

/* ── Word-by-word quote reveal ── */
function QuoteReveal() {
  const ref = useRef<HTMLQuoteElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <blockquote
      ref={ref}
      className="relative text-center text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed px-6 sm:px-12"
      dir="rtl"
    >
      {quoteWords.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mx-[0.15em]"
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 12, filter: "blur(4px)" }
          }
          transition={{
            duration: 0.5,
            delay: 0.1 + i * 0.06,
            ease,
          }}
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          {word}
        </motion.span>
      ))}
    </blockquote>
  );
}

export default function WeAreSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const quoteBlockRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });
  const quoteBlockInView = useInView(quoteBlockRef, {
    once: true,
    margin: "-60px",
  });

  // Mouse spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [mouseInSection, setMouseInSection] = useState(false);
  const spotlightBg = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(167,226,110,0.04), transparent 60%)`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  // Parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const glowY = useSpring(useTransform(scrollYProgress, [0, 1], [120, -120]), {
    stiffness: 60,
    damping: 25,
  });
  const glowScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.6, 1.3, 0.8]
  );
  const bgOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0, 1, 1, 0]
  );
  const quoteY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "#08080b" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setMouseInSection(true)}
      onMouseLeave={() => setMouseInSection(false)}
    >
      {/* ── Mouse-tracking spotlight ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none transform-gpu z-[1] transition-opacity duration-500"
        style={{
          background: spotlightBg,
          opacity: mouseInSection ? 1 : 0,
        }}
      />

      {/* ── Constellation dots ── */}
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-white/20 pointer-events-none transform-gpu"
          style={{
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0.5, 1.3, 0.5],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Ambient glow orbs ── */}
      <motion.div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none transform-gpu"
        style={{
          y: glowY,
          scale: glowScale,
          opacity: bgOpacity,
          background:
            "radial-gradient(circle, rgba(167,226,110,0.07) 0%, rgba(167,226,110,0.02) 35%, transparent 65%)",
        }}
      />
      <motion.div
        className="absolute -left-40 top-1/2 w-[500px] h-[500px] rounded-full pointer-events-none transform-gpu"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [60, -100]),
          opacity: useTransform(
            scrollYProgress,
            [0, 0.3, 0.7, 1],
            [0, 0.4, 0.4, 0]
          ),
          background:
            "radial-gradient(circle, rgba(34,47,48,0.4) 0%, transparent 65%)",
        }}
      />
      <motion.div
        className="absolute -right-20 top-1/4 w-[300px] h-[300px] rounded-full pointer-events-none transform-gpu"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [-30, 80]),
          opacity: useTransform(
            scrollYProgress,
            [0, 0.4, 0.8, 1],
            [0, 0.3, 0.3, 0]
          ),
          background:
            "radial-gradient(circle, rgba(167,226,110,0.04) 0%, transparent 60%)",
        }}
      />

      {/* ── Grain overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* ── Top gradient edge ── */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[var(--bg)] to-transparent z-10 pointer-events-none" />

      <div className="container relative z-10 py-28 sm:py-36 md:py-44">
        {/* ── Quote block — word-by-word reveal ── */}
        <div ref={quoteBlockRef} className="max-w-4xl mx-auto mb-20 relative">
          {/* Giant quotation marks with parallax */}
          <motion.div
            className="absolute -top-8 right-0 sm:-right-4 text-[120px] sm:text-[180px] leading-none font-serif select-none pointer-events-none transform-gpu"
            style={{ y: quoteY, color: "rgba(167,226,110,0.06)" }}
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={
              quoteBlockInView
                ? { opacity: 1, scale: 1, rotate: 0 }
                : { opacity: 0, scale: 0.5, rotate: -10 }
            }
            transition={{ duration: 1.2, ease }}
          >
            &ldquo;
          </motion.div>

          <QuoteReveal />

          <motion.div
            className="absolute -bottom-4 left-0 sm:-left-4 text-[120px] sm:text-[180px] leading-none font-serif select-none pointer-events-none rotate-180 transform-gpu"
            style={{
              y: useTransform(scrollYProgress, [0, 1], [-20, 20]),
              color: "rgba(167,226,110,0.06)",
            }}
            initial={{ opacity: 0, scale: 0.5, rotate: 190 }}
            animate={
              quoteBlockInView
                ? { opacity: 1, scale: 1, rotate: 180 }
                : { opacity: 0, scale: 0.5, rotate: 190 }
            }
            transition={{ duration: 1.2, delay: 0.2, ease }}
          >
            &ldquo;
          </motion.div>
        </div>

        {/* ── Decorative divider ── */}
        <motion.div
          className="flex items-center gap-4 max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <motion.div
            className="flex-1 h-px bg-gradient-to-r from-transparent to-[#27272a]"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-[var(--accent)]/30"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5, ease }}
          />
          <motion.div
            className="flex-1 h-px bg-gradient-to-l from-transparent to-[#27272a]"
            initial={{ scaleX: 0, originX: 1 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
          />
        </motion.div>

        {/* ── Magnetic Avatar ── */}
        <div className="flex justify-center mb-12">
          <MagneticAvatar />
        </div>

        {/* ── "We are" label ── */}
        <motion.p
          className="text-center text-sm font-mono text-[var(--accent)] mb-5 tracking-[0.2em] uppercase"
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease }}
        >
          نحن
        </motion.p>

        {/* ── Heading — staggered text reveal ── */}
        <div ref={headingRef} className="text-center mb-3">
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.15]"
              initial={{ y: "115%", opacity: 0 }}
              animate={
                headingInView
                  ? { y: 0, opacity: 1 }
                  : { y: "115%", opacity: 0 }
              }
              transition={{ duration: 1, ease }}
            >
              د. علي الجمو،
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.15]"
              style={{
                background:
                  "linear-gradient(135deg, #52525b 0%, #a1a1aa 40%, #71717a 70%, #a1a1aa 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              initial={{ y: "115%", opacity: 0 }}
              animate={
                headingInView
                  ? {
                      y: 0,
                      opacity: 1,
                      backgroundPosition: ["0% 50%", "100% 50%"],
                    }
                  : { y: "115%", opacity: 0 }
              }
              transition={{
                y: { duration: 1, delay: 0.12, ease },
                opacity: { duration: 1, delay: 0.12, ease },
                backgroundPosition: {
                  duration: 4,
                  delay: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                },
              }}
            >
              مؤسس JEMO LABS
            </motion.span>
          </span>
        </div>

        {/* ── Badge ── */}
        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
        >
          <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[var(--accent)]/[0.08] border border-[var(--accent)]/15 text-[var(--accent)] text-xs font-mono backdrop-blur-sm">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            بيت الحكمة الرقمي
          </span>
        </motion.div>

        {/* ── Stats strip ── */}
        <motion.div
          className="max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-y border-[#1a1a1f]">
            {stats.map((stat, i) => (
              <AnimatedStat key={stat.label} {...stat} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── Story paragraphs — scroll-driven brightness ── */}
        <div className="max-w-3xl mx-auto space-y-7 text-base sm:text-lg leading-[1.9]">
          {paragraphs.map((text, i) => (
            <ScrollParagraph key={i} text={text} index={i} />
          ))}

          {/* ── Sign-off ── */}
          <motion.div
            className="pt-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          >
            <p className="text-white font-bold text-lg sm:text-xl mb-6">
              شكراً، ونتطلع لخدمتكم.
            </p>
            <div className="flex items-center gap-4">
              <motion.div
                className="h-px bg-gradient-to-r from-[var(--accent)]/50 to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease }}
              />
              <motion.span
                className="text-sm font-mono text-[#52525b]"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6, ease }}
              >
                — د. علي الجمو، ٢٠٢٦
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Infinite marquee band ── */}
      <div className="relative z-10 border-t border-[#141418] overflow-hidden">
        <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="text-[11px] font-mono text-[#27272a] tracking-[0.15em] uppercase py-3 px-4 shrink-0"
            >
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom gradient fade ── */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
