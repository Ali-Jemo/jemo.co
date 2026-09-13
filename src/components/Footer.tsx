"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { GithubIcon, TelegramIcon, XIcon } from "@/components/Icons";

const FOOTER_COLUMNS = [
  {
    title: "الأبحاث",
    links: [
      { label: "السجلات", href: "/research" },
      { label: "التسلسل", href: "/timeline" },
      { label: "المختبرات", href: "/labs" },
      { label: "انشر بحثك", href: "/publish" },
    ],
  },
  {
    title: "المؤسسة",
    links: [
      { label: "من نحن", href: "/about" },
      { label: "المبادرات", href: "/initiatives" },
      { label: "تواصل معنا", href: "/contact" },
      { label: "الأسئلة الشائعة", href: "/faq" },
    ],
  },
  {
    title: "التوثيق",
    links: [
      { label: "المعايير", href: "/benchmarks" },
      { label: "نشرة الشركة", href: "/newsletter" },
      { label: "الشروط", href: "/terms" },
      { label: "الخصوصية", href: "/privacy" },
    ],
  },
];

const SOCIAL_LINKS = [
  { href: "https://t.me/alijemo", label: "Telegram", Icon: TelegramIcon },
  { href: "https://x.com/jemolabs", label: "X", Icon: XIcon },
  { href: "https://github.com/Ali-Jemo", label: "GitHub", Icon: GithubIcon },
];

// ponytail: staggered per-letter slide-up reveal with snappy bezier; no heavy animation library needed
const WORDMARK_LETTERS = "jemo.co".split("");

const wordmarkContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const wordmarkLetterVariants = {
  hidden: {
    y: "110%",
    opacity: 0,
    transition: { duration: 0.15 },
  },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export default function Footer() {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  // ponytail: lightweight mouse spotlight without canvas/rAF loop; add rAF when high-framerate pointer lag occurs
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wordmarkRef.current) return;
    const rect = wordmarkRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <footer className="relative w-full border-t border-[var(--line)] bg-[var(--bg)] pt-12 sm:pt-16 pb-20 md:pb-8 mt-auto overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Section: Brand Statement & Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pb-12 sm:pb-16">
          <div className="md:col-span-6 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <Image
                src="/jemo-logo.svg"
                alt="JEMO LABS"
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
                width={36}
                height={36}
              />
              <div className="flex items-baseline gap-1 font-mono">
                <span className="font-black text-xl tracking-tight text-[var(--ink)]">jemo</span>
                <span className="font-bold text-xl tracking-tight text-[var(--ink-2)]">labs</span>
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse ms-1" />
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[var(--ink-2)] max-w-md leading-relaxed">
              سجل مفتوح لتوثيق وتدقيق أبحاث واكتشافات الذكاء الاصطناعي — نحو بنية معرفية سيادية قابلة للتكرار والتحقق.
            </p>

            <div className="flex items-center gap-2 pt-1">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 rounded-lg text-[var(--ink-2)]/70 hover:text-[var(--ink)] hover:bg-black/[0.04] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-6 grid grid-cols-3 gap-6 text-sm">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <span className="font-bold text-xs sm:text-sm text-[var(--ink)] font-mono">
                  {col.title}
                </span>
                <ul className="flex flex-col gap-2.5 text-xs">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Monumental Wordmark with Curtain Reveal & Interactive Neon Spotlight */}
        <div className="@container relative border-t border-[var(--line)]/70 pt-6 sm:pt-8 overflow-hidden select-none">
          <motion.div
            ref={wordmarkRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setMousePos(null);
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            title="اضغط للعودة إلى أعلى الصفحة ↑"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={wordmarkContainerVariants}
            className="relative w-full text-center overflow-hidden cursor-pointer group py-2"
          >
            {/* Subtle glow backdrop tracking cursor on hover */}
            {isHovered && mousePos && (
              <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100"
                style={{
                  background: `radial-gradient(circle 380px at ${mousePos.x}px ${mousePos.y}px, rgba(167, 226, 110, 0.18), transparent 70%)`,
                }}
              />
            )}

            <h2 className="text-[clamp(2.5rem,14.5vw,14rem)] @[640px]:text-[clamp(3.5rem,21.5cqw,16.5rem)] leading-[0.85] font-black font-mono tracking-[-0.04em] group-hover:tracking-[-0.02em] transition-[letter-spacing,color] duration-300 select-none text-[var(--ink)]/25 group-hover:text-[var(--ink)]/45 py-2 inline-flex justify-center max-w-full mix-blend-multiply">
              {WORDMARK_LETTERS.map((char, idx) => (
                <motion.span
                  key={idx}
                  variants={wordmarkLetterVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </h2>
          </motion.div>
        </div>

        {/* Bottom Bar: Monospace Status, Copyright & Legal Links */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 text-[11px] sm:text-xs text-[var(--ink-2)]/80 font-mono border-t border-[var(--line)]/50 gap-4">
          <p>© 2026 علي حسين هادي (Jemo) — JEMO LABS</p>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <Link href="/privacy" className="hover:text-[var(--ink)] transition-colors">
              سياسة الخصوصية
            </Link>
            <span className="opacity-30">·</span>
            <Link href="/terms" className="hover:text-[var(--ink)] transition-colors">
              الشروط والأحكام
            </Link>
            <span className="opacity-30">·</span>
            <span className="text-emerald-600/90">[LATENCY: OPTIMAL]</span>
            <span className="opacity-30">·</span>
            <span className="text-emerald-600/90">[NODES: ONLINE]</span>
          </div>
        </div>

        {/* Invisible Decoy Trap: Automated scraper & malicious crawler honeypot */}
        <a
          href="/api/security/honeypot-trap"
          aria-hidden="true"
          tabIndex={-1}
          rel="nofollow noindex"
          className="sr-only select-none pointer-events-none opacity-0 h-0 w-0 overflow-hidden inline-block"
        >
          Security Telemetry Beacon
        </a>
      </div>
    </footer>
  );
}