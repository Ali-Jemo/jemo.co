import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NEWS_ITEMS } from "@/lib/data/research-data";
import { Newspaper, ArrowRight, Calendar, Tag } from "lucide-react";

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = NEWS_ITEMS.find((n) => n.slug === slug);
  if (!item) return { title: "الخبر غير موجود | JEMO LABS" };

  return {
    title: `${item.title} | أخبار JEMO LABS`,
    description: item.summary,
  };
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const item = NEWS_ITEMS.find((n) => n.slug === slug);
  if (!item) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-3xl">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--ink-2)] hover:text-[var(--brand)] mb-8 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للأخبار</span>
          </Link>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded bg-[var(--brand)]/10 text-[var(--brand)] font-bold">
                {item.category}
              </span>
              <span className="text-[var(--ink-2)] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {item.date}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--ink-1)] leading-tight">
              {item.title}
            </h1>
          </div>

          <Card className="p-8 space-y-6">
            <p className="text-lg font-semibold text-[var(--brand)] border-r-2 border-[var(--brand)] pr-4 py-1 leading-relaxed">
              {item.summary}
            </p>

            <div className="text-[var(--ink-2)] leading-relaxed text-base pt-4 border-t border-[var(--line)] whitespace-pre-line">
              {item.content}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
