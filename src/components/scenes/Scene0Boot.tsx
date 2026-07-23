"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const SUBTITLE_TEXT = "منذ ٥٠٠٠ سنة... والسطر لم ينتهِ";

export default function Scene0Boot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const starBoxRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<SVGSVGElement>(null);
  const textCharsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const starPaths = starRef.current?.querySelectorAll("path");

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Star entrance animation (scale + rotate + stroke draw)
      if (starBoxRef.current) {
        tl.fromTo(
          starBoxRef.current,
          { scale: 0.4, rotation: -90, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 1.6, ease: "back.out(1.4)" }
        );
      }

      if (starPaths) {
        tl.fromTo(
          starPaths,
          { strokeDasharray: 400, strokeDashoffset: 400, opacity: 0 },
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 1.8,
            stagger: 0.25,
            ease: "power2.inOut",
          },
          "-=1.2"
        );
      }

      // Typewriter reveal for character spans
      if (textCharsRef.current) {
        const chars = textCharsRef.current.querySelectorAll(".char-item");
        tl.fromTo(
          chars,
          { opacity: 0, y: 10, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            stagger: 0.04,
            ease: "power1.out",
          },
          "-=0.8"
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden select-none"
      style={{ background: "var(--clay-900)" }}
    >
      {/* Background grain and ambient particle dust */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
           backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Floating Sumerian cuneiform ambient symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <span className="absolute top-1/4 left-1/6 text-4xl text-[var(--gold)] font-mono animate-pulse">
          𐎀
        </span>
        <span className="absolute bottom-1/4 right-1/6 text-5xl text-[var(--gold)] font-mono animate-pulse" style={{ animationDelay: "1s" }}>
          𐎁
        </span>
        <span className="absolute top-1/3 right-1/4 text-3xl text-[var(--gold)] font-mono animate-pulse" style={{ animationDelay: "2s" }}>
          𐎃
        </span>
      </div>

      {/* Sumerian Anu 8-pointed star & Text Container */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div ref={starBoxRef} className="relative">
          {/* Radial gold glow halo */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-50 animate-pulse"
            style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
          />

          <svg
            ref={starRef}
            width="140"
            height="140"
            viewBox="0 0 120 120"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1.5"
             className="relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          >
            {/* Outer square */}
            <path d="M 20 20 L 100 20 L 100 100 L 20 100 Z" />
            {/* Rotated 45deg inner square */}
            <path d="M 60 6 L 114 60 L 60 114 L 6 60 Z" />
            {/* Center cross rays */}
            <path d="M 60 20 L 60 100 M 20 60 L 100 60" strokeDasharray="4 4" opacity="0.6" />
            {/* Inner diamond ring */}
            <circle cx="60" cy="60" r="14" stroke="var(--gold)" strokeDasharray="2 2" opacity="0.8" />
            {/* Center point */}
            <circle cx="60" cy="60" r="3" fill="var(--gold)" />
          </svg>
        </div>

        {/* Character-by-character typed Arabic subtitle */}
        <div
          ref={textCharsRef}
          className="text-lg md:text-2xl font-kufi tracking-wide text-center px-4 flex flex-row-reverse items-center justify-center gap-[1px]"
           style={{ color: "var(--light-warm)", textShadow: "0 0 16px rgba(255, 255, 255, 0.3)" }}
        >
          {SUBTITLE_TEXT.split("").map((char, i) => (
            <span
              key={i}
              className="char-item inline-block"
              style={{ whiteSpace: char === " " ? "pre" : "normal" }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Scroll indicator prompt */}
        <div className="mt-6 flex flex-col items-center gap-2 opacity-60 animate-bounce">
          <span className="text-[10px] font-mono text-[var(--gold)] tracking-widest uppercase">
            SCROLL TO BEGIN
          </span>
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[var(--gold)] to-transparent" />
        </div>
      </div>
    </div>
  );
}
