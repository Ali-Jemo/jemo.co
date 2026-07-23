import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import CountUp from "@/components/CountUp";
import { ShieldCheck, Target, Users, Rocket, ArrowUpLeft } from "lucide-react";
import GlowingBorder from "@/components/GlowingBorder";
import MagneticCard from "@/components/MagneticCard";
import AboutScrollProgress from "@/components/AboutScrollProgress";
import StaggerReveal from "@/components/StaggerReveal";
import NextGenButton from "@/components/NextGenButton";
import AnimatedTimeline from "@/components/AnimatedTimeline";
import DepartmentTabs from "@/components/DepartmentTabs";
import InteractiveValues from "@/components/InteractiveValues";
import AboutHeroTerminal from "@/components/AboutHeroTerminal";
export const metadata: Metadata = {
  title: "من نحن | Jemo Labs",
  description: "ذراع LXD البحثي — فلسفة التفوق الجذري.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <AboutScrollProgress />
      <main className="flex-1">
        {/* HERO */}
        <AnimatedSection className="section bg-[var(--surface)] border-b border-[var(--line)] relative overflow-hidden">
          {/* Floating decorative elements */}
          <div className="absolute top-20 right-[10%] w-24 h-24 bg-[var(--brand)]/[0.04] rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-10 left-[5%] w-16 h-16 bg-[var(--brand)]/[0.03] rounded-full blur-lg pointer-events-none" />
          <div className="container max-w-4xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--line)] bg-[var(--bg)] text-xs font-mono text-[var(--ink-2)] mb-8">
              <span className="w-2 h-2 rounded-full bg-[var(--ok)] animate-pulse" />
              <span>actively building since 2026</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 uppercase">
              Born in <br />
              <span className="about-hero-gradient text-[var(--brand)] italic">Mesopotamia.</span><br />
              Built for the world.
            </h1>
            <p className="text-xl md:text-2xl text-[var(--ink-2)] leading-relaxed max-w-2xl mx-auto">
              نحن لا نتبع الأثر. نحن نصنع الطريق. جهاز jemo البحثي هو القوة الضاربة والواجهة الابتكارية.
            </p>
            <AboutHeroTerminal />
          </div>
        </AnimatedSection>

        {/* PHILOSOPHY */}
        <AnimatedSection className="section bg-[var(--bg)]" delay={0.1}>
          <div className="container max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
              <div className="sticky top-24">
                <div className="badge mb-4">01 / The Core</div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">فلسفة التفوق الجذري</h2>
                <p className="text-lg text-[var(--ink-2)]">
                  من أرض الحضارات الأولى، نستلهم روح البناء. لا نكتفي بتقليد الموجود، بل نهدم القديم لنبني معايير لا يمكن اللحاق بها.
                </p>
              </div>
              <div className="flex flex-col gap-8">
                {[
                  { icon: ShieldCheck, title: "سيادة تقنية", desc: "نرفض التبعية التقنية. نبني أنظمتنا، ندير خوادمنا، ونمتلك شفرتنا." },
                  { icon: Target, title: "عمق لا قشور", desc: "لا نبحث عن تريندات مؤقتة. أبحاثنا تبدأ من الصفر وتنتهي بحلول جذرية." },
                  { icon: Users, title: "نخبة متحالفة", desc: "جيمو ليست ساحة تدريب مفتوحة، بل تحالف للمتفوقين الذين يرفضون المتوسط." },
                ].map((item, i) => (
                  <MagneticCard key={i}>
                    <GlowingBorder>
                      <div className="p-6">
                        <div className="w-12 h-12 rounded-lg bg-[var(--surface-2)] flex items-center justify-center text-[var(--brand)] mb-6">
                          <item.icon size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                        <p className="text-[var(--ink-2)] leading-relaxed m-0">{item.desc}</p>
                      </div>
                    </GlowingBorder>
                  </MagneticCard>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* METRICS */}
        <AnimatedSection className="section bg-[var(--surface)] border-t border-[var(--line)] overflow-hidden" delay={0.2}>
          <div className="container max-w-4xl text-center">
            <div className="badge mb-4">Numbers</div>
            <h2 className="text-3xl font-bold mb-12">أرقام وحقائق</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: 4, suffix: "", label: "أقسام تخصصية", icon: "◆" },
                { value: 12, suffix: "+", label: "مشروع مفتوح المصدر", icon: "◇" },
                { value: 100, suffix: "%", label: "استقلالية تقنية", icon: "○" },
                { value: 2026, suffix: "", label: "عام التأسيس", icon: "△" },
              ].map((stat, i) => (
                <div key={i} className="about-stat-card p-6 rounded-2xl bg-[var(--bg)] border border-[var(--line)] cursor-default">
                  <div className="text-[var(--brand)]/20 text-lg mb-3">{stat.icon}</div>
                  <div className="stat-value text-4xl md:text-5xl font-mono font-bold text-[var(--brand)] mb-2">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm font-medium uppercase tracking-wider text-[var(--ink-2)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
        {/* DEPARTMENTS */}
        <AnimatedSection className="section bg-[var(--bg)] about-grid-bg overflow-hidden" delay={0.1}>
          <div className="container max-w-5xl">
            <div className="flex flex-col items-center text-center mb-16">
              <div className="badge mb-4">02 / Departments</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">أقسامنا الأربعة</h2>
              <p className="text-lg text-[var(--ink-2)] max-w-2xl mx-auto">
                كل قسم يعمل باستقلالية تامة لكن جميعها تتبع فلسفة واحدة: التفوق الجذري.
              </p>
            </div>
            <DepartmentTabs />
          </div>
        </AnimatedSection>

        {/* VISION */}
        <AnimatedSection className="section bg-[var(--surface)] border-t border-[var(--line)] about-gradient-border overflow-hidden" delay={0.1}>
          <div className="container max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className="flex flex-col gap-6">
                <div className="badge mb-2 w-fit">03 / Vision</div>
                <h2 className="text-4xl md:text-5xl font-bold">رؤيتنا لـ 2030</h2>
                <p className="text-lg text-[var(--ink-2)] leading-relaxed">
                  نرى مستقبلاً تكون فيه المنطقة العربية مصدراً للابتكار التقني لا مستهلكاً له. نعمل الآن لبناء الأساس الذي ستقف عليه الأجيال القادمة.
                </p>
              </div>
              <div className="w-full flex items-center justify-center">
                <AnimatedTimeline />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* VALUES */}
        <AnimatedSection className="section bg-[var(--bg)] about-grid-bg overflow-hidden" delay={0.1}>
          <div className="container max-w-5xl">
            <div className="flex flex-col items-center text-center mb-16">
              <div className="badge mb-4">04 / Values</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">القيم التي نعيشها</h2>
            </div>
            <InteractiveValues />
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="section bg-[var(--surface)] border-t border-[var(--line)] relative overflow-hidden" delay={0.2}>
          <div className="absolute top-10 left-[10%] w-20 h-20 bg-[var(--brand)]/[0.04] rounded-full blur-lg pointer-events-none" />
          <div className="absolute bottom-10 right-[10%] w-16 h-16 bg-[var(--brand)]/[0.03] rounded-full blur-lg pointer-events-none" />
          <div className="absolute inset-0 about-dots pointer-events-none" />
          <div className="container max-w-3xl mx-auto flex flex-col items-center justify-center text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--brand)]/20 bg-[var(--brand)]/5 text-xs font-mono text-[var(--brand)] mb-8 about-pulse-ring">
              <span>open for applications</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">انضم إلى التحالف</h2>
            <p className="text-lg text-[var(--ink-2)] mb-10 max-w-xl mx-auto leading-relaxed">
              لا نقدم وظائف. نبني تحالفاً. إذا كنت ترى أن المستوى المعتاد لا يكفي، فقد تكون أنت من نبحث عنه.
            </p>
            <NextGenButton />
          </div>
        </AnimatedSection>
      </main>
      <Footer />
    </>
  );
}