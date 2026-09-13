import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RESEARCH_LABS, RESEARCH_PAPERS, RESEARCH_PROJECTS, RESEARCHERS } from "@/lib/data/research-data";
import { getLabNews } from "@/lib/data/lab-news";
import { Cpu, ArrowRight, Users, FileText, FolderGit2, ArrowUpLeft, UserCheck, Newspaper, Calendar } from "lucide-react";

interface LabPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LabPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lab = RESEARCH_LABS.find((l) => l.slug === slug);
  if (!lab) return { title: "المختبر غير موجود | JEMO LABS" };

  return {
    title: `${lab.name} | مختبرات JEMO LABS`,
    description: lab.description,
  };
}

export default async function LabDetailPage({ params }: LabPageProps) {
  const { slug } = await params;
  const lab = RESEARCH_LABS.find((l) => l.slug === slug);
  if (!lab) notFound();
  const labPapers = RESEARCH_PAPERS.filter((p) => p.labSlug === lab.slug);
  const labProjects = RESEARCH_PROJECTS.filter((p) => p.labSlug === lab.slug);
  const labResearchers = RESEARCHERS.filter((r) => r.labSlug === lab.slug);
  const labNews = getLabNews(lab.slug);

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <Link
            href="/labs"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--ink-2)] hover:text-[var(--brand)] mb-8 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة المختبرات</span>
          </Link>

          {/* Header */}
          <div className="space-y-4 mb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-1)]">
              {lab.name}
            </h1>
            <p className="text-sm font-mono text-[var(--brand)] dir-ltr text-right">
              {lab.nameEn}
            </p>
            <p className="text-lg text-[var(--ink-2)] leading-relaxed">
              {lab.description}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-12 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] text-center font-mono">
            <div>
              <div className="text-2xl font-bold text-[var(--brand)]">{lab.researchersCount}</div>
              <div className="text-xs text-[var(--ink-2)]">باحثاً</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--brand)]">{lab.activeProjectsCount}</div>
              <div className="text-xs text-[var(--ink-2)]">مشروعاً نشطاً</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--brand)]">{lab.publishedPapersCount}</div>
              <div className="text-xs text-[var(--ink-2)]">ورقة علمية</div>
            </div>
          </div>

          {/* Focus Areas */}
          <Card className="p-8 mb-12">
            <h2 className="text-xl font-bold text-[var(--ink-1)] mb-4">مجالات التركيز الأكاديمي</h2>
            <div className="flex flex-wrap gap-2">
              {lab.focusAreas.map((area) => (
                <span
                  key={area}
                  className="px-3.5 py-1.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm font-mono text-[var(--ink-1)]"
                >
                  {area}
                </span>
              ))}
            </div>
          </Card>

          {/* Lab Researchers */}
          {labResearchers.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[var(--ink-1)] mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--brand)]" />
                <span>فريق الباحثين</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {labResearchers.map((r) => (
                  <Card key={r.id} hover className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[var(--brand)] flex items-center justify-center font-bold font-mono shrink-0">
                      {r.name.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <Link href={`/researchers/${r.slug}`} className="font-bold text-[var(--ink-1)] hover:text-[var(--brand)] transition-colors block truncate">
                        {r.name}
                      </Link>
                      <p className="text-xs text-[var(--ink-2)] truncate">{r.role}</p>
                      <p className="text-[10px] font-mono text-[var(--ink-2)] mt-1">{r.papersCount} أوراق • {r.projectsCount} مشاريع</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Active Lab Projects */}
          {labProjects.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[var(--ink-1)] mb-6 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-[var(--brand)]" />
                <span>مشاريع المختبر النشطة</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {labProjects.map((proj) => (
                  <Card key={proj.id} hover className="p-6">
                    <h3 className="font-bold text-lg mb-2">
                      <Link href={`/projects/${proj.slug}`}>{proj.title}</Link>
                    </h3>
                    <p className="text-xs text-[var(--ink-2)] mb-4">{proj.description}</p>
                    <Link href={`/projects/${proj.slug}`} className="text-xs font-bold text-[var(--brand)] flex items-center gap-1">
                      <span>عرض المشروع</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Lab Papers */}
          {labPapers.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[var(--ink-1)] mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--brand)]" />
                <span>الأوراق البحثية الصادرة عن المختبر</span>
              </h2>
              <div className="space-y-4">
                {labPapers.map((paper) => (
                  <Card key={paper.id} hover className="p-6">
                    <h3 className="font-bold text-lg mb-2">
                      <Link href={`/research/${paper.slug}`}>{paper.title}</Link>
                    </h3>
                    <p className="text-xs text-[var(--ink-2)] mb-4">{paper.abstract}</p>
                    <Link href={`/research/${paper.slug}`} className="text-xs font-bold text-[var(--brand)] flex items-center gap-1">
                      <span>تفاصيل الورقة والمصادر</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Lab News */}
          {labNews.length > 0 && (
            <section className="mb-12" aria-labelledby="lab-news-heading">
              <div className="flex items-end justify-between gap-4 mb-4">
                <div>
                  <h2 id="lab-news-heading" className="text-2xl font-bold text-[var(--ink-1)] flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-[var(--brand)]" />
                    أخبار المختبر
                  </h2>
                  <p className="text-sm text-[var(--ink-2)] mt-1">آخر المستجدات والإعلانات الخاصة بهذا المختبر.</p>
                </div>
                <Link href="/news" className="text-xs font-bold text-[var(--brand)] hover:underline">كل الأخبار</Link>
              </div>
              <div className="space-y-3">
                {labNews.map((item) => (
                  <Card key={item.id} hover className="p-5">
                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--ink-2)] mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </div>
                    <Link href={`/news/${item.slug}`} className="font-bold text-[var(--ink-1)] hover:text-[var(--brand)] transition-colors">
                      {item.title}
                    </Link>
                    <p className="text-sm text-[var(--ink-2)] mt-2 leading-relaxed">{item.summary}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
