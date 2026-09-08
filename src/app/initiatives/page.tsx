import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InitiativeSearchFilter from "@/components/InitiativeSearchFilter";
import { INITIATIVES } from "@/lib/data/research-data";
import { Sparkles, ArrowUpLeft, Users, Target, BookOpen, Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "المبادرات الوطنية | JEMO LABS",
  description: "مبادرات JEMO LABS لبناء البنية التحتية العلمية والتعليمية المفتوحة المصدر.",
};

const STATS = [
  { icon: Users, label: "باحث مشارك", value: "53" },
  { icon: Target, label: "مبادرة نشطة", value: String(INITIATIVES.length) },
  { icon: BookOpen, label: "مخرجات مستهدفة", value: String(INITIATIVES.reduce((a, i) => a + i.deliverables.length, 0)) },
  { icon: Rocket, label: "متوسط التقدم", value: `${Math.round(INITIATIVES.reduce((a, i) => a + i.progress, 0) / INITIATIVES.length)}%` },
];

export default function InitiativesIndexPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container">
          {/* Hero header */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>الاستراتيجية المعرفية</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)] mb-4">المبادرات الوطنية الحالية</h1>
            <p className="text-[var(--ink-2)] leading-relaxed">
              مشاريع ومبادرات طويلة المدى لبناء منظومة البحث العلمي المفتوح في العراق.
            </p>
          </div>

          {/* Stats band */}
          <div className="init-stats mb-12">
            {STATS.map((s) => (
              <div key={s.label} className="init-stat">
                <s.icon className="w-5 h-5 text-[var(--brand)] mx-auto mb-2" />
                <div className="init-stat__number">{s.value}</div>
                <div className="init-stat__label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search & Filter + Grid */}
          <InitiativeSearchFilter initiatives={INITIATIVES} />
        </div>
      </main>
      <Footer />
    </>
  );
}
