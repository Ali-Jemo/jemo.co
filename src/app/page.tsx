"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Microscope, Code2, Palette, Gamepad2, FileText, ClipboardCheck, MessageSquareCode, Signature } from "lucide-react";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/SpotlightCard";
import MagneticButton from "@/components/MagneticButton";
import TechMarquee from "@/components/TechMarquee";
import GradientText from "@/components/GradientText";
import GlowButton from "@/components/GlowButton";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <motion.section
          {...fadeIn}
          className="section border-b border-[var(--line)] bg-[var(--bg)] text-center relative overflow-hidden min-h-[85vh] flex items-center justify-center"
        >
          {/* Hero Background Photo */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src="/hero-bg.png"
              alt="Hero Background"
              className="w-full h-full object-cover object-center opacity-85 dark:opacity-40 transition-opacity duration-500"
            />
            {/* Soft Top Fade for Header Nav readability */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--bg)]/80 to-transparent" />
            {/* Soft Bottom Fade for Section transition */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent" />
          </div>
          <div className="container max-w-4xl flex flex-col items-center relative z-10">
            <div className="badge mb-6">LXD Research Branch</div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
              نحن لا نبني برمجيات، <br className="hidden sm:inline" />
              نبني <GradientText>المستقبل</GradientText>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-10 text-[var(--ink-2)]">
              مؤسسة بحثية وتقنية غير ربحية تجمع العقول المبدعة لبناء أبحاث، أدوات، ومنصات مفتوحة المصدر.
            </p>
            <div className="flex gap-4">
              <MagneticButton href="/about" className="btn px-8 py-3 text-base">
                ادخل بيت الحكمة
              </MagneticButton>
            </div>
          </div>
        </motion.section>

        {/* TECH MARQUEE */}
        <TechMarquee />

        {/* DEPARTMENTS */}
        <motion.section id="departments" {...fadeIn} className="section relative overflow-hidden py-24">
          {/* Section Background Photo */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src="/departments-bg.png"
              alt="Departments Background"
              className="w-full h-full object-cover object-center brightness-95 opacity-90 transition-opacity duration-500"
            />
            {/* Soft tint overlay to ensure contrast and seamless integration */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/80 via-[var(--bg)]/35 to-[var(--bg)]/80 backdrop-blur-[1px]" />
          </div>

          <div className="container relative z-10">
            <motion.div variants={stagger} initial="hidden" animate="show" className="mb-12 text-center">
              <motion.h2 variants={item} className="text-3xl md:text-4xl font-bold">الأقسام التخصصية الأربعة</motion.h2>
              <motion.p variants={item} className="max-w-2xl mx-auto mt-4 font-medium">
                منظومة متكاملة تنطلق من أركان معرفية تدمج بين البحث، البرمجة، التصميم، والإعلام الرقمي.
              </motion.p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            >
              {[
                { icon: Microscope, title: "أبحاث علمية", desc: "تحليل بيانات، أوراق بحثية منشورة، ودراسات ميدانية." },
                { icon: Code2, title: "ابتكار برمجي", desc: "بناء منصات ويب، بوتات، وأدوات أتمتة مفتوحة المصدر." },
                { icon: Palette, title: "التصميم والهوية", desc: "تصميم واجهات وهوية بصرية متكاملة للمشاريع التقنية." },
                { icon: Gamepad2, title: "المحتوى والألعاب", desc: "إنتاج محتوى تحليلي تحريري وأعمال رقمية تعليمية." },
              ].map((dept, i) => (
                <motion.div key={i} variants={item}>
                  <SpotlightCard className="card flex items-start gap-4 bg-[var(--surface)] border border-[var(--line)] shadow-xs hover:border-[var(--brand)]/40 transition-all">
                    <div className="p-3 bg-[var(--surface-2)] rounded-lg text-[var(--brand)]">
                      <dept.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{dept.title}</h3>
                      <p className="text-sm m-0 text-[var(--ink-2)]">{dept.desc}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* PROCESS */}
        <motion.section id="process" {...fadeIn} className="section border-t border-[var(--line)] bg-[var(--surface)]">
          <div className="container max-w-5xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl">آلية التقديم والعمل</h2>
              <p className="mt-4">مسار شفاف من أربع محطات ينقلك من فكرة التقديم إلى مشاركة الفريق.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: FileText, title: "1. طلب انضمام", desc: "تعبئة الاستمارة وتحديد القسم والمهارات." },
                { icon: ClipboardCheck, title: "2. مراجعة وتقييم", desc: "دراسة طلبك من قيادة القسم المختص." },
                { icon: MessageSquareCode, title: "3. مقابلة تقنية", desc: "جلسة نقاش لتبادل الأفكار وتحديد المسار." },
                { icon: Signature, title: "4. التوقيع والمباشرة", desc: "إصدار الميثاق والبدء في المشاريع." },
              ].map((step, i) => (
                <SpotlightCard key={i} className="card text-center p-6">
                  <div className="w-12 h-12 rounded-xl bg-[var(--surface-2)] text-[var(--brand)] flex items-center justify-center mx-auto mb-4">
                    <step.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-xs text-[var(--ink-2)]">{step.desc}</p>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section id="cta" {...fadeIn} className="section bg-[var(--bg)] text-center relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="container max-w-2xl relative z-10">
            <h2 className="text-4xl mb-6">هل أنت جاهز للميثاق؟</h2>
            <p className="text-lg text-[var(--ink-2)] mb-10">
              انضم إلى نخبة من المبدعين والمهندسين والباحثين في رحلة بناء المستقبل الرقمي.
            </p>
            <GlowButton href="/apply">قدّم طلبك الآن</GlowButton>
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
