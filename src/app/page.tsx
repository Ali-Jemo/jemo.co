import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import BioManifesto from "@/components/BioManifesto";
import BioUSPCards from "@/components/BioUSPCards";
import BioMediaMultiCol from "@/components/BioMediaMultiCol";
import BioMetricsBand from "@/components/BioMetricsBand";
import FeaturedResearch from "@/components/FeaturedResearch";
import FeaturedScenes from "@/components/FeaturedScenes";
import BioLeadershipGrid from "@/components/BioLeadershipGrid";
import BioPartnersGrid from "@/components/BioPartnersGrid";
import ContributeCTA from "@/components/ContributeCTA";
import ResearchNewsletter from "@/components/ResearchNewsletter";
import BioButton from "@/components/BioButton";
export default function Home() {
  return (
    <>
      <Header />
      <main className="home flex-1 bg-[#f7f7f5]">
        {/* 1. HERO — IntegratedBio Monumental Hero with BioButton */}
        <HeroSection />

        {/* 2. HGROUP MANIFESTO — IntegratedBio Split Section on the Discovery Engine */}
        <BioManifesto />

        {/* 3. NUMBERED USP CARDS — 01, 02, 03 (Ziqa Kernel, Baghdad-LLM, Baghdad-1 HPC) */}
        <BioUSPCards />

        {/* 5. MULTI-COLUMN MEDIA — IntegratedBio Platform Deep Dive */}
        <BioMediaMultiCol />

        {/* 6. TECHNICAL BENCHMARKS — Hardware & System Metrics (0.12µs, 18.2 PFLOPS, 128K) */}
        <BioMetricsBand />

        {/* 7. DISCOVERIES FEED — AI-Assisted Research & Citizen Investigations */}
        <section className="py-8 sm:py-16 bg-[#f7f7f5] border-b border-[#e4e3e3]" dir="rtl" id="discoveries">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16">
            {/* Academic Section Header */}
            <div className="mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-[#e4e3e3]">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="flex items-center gap-2.5 text-xs font-mono text-[#55696a]">
                    <span className="font-bold text-[#222f30] text-sm tracking-normal">05</span>
                    <span className="w-5 h-px bg-[#c9cbbe]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e]" />
                    <span className="tracking-widest uppercase text-[11px] font-semibold text-[#738284]">
                      أرشيف الاكتشافات المحققة · VERIFIED DISCOVERY LOGS
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.2] text-[#222f30] font-kufi">
                    سجلات الاكتشافات والتحقيقات التقنية{" "}
                    <span className="text-[#738284] font-normal">
                      المحققة بشرياً ببرهان العمل.
                    </span>
                  </h2>
                  <p className="text-sm sm:text-base text-[#55696a] leading-relaxed">
                    أوراق ومذكرات وتجارب هندسية في النظم، والبرمجة، ونماذج الذكاء الاصطناعي خضعت لمعيار التحقق البشري الصارم{" "}
                    <bdi dir="ltr" className="inline-block whitespace-nowrap font-mono font-semibold text-[#222f30]">
                      (Proof of Work)
                    </bdi>.
                  </p>
                </div>
                <div className="shrink-0">
                  <BioButton
                    href="/publish"
                    label="SUBMIT DISCOVERY"
                    secondaryLabel="وثّق اكتشافك الآن"
                    variant="primary"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
            <FeaturedResearch />
          </div>
        </section>

        {/* 8. FIELDS SHOWCASE — All sciences */}
        <section className="py-8 sm:py-16 bg-[#f7f7f5] border-b border-[#e4e3e3]" dir="rtl">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16">
            {/* Academic Section Header */}
            <div className="mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-[#e4e3e3]">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="flex items-center gap-2.5 text-xs font-mono text-[#55696a]">
                    <span className="font-bold text-[#222f30] text-sm tracking-normal">06</span>
                    <span className="w-5 h-px bg-[#c9cbbe]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e]" />
                    <span className="tracking-widest uppercase text-[11px] font-semibold text-[#738284]">
                      ركائز التركيز الهندسي · CORE LAB SANDBOXES
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.2] text-[#222f30] font-kufi">
                    تركيز نخبوي: النظم، والبرمجيات،{" "}
                    <span className="text-[#738284] font-normal">
                      وهندسة نماذج الذكاء الاصطناعي.
                    </span>
                  </h2>
                  <p className="text-sm sm:text-base text-[#55696a] leading-relaxed">
                    بداية مركزة في القطاع الأعلى قيمة: أنوية التشغيل المدمجة (نواة Ziqa)، تقييم النماذج الاستدلالية، وهندسة البرمجيات المتقدمة.
                  </p>
                </div>
              </div>
            </div>
            <FeaturedScenes />
          </div>
        </section>

        {/* 9. SCIENTIFIC LEADERSHIP — IntegratedBio Split Layout */}
        <BioLeadershipGrid />

        {/* 10. ACADEMIC ALLIANCE & PARTNERS — IntegratedBio Partner Grid */}
        <BioPartnersGrid />

        {/* 11. COMMUNITY CONTRIBUTE FINALE */}
        <ContributeCTA />

        {/* 10. SCIENTIFIC NEWSLETTER */}
        <section className="py-8 sm:py-16 bg-[#f7f7f5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <ResearchNewsletter />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
