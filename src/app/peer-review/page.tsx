import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { PEER_REVIEW_POLICY } from "@/lib/data/research-data";
import { ShieldCheck, CheckCircle2, FileCheck, Lock, Globe, Scale } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "سياسة التدقيق الأكاديمي والتحكيم | JEMO LABS",
  description: "معايير التحكيم الأكاديمي المزدوج، النشر المباشر للنسخ المسبقة، وأخلاقيات البحث.",
};

export default function PeerReviewPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>الصرامة الأكاديمية</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)]">{PEER_REVIEW_POLICY.title}</h1>
            <p className="text-[var(--ink-2)] text-base leading-relaxed">
              {PEER_REVIEW_POLICY.summary}
            </p>
          </div>

          <Card className="p-8 md:p-10 mb-16 space-y-6">
            <h2 className="text-2xl font-bold text-[var(--ink-1)] border-b border-[var(--line)] pb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-[var(--brand)]" />
              <span>مبادئ وأخلاقيات النشر والتحكيم</span>
            </h2>

            <div className="space-y-4">
              {PEER_REVIEW_POLICY.guidelines.map((guide, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--line)] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--brand)] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[var(--ink-1)] leading-relaxed">{guide}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <FileCheck className="w-8 h-8 text-[var(--brand)]" />
              <h3 className="text-xl font-bold text-[var(--ink-1)]">النسخ المسبقة (Preprints)</h3>
              <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                تُنشر الأوراق في مستودع المؤسسة المفتوح فور إجازتها أولياً لسرعة إتاحتها للمجتمع الأكاديمي الدولي.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <Globe className="w-8 h-8 text-[var(--brand)]" />
              <h3 className="text-xl font-bold text-[var(--ink-1)]">ضمان قابلية إعادة الإنتاج</h3>
              <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                يشترط في كل أطروحة توفير كود التكرار (Reproducibility Script) ليتمكن أي باحث من مطابقة النتائج.
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
