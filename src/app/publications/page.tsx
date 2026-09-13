import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { getLiveResearchPapers } from "@/lib/live-content";
import { FileText, ArrowUpLeft, Users, Filter, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "المنشورات والأوراق الأكاديمية | JEMO LABS",
  description: "مستودع المنشورات العلمية لـ JEMO LABS مصنفة حسب السنة، المجال، والمؤلف.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PublicationsPage() {
  const papers = await getLiveResearchPapers();
  const fields = Array.from(new Set(papers.map((p) => p.field)));
  const years = Array.from(new Set(papers.map((p) => p.publishDate.slice(0, 4))));
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono mb-4">
              <FileText className="w-3.5 h-3.5" />
              <span>مستودع المنشورات الأكاديمية</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)] mb-4">فهرس المنشورات والأوراق المحكمة</h1>
            <p className="text-[var(--ink-2)] leading-relaxed">
              تصفح وتصنيف كافة الأوراق العلمية المنتجة حسب السنة، المجال الأكاديمي، أو المؤلفين.
            </p>
          </div>

          {/* Category Summary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="p-6">
              <h3 className="text-xs font-mono uppercase text-[var(--ink-2)] mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[var(--brand)]" />
                <span>المجالات البحثية ({fields.length})</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {fields.map((f) => (
                  <Badge key={f} variant="info">{f}</Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xs font-mono uppercase text-[var(--ink-2)] mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--brand)]" />
                <span>سنوات النشر ({years.length})</span>
              </h3>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {years.map((y) => (
                  <span key={y} className="px-3 py-1 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-1)]">
                    {y}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Publications List */}
          <div className="space-y-6">
            {papers.map((paper) => (
              <Card key={paper.id} hover className="p-8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <Badge variant="info">{paper.field}</Badge>
                  <span className="text-xs font-mono text-[var(--ink-2)]">{paper.publishDate}</span>
                </div>

                <h2 className="text-2xl font-bold text-[var(--ink-1)] mb-2 hover:text-[var(--brand)] transition-colors">
                  <Link href={`/research/${paper.slug}`}>{paper.title}</Link>
                </h2>

                <p className="text-xs font-mono text-[var(--brand)] mb-3 dir-ltr text-right">{paper.titleEn}</p>

                <p className="text-sm text-[var(--ink-2)] leading-relaxed mb-6 line-clamp-3">
                  {paper.abstract}
                </p>

                <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2 text-[var(--ink-2)]">
                    <Users className="w-4 h-4 text-[var(--brand)]" />
                    <span>المؤلفون: {(paper.authors ?? []).map((a: unknown) => typeof a === "string" ? a : (a as { name?: string })?.name || "").filter(Boolean).join(" ، ")}</span>
                  </div>
                  <Link
                    href={`/research/${paper.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-[var(--brand)] hover:underline"
                  >
                    <span>صفحة الورقة والاقتباس</span>
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
