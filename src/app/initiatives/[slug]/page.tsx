import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import InitiativeGallery from "@/components/InitiativeGallery";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INITIATIVES, RESEARCHERS, RESEARCH_PROJECTS } from "@/lib/data/research-data";
import {
  CheckCircle2, UserCheck, Target,
  Users, Clock, ArrowUpLeft, ExternalLink, Tag, Rocket,
  BookOpen, Briefcase, ChevronDown, ChevronUp,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

interface InitiativePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: InitiativePageProps): Promise<Metadata> {
  const { slug } = await params;
  const init = INITIATIVES.find((i) => i.slug === slug);
  if (!init) return { title: "المبادرة غير موجودة | JEMO LABS" };

  return {
    title: `${init.title} | مبادرات JEMO LABS`,
    description: init.fullDescription || init.description,
    openGraph: {
      title: init.title,
      description: init.fullDescription || init.description,
      type: "article",
      images: init.image ? [{ url: init.image }] : undefined,
    },
  };
}

const STATUS_LABELS: Record<string, string> = {
  Research: "بحث",
  Active: "نشط",
  Scaling: "توسع",
  Completed: "مكتمل",
};

export default async function InitiativeDetailPage({ params }: InitiativePageProps) {
  const { slug } = await params;
  const init = INITIATIVES.find((i) => i.slug === slug);
  if (!init) notFound();

  const progressColor = init.progress >= 80 ? "#22c55e" : init.progress >= 50 ? "#d97706" : "#5b9bd5";

  // Related: initiatives by same lead
  const relatedInitiatives = INITIATIVES.filter(
    (i) => i.slug !== slug && (i.lead === init.lead || i.team?.some((t) => init.team?.includes(t)))
  ).slice(0, 3);

  // Related researchers
  const relatedResearchers = RESEARCHERS.filter((r) =>
    init.team?.some((t) => t.includes(r.name))
  ).slice(0, 4);

  // Related projects (via tags)
  const relatedProjects = RESEARCH_PROJECTS.filter((p) =>
    init.tags?.some((tag) => p.techStack.some((t) => t.toLowerCase().includes(tag.toLowerCase())))
  ).slice(0, 3);

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <Link
            href="/initiatives"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--ink-2)] hover:text-[var(--brand)] mb-8 transition-colors"
          >
            <ArrowUpLeft className="w-4 h-4" />
            <span>العودة لقائمة المبادرات</span>
          </Link>

          {/* Gallery */}
          <InitiativeGallery image={init.image} gallery={init.gallery} title={init.title} />

          {/* Header */}
          <div className="space-y-4 mb-10 init-detail-header">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">
                  {init.progress}% متقدم
                </span>
                <span className={`status-badge status-badge--${init.status.toLowerCase()}`}>
                  {STATUS_LABELS[init.status] || init.status}
                </span>
              </div>
              <span className="text-xs font-mono text-[var(--ink-2)]">
                <Clock className="w-3 h-3 inline" /> آخر تحديث: 2026
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-1)] leading-tight">
              {init.title}
            </h1>

            {/* Expandable fullDescription */}
            {init.fullDescription && <FullDescription text={init.fullDescription} />}
            <p className="text-base text-[var(--ink-2)] leading-relaxed">
              {init.description}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[var(--surface)] h-3 rounded-full overflow-hidden border border-[var(--line)] mb-12">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${init.progress}%`, backgroundColor: progressColor }}
            />
          </div>

          {/* Vision & Deliverables */}
          <Card className="p-8 mb-12 space-y-6">
            <div className="flex items-center gap-2 text-xl font-bold text-[var(--ink-1)]">
              <Target className="w-5 h-5 text-[var(--brand)]" />
              <h2>الرؤية والأثر المستهدف</h2>
            </div>
            <p className="text-[var(--ink-2)] leading-relaxed text-base">
              {init.vision}
            </p>

            <div className="pt-4 border-t border-[var(--line)]">
              <h3 className="text-sm font-mono text-[var(--ink-2)] uppercase mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                المخرجات الرئيسية (Deliverables)
              </h3>
              <div className="space-y-2">
                {init.deliverables.map((d) => (
                  <div key={d} className="deliverable-card">
                    <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {init.tags && init.tags.length > 0 && (
              <div className="pt-4 border-t border-[var(--line)]">
                <h3 className="text-sm font-mono text-[var(--ink-2)] uppercase mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  الوسوم
                </h3>
                <div className="flex flex-wrap gap-2">
                  {init.tags.map((tag) => (
                    <span key={tag} className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-2)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Milestones Timeline */}
          {init.milestones && init.milestones.length > 0 && (
            <Card className="p-8 mb-12 space-y-4">
              <div className="flex items-center gap-2 text-xl font-bold text-[var(--ink-1)]">
                <Rocket className="w-5 h-5 text-[var(--brand)]" />
                <h2>المعالم والمحطات</h2>
              </div>
              <div className="space-y-2">
                {init.milestones.map((m, i) => (
                  <div key={i} className={`milestone ${m.done ? "milestone--done" : ""}`}>
                    <div className="milestone__dot" />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="milestone__title">{m.title}</div>
                        <div className="milestone__date">{m.date}</div>
                      </div>
                      {m.done && (
                        <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Team */}
          {init.team && init.team.length > 0 && (
            <Card className="p-8 mb-12 space-y-6">
              <div className="flex items-center gap-2 text-xl font-bold text-[var(--ink-1)]">
                <Users className="w-5 h-5 text-[var(--brand)]" />
                <h2>الفريق</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {init.team.map((member) => {
                  const researcher = RESEARCHERS.find((r) => r.name === member);
                  return (
                    <div key={member} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--brand)] transition-colors">
                      {researcher ? (
                        <>
                          <div className="w-10 h-10 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)] font-bold text-sm font-kufi">
                            {researcher.name.charAt(0)}
                          </div>
                          <div>
                            <Link href={`/researchers/${researcher.slug}`} className="text-sm font-bold text-[var(--ink-1)] hover:text-[var(--brand)] transition-colors">
                              {researcher.name}
                            </Link>
                            <div className="text-xs text-[var(--ink-2)]">{researcher.role}</div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--ink-2)]">
                            <UserCheck className="w-5 h-5" />
                          </div>
                          <span className="text-sm text-[var(--ink-1)]">{member}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <Card className="p-8 mb-12">
              <div className="flex items-center gap-2 text-xl font-bold text-[var(--ink-1)] mb-6">
                <Briefcase className="w-5 h-5 text-[var(--brand)]" />
                <h2>المشاريع ذات الصلة</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedProjects.map((proj) => (
                  <Link
                    key={proj.id}
                    href={`/projects/${proj.slug}`}
                    className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--brand)] transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-[var(--ink-1)] group-hover:text-[var(--brand)] transition-colors">
                        {proj.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--ink-2)]">
                        {proj.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--ink-2)] leading-relaxed line-clamp-2">
                      {proj.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Related Researchers */}
          {relatedResearchers.length > 0 && (
            <Card className="p-8 mb-12">
              <div className="flex items-center gap-2 text-xl font-bold text-[var(--ink-1)] mb-6">
                <UserCheck className="w-5 h-5 text-[var(--brand)]" />
                <h2>باحثون مرتبطون</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedResearchers.map((r) => (
                  <Link
                    key={r.id}
                    href={`/researchers/${r.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--brand)] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)] font-bold text-sm font-kufi">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--ink-1)] group-hover:text-[var(--brand)] transition-colors">
                        {r.name}
                      </div>
                      <div className="text-xs text-[var(--ink-2)]">{r.role}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Related Initiatives */}
          {relatedInitiatives.length > 0 && (
            <Card className="p-8 mb-12">
              <div className="flex items-center gap-2 text-xl font-bold text-[var(--ink-1)] mb-6">
                <BookOpen className="w-5 h-5 text-[var(--brand)]" />
                <h2>مبادرات ذات صلة</h2>
              </div>
              <div className="space-y-3">
                {relatedInitiatives.map((ri) => (
                  <Link
                    key={ri.id}
                    href={`/initiatives/${ri.slug}`}
                    className="related-init block"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-[var(--ink-1)]">{ri.title}</div>
                        <div className="related-init__slug">{ri.slug}</div>
                      </div>
                      <span className="text-xs font-mono text-[var(--brand)]">{ri.progress}%</span>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Lead + CTA */}
          <Card className="p-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-[var(--brand)]" />
              <div>
                <div className="text-xs text-[var(--ink-2)]">قيادة وتنسيق المبادرة</div>
                <div className="font-bold text-[var(--ink-1)]">{init.lead}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {init.link && (
                <a
                  href={init.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--brand)] font-bold text-sm hover:border-[var(--brand)] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>المستودع</span>
                </a>
              )}
              <Link
                href="/join"
                className="px-5 py-3 rounded-xl bg-[var(--brand)] text-white font-bold text-sm hover:opacity-90 transition-opacity"
              >
                ساهم في المبادرة
              </Link>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Expandable fullDescription component
function FullDescription({ text }: { text: string }) {
  const [open, setOpen] = React.useState(false);

  if (!text) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-[var(--brand)] hover:underline mb-2"
      >
        {open ? (
          <>
            <ChevronUp className="w-4 h-4" />
            <span>إخفاء التفاصيل الكاملة</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            <span>عرض التفاصيل الكاملة</span>
          </>
        )}
      </button>
      {open && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="text-base text-[var(--ink-2)] leading-relaxed"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
