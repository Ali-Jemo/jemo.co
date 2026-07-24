import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResearchSearchFilter from "@/components/ResearchSearchFilter";
import { RESEARCH_PAPERS } from "@/lib/data/research-data";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "الأبحاث العلمية | JEMO LABS",
  description: "المستودع الرقمي للأوراق والأبحاث العلمية المحكمة من مختبرات JEMO LABS.",
};

export default function ResearchIndexPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>مستودع الأبحاث المفتوحة</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)] mb-4">الأوراق البحثية المحكمة</h1>
            <p className="text-[var(--ink-2)] leading-relaxed">
              كافة الأوراق والنسخ المسبقة (Preprints) المنتجة في JEMO LABS متاحة مجاناً مع البيانات والشيفرات المصدرية.
            </p>
          </div>

          <ResearchSearchFilter papers={RESEARCH_PAPERS} />
        </div>
      </main>
      <Footer />
    </>
  );
}
