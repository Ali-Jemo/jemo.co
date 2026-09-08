import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RESEARCHERS, RESEARCH_PAPERS, RESEARCH_PROJECTS, RESEARCH_LABS } from "@/lib/data/research-data";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { ArrowRight, Mail, FileText, FolderGit2, BookOpen } from "lucide-react";

interface ResearcherPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ResearcherPageProps): Promise<Metadata> {
  const { slug } = await params;
  const researcher = RESEARCHERS.find((r) => r.slug === slug);
  if (!researcher) return { title: "الباحث غير موجود | JEMO LABS" };

  return {
    title: `${researcher.name} | الباحثون في JEMO LABS`,
    description: researcher.bio,
  };
}

export default async function ResearcherDetailPage({ params }: ResearcherPageProps) {
  const { slug } = await params;
  const researcher = RESEARCHERS.find((r) => r.slug === slug);
  if (!researcher) notFound();

  const lab = RESEARCH_LABS.find((l) => l.slug === researcher.labSlug);

  const authoredPapers = RESEARCH_PAPERS.filter((p) => p.authors.some((a) => a.slug === researcher.slug));
  const ledProjects = RESEARCH_PROJECTS.filter((p) => p.team.some((t) => t.slug === researcher.slug));

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <Link
            href="/researchers"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--ink-2)] hover:text-[var(--brand)] mb-8 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لدليل الباحثين</span>
          </Link>

          {/* Scholar Profile Header */}
          <Card className="p-8 md:p-10 mb-12 flex flex-col md:flex-row items-start gap-8">
            <div className="w-24 h-24 rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20 flex items-center justify-center font-mono text-3xl font-extrabold flex-shrink-0">
              {researcher.name.slice(0, 2)}
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--ink-1)]">
                  {researcher.name}
                </h1>
                <p className="text-sm font-bold text-[var(--brand)] mt-1">{researcher.role}</p>
              </div>

              <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                {researcher.bio}
              </p>

              <div className="flex flex-wrap gap-3 items-center">
                {lab && (
                  <Link
                    href={`/labs/${lab.slug}`}
                    className="inline-block"
                  >
                    <Badge variant="info">{lab.name}</Badge>
                  </Link>
                )}
                {researcher.orcid && (
                  <span className="text-xs font-mono text-[var(--ink-2)] bg-[var(--bg)] px-3 py-1.5 rounded-lg border border-[var(--line)] inline-block dir-ltr">
                    ORCID: {researcher.orcid}
                  </span>
                )}
              </div>

              {/* Scholar Social Links */}
              <div className="flex flex-wrap gap-3 pt-2">
                {researcher.github && (
                  <a
                    href={researcher.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink-1)] hover:border-[var(--brand)] transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                {researcher.linkedin && (
                  <a
                    href={researcher.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink-1)] hover:border-[var(--brand)] transition-colors"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5 text-sky-500" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {researcher.scholar && (
                  <a
                    href={researcher.scholar}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink-1)] hover:border-[var(--brand)] transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[var(--brand)]" />
                    <span>Google Scholar</span>
                  </a>
                )}
                <a
                  href={`mailto:${researcher.email}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink-1)] hover:border-[var(--brand)] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{researcher.email}</span>
                </a>
              </div>
            </div>
          </Card>

          {/* Authored Papers (Scholar Style) */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--ink-1)] mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--brand)]" />
              <span>الأوراق العلمية المنشورة ({authoredPapers.length})</span>
            </h2>
            {authoredPapers.length === 0 ? (
              <p className="text-sm text-[var(--ink-2)]">لا توجد أوراق منشورة بعد.</p>
            ) : (
              <div className="space-y-4">
                {authoredPapers.map((paper) => (
                  <Card key={paper.id} hover className="p-6">
                    <div className="text-xs font-mono text-[var(--ink-2)] mb-1">{paper.publishDate}</div>
                    <h3 className="font-bold text-lg text-[var(--ink-1)] mb-2 hover:text-[var(--brand)] transition-colors">
                      <Link href={`/research/${paper.slug}`}>{paper.title}</Link>
                    </h3>
                    <p className="text-xs font-mono text-[var(--brand)] mb-3 dir-ltr text-right">{paper.titleEn}</p>
                    <p className="text-xs text-[var(--ink-2)] line-clamp-2 leading-relaxed mb-4">{paper.abstract}</p>
                    <Link href={`/research/${paper.slug}`} className="text-xs font-bold text-[var(--brand)] hover:underline">
                      عرض الورقة والمصادر →
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Associated Projects */}
          {ledProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[var(--ink-1)] mb-6 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-[var(--brand)]" />
                <span>المشاريع التكنولوجية المساهم فيها ({ledProjects.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ledProjects.map((proj) => (
                  <Card key={proj.id} hover className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="info">{proj.status}</Badge>
                    </div>
                    <h3 className="font-bold text-base mb-2">
                      <Link href={`/projects/${proj.slug}`}>{proj.title}</Link>
                    </h3>
                    <p className="text-xs text-[var(--ink-2)] mb-3">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {proj.techStack.map((tech) => (
                        <span key={tech} className="text-[10px] font-mono text-[var(--brand)] bg-[var(--brand)]/10 px-1.5 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link href={`/projects/${proj.slug}`} className="text-xs font-bold text-[var(--brand)]">
                      صفحة المشروع →
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
