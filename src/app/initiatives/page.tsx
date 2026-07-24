import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { INITIATIVES } from "@/lib/data/research-data";
import { Sparkles, ArrowUpLeft, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "المبادرات الوطنية | JEMO LABS",
  description: "مبادرات JEMO LABS لبناء البنية التحتية العلمية والتعليمية المفتوحة المصدر.",
};

export default function InitiativesIndexPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {INITIATIVES.map((init) => (
              <Card key={init.id} hover className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[var(--brand)]">
                      نسبة الإنجاز: {init.progress}%
                    </span>
                    <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                  </div>

                  <h2 className="text-2xl font-bold mb-3 text-[var(--ink-1)] hover:text-[var(--brand)] transition-colors">
                    <Link href={`/initiatives/${init.slug}`}>{init.title}</Link>
                  </h2>

                  <p className="text-sm text-[var(--ink-2)] leading-relaxed mb-6">
                    {init.description}
                  </p>

                  <div className="w-full bg-[var(--bg)] h-2 rounded-full overflow-hidden border border-[var(--line)] mb-6">
                    <div
                      className="bg-[var(--brand)] h-full rounded-full transition-all duration-500"
                      style={{ width: `${init.progress}%` }}
                    />
                  </div>

                  <div className="space-y-1.5 mb-6">
                    <div className="text-xs font-mono text-[var(--ink-2)]">المخرجات المستهدفة:</div>
                    {init.deliverables.map((d) => (
                      <div key={d} className="text-xs text-[var(--ink-1)] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-[var(--brand)]" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs">
                  <div className="text-[var(--ink-2)] font-mono">
                    المسؤول: <span className="font-bold text-[var(--ink-1)]">{init.lead}</span>
                  </div>
                  <Link
                    href={`/initiatives/${init.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-[var(--brand)] hover:underline"
                  >
                    <span>تفاصيل المبادرة</span>
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
