import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import { getLiveAboutInfo } from "@/lib/live-content";
import { Target, ArrowUpLeft, Compass, Sparkles, BookOpen, ShieldCheck, Cpu, GitBranch, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import BioLeadershipGrid from "@/components/BioLeadershipGrid";
import BioPartnersGrid from "@/components/BioPartnersGrid";
import BioButton from "@/components/BioButton";
import WeAreSection from "@/components/WeAreSection";

export const metadata: Metadata = {
  title: "من نحن | JEMO — سجل أبحاث واكتشافات عصر الذكاء الاصطناعي",
  description: "ما هي JEMO؟ لماذا أنشئت؟ وكيف تحول أبحاثك واستقصاءاتك بمساعدة الذكاء الاصطناعي إلى معرفة مشتركة وموثقة للجميع.",
};

const METHODOLOGY_STEPS = [
  {
    step: "01",
    title: "السؤال والمعضلة (The Question)",
    titleEn: "What were you trying to find?",
    desc: "تحديد المسألة أو الفكرة التي دفعتك للبحث بوضوح: معضلة برمجية، نص تراثي، فرضية علمية، أو مقارنة بين أدوات.",
    icon: Compass,
  },
  {
    step: "02",
    title: "الأدوات ومسار الحوار (The Tools)",
    titleEn: "What did you use & how?",
    desc: "توثيق النماذج والمراجع المستخدمة (Claude, GPT, Gemini, كتب، أكواد) ومسار التفاعل والافتراضات التي فُحصت.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "الخلاصة والنتيجة (The Findings)",
    titleEn: "What did you discover?",
    desc: "عرض النتيجة الملموسة أو الحل النهائي الذي تم التوصل إليه، ومشاركته مفتوحاً للجميع ليكون رصيداً معرفياً عاماً.",
    icon: GitBranch,
  },
  {
    step: "04",
    title: "التحقق وتصحيح الهلوسة (Verification)",
    titleEn: "Human Verification & Challenge",
    desc: "بيان أين أصاب الذكاء الاصطناعي وأين هلوس وتم تصحيحه يدوياً، مع إتاحة التحدي والتحديث المستمر للنسخ.",
    icon: ShieldCheck,
  },
];

export default async function AboutPage() {
  const about = await getLiveAboutInfo();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ABOUT HERO */}
        <AnimatedSection className="section bg-[var(--surface)] border-b border-[var(--line)] relative overflow-hidden">
          <div className="container text-center max-w-4xl mx-auto py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] text-xs font-mono mb-4">
              <Compass className="w-3.5 h-3.5" />
              <span>سجل الاكتشافات المفتوح · OPEN RESEARCH REGISTRY</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--ink-1)] mb-6 leading-tight">
              بوابة المعرفة المشتركة <br />
              <span className="text-gradient">سجل أبحاث واكتشافات عصر الذكاء الاصطناعي</span>
            </h1>
            <blockquote className="text-lg md:text-xl font-bold text-[var(--brand)] border-y border-[var(--line)] py-6 my-6 bg-[var(--bg)]/50 rounded-xl leading-relaxed max-w-3xl mx-auto">
              "{about.coreQuote}"
            </blockquote>
          </div>
        </AnimatedSection>

        {/* WHY CREATED & NAME MEANING */}
        <AnimatedSection className="section bg-[var(--bg)] border-b border-[var(--line)]">
          <div className="container grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center font-bold font-mono">
                01
              </div>
              <h2 className="text-2xl font-bold text-[var(--ink-1)]">لماذا أنشئت JEMO LABS؟</h2>
              <p className="text-[var(--ink-2)] leading-relaxed text-sm md:text-base">
                {about.whyCreated}
              </p>
            </Card>

            <Card className="p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center font-bold font-mono">
                02
              </div>
              <h2 className="text-2xl font-bold text-[var(--ink-1)]">ماذا يعني الاسم؟</h2>
              <p className="text-[var(--ink-2)] leading-relaxed text-sm md:text-base">
                {about.nameMeaning}
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
              <p className="text-[var(--ink-2)] leading-relaxed text-base">
                {about.mission}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-4">
              <div className="flex items-center gap-3 text-[var(--brand)] font-bold text-xl">
                <Sparkles className="w-6 h-6" />
                <h3>الرؤية (Vision)</h3>
              </div>
              <p className="text-[var(--ink-2)] leading-relaxed text-base">
                {about.vision}
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* RESEARCH METHODOLOGY FLOWCHART */}
        <AnimatedSection className="section bg-[var(--bg)] border-b border-[var(--line)]">
          <div className="container">
            <SectionHeader
              eyebrow="المنهجية العلمية"
              title="منهجية تنفيذ الأبحاث في JEMO LABS"
              description="خطوات دقيقة تضمن رصانة الأبحاث وقابليتها للتكرار والاستخدام العمومي."
              center
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {METHODOLOGY_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <Card key={step.step} hover className="p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xl font-extrabold text-[var(--brand)]">
                          {step.step}
                        </span>
                        <div className="w-9 h-9 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[var(--brand)] flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-[var(--ink-1)] mb-1">{step.title}</h3>
                      <div className="text-[10px] font-mono text-[var(--brand)] mb-3 dir-ltr text-right">{step.titleEn}</div>

                      <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* RESEARCH PHILOSOPHY & CHARTER */}
        <AnimatedSection className="section bg-[var(--surface)] border-b border-[var(--line)]">
          <div className="container max-w-4xl mx-auto">
            <Card className="p-8 md:p-12 border-2 border-[var(--brand)]/30 relative space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono">
                <BookOpen className="w-4 h-4" />
                <span>فلسفة البحث من المبادئ الأولى</span>
              </div>
              <h2 className="text-3xl font-bold text-[var(--ink-1)]">البحث العلمي الصافي والسيادة الرقمية</h2>
              <p className="text-[var(--ink-2)] leading-relaxed text-base md:text-lg">
                {about.researchPhilosophy}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-[var(--ink-2)] pt-2">
                <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>لا شروط أو قيود تجارية على النشر</span>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>إتاحة الشيفرات والبيانات مجاناً للعموم</span>
                </div>
              </div>
            </Card>
          </div>
        </AnimatedSection>

        {/* SCIENTIFIC COUNCIL & LEADERSHIP */}
        {/* SCIENTIFIC LEADERSHIP (IntegratedBio Style) */}
        <BioLeadershipGrid />

        {/* VALUES */}
        <AnimatedSection className="section bg-[var(--surface)] border-b border-[var(--line)]">
          <div className="container">
            <SectionHeader
              eyebrow="قيم المؤسسة"
              title="القيم التي تحكم أبحاثنا ومختبراتنا"
              description="مبادئ ثابتة تضمن النزاهة العلمية والاستقلالية المعرفية."
              center
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {about.values.map((v, i) => (
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

        {/* ACADEMIC ALLIANCE (IntegratedBio Style) */}
        {/* WE ARE — founder story */}
        <WeAreSection />

        <BioPartnersGrid />
        {/* CTA */}
        <AnimatedSection className="section bg-[var(--bg)] text-center">
          <div className="container max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-[var(--ink-1)]">أجريت بحثاً بالذكاء الاصطناعي وتريد توثيقه؟</h2>
            <p className="text-[var(--ink-2)] text-sm">
              لا تدع المعرفة تضيع في أرشيف المحادثات الخاصة. وثّق سؤالك، أدواتك، وما توصلت إليه ليكون رصيداً مفتوحاً للجميع.
            </p>
            <div className="flex justify-center pt-2">
              <BioButton
                href="/publish"
                label="PUBLISH YOUR RESEARCH"
                secondaryLabel="انشر بحثك واكتشافك"
                variant="primary"
                dir="ltr"
              />
            </div>
          </div>
        </AnimatedSection>
      </main>
      <Footer />
    </>
  );
}
