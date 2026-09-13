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
import EditorialSectionHeader from "@/components/EditorialSectionHeader";

// Section rhythm is shared by every section on this page: one container width,
// one gutter scale, one vertical rhythm. Change it here, not per-section.
const SECTION = "py-12 sm:py-20 lg:py-24 bg-[#f7f7f5] border-b border-[#e4e3e3]";
const CONTAINER = "max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16";

export default function Home() {
  return (
    <>
      <Header />
      <main className="home flex-1 bg-[#f7f7f5]">
        {/* 1. HERO — IntegratedBio Monumental Hero with BioButton */}
        <HeroSection />

        {/* 2. MANIFESTO — Split section on the Discovery Engine .......... 01 */}
        <BioManifesto />

        {/* 3. NUMBERED USP CARDS — Ziqa Kernel, Baghdad-LLM, Baghdad-1 HPC  02 */}
        <BioUSPCards />

        {/* 4. MULTI-COLUMN MEDIA — Platform deep dive ..................... 03 */}
        <BioMediaMultiCol />

        {/* 5. INSTITUTIONAL BENCHMARKS — Openness, preservation, coverage . 04 */}
        <BioMetricsBand />

        {/* 6. DISCOVERIES FEED — AI-assisted research & citizen logs ...... 05 */}
        <section className={SECTION} dir="rtl" id="discoveries">
          <div className={CONTAINER}>
            <EditorialSectionHeader
              num="05"
              kickerAr="أرشيف الاكتشافات المحققة"
              kickerEn="VERIFIED DISCOVERY LOGS"
              title="سجلات الاكتشافات والتحقيقات التقنية"
              titleAccent="المحققة بشرياً ببرهان العمل."
              lede={
                <>
                  أوراق ومذكرات وتجارب هندسية في النظم، والبرمجة، ونماذج الذكاء الاصطناعي خضعت لمعيار التحقق البشري الصارم{" "}
                  <bdi dir="ltr" className="inline-block whitespace-nowrap font-mono font-semibold text-[#222f30]">
                    (Proof of Work)
                  </bdi>
                  .
                </>
              }
              cta={
                <BioButton
                  href="/publish"
                  label="SUBMIT DISCOVERY"
                  secondaryLabel="وثّق اكتشافك الآن"
                  variant="primary"
                  dir="ltr"
                />
              }
            />
            <FeaturedResearch />
          </div>
        </section>

        {/* 7. FIELDS SHOWCASE — Core lab sandboxes ......................... 06 */}
        <section className={SECTION} dir="rtl">
          <div className={CONTAINER}>
            <EditorialSectionHeader
              num="06"
              kickerAr="ركائز التركيز الهندسي"
              kickerEn="CORE LAB SANDBOXES"
              title="تركيز نخبوي: النظم، والبرمجيات،"
              titleAccent="وهندسة نماذج الذكاء الاصطناعي."
              lede="بداية مركزة في القطاع الأعلى قيمة: أنوية التشغيل المدمجة (نواة Ziqa)، تقييم النماذج الاستدلالية، وهندسة البرمجيات المتقدمة."
            />
            <FeaturedScenes />
          </div>
        </section>

        {/* 8. SCIENTIFIC LEADERSHIP — IntegratedBio topology canvas ....... 07 */}
        <BioLeadershipGrid sectionNum="07" />

        {/* 9. ACADEMIC ALLIANCE & PARTNERS — Partner wall ................. 08 */}
        <BioPartnersGrid />

        {/* 10. COMMUNITY CONTRIBUTE FINALE ................................ 09 */}
        <ContributeCTA />

        {/* 11. SCIENTIFIC NEWSLETTER ...................................... 10 */}
        <section className="py-12 sm:py-20 lg:py-24 bg-[#f7f7f5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-10 lg:px-16">
            <ResearchNewsletter />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
