import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterClient from "./NewsletterClient";
import {
  Sparkles,
  Calendar,
  BookOpen,
  CheckCircle2,
  Users,
} from "lucide-react";

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

      <main className="min-h-screen bg-[var(--bg)] text-[var(--ink-1)] py-12 md:py-20">
        <div className="container max-w-5xl px-4 sm:px-6 mx-auto space-y-12 sm:space-y-16">
          {/* Main Hero Header */}
          <header className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--line)] shadow-xs text-xs font-mono text-[var(--ink-2)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>الإصدارات والمعارف الدورية • JEMO DISPATCH</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--ink-1)] leading-tight">
              النشرة الإخبارية والعلمية للشركة
            </h1>

            <p className="text-base sm:text-lg text-[var(--ink-2)] leading-relaxed font-normal">
              أوراق بحثية مسبقة النشر، شفرات مصدرية مفتوحة، تحليلات معمارية للنظم ونوى الذكاء الاصطناعي،
              وأخبار المختبرات تصلك دورياً بدون وسطاء أو خوارزميات.
            </p>

            {/* Quick Metrics Strip */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-[var(--ink-2)]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--surface)] border border-[var(--line)]">
                <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>إصدار نصف شهري (كل 15 يوماً)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--surface)] border border-[var(--line)]">
                <Users className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>+4,850 باحث ومتابع</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--surface)] border border-[var(--line)]">
                <BookOpen className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>14 عدداً منشوراً بالأرشيف</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--surface)] border border-[var(--line)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% مستقلة وبلا إعلانات</span>
              </span>
            </div>
          </header>

          {/* Interactive Client Component */}
          <NewsletterClient />
        </div>
      </main>

      <Footer />
    </>
  );
}
