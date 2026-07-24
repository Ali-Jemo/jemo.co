import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LivingMuseumTimeline from "@/components/LivingMuseumTimeline";

export const metadata: Metadata = {
  title: "الخط الزمني (المتحف الحي للعلم) | JEMO LABS",
  description: "الخط الزمني ومسار المؤسسة من بيت الحكمة في بغداد (762) إلى افتتاح أول مجمع مختبرات حقيقي (2032).",
};

export default function TimelinePage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <LivingMuseumTimeline showFull={true} />
        </div>
      </main>
      <Footer />
    </>
  );
}
