import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LabBentoCard from "@/components/ui/LabBentoCard";
import Link from "next/link";
import { RESEARCH_LABS } from "@/lib/data/research-data";
import { Cpu, Terminal, Eye, Bot, Activity, Dna, ArrowUpLeft, Users, FileText, FolderGit2 } from "lucide-react";

export const metadata: Metadata = {
  title: "المختبرات البحثية المتخصصة | JEMO LABS",
  description: "مختبرات JEMO LABS للذكاء الاصطناعي، أنظمة التشغيل، الرؤية الحاسوبية، والروبوتات.",
};

const iconMap: Record<string, React.ElementType> = {
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
            {RESEARCH_LABS.map((lab, idx) => {
              const Icon = iconMap[lab.iconName] ?? Cpu;
              const isFeatured = idx === 0; // AI Lab becomes the flagship 2x2 bento card
              return (
                <LabBentoCard
                  key={lab.id}
                  lab={lab}
                  icon={Icon}
                  featured={isFeatured}
                />
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
