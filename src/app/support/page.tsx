import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { getLiveFinancialSupports } from "@/lib/live-content";
import { HeartHandshake, ShieldCheck, Cpu, BookOpen, Server, DollarSign, CheckCircle2, ArrowUpLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "دعم البحث العلمي العراقي | JEMO LABS",
  description: "شفافية الدعم والتمويل للبحث العلمي والسيادة التقنية في JEMO LABS.",
};

export default async function SupportPage() {
  const supports = await getLiveFinancialSupports();

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>دعم الأبحاث المستقلة</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)]">Support Iraqi Research</h1>
            <p className="text-[var(--ink-2)] text-base leading-relaxed">
              {supports.quote}
            </p>
          </div>

          {/* Dollar Allocation Breakdown */}
          <div className="mb-16">
            <SectionHeader
              eyebrow="توزيع التمويل"
              title="أين يذهب كل دولار يتلقاه المختبر؟"
              description="شفافية مطلقة تضمن تفرغ العقول وتجهيز البنية التحتية."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {supports.breakdown.map((item) => (
                <Card key={item.title} hover className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-extrabold text-[var(--brand)]">
                      {item.percentage}%
                    </span>
                    <DollarSign className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--ink-1)]">{item.title}</h3>
                  <p className="text-xs text-[var(--ink-2)] leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Transparency Commitments */}
          <Card className="p-8 md:p-10 mb-12 space-y-6">
            <h2 className="text-2xl font-bold text-[var(--ink-1)] flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[var(--brand)]" />
              <span>التزامات الشفافية والاستقلالية</span>
            </h2>

            <div className="space-y-4">
              {supports.commitments.map((c) => (
                <div key={c} className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--brand)] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[var(--ink-1)] leading-relaxed">{c}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="text-center p-8 rounded-2xl bg-[var(--surface)] border border-[var(--line)] space-y-4">
            <h3 className="text-xl font-bold text-[var(--ink-1)]">التقرير المالي والشفافية السنوية</h3>
            <p className="text-sm text-[var(--ink-2)] max-w-xl mx-auto">
              تلتزم المؤسسة بنشر التقرير المالي السنوي المدقق للعموم لإتاحة الاطلاع على الميزانية وأثر الأبحاث.
            </p>
            <div className="pt-2">
              <Link
                href="/newsletter"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--brand)] text-white text-sm font-bold shadow-md hover:opacity-90 transition-all"
              >
                <span>الاطلاع على تقارير ونشرة الشركة</span>
                <ArrowUpLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
