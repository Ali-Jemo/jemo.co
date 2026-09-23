import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectSearchFilter from "@/components/ProjectSearchFilter";
import RevealGroup from "@/components/RevealGroup";
import { getLiveProjects } from "@/lib/live-content";
import { FolderGit2, Cpu, Users, Rocket } from "lucide-react";

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
          <RevealGroup className="max-w-4xl mb-12 sm:mb-16">
            <div
              data-cohere-item=""
              style={{ "--cohere-delay": "0ms" } as CSSProperties}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-white font-mono text-xs uppercase tracking-widest text-[#445e5f] mb-4 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
              <span>المشاريع البرمجية المفتوحة · SOVEREIGN OPEN REPOSITORIES</span>
            </div>
            <h1
              data-cohere-item=""
              style={{ "--cohere-delay": "90ms" } as CSSProperties}
              className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-[#222f30] mb-4 tracking-tight leading-tight font-kufi"
            >
              المشاريع والنوى السيادية.
            </h1>
            <p
              data-cohere-item=""
              style={{ "--cohere-delay": "180ms" } as CSSProperties}
              className="text-base sm:text-xl text-[#445e5f] leading-relaxed max-w-2xl"
            >
              منظومات برمجية ونوى تشغيل متقدمة طُوّرت داخل مختبرات JEMO ومتاحة للجميع مجاناً تحت تراخيص مفتوحة المصدر.
            </p>

            {/* Desktop-first stats band — same pattern as initiatives */}
            <div
              data-cohere-item=""
              style={{ "--cohere-delay": "260ms" } as CSSProperties}
              className="init-stats mt-8"
            >
              {[
                { icon: FolderGit2, label: "مشروع مفتوح", value: String(projects.length) },
                {
                  icon: Cpu,
                  label: "تقنية مفتوحة المصدر",
                  value: String(new Set(projects.flatMap((p) => p.techStack)).size),
                },
                {
                  icon: Users,
                  label: "مساهم فريد",
                  value: String(new Set(projects.flatMap((p) => p.team.map((m) => m.name))).size),
                },
                {
                  icon: Rocket,
                  label: "قيد التطوير النشط",
                  value: String(projects.filter((p) => p.status === "Active").length),
                },
              ].map((s) => (
                <div key={s.label} className="init-stat">
                  <s.icon className="w-5 h-5 text-[var(--brand)] mx-auto mb-2" />
                  <div className="init-stat__number">{s.value}</div>
                  <div className="init-stat__label">{s.label}</div>
                </div>
              ))}
            </div>
          </RevealGroup>

          <ProjectSearchFilter projects={projects} />
        </div>
      </main>
      <Footer />
    </>
  );
}
