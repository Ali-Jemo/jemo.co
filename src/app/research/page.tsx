import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResearchSearchFilter from "@/components/ResearchSearchFilter";
import { getLiveOpenQuestions, getLiveResearchPapers } from "@/lib/live-content";

export const metadata: Metadata = {
  title: "سجلات الاكتشاف وكائنات البحث | JEMO — RESEARCH OBJECT REGISTRY",
  description: "المستودع التراكمي لكائنات البحث (Research Objects) المحمية بمعيار التحقق البشري وإعادة التجارب في النظم والذكاء الاصطناعي.",
};

export default async function ResearchIndexPage() {
  const [papers, questions] = await Promise.all([getLiveResearchPapers(), getLiveOpenQuestions()]);
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 sm:pt-28 pb-16 bg-[var(--bg)]">
        <div className="container">
          <div className="max-w-4xl mb-8 sm:mb-12 border-b-2 border-[var(--ink)] pb-6 sm:pb-10">
            <div className="flex items-center gap-2 text-[#222f30] text-xs sm:text-sm font-bold font-mono mb-4 sm:mb-6">
              <span className="bg-[#bef264] text-[#222f30] px-3 py-1 rounded-full font-bold shadow-xs">
                كائنات البحث
              </span>
              <span className="text-[#3f5456]">/ سجل الاكتشاف المفتوح</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#222f30] mb-4 sm:mb-6 leading-tight tracking-tight font-kufi">
              سجلات الاكتشاف وكائنات البحث.
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#55696a] leading-relaxed max-w-3xl font-sans">
              Reddit في الاكتشاف + GitHub في التوثيق + Wikipedia في التراكم. وحدتنا الأساسية هي{" "}
              <strong className="text-[#222f30] font-bold">كائن البحث (Research Object)</strong> — لا منشورات عابرة، بل معرفة تتراكم بإعادة التجارب (Replications)، التحديات المنهجية (Challenges)، والتحقق البشري الصارم.
            </p>
          </div>
        </div>
        
        {/* Decorative ticker. LTR keeps the loop moving in one direction. */}
        <div
          dir="ltr"
          aria-hidden="true"
          className="w-full bg-[var(--ink-1)] text-white overflow-hidden py-2.5 sm:py-3.5 mb-10 sm:mb-16 border-y-2 border-black flex items-center font-mono text-xs sm:text-sm tracking-widest uppercase whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        >
          <div className="flex w-fit animate-[marquee_20s_linear_infinite]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="mx-8">كائنات البحث</span>
                <span className="text-[#bef264]">✦</span>
                <span className="mx-8">إعادات التجربة</span>
                <span className="text-[#bef264]">✦</span>
                <span className="mx-8">تحديات الأقران</span>
                <span className="text-[#bef264]">✦</span>
                <span className="mx-8">Proof of Work</span>
                <span className="text-[#bef264]">✦</span>
                <span className="mx-8">النظم والأنوية</span>
                <span className="text-[#bef264]">✦</span>
                <span className="mx-8">اختبارات الاستدلال</span>
                <span className="text-[#bef264]">✦</span>
              </div>
            ))}
          </div>
        </div>

        <div className="container">
          <ResearchSearchFilter papers={papers} questions={questions} />
        </div>
      </main>
      <Footer />
    </>
  );
}
