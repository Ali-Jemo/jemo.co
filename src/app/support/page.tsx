import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportPageClient from "@/components/support/SupportPageClient";
import { getLiveFinancialSupports } from "@/lib/live-content";

export const metadata: Metadata = {
  title: "رعاية ودعم البحث العلمي والسيادة التقنية | JEMO LABS",
  description: "باقات الرعاية، قنوات التبرع المباشر (كريبتو، محلي، ومنصات عالمية)، وشفافية تخصيص الميزانية التشغيلية لأبحاث JEMO LABS المستقلة.",
  keywords: [
    "دعم البحث العلمي",
    "JEMO LABS",
    "تبرع كريبتو العراق",
    "رعاية أبحاث الذكاء الاصطناعي",
    "السيادة التقنية",
    "المصادر المفتوحة",
    "أنظمة التشغيل العراقية",
  ],
};

export default async function SupportPage() {
  const supports = await getLiveFinancialSupports();

  return (
    <>
      <Header />
      <main className="flex-1 py-12 bg-[var(--bg)]" dir="rtl">
        <SupportPageClient supports={supports} />
      </main>
      <Footer />
    </>
  );
}
