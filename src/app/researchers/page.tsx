import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { getLiveLabs, getLiveResearchers } from "@/lib/live-content";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { Users, ArrowUpLeft, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "دليل الباحثين | JEMO LABS",
  description: "العلماء والمهندسون في مختبرات JEMO LABS للأبحاث الرقمية والسيادية.",
};

export default async function ResearchersIndexPage() {
  const [researchers, labs] = await Promise.all([getLiveResearchers(), getLiveLabs()]);

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono mb-4">
              <Users className="w-3.5 h-3.5" />
              <span>المجتمع الأكاديمي</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)] mb-4">الباحثون والعلماء</h1>
            <p className="text-[var(--ink-2)] leading-relaxed">
              دليل أعضاء الهيئة البحثية والزملاء الأكاديميين في JEMO LABS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {researchers.map((r) => {
              const lab = labs.find((l) => l.slug === r.labSlug);
              return (
                <Card key={r.id} hover className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[var(--brand)] flex items-center justify-center font-bold text-xl font-mono mb-6">
                      {r.name.slice(0, 2)}
                    </div>

                    <h2 className="text-2xl font-bold mb-1 text-[var(--ink-1)] hover:text-[var(--brand)] transition-colors">
                      <Link href={`/researchers/${r.slug}`}>{r.name}</Link>
                    </h2>
                    <p className="text-xs font-semibold text-[var(--brand)] mb-4">{r.role}</p>

                    <p className="text-sm text-[var(--ink-2)] leading-relaxed line-clamp-3 mb-6">
                      {r.bio}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {r.github && (
                        <a
                          href={r.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors"
                          aria-label="GitHub"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {r.linkedin && (
                        <a
                          href={r.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors"
                          aria-label="LinkedIn"
                        >
                          <LinkedinIcon className="w-3.5 h-3.5 text-sky-500" />
                        </a>
                      )}
                      {r.scholar && (
                        <a
                          href={r.scholar}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors"
                          aria-label="Google Scholar"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {lab && (
                        <Link
                          href={`/labs/${lab.slug}`}
                          className="text-[10px] font-mono inline-block"
                        >
                          <Badge variant="info">{lab.name}</Badge>
                        </Link>
                      )}
                      {r.orcid && (
                        <span className="text-[10px] font-mono text-[var(--ink-2)] bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--line)] dir-ltr">
                          ORCID: {r.orcid}
                        </span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs">
                      <div className="text-[var(--ink-2)] font-mono">
                        <span>{r.papersCount} أوراق</span> • <span>{r.projectsCount} مشاريع</span>
                      </div>
                      <Link
                        href={`/researchers/${r.slug}`}
                        className="inline-flex items-center gap-1 font-bold text-[var(--brand)] hover:underline"
                      >
                        <span>الملف الأكاديمي</span>
                        <ArrowUpLeft className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
