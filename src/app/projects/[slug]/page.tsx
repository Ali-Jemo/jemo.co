import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RESEARCH_PROJECTS } from "@/lib/data/research-data";
import { FolderGit2, ArrowRight, ExternalLink, Code2, Users, Layers, PlayCircle, CheckCircle2 } from "lucide-react";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const proj = RESEARCH_PROJECTS.find((p) => p.slug === slug);
  if (!proj) return { title: "المشروع غير موجود | JEMO LABS" };

  return {
    title: `${proj.title} | مشاريع JEMO LABS`,
    description: proj.description,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const proj = RESEARCH_PROJECTS.find((p) => p.slug === slug);
  if (!proj) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--ink-2)] hover:text-[var(--brand)] mb-8 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة المشاريع</span>
          </Link>

          {/* Header */}
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[var(--brand)]">
                حالة المشروع: {proj.status}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-1)]">
              {proj.title}
            </h1>

            <p className="text-sm font-mono text-[var(--brand)] dir-ltr text-right">
              {proj.titleEn}
            </p>

            <p className="text-lg text-[var(--ink-2)] leading-relaxed">
              {proj.description}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 mb-12">
            {proj.githubUrl && (
              <a
                href={proj.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--brand)] text-white font-bold text-sm shadow-md hover:opacity-90 transition-all"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>مستودع GitHub المفتوح</span>
              </a>
            )}
            {proj.demoUrl && (
              <a
                href={proj.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-1)] font-bold text-sm hover:border-[var(--brand)] transition-all"
              >
                <ExternalLink className="w-4 h-4 text-[var(--brand)]" />
                <span>التطبيق التفاعلي (Live Demo)</span>
              </a>
            )}
          </div>

          {/* Detailed Info */}
          <Card className="p-8 mb-12 space-y-6">
            <h2 className="text-2xl font-bold text-[var(--ink-1)] border-b border-[var(--line)] pb-4">
              نظرة عامة وأهداف المشروع
            </h2>
            <p className="text-[var(--ink-2)] leading-relaxed text-base">
              {proj.fullDescription}
            </p>

            <div className="pt-4 border-t border-[var(--line)]">
              <h3 className="text-sm font-mono text-[var(--ink-2)] uppercase mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[var(--brand)]" />
                <span>التقنيات والمكتبات المستخدمة (Tech Stack)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {proj.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs font-mono font-bold text-[var(--ink-1)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Team Members */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--ink-1)] flex items-center gap-2">
              <Users className="w-6 h-6 text-[var(--brand)]" />
              <span>فريق أبحاث المشروع</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {proj.team.map((member) => (
                <Link
                  key={member.slug}
                  href={`/researchers/${member.slug}`}
                  className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)] transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] font-bold flex items-center justify-center font-mono">
                    {member.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-[var(--ink-1)]">{member.name}</div>
                    <div className="text-xs text-[var(--ink-2)]">{member.role}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
