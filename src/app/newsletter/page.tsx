import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterClient from "./NewsletterClient";
// ponytail: DEV.to-styled newsletter page shell

// ponytail: Server Component shell + rich NewsletterClient with live topic filtering & dispatch archive

const DESCRIPTION =
  "النشرة الإخبارية والعلمية لمؤسسة ومختبرات JEMO: إيداعات الأوراق المسبقة، الشفرات المصدرية، تحليلات النظم ونوى الذكاء الاصطناعي، وأخبار الشركة الدورية.";

export const metadata: Metadata = {
  title: "نشرة الشركة والتقارير الدورية (JEMO DISPATCH) | JEMO LABS",
  description: DESCRIPTION,
  openGraph: {
    title: "نشرة الشركة والتقارير الدورية (JEMO DISPATCH) | JEMO LABS",
    description: DESCRIPTION,
    type: "website",
    locale: "ar_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "نشرة الشركة | JEMO LABS",
    description: DESCRIPTION,
  },
};

export const dynamic = "force-dynamic";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Periodical",
      "@id": "https://jemo.co/newsletter",
      "url": "https://jemo.co/newsletter",
      "name": "JEMO LABS Newsletter & Research Dispatch • نشرة الشركة",
      "description": DESCRIPTION,
      "inLanguage": "ar",
      "publisher": {
        "@type": "Organization",
        "name": "JEMO LABS",
        "url": "https://jemo.co",
      },
    },
  ],
};

export default function NewsletterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />

      <main className="min-h-screen bg-[var(--bg)] text-[var(--ink-1)] py-4 sm:py-6">
        <div className="max-w-[1380px] px-3 sm:px-4 md:px-6 mx-auto">
          {/* Compact feed hero — H1 + metrics, dev.to index style */}
          <header className="mb-5 sm:mb-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs px-5 py-5 sm:px-7 sm:py-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div className="flex-1 space-y-1.5 text-center md:text-right">
              <p className="text-[11px] font-mono text-[var(--ink-2)]">
                الإصدارات والمعارف الدورية • JEMO DISPATCH
              </p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--ink-1)] leading-tight">
                النشرة الإخبارية والعلمية للشركة
              </h1>
              <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                أوراق بحثية مسبقة النشر، شفرات مصدرية مفتوحة، تحليلات معمارية للنظم ونوى الذكاء
                الاصطناعي — تصلك دورياً بدون وسطاء أو خوارزميات.
              </p>
            </div>
            <dl className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-[11px] font-mono text-[var(--ink-2)] shrink-0">
              <div className="px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)]">
                <dt className="sr-only">وتيرة الصدور</dt>
                <dd>إصدار نصف شهري</dd>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)]">
                <dt className="sr-only">المشتركون</dt>
                <dd>+4,850 باحث ومتابع</dd>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)]">
                <dt className="sr-only">الأرشيف</dt>
                <dd>14 عدداً منشوراً</dd>
              </div>
            </dl>
          </header>
          <Suspense>
            <NewsletterClient />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}
