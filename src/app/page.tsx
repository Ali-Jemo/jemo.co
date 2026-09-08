import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import BioManifesto from "@/components/BioManifesto";
import BioUSPCards from "@/components/BioUSPCards";
import BioMarquee from "@/components/BioMarquee";
import BioMediaMultiCol from "@/components/BioMediaMultiCol";
import BioMetricsBand from "@/components/BioMetricsBand";
import FeaturedResearch from "@/components/FeaturedResearch";
import FeaturedScenes from "@/components/FeaturedScenes";
import BioLeadershipGrid from "@/components/BioLeadershipGrid";
import BioPartnersGrid from "@/components/BioPartnersGrid";
import ContributeCTA from "@/components/ContributeCTA";
import ResearchNewsletter from "@/components/ResearchNewsletter";

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

        {/* 4. MARQUEE — IntegratedBio Continuous Typographic Ribbon */}
        <BioMarquee />

        {/* 5. MULTI-COLUMN MEDIA — IntegratedBio Platform Deep Dive */}
        <BioMediaMultiCol />

        {/* 6. TECHNICAL BENCHMARKS — Hardware & System Metrics (0.12µs, 18.2 PFLOPS, 128K) */}
        <BioMetricsBand />

        {/* 7. NEWSROOM / PUBLICATIONS — Latest Scientific Papers & Preprints */}
        <section className="py-20 sm:py-28 bg-[#f7f7f5] border-b border-[#e4e3e3]" dir="rtl">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-white font-mono text-xs uppercase tracking-widest text-[#445e5f] mb-4 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
                  <span>المستودع البحثي · PUBLICATIONS &amp; PAPERS</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[#222f30] font-kufi">
                  أحدث الأوراق العلمية والأبحاث المحكّمة.
                </h2>
              </div>
            </div>
            <FeaturedResearch />
          </div>
        </section>

        {/* 8. SOVEREIGN SYSTEMS SHOWCASE — Live Interactive Systems Simulator */}
        <section className="py-20 sm:py-28 bg-[#f7f7f5] border-b border-[#e4e3e3]" dir="rtl">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-white font-mono text-xs uppercase tracking-widest text-[#445e5f] mb-4 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
                  <span>الأنظمة الميدانية · SOVEREIGN PLATFORMS</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[#222f30] font-kufi">
                  منظومات نُصمّمها ونشغّلها من النواة.
                </h2>
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
        <section className="py-16 sm:py-20 bg-[#f7f7f5]">
          <div className="max-w-4xl mx-auto px-6">
            <ResearchNewsletter />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
