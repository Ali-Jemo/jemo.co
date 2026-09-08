import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Badge from "@/components/ui/Badge";
import CitationBox from "@/components/ui/CitationBox";
import Card from "@/components/ui/Card";
import PaperReaderModal from "@/components/PaperReaderModal";
import ExportCitationModal from "@/components/ExportCitationModal";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLiveResearchPapers } from "@/lib/live-content";
import { Download, Code2, Database, FileText, Calendar, Tag, UserCheck, ArrowRight } from "lucide-react";

interface PaperPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PaperPageProps): Promise<Metadata> {
  const { slug } = await params;
  const papers = await getLiveResearchPapers();
  const paper = papers.find((p) => p.slug === slug);
  if (!paper) return { title: "الورقة غير موجودة | JEMO LABS" };
  return {
    title: `${paper.title} | أبحاث JEMO LABS`,
    description: paper.abstract,
  };
}

export default async function PaperDetailPage({ params }: PaperPageProps) {
  const { slug } = await params;
  const papers = await getLiveResearchPapers();
  const paper = papers.find((p) => p.slug === slug);
  if (!paper) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--ink-2)] hover:text-[var(--brand)] mb-8 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة الأبحاث</span>
          </Link>

          {/* Paper Header */}
          <div className="space-y-4 mb-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="info">{paper.field}</Badge>
                <span className="text-xs font-mono text-[var(--ink-2)] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {paper.publishDate}
                </span>
                {paper.doi && (
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-2)] dir-ltr">
                    DOI: {paper.doi}
                  </span>
                )}
              </div>
              <ExportCitationModal paper={paper} />
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-1)] leading-tight">
              {paper.title}
            </h1>

            <p className="text-sm font-mono text-[var(--brand)] dir-ltr text-right">
              {paper.titleEn}
            </p>

            {/* Authors list */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--line)]">
              {paper.authors.map((author) => (
                <Link
                  key={author.slug}
                  href={`/researchers/${author.slug}`}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)] transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-[var(--brand)]" />
                  <div>
                    <div className="text-sm font-bold text-[var(--ink-1)]">{author.name}</div>
                    {author.role && <div className="text-[10px] text-[var(--ink-2)]">{author.role}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Interactive Reader Button */}
          <div className="mb-6">
            <PaperReaderModal paper={paper} />
          </div>

          {/* Action Links (PDF, Dataset, Code) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[var(--brand)] text-white font-bold text-sm shadow-md hover:opacity-90 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>تحميل الورقة (PDF)</span>
            </a>

            {paper.datasetUrl ? (
              <a
                href={paper.datasetUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-1)] font-bold text-sm hover:border-[var(--brand)] transition-all"
              >
                <Database className="w-4 h-4 text-[var(--brand)]" />
                <span>مجموعة البيانات (Dataset)</span>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-2)] text-xs font-mono opacity-50">
                البيانات مدمجة مع الكود
              </div>
            )}

            {paper.codeUrl ? (
              <a
                href={paper.codeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-1)] font-bold text-sm hover:border-[var(--brand)] transition-all"
              >
                <Code2 className="w-4 h-4 text-[var(--brand)]" />
                <span>المصدر المفتوح (Code)</span>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-2)] text-xs font-mono opacity-50">
                الكود قيد المراجعة
              </div>
            )}
          </div>

          {/* Abstract */}
          <Card className="p-8 mb-12">
            <h2 className="text-xl font-bold text-[var(--ink-1)] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--brand)]" />
              <span>الملخص الأكاديمي (Abstract)</span>
            </h2>
            <p className="text-[var(--ink-1)] leading-[2] text-lg md:text-xl text-justify font-medium opacity-90">
              {paper.abstract}
            </p>
          </Card>

          {/* Keywords */}
          <div className="mb-12">
            <h3 className="text-xs font-mono text-[var(--ink-2)] uppercase mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>الكلمات المفتاحية (Keywords)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {paper.keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] text-xs font-mono text-[var(--ink-1)]"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          {/* Citation Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[var(--ink-1)]">الاقتباس الأكاديمي (Citation)</h3>
            <CitationBox bibtex={paper.citation.bibtex} apa={paper.citation.apa} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
