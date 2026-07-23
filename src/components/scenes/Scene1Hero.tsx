"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowLeft, Send } from "lucide-react";
import Button from "@/components/ui/Button";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const ClayBackground = dynamic(
  () => import("@/components/canvas/ClayBackground"),
  { ssr: false }
);

export default function Scene1Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current.children,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-screen relative flex items-center justify-center overflow-hidden"
    >
      <ClayBackground />

      {/* Hero Lamassu Image */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <Image
          src="/hero-image.png"
          alt="Jemo Labs Lamassu"
          fill
          priority
          className="object-cover object-right opacity-40 md:opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/40 to-black" />
      </div>
      <div className="container relative z-10 max-w-4xl px-6 text-center">
        <div ref={titleRef} className="flex flex-col items-center gap-6">
          {/* Metadata */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--gold-dim)] bg-black/40 text-[var(--gold)] text-xs font-mono">
            <span>est. 762 — present</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
          </div>

          {/* Cuneiform JEMO LABS Heading */}
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-bold font-kufi tracking-tight text-white">
              <span className="text-gradient">JEMO</span>{" "}
              <span className="font-mono text-white/90">LABS</span>
            </h1>
            {/* Cuneiform wedge decoration lines */}
            <svg
              className="w-48 h-4 mx-auto mt-2"
              viewBox="0 0 200 16"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1.5"
            >
              <path d="M 0 8 L 80 8 M 120 8 L 200 8" strokeDasharray="4 4" />
              <polygon points="100,2 108,14 92,14" fill="var(--gold)" />
            </svg>
          </div>

          {/* Arabic Subtitle */}
          <p className="text-lg md:text-2xl font-kufi text-[var(--light-warm)] max-w-2xl leading-relaxed">
            من أرضِ كُتب فيها أول سطر، نكتب السطر التالي.
          </p>

          <p className="text-sm md:text-base text-white/70 max-w-xl">
            منظومة بحثية وتقنية يمارس فيها الشباب حرية الابتكار، لبناء الأبحاث العلمية، المنصات البرمجية، والهويات الرقمية.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Button href="/apply" variant="primary" glow icon={<Send size={16} />}>
              أختم الميثاق
            </Button>
            <Button href="#wisdom" variant="outline" icon={<ArrowLeft size={16} />}>
              ادخل بيت الحكمة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
