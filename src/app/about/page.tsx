import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import { ABOUT_INFO } from "@/lib/data/research-data";
import { ShieldCheck, Target, Users, Rocket, ArrowUpLeft, Compass, Lightbulb, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "من نحن | JEMO LABS — بيت الحكمة الرقمي",
  description: "لماذا أنشئت JEMO LABS؟ فلسفة البحث، الرسالة، الرؤية، والقيم المؤسسية.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ABOUT HERO */}
        <AnimatedSection className="section bg-[var(--surface)] border-b border-[var(--line)] relative overflow-hidden">
          <div className="container text-center max-w-4xl mx-auto py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] text-xs font-mono mb-4">
              <Compass className="w-3.5 h-3.5" />
              <span>عن المؤسسة ورسالتها الأكاديمية</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--ink-1)] mb-6 leading-tight">
              بيت الحكمة الرقمي <br />
              <span className="text-gradient">صرح البحث والسيادة المعرفية</span>
            </h1>
            <blockquote className="text-lg md:text-xl font-bold text-[var(--brand)] border-y border-[var(--line)] py-6 my-6 bg-[var(--bg)]/50 rounded-xl leading-relaxed">
              "{ABOUT_INFO.coreQuote}"
            </blockquote>
          </div>
        </AnimatedSection>

        {/* WHY CREATED & NAME MEANING */}
        <AnimatedSection className="section bg-[var(--bg)] border-b border-[var(--line)]">
          <div className="container grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center font-bold mb-4 font-mono">
                01
              </div>
              <h2 className="text-2xl font-bold text-[var(--ink-1)] mb-4">لماذا أنشئت JEMO LABS؟</h2>
              <p className="text-[var(--ink-2)] leading-relaxed text-sm md:text-base">
                {ABOUT_INFO.whyCreated}
              </p>
            </Card>

            <Card className="p-8">
              <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center font-bold mb-4 font-mono">
                02
              </div>
              <h2 className="text-2xl font-bold text-[var(--ink-1)] mb-4">ماذا يعني الاسم؟</h2>
              <p className="text-[var(--ink-2)] leading-relaxed text-sm md:text-base">
                {ABOUT_INFO.nameMeaning}
              </p>
            </Card>
          </div>
        </AnimatedSection>

        {/* MISSION & VISION */}
        <AnimatedSection className="section bg-[var(--surface)] border-b border-[var(--line)]">
          <div className="container grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-4">
              <div className="flex items-center gap-3 text-[var(--brand)] font-bold text-xl">
                <Target className="w-6 h-6" />
                <h3>الرسالة (Mission)</h3>
              </div>
              <p className="text-[var(--ink-2)] leading-relaxed">
                {ABOUT_INFO.mission}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-4">
              <div className="flex items-center gap-3 text-[var(--brand)] font-bold text-xl">
                <Sparkles className="w-6 h-6" />
                <h3>الرؤية (Vision)</h3>
              </div>
              <p className="text-[var(--ink-2)] leading-relaxed">
                {ABOUT_INFO.vision}
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* RESEARCH PHILOSOPHY */}
        <AnimatedSection className="section bg-[var(--bg)] border-b border-[var(--line)]">
          <div className="container max-w-4xl mx-auto">
            <Card className="p-8 md:p-12 border-2 border-[var(--brand)]/30 relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono mb-4">
                <BookOpen className="w-4 h-4" />
                <span>فلسفة البحث العلمي في JEMO LABS</span>
              </div>
              <h2 className="text-3xl font-bold text-[var(--ink-1)] mb-6">البحث من المبادئ الأولى (First Principles)</h2>
              <p className="text-[var(--ink-2)] leading-relaxed text-base md:text-lg mb-6">
                {ABOUT_INFO.researchPhilosophy}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-[var(--ink-2)]">
                <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                  ✓ لا شروط على النشر المعرفي
                </div>
                <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                  ✓ شفافية كاملة في الكود والبيانات
                </div>
              </div>
            </Card>
          </div>
        </AnimatedSection>

        {/* VALUES */}
        <AnimatedSection className="section bg-[var(--surface)] border-b border-[var(--line)]">
          <div className="container">
            <SectionHeader
              eyebrow="قيم المؤسسة"
              title="القيم التي تحكم أبحاثنا ومختبراتنا"
              description="مبادئ ثابته تضمن النزاهة العلمية والاستقلالية المعرفية."
              center
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {ABOUT_INFO.values.map((v, i) => (
                <Card key={v.title} hover className="p-6">
                  <div className="w-8 h-8 rounded-lg bg-[var(--brand)]/10 text-[var(--brand)] font-mono font-bold flex items-center justify-center mb-4">
                    0{i + 1}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[var(--ink-1)]">{v.title}</h3>
                  <p className="text-xs text-[var(--ink-2)] leading-relaxed">{v.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="section bg-[var(--bg)] text-center">
          <div className="container max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-[var(--ink-1)]">هل ترغب بالانضمام أو المساهمة في الأبحاث؟</h2>
            <p className="text-[var(--ink-2)] text-sm">
              نرحب بالباحثين، المطورين، والمصممين الراغبين بالمساهمة في بناء بيت الحكمة الرقمي.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link href="/join">
                <button className="px-6 py-3 rounded-full bg-[var(--brand)] text-white font-bold text-sm shadow-md hover:opacity-90 transition-all flex items-center gap-2">
                  <span>قدم طلب انضمام</span>
                  <ArrowUpLeft className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </main>
      <Footer />
    </>
  );
}
