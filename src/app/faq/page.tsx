import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Accordion from "@/components/ui/Accordion";
import { getLiveFaq } from "@/lib/live-content";
import { HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة | JEMO LABS",
  description: "الأسئلة الشائعة حول النشر الأكاديمي، الانضمام، التمويل، والملكية الفكرية.",
};

export default async function FAQPage() {
  const faqItems = await getLiveFaq();
  const categories = Array.from(new Set(faqItems.map((item) => item.category)));

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>الاستفسارات الشائعة</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)]">الأسئلة الشائعة (FAQ)</h1>
            <p className="text-[var(--ink-2)] text-base leading-relaxed">
              إجابات دقيقة حول آلية عمل المختبرات، سياسات النشر، والملكية الفكرية.
            </p>
          </div>

          <div className="space-y-12">
            {categories.map((cat) => {
              const catItems = faqItems.filter((item) => item.category === cat).map((item, idx) => ({
                id: `${cat}-${idx}`,
                title: item.question,
                children: item.answer,
              }));

              return (
                <div key={cat} className="space-y-4">
                  <h2 className="text-2xl font-bold text-[var(--ink-1)] border-b border-[var(--line)] pb-3 font-mono">
                    • {cat}
                  </h2>
                  <Accordion items={catItems} />
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
