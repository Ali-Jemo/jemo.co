"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpLeft, Cpu } from "lucide-react";
import EditorialSectionHeader from "@/components/EditorialSectionHeader";

/**
 * Shared by the homepage and /about. The numbered editorial header is opt-in via
 * `sectionNum` so the homepage can slot this into its 01–10 spine without
 * imposing ordinals on other pages.
 */
export default function BioLeadershipGrid({ sectionNum }: { sectionNum?: string } = {}) {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <section
      dir="rtl"
      className="c-topology-canvas py-12 sm:py-20 lg:py-24 bg-[#f7f7f5] text-[#222f30] border-b border-[#e4e3e3] relative overflow-hidden select-none"
      aria-label="المخطط العُقدي التفاعلي لفريق المبادرة"
    >
      {/* 0. Ambient Topographic Wave Field & Subtle Circuit Grid Canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-35 overflow-hidden">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradBio" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c9cbbe" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#a7e26e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#222f30" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M -100 200 C 300 120, 600 320, 1100 180 C 1300 120, 1500 240, 1600 200"
            fill="none"
            stroke="url(#waveGradBio)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />
          <path
            d="M -100 280 C 250 200, 700 420, 1150 260 C 1350 200, 1500 320, 1600 280"
            fill="none"
            stroke="url(#waveGradBio)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          <path
            d="M -100 380 C 350 300, 800 500, 1200 340 C 1400 280, 1550 400, 1650 360"
            fill="none"
            stroke="url(#waveGradBio)"
            strokeWidth="0.8"
            strokeDasharray="2 4"
          />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 relative z-10">
        {sectionNum && (
          <EditorialSectionHeader
            num={sectionNum}
            kickerAr="القيادة العلمية"
            kickerEn="SCIENTIFIC LEADERSHIP"
            title="باحثون ومهندسون"
            titleAccent="يقودون المختبرات والبنية التجريبية."
          />
        )}

        {/* Main Spatial Layout: 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative">
          
          {/* =========================================================
              LEFT AREA (Col 1 to 8 in RTL = The 4 Interconnected Nodes)
             ========================================================= */}
          <div className="lg:col-span-8 flex flex-col gap-6 relative">
            
            {/* SVG Connecting Bézier Overlay for Desktop Canvas (Jemo Theme: Slate to Bio-Lime) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block z-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Circuit from Right Hub to Node 1 (Ali Jemo) */}
              <path
                d="M 98% 180 C 85% 180, 75% 90, 60% 90"
                fill="none"
                stroke={activeNode === "ali" ? "#a7e26e" : "#c9cbbe"}
                strokeWidth={activeNode === "ali" ? "2.2" : "1.2"}
                strokeDasharray={activeNode === "ali" ? "none" : "3 4"}
                className="transition-all duration-300"
              />
              {/* Circuit from Hub to Node 2 (Ahmed Furati) */}
              <path
                d="M 98% 280 C 70% 280, 50% 290, 38% 300"
                fill="none"
                stroke={activeNode === "ahmed" ? "#a7e26e" : "#c9cbbe"}
                strokeWidth={activeNode === "ahmed" ? "2.2" : "1.2"}
                strokeDasharray={activeNode === "ahmed" ? "none" : "3 4"}
                className="transition-all duration-300"
              />
              {/* Circuit from Hub to Node 3 (Haider Baghdadi) */}
              <path
                d="M 98% 360 C 80% 360, 65% 520, 55% 540"
                fill="none"
                stroke={activeNode === "haider" ? "#a7e26e" : "#c9cbbe"}
                strokeWidth={activeNode === "haider" ? "2.2" : "1.2"}
                strokeDasharray={activeNode === "haider" ? "none" : "3 4"}
                className="transition-all duration-300"
              />
              {/* Circuit from Node 3 to Node 4 (Sara Hussaini) */}
              <path
                d="M 45% 620 C 35% 620, 25% 680, 15% 680"
                fill="none"
                stroke={activeNode === "sara" ? "#a7e26e" : "#c9cbbe"}
                strokeWidth={activeNode === "sara" ? "2.2" : "1.2"}
                strokeDasharray={activeNode === "sara" ? "none" : "3 4"}
                className="transition-all duration-300"
              />

              {/* Glowing Interconnection Junction Nodes in Jemo Lime */}
              <circle cx="98%" cy="180" r="4.5" fill="#a7e26e" className="animate-pulse" />
              <circle cx="98%" cy="280" r="4.5" fill="#cef79e" />
              <circle cx="98%" cy="360" r="4.5" fill="#a7e26e" />
              <circle cx="55%" cy="540" r="4" fill="#a7e26e" />
              <circle cx="38%" cy="300" r="4" fill="#cef79e" />
            </svg>

            {/* -------------------------------------------------------------
                NODE 1: علي حسين هادي (Jemo) (Systems Engineer & Founder)
                ------------------------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onMouseEnter={() => setActiveNode("ali")}
              onMouseLeave={() => setActiveNode(null)}
              className={`relative z-10 p-5 sm:p-7 rounded-3xl bg-white border transition-all duration-300 shadow-sm hover:shadow-xl ${
                activeNode === "ali" ? "border-[#a7e26e] ring-2 ring-[#a7e26e]/25" : "border-[#e4e3e3]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                
                {/* Right side: Name, Role & Bio */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
                    <h3 className="text-xl sm:text-2xl font-bold text-[#222f30] font-kufi">
                      علي حسين هادي (Jemo)
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-[#728825] font-semibold">
                    مؤسس المنصة · مهندس أنظمة ومطور أنظمة تشغيل
                  </p>
                  <p className="text-xs sm:text-sm text-[#55696a] leading-relaxed max-w-lg">
                    مهندس أنظمة ومؤسس فريق Axiq ومشروع ZiqaKernel و Axiq-IQ. متخصص في لغات الأنظمة منخفضة المستوى (Rust / Zig / C)، وبناء البنى التحتية البرمجية والأنظمة السيادية المفتوحة.
                  </p>
                  <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#55696a]">
                    <span>8 مشاريع سيادية</span>
                    <span>·</span>
                    <Link
                      href="/researchers/ali-jemo"
                      className="inline-flex items-center gap-1 text-[#222f30] font-bold hover:text-[#728825] transition-colors"
                    >
                      <span>الملف التوثيقي</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </Link>
                    <span>·</span>
                    <a
                      href="https://ali.lxds.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#728825] font-bold hover:underline transition-colors"
                    >
                      <span>ali.lxds.org</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Center / Left: Avatar with Circular HUD Telemetry Radar */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-[#162021] border border-[#e4e3e3] shadow-md flex items-center justify-center overflow-hidden group/hud">
                    {/* Rotating HUD Radar Ring in Jemo Lime */}
                    <div className="absolute inset-0.5 rounded-xl border border-dashed border-[#a7e26e]/45 animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-2 rounded-lg border border-[#cef79e]/20" />
                    
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden">
                      <Image
                        src="/team/ali.jpg"
                        alt="علي حسين هادي (Jemo)"
                        fill
                        sizes="96px"
                        className="object-cover transition-transform duration-500 group-hover/hud:scale-105"
                      />
                    </div>
                  </div>

                  {/* ORCID Verified + Metrics in Site Theme */}
                  <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] font-mono text-center min-w-[84px]">
                    <span className="px-2 py-0.5 rounded-full bg-white border border-[#e4e3e3] text-[9px] font-bold text-[#222f30] uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e]" />
                      <span>FOUNDER</span>
                    </span>
                    <div className="flex items-center justify-center gap-3 pt-1 text-xs">
                      <div>
                        <span className="font-bold text-[#222f30] block">8</span>
                        <span className="text-[10px] text-[#738284]">أوراق</span>
                      </div>
                      <div className="w-px h-6 bg-[#e4e3e3]" />
                      <div>
                        <span className="font-bold text-[#222f30] block">8</span>
                        <span className="text-[10px] text-[#738284]">مشاريع</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* -------------------------------------------------------------
                ROW 2: TWO ASYMMETRIC NODES (Ahmed Furati & Haider Baghdadi)
                ------------------------------------------------------------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* NODE 2: م. أحمد الفراتي (Systems & Microkernel Console) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 }}
                onMouseEnter={() => setActiveNode("ahmed")}
                onMouseLeave={() => setActiveNode(null)}
                className={`relative z-10 p-5 sm:p-6 rounded-3xl bg-white border transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between ${
                  activeNode === "ahmed" ? "border-[#a7e26e] ring-2 ring-[#a7e26e]/25" : "border-[#e4e3e3]"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#e4e3e3] shrink-0">
                        <Image
                          src="/team/ahmed.jpg"
                          alt="م. أحمد الفراتي"
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-[#222f30] font-kufi">
                          م. أحمد الفراتي
                        </h4>
                        <p className="text-[11px] font-mono text-[#728825] font-semibold">
                          كبير مهندسي النوى ومختبر أنظمة التشغيل
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#55696a] leading-relaxed">
                    مهندس نظم متخصص في Rust والتصميم الآمن للمشغلات الميكروية وتطوير نواة Ziqa Kernel.
                  </p>

                  {/* Micro-Widget: Systems Console / Silicon Die Circuit Diagram */}
                  <div className="p-3 rounded-2xl bg-[#0c1415] text-white border border-[#222f30] space-y-2 font-mono">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#a7e26e]" />
                        <span className="text-[#a7e26e] font-bold">SYSTEMS CONSOLE</span>
                      </span>
                      <span className="text-zinc-500">CORE KERNEL</span>
                    </div>

                    {/* Stylized Chip Pinout Schematic */}
                    <div className="py-1.5 px-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[9px]">
                      <span className="text-zinc-400">BUS: 128-BIT</span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e] animate-pulse" />
                        <span className="text-[#bef264] font-bold">ZIQA_v0.9 // ONLINE</span>
                      </div>
                      <span className="text-zinc-400">RUST // NO_STD</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#f0f0ee] flex items-center justify-between text-xs font-mono text-[#55696a]">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span>5 أوراق</span>
                    <span>·</span>
                    <span>3 مشاريع</span>
                  </div>
                  <Link
                    href="/researchers/ahmed-al-furati"
                    className="inline-flex items-center gap-1 text-[#222f30] font-bold hover:text-[#728825] transition-colors"
                  >
                    <span>الملف</span>
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>

              {/* NODE 3: م. حيدر البغدادي (Kinematic Robotic Arm & Mechatronics Sensor) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12 }}
                onMouseEnter={() => setActiveNode("haider")}
                onMouseLeave={() => setActiveNode(null)}
                className={`relative z-10 p-5 sm:p-6 rounded-3xl bg-white border transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between ${
                  activeNode === "haider" ? "border-[#a7e26e] ring-2 ring-[#a7e26e]/25" : "border-[#e4e3e3]"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#e4e3e3] shrink-0">
                        <Image
                          src="/team/haider.jpg"
                          alt="م. حيدر البغدادي"
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-[#222f30] font-kufi">
                          م. حيدر البغدادي
                        </h4>
                        <p className="text-[11px] font-mono text-[#728825] font-semibold">
                          باحث ورئيس مختبر الروبوتات
                        </p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-[#f5f8f7] text-[#222f30] border border-[#e4e3e3] text-[9px] font-mono font-bold uppercase">
                      ROBOTICS LAB
                    </span>
                  </div>

                  <p className="text-xs text-[#55696a] leading-relaxed">
                    متخصص في الأنظمة الميكاترونيكية ودمج المستشعرات ذاتية الحركة في البيئات الميدانية الصعبة.
                  </p>

                  {/* Micro-Widget: Kinematic Robotic Arm & Mechatronics Sensor */}
                  <div className="p-3 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] flex items-center justify-between gap-3">
                    {/* Mechatronic Pulse Sensor Graphic in Jemo Theme */}
                    <div className="flex items-center gap-1.5 font-mono text-xs text-[#222f30]">
                      <span className="text-[#848c8e] text-sm">((</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#a7e26e] animate-ping" />
                      <span className="text-[#848c8e] text-sm">))</span>
                      <span className="text-[10px] text-[#55696a] font-bold mr-1">SENSOR ACTUATOR</span>
                    </div>

                    {/* Robotic Arm Vector Illustration with Jemo Accents */}
                    <div className="relative w-12 h-10 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 64 48" className="w-full h-full stroke-[#222f30] fill-none stroke-[2.2]">
                        <path d="M 8 42 L 56 42" stroke="#c9cbbe" strokeWidth="2.5" />
                        <circle cx="20" cy="40" r="4" fill="#a7e26e" stroke="#222f30" />
                        <path d="M 20 36 L 28 20" />
                        <circle cx="28" cy="20" r="3.5" fill="#cef79e" stroke="#222f30" />
                        <path d="M 28 20 L 44 14" />
                        <circle cx="44" cy="14" r="3" fill="#a7e26e" stroke="#222f30" />
                        <path d="M 44 14 L 50 18 M 44 14 L 50 10" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#f0f0ee] flex items-center justify-between text-xs font-mono text-[#55696a]">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span>4 أوراق</span>
                    <span>·</span>
                    <span>3 مشاريع</span>
                  </div>
                  <Link
                    href="/researchers/haider-al-baghdadi"
                    className="inline-flex items-center gap-1 text-[#222f30] font-bold hover:text-[#728825] transition-colors"
                  >
                    <span>الملف</span>
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>

            </div>

            {/* -------------------------------------------------------------
                NODE 4: د. سارة الحسيني (Artifact Scanner & Historical Manuscript)
                ------------------------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
              onMouseEnter={() => setActiveNode("sara")}
              onMouseLeave={() => setActiveNode(null)}
              className={`relative z-10 p-5 sm:p-7 rounded-3xl bg-white border transition-all duration-300 shadow-sm hover:shadow-xl ${
                activeNode === "sara" ? "border-[#a7e26e] ring-2 ring-[#a7e26e]/25" : "border-[#e4e3e3]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                
                {/* Right side: Name, Role & Bio */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#e4e3e3] shrink-0">
                      <Image
                        src="/team/sara.jpg"
                        alt="د. سارة الحسيني"
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#222f30] font-kufi">
                        د. سارة الحسيني
                      </h4>
                      <p className="text-xs font-mono text-[#728825] font-semibold">
                        رئيسة مختبر الرؤية الحاسوبية
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#55696a] leading-relaxed max-w-lg pt-1">
                    باحثة في معالجة الصور الرقمية وتطبيق تقنيات التعلم العميق لفك وترميم المخطوطات التاريخية العربية.
                  </p>
                  <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#55696a]">
                    <span>6 أوراق منشورة</span>
                    <span>·</span>
                    <span>2 مشاريع مفتوحة</span>
                    <span>·</span>
                    <Link
                      href="/researchers/sara-al-hussaini"
                      className="inline-flex items-center gap-1 text-[#222f30] font-bold hover:text-[#728825] transition-colors"
                    >
                      <span>الملف التوثيقي</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Left side: Micro-Widget — Artifact Scanner Scroll Hologram */}
                <div className="p-3 sm:p-4 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] flex items-center gap-4 shrink-0 shadow-2xs">
                  
                  {/* Ancient Manuscript Wireframe Scroll Diagram with Jemo Lime Laser Scanner */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-20 bg-white rounded-xl border border-[#e4e3e3] p-1.5 overflow-hidden flex flex-col justify-between shadow-2xs">
                    {/* Simulated Text Lines */}
                    <div className="space-y-1 opacity-35">
                      <div className="h-1 bg-[#222f30] rounded-full w-3/4" />
                      <div className="h-1 bg-[#222f30] rounded-full w-full" />
                      <div className="h-1 bg-[#222f30] rounded-full w-5/6" />
                      <div className="h-1 bg-[#222f30] rounded-full w-2/3" />
                    </div>

                    {/* Animated Laser Scan Beam in Bio-Lime */}
                    <div className="absolute inset-x-0 h-0.5 bg-[#a7e26e] shadow-[0_0_8px_#a7e26e] animate-[bounce_2.4s_infinite]" />

                    <div className="flex items-center justify-between text-[8px] font-mono text-[#738284]">
                      <span>DOC-OCR</span>
                      <span className="text-[#728825] font-bold">99.4%</span>
                    </div>
                  </div>

                  {/* Transcription Status in Jemo Palette */}
                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white text-[#222f30] border border-[#e4e3e3] text-[10px] font-bold shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e] animate-pulse" />
                      <span>ARTIFACT SCANNER</span>
                    </div>
                    <p className="text-[10px] text-[#738284]">transcription status</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full border-2 border-[#a7e26e] border-t-transparent animate-spin" />
                      <span className="font-bold text-[#222f30]">نشط (REALTIME)</span>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>

          </div>

          {/* =========================================================
              RIGHT AREA (Col 9 to 12 in RTL = The Initiative Hub Card)
             ========================================================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* The Central Initiative Command Hub Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-sm hover:shadow-xl transition-all duration-300 space-y-6"
            >
              {/* Header Track Tag */}
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f8f7] border border-[#e4e3e3] text-[#222f30] font-bold text-[10px] tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#a7e26e] animate-pulse" />
                  <span>[INITIATIVE_HUB // CONTRIBUTORS]</span>
                </div>
                
                {/* Anchor Port Dot on Left Border (Connecting out to nodes in Jemo Lime) */}
                <span className="hidden lg:block w-3 h-3 rounded-full bg-[#a7e26e] border-2 border-white ring-2 ring-[#a7e26e]/30 animate-pulse" />
              </div>

              {/* Title & Mission Statement */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-[#222f30] font-kufi">
                  فريق المبادرة وبناء المنصة.
                </h2>
                <p className="text-xs sm:text-sm text-[#55696a] leading-relaxed">
                  فريقٌ تقني ومعرفي مستقل ييسّر المنصة، يطوّر أدوات النشر المفتوح، ويدير البنية التجريبية — بينما المعرفة الحقيقية يصنعها آلاف الباحثين والمساهمين المستقلين عبر أبحاثهم اليومية.
                </p>
              </div>

              {/* Team Count & Roster Action Link */}
              <div>
                <Link
                  href="/researchers"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold font-mono tracking-wider uppercase border-b-2 border-[#222f30] pb-1 hover:gap-3 transition-all text-[#222f30]"
                >
                  <span>فريق العمل والمساهمون (12)</span>
                  <ArrowUpLeft className="w-4 h-4 text-[#728825]" />
                </Link>
              </div>

              {/* Two Integrated Telemetry Micro-Widgets in Jemo Theme */}
              <div className="pt-4 border-t border-[#e4e3e3] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5 font-mono">
                
                {/* Telemetry 1: Research Activity Sparkline Curve */}
                <div className="p-3.5 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#55696a] font-bold uppercase">RESEARCH ACTIVITY</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#cef79e] text-[#162021] font-bold text-[9px] border border-[#a7e26e]">
                      +18.4%
                    </span>
                  </div>

                  {/* SVG Smooth Sine/Bézier Sparkline Curve in Jemo Pine + Lime */}
                  <div className="h-10 w-full">
                    <svg viewBox="0 0 160 40" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="curveFillBio" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a7e26e" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#a7e26e" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 35 C 30 35, 45 10, 80 14 C 115 18, 130 5, 160 8 L 160 40 L 0 40 Z"
                        fill="url(#curveFillBio)"
                      />
                      <path
                        d="M 0 35 C 30 35, 45 10, 80 14 C 115 18, 130 5, 160 8"
                        fill="none"
                        stroke="#222f30"
                        strokeWidth="2"
                      />
                      <circle cx="80" cy="14" r="3" fill="#a7e26e" stroke="#222f30" strokeWidth="1.5" />
                      <circle cx="160" cy="8" r="3.5" fill="#cef79e" stroke="#222f30" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>

                {/* Telemetry 2: Daily Commits Dynamic Bar Chart in Jemo Theme */}
                <div className="p-3.5 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#55696a] font-bold uppercase">DAILY COMMITS</span>
                    <span className="text-[#222f30] font-bold">42/DAY</span>
                  </div>

                  {/* Dynamic Vertical Commits Bar Chart */}
                  <div className="h-9 flex items-end justify-between gap-1.5 pt-1 px-1">
                    {[35, 55, 40, 75, 60, 90, 45, 80, 65, 100, 70, 85].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className={`w-full rounded-sm transition-all duration-300 ${
                          i === 9
                            ? "bg-[#222f30] shadow-xs"
                            : i === 5 || i === 11
                            ? "bg-[#a7e26e]"
                            : "bg-[#c9cbbe]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
