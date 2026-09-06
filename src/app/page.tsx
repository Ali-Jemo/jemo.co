"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LivingMuseumTimeline from "@/components/LivingMuseumTimeline";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CountUp from "@/components/CountUp";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  INSTITUTION_STATS,
  RESEARCH_PAPERS,
  RESEARCH_PROJECTS,
  INITIATIVES,
  ABOUT_INFO,
} from "@/lib/data/research-data";
import {
  BookOpen,
  FolderGit2,
  Users,
  ArrowUpLeft,
  Sparkles,
  ChevronLeft,
  ShieldCheck,
  Atom,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* INSTITUTIONAL KNOWLEDGE HERO */}
        <section className="relative overflow-hidden py-20 md:py-28 bg-[var(--bg)] border-b border-[var(--line)]">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] text-xs font-mono"
              >
                <Atom className="w-4 h-4 animate-spin-slow" />
                <span>بيت الحكمة الرقمي — JEMO LABS</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ink-1)] leading-tight"
              >
                المعرفة المفتوحة <br />
                <span className="text-gradient">والأبحاث الرقمية السيادية</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-[var(--ink-2)] leading-relaxed max-w-3xl mx-auto"
              >
                {ABOUT_INFO.coreQuote}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-4 pt-4"
              >
                <Link href="/research">
                  <Button variant="primary" size="lg" className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>الأوراق البحثية</span>
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="outline" size="lg" className="gap-2">
                    <FolderGit2 className="w-4 h-4" />
                    <span>المشاريع المفتوحة</span>
                  </Button>
                </Link>
                <Link href="/transparency">
                  <Button variant="ghost" size="lg" className="gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>تقرير الشفافية</span>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* INSTITUTION STATS */}
        <section className="py-16 bg-[var(--surface)] border-b border-[var(--line)]">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              <div className="p-6 rounded-2xl bg-[var(--bg)] border border-[var(--line)]">
                <div className="text-3xl md:text-4xl font-mono font-extrabold text-[var(--brand)] mb-1">
                  <CountUp to={INSTITUTION_STATS.papers} />
                </div>
                <div className="text-xs text-[var(--ink-2)] font-bold">Research Papers</div>
                <div className="text-xs text-[var(--ink-2)] font-sans mt-0.5">أوراق علمية محكمة</div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--bg)] border border-[var(--line)]">
                <div className="text-3xl md:text-4xl font-mono font-extrabold text-[var(--brand)] mb-1">
                  <CountUp to={INSTITUTION_STATS.projects} />
                </div>
                <div className="text-xs text-[var(--ink-2)] font-bold">Open Projects</div>
                <div className="text-xs text-[var(--ink-2)] font-sans mt-0.5">مشروعاً مفتوح المصدر</div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--bg)] border border-[var(--line)]">
                <div className="text-3xl md:text-4xl font-mono font-extrabold text-[var(--brand)] mb-1">
                  <CountUp to={INSTITUTION_STATS.researchers} />
                </div>
                <div className="text-xs text-[var(--ink-2)] font-bold">Researchers</div>
                <div className="text-xs text-[var(--ink-2)] font-sans mt-0.5">باحثاً وعالماً</div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--bg)] border border-[var(--line)]">
                <div className="text-3xl md:text-4xl font-mono font-extrabold text-[var(--brand)] mb-1">
                  <CountUp to={INSTITUTION_STATS.fields} />
                </div>
                <div className="text-xs text-[var(--ink-2)] font-bold">Research Fields</div>
                <div className="text-xs text-[var(--ink-2)] font-sans mt-0.5">مجالات بحثية متخصصة</div>
              </div>

              <div className="col-span-2 md:col-span-1 p-6 rounded-2xl bg-[var(--bg)] border border-[var(--line)]">
                <div className="text-3xl md:text-4xl font-mono font-extrabold text-[var(--brand)] mb-1">
                  {INSTITUTION_STATS.founded}
                </div>
                <div className="text-xs text-[var(--ink-2)] font-bold">Founded</div>
                <div className="text-xs text-[var(--ink-2)] font-sans mt-0.5">سنة التأسيس</div>
              </div>
            </div>
          </div>
        </section>

        {/* LATEST RESEARCH */}
        <section className="py-20 bg-[var(--bg)] border-b border-[var(--line)]">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
              <SectionHeader
                eyebrow="الأبحاث العلمية"
                title="آخر الأوراق البحثية المنشورة"
                description="مخرجات أكاديمية محكمة متاحة مجاناً بكافة بياناتها وشيفراتها للباحثين."
              />
              <Link
                href="/research"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--brand)] hover:underline"
              >
                <span>استعرض كافة الأوراق ({RESEARCH_PAPERS.length})</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {RESEARCH_PAPERS.map((paper) => (
                <Card key={paper.id} hover className="p-7 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <Badge variant="info">{paper.field}</Badge>
                      <span className="text-xs font-mono text-[var(--ink-2)]">{paper.publishDate}</span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-[var(--ink-1)] hover:text-[var(--brand)] transition-colors">
                      <Link href={`/research/${paper.slug}`}>{paper.title}</Link>
                    </h3>

                    <p className="text-xs font-mono text-[var(--brand)] mb-3 dir-ltr text-right">{paper.titleEn}</p>

                    <p className="text-sm text-[var(--ink-2)] line-clamp-3 leading-relaxed mb-6">
                      {paper.abstract}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-[var(--ink-2)]">
                      <Users className="w-3.5 h-3.5 text-[var(--brand)]" />
                      <span>{paper.authors.map((a) => a.name).join(" ، ")}</span>
                    </div>
                    <Link
                      href={`/research/${paper.slug}`}
                      className="inline-flex items-center gap-1 font-bold text-[var(--brand)] hover:underline"
                    >
                      <span>قراءة الورقة والبيانات</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* LATEST PROJECTS */}
        <section className="py-20 bg-[var(--surface)] border-b border-[var(--line)]">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
              <SectionHeader
                eyebrow="المشاريع التقنية"
                title="أحدث مشاريع المختبرات"
                description="منظومات برمجية ونوى تشغيلية مفتوحة المصدر طُورت في العراق."
              />
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--brand)] hover:underline"
              >
                <span>كافة المشاريع ({RESEARCH_PROJECTS.length})</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RESEARCH_PROJECTS.slice(0, 3).map((proj) => (
                <Card key={proj.id} hover className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[var(--bg)] border border-[var(--line)] text-[var(--brand)]">
                        {proj.status}
                      </span>
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors"
                          title="GitHub Repository"
                        >
                          <FolderGit2 className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <h3 className="text-lg font-bold mb-2 text-[var(--ink-1)] hover:text-[var(--brand)] transition-colors">
                      <Link href={`/projects/${proj.slug}`}>{proj.title}</Link>
                    </h3>

                    <p className="text-xs text-[var(--ink-2)] leading-relaxed mb-4">
                      {proj.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[10px] font-mono text-[var(--ink-2)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/projects/${proj.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[var(--brand)] hover:underline"
                    >
                      <span>تفاصيل المشروع</span>
                      <ArrowUpLeft className="w-3 h-3" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* INITIATIVES SHOWCASE */}
        <section className="py-20 bg-[var(--bg)] border-b border-[var(--line)]">
          <div className="container">
            <SectionHeader
              eyebrow="المبادرات الحالية"
              title="مبادرات JEMO LABS للتمكين المعرفي"
              description="مبادرات استراتيجية طويلة المدى لبناء البنية التحتية العلمية وتأهيل الكوادر."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {INITIATIVES.map((init) => (
                <Card key={init.id} hover className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[var(--brand)] font-bold">
                      تقدم المبادرة: {init.progress}%
                    </span>
                    <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[var(--ink-1)]">
                    <Link href={`/initiatives/${init.slug}`}>{init.title}</Link>
                  </h3>
                  <p className="text-xs text-[var(--ink-2)] leading-relaxed mb-4">
                    {init.description}
                  </p>
                  <div className="w-full bg-[var(--bg)] h-2 rounded-full overflow-hidden border border-[var(--line)] mb-4">
                    <div
                      className="bg-[var(--brand)] h-full rounded-full transition-all duration-500"
                      style={{ width: `${init.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-[var(--ink-2)] font-mono">
                    مسؤول المبادرة: <span className="text-[var(--ink-1)] font-bold">{init.lead}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* LIVING MUSEUM TIMELINE */}
        <section className="py-24 bg-[var(--surface)] border-b border-[var(--line)]">
          <div className="container">
            <LivingMuseumTimeline showFull={false} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
