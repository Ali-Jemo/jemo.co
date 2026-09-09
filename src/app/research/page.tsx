import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResearchSearchFilter from "@/components/ResearchSearchFilter";
import { getLiveResearchPapers } from "@/lib/live-content";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "سجلات الاكتشاف وكائنات البحث | JEMO — RESEARCH OBJECT REGISTRY",
  description: "المستودع التراكمي لكائنات البحث (Research Objects) المحمية بمعيار التحقق البشري وإعادة التجارب في النظم والذكاء الاصطناعي.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ResearchIndexPage() {
  const papers = await getLiveResearchPapers();
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 sm:pt-28 pb-16 bg-[var(--bg)]">
        <div className="container">
          <div className="max-w-4xl mb-8 sm:mb-12 border-b-2 border-[var(--ink)] pb-6 sm:pb-10">
            <div className="flex items-center gap-2 text-[#222f30] text-xs sm:text-sm font-bold font-mono uppercase tracking-widest mb-4 sm:mb-6">
              <span className="bg-[#bef264] text-[#222f30] px-2.5 py-0.5 rounded-full font-bold">RESEARCH_OBJECTS</span>
              <span>/ OPEN_DISCOVERY_REGISTRY</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#222f30] mb-4 sm:mb-6 leading-tight tracking-tight font-kufi">
              سجلات الاكتشاف وكائنات البحث.
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#55696a] leading-relaxed max-w-3xl font-normal">
              Reddit في الاكتشاف + GitHub في التوثيق + Wikipedia في التراكم. وحدتنا الأساسية هي <strong>كائن البحث (Research Object)</strong> — لا منشورات عابرة، بل معرفة تتراكم بإعادة التجارب (Replications)، التحديات المنهجية (Challenges)، والتحقق البشري الصارم.
            </p>
          </div>
        </div>
        
        {/* Mistral-style Ticker Tape */}
        <div className="w-full bg-[var(--ink-1)] text-white overflow-hidden py-2 sm:py-3 mb-10 sm:mb-16 border-y-2 border-black flex items-center font-mono text-xs sm:text-sm tracking-widest uppercase whitespace-nowrap">
          <div className="flex w-fit animate-[marquee_20s_linear_infinite]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="mx-8">RESEARCH OBJECTS</span>
                <span className="text-[#bef264]">✦</span>
                <span className="mx-8">REPLICATIONS</span>
                <span className="text-[#bef264]">✦</span>
                <span className="mx-8">PEER CHALLENGES</span>
                <span className="text-[#bef264]">✦</span>
                <span className="mx-8">PROOF OF WORK</span>
                <span className="text-[#bef264]">✦</span>
                <span className="mx-8">SYSTEMS & KERNELS</span>
                <span className="text-[#bef264]">✦</span>
                <span className="mx-8">REASONING BENCHMARKS</span>
                <span className="text-[#bef264]">✦</span>
              </div>
            ))}
          </div>
        </div>

        <div className="container">
          <ResearchSearchFilter papers={papers} />
        </div>
      </main>
      <Footer />
    </>
  );
}
