import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { FINANCIAL_SUPPORTS, PARTNERS } from "@/lib/data/research-data";
import { ShieldCheck, FileText, PieChart, Users, Award, Download, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "الشفافية المؤسسية والمالية | JEMO LABS",
  description: "التقارير السنوية، الميزانيات، الشركاء، والنزاهة المالية في JEMO LABS.",
};

export default function TransparencyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>الثقة والحوكمة المعرفية</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)]">الشفافية والتقارير السنوية</h1>
            <p className="text-[var(--ink-2)] text-base leading-relaxed">
              نؤمن أن الثقة تُبنى بالشفافية الكاملة في التمويل، إتاحة البيانات للعموم، ونشر تقارير الأثر الأكاديمي.
            </p>
          </div>

          {/* Reports */}
          <div className="mb-16">
            <SectionHeader
              eyebrow="التقارير المؤسسية"
              title="Annual Reports & Impact Statements"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card hover className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[var(--brand)]/10 text-[var(--brand)]">
                    عام 2026
                  </span>
                  <FileText className="w-5 h-5 text-[var(--brand)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--ink-1)]">التقرير السنوي وتقرير الأثر الأول</h3>
                <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                  يتضمن حصيلة الأوراق المحكمة، المشاريع المفتوحة، والميزانية المالية التأسيسية.
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--brand)] opacity-60">
                    <Download className="w-3.5 h-3.5" />
                    <span>يصدر بنهاية العام</span>
                  </span>
                </div>
              </Card>

              <Card hover className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[var(--surface)] text-[var(--ink-2)]">
                    سياسات الحوكمة
                  </span>
                  <ShieldCheck className="w-5 h-5 text-[var(--brand)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--ink-1)]">وثيقة النزاهة والاستقلالية العلمية</h3>
                <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                  القواعد التي تضمن عدم تضارب المصالح وحرية الباحثين الكاملة في نشر مخرجاتهم.
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--brand)]">
                    <span>تحميل الوثيقة (PDF)</span>
                  </span>
                </div>
              </Card>
            </div>
          </div>

          {/* Budget & Financial Transparency */}
          <Card className="p-8 md:p-10 mb-16 space-y-6">
            <h2 className="text-2xl font-bold text-[var(--ink-1)] flex items-center gap-2">
              <PieChart className="w-6 h-6 text-[var(--brand)]" />
              <span>Financial Transparency & Budget</span>
            </h2>
            <p className="text-sm text-[var(--ink-2)] leading-relaxed">
              تعتمد JEMO LABS هيكلية تمويل غير ربحية قائمة على التبرعات والمنح غير المشروطة لضمان الاستقلالية المعرفية.
            </p>

            <div className="space-y-4 pt-4 border-t border-[var(--line)]">
              {FINANCIAL_SUPPORTS.breakdown.map((item) => (
                <div key={item.title} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[var(--ink-1)]">{item.title}</span>
                    <span className="text-[var(--brand)] font-extrabold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-[var(--bg)] h-2 rounded-full overflow-hidden border border-[var(--line)]">
                    <div
                      className="bg-[var(--brand)] h-full rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
