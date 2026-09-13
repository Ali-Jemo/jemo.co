import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { NEWS_ITEMS } from "@/lib/data/research-data";
import { Newspaper, ArrowUpLeft, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "الأخبار والإعلانات | JEMO LABS",
  description: "أخبار المؤسسة، المستجدات الأكاديمية، والمؤتمرات والجوائز.",
};

export default function NewsIndexPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono mb-4">
              <Newspaper className="w-3.5 h-3.5" />
              <span>المستجدات والأخبار الأكاديمية</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)] mb-4">أخبار JEMO LABS</h1>
            <p className="text-[var(--ink-2)] leading-relaxed">
              متابعة آخر مستجدات أبحاث المؤسسة، المؤتمرات، التعاونات، والجوائز العلمية.
            </p>
          </div>

          <div className="space-y-6">
            {NEWS_ITEMS.map((item) => (
              <Card key={item.id} hover className="p-8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs font-mono">
                  <span className="px-2.5 py-0.5 rounded bg-[var(--brand)]/10 text-[var(--brand)] font-bold">
                    {item.category}
                  </span>
                  <span className="text-[var(--ink-2)] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-[var(--ink-1)] mb-3 hover:text-[var(--brand)] transition-colors">
                  <Link href={`/news/${item.slug}`}>{item.title}</Link>
                </h2>

                <p className="text-sm text-[var(--ink-2)] leading-relaxed mb-4">
                  {item.summary}
                </p>

                <Link
                  href={`/news/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand)] hover:underline"
                >
                  <span>قراءة الخبر كاملًا</span>
                  <ArrowUpLeft className="w-3.5 h-3.5" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
