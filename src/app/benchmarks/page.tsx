import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { BENCHMARKS } from "@/lib/data/research-data";
import { Trophy, ArrowUpLeft, Cpu, Database, CheckCircle2, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "النتائج والمعايير البحثية (Benchmarks) | JEMO LABS",
  description: "لوحة نتائج أداء النماذج اللغوية، النوى التشغيلية، وخوارزميات الرؤية الحاسوبية.",
};

export default function BenchmarksPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono">
              <Trophy className="w-3.5 h-3.5" />
              <span>القياسات والأداء العلمي</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)]">لوحة النتائج والمعايير (Benchmarks)</h1>
            <p className="text-[var(--ink-2)] text-base leading-relaxed">
              نتائج قياس أداء الابتكارات والنماذج المطورة في JEMO LABS مقارنة بأعلى المعايير العالمية (SOTA).
            </p>
          </div>

          <div className="space-y-8 mb-16">
            {BENCHMARKS.map((bench) => (
              <Card key={bench.id} hover className="p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-[var(--brand)] px-2.5 py-1 rounded bg-[var(--brand)]/10">
                      {bench.category}
                    </span>
                    <h2 className="text-2xl font-bold text-[var(--ink-1)] mt-2 dir-ltr text-right">{bench.name}</h2>
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-xs text-[var(--ink-2)] block">الوحدة والمقياس</span>
                    <span className="text-sm font-bold text-[var(--ink-1)]">{bench.metricName}</span>
                  </div>
                </div>

                <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                  {bench.description}
                </p>

                {/* Score Comparison Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
                  <div className="p-4 rounded-xl bg-[var(--brand)]/10 border-2 border-[var(--brand)]/40 space-y-1">
                    <div className="text-[10px] text-[var(--brand)] font-bold uppercase">JEMO LABS Score</div>
                    <div className="text-2xl font-extrabold text-[var(--brand)]">{bench.jemoScore}</div>
                    <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>الأعلى كفاءة</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-1">
                    <div className="text-[10px] text-[var(--ink-2)] font-bold uppercase">SOTA Baseline</div>
                    <div className="text-2xl font-bold text-[var(--ink-1)]">{bench.sotaScore}</div>
                    <div className="text-[10px] text-[var(--ink-2)]">المعيار العالمي</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-1">
                    <div className="text-[10px] text-[var(--ink-2)] font-bold uppercase">Standard Baseline</div>
                    <div className="text-2xl font-bold text-[var(--ink-2)]">{bench.baselineScore}</div>
                    <div className="text-[10px] text-[var(--ink-2)]">النموذج المرجعي</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                  <Link href={`/research/${bench.paperSlug}`} className="text-[var(--brand)] font-bold hover:underline flex items-center gap-1">
                    <span>قراءة الورقة العلمية وتفاصيل التجربة</span>
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={bench.datasetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--ink-2)] hover:text-[var(--brand)] flex items-center gap-1"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>تحميل بيانات الاختبار (Dataset)</span>
                  </a>
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
