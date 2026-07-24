import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { RESEARCH_LABS } from "@/lib/data/research-data";
import { Cpu, Terminal, Eye, Bot, Activity, Dna, ArrowUpLeft, Users, FileText, FolderGit2 } from "lucide-react";

export const metadata: Metadata = {
  title: "المختبرات البحثية المتخصصة | JEMO LABS",
  description: "مختبرات JEMO LABS للذكاء الاصطناعي، أنظمة التشغيل، الرؤية الحاسوبية، والروبوتات.",
};

const iconMap: Record<string, any> = {
  Cpu,
  Terminal,
  Eye,
  Bot,
  Activity,
  Dna,
};

export default function LabsIndexPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono mb-4">
              <Cpu className="w-3.5 h-3.5" />
              <span>البنية التحتية المعرفية</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)] mb-4">المختبرات البحثية المتخصصة</h1>
            <p className="text-[var(--ink-2)] leading-relaxed">
              تقود مختبراتنا المستقلة الأبحاث في أحدث المجالات العلمية والتكنولوجية السيادية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {RESEARCH_LABS.map((lab) => {
              const Icon = iconMap[lab.iconName] ?? Cpu;
              return (
                <Card key={lab.id} hover className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h2 className="text-2xl font-bold mb-1 text-[var(--ink-1)] hover:text-[var(--brand)] transition-colors">
                      <Link href={`/labs/${lab.slug}`}>{lab.name}</Link>
                    </h2>
                    <p className="text-xs font-mono text-[var(--brand)] mb-4 dir-ltr text-right">{lab.nameEn}</p>

                    <p className="text-sm text-[var(--ink-2)] leading-relaxed mb-6">
                      {lab.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {lab.focusAreas.map((area) => (
                        <span
                          key={area}
                          className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-xs font-mono text-[var(--ink-2)]"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs">
                    <div className="text-[var(--ink-2)] flex items-center gap-3 font-mono">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-[var(--brand)]" /> {lab.researchersCount}</span>
                      <span className="flex items-center gap-1"><FolderGit2 className="w-3.5 h-3.5 text-[var(--brand)]" /> {lab.activeProjectsCount}</span>
                      <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-[var(--brand)]" /> {lab.publishedPapersCount}</span>
                    </div>
                    <Link
                      href={`/labs/${lab.slug}`}
                      className="inline-flex items-center gap-1 font-bold text-[var(--brand)] hover:underline"
                    >
                      <span>تفاصيل المختبر</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </Link>
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
