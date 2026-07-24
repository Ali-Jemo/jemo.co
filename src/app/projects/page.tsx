import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectSearchFilter from "@/components/ProjectSearchFilter";
import { RESEARCH_PROJECTS } from "@/lib/data/research-data";
import { FolderGit2 } from "lucide-react";

export const metadata: Metadata = {
  title: "المشاريع المفتوحة | JEMO LABS",
  description: "مستودع المشاريع البرمجية والنوى التشغيلية المفتوحة المصدر المبتكرة في JEMO LABS.",
};

export default function ProjectsIndexPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono mb-4">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>البنية التحتية المفتوحة المصدر</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)] mb-4">مشاريع المختبرات</h1>
            <p className="text-[var(--ink-2)] leading-relaxed">
              منظومات برمجية ونوى تشغيل سيادية طُورت في العراق ومتاحة للجميع مجاناً.
            </p>
          </div>

          <ProjectSearchFilter projects={RESEARCH_PROJECTS} />
        </div>
      </main>
      <Footer />
    </>
  );
}
