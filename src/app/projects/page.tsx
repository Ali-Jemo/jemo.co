import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectSearchFilter from "@/components/ProjectSearchFilter";
import RevealGroup from "@/components/RevealGroup";
import { getLiveProjects } from "@/lib/live-content";
import { FolderGit2, Cpu, Users, Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "المشاريع",
  description: "ZiqaKernel وAxiq-IQ وفريق Axiq. المختبرات جزء من هذه الصفحة.",
};

export default async function ProjectsIndexPage() {
  const projects = await getLiveProjects();
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 sm:pt-28 pb-20 bg-[#f7f7f5]" dir="rtl">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <RevealGroup className="max-w-4xl mb-12 sm:mb-16">
            <h1
              data-cohere-item=""
              style={{ "--cohere-delay": "90ms" } as CSSProperties}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#222f30] mb-4 tracking-tight leading-tight font-kufi"
            >
              المشاريع
            </h1>
            <p
              data-cohere-item=""
              style={{ "--cohere-delay": "180ms" } as CSSProperties}
              className="text-base sm:text-xl text-[#243233] leading-relaxed max-w-2xl"
            >
              ZiqaKernel وAxiq-IQ وفريق Axiq. ما كان يُسمى المختبرات يعيش هنا، مع رابط المستودع حين يوجد.
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
