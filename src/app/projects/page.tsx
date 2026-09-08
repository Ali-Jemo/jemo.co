import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectSearchFilter from "@/components/ProjectSearchFilter";
import { getLiveProjects } from "@/lib/live-content";
import { FolderGit2 } from "lucide-react";

export const metadata: Metadata = {
  title: "المشاريع المفتوحة | JEMO LABS",
  description: "مستودع المشاريع البرمجية والنوى التشغيلية المفتوحة المصدر المبتكرة في JEMO LABS.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsIndexPage() {
  const projects = await getLiveProjects();
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 sm:pt-28 pb-20 bg-[#f7f7f5]" dir="rtl">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-4xl mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-white font-mono text-xs uppercase tracking-widest text-[#445e5f] mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
              <span>المشاريع البرمجية المفتوحة · SOVEREIGN OPEN REPOSITORIES</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#222f30] mb-4 tracking-tight leading-tight font-kufi">
              المشاريع والنوى السيادية.
            </h1>
            <p className="text-base sm:text-xl text-[#445e5f] leading-relaxed max-w-2xl">
              منظومات برمجية ونوى تشغيل متقدمة طُوّرت داخل مختبرات JEMO ومتاحة للجميع مجاناً تحت تراخيص مفتوحة المصدر.
            </p>
          </div>

          <ProjectSearchFilter projects={projects} />
        </div>
      </main>
      <Footer />
    </>
  );
}
