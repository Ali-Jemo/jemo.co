import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INITIATIVES } from "@/lib/data/research-data";
import { Sparkles, ArrowRight, CheckCircle2, UserCheck, Target } from "lucide-react";

interface InitiativePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: InitiativePageProps): Promise<Metadata> {
  const { slug } = await params;
  const init = INITIATIVES.find((i) => i.slug === slug);
  if (!init) return { title: "المبادرة غير موجودة | JEMO LABS" };

  return {
    title: `${init.title} | مبادرات JEMO LABS`,
    description: init.description,
  };
}

export default async function InitiativeDetailPage({ params }: InitiativePageProps) {
  const { slug } = await params;
  const init = INITIATIVES.find((i) => i.slug === slug);
  if (!init) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <Link
            href="/initiatives"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--ink-2)] hover:text-[var(--brand)] mb-8 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة المبادرات</span>
          </Link>

          <div className="space-y-4 mb-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--brand)] font-bold">
                تقدم العمل الحالي: {init.progress}%
              </span>
              <Sparkles className="w-5 h-5 text-[var(--brand)]" />
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-1)]">
              {init.title}
            </h1>

            <p className="text-lg text-[var(--ink-2)] leading-relaxed">
              {init.description}
            </p>
          </div>

          <div className="w-full bg-[var(--surface)] h-3 rounded-full overflow-hidden border border-[var(--line)] mb-12">
            <div
              className="bg-[var(--brand)] h-full rounded-full transition-all duration-500"
              style={{ width: `${init.progress}%` }}
            />
          </div>

          <Card className="p-8 mb-12 space-y-6">
            <div className="flex items-center gap-2 text-xl font-bold text-[var(--ink-1)]">
              <Target className="w-5 h-5 text-[var(--brand)]" />
              <h2>الرؤية والأثر المستهدف</h2>
            </div>
            <p className="text-[var(--ink-2)] leading-relaxed text-base">
              {init.vision}
            </p>

            <div className="pt-4 border-t border-[var(--line)]">
              <h3 className="text-sm font-mono text-[var(--ink-2)] uppercase mb-3">المخرجات الرئيسية (Deliverables)</h3>
              <div className="space-y-2">
                {init.deliverables.map((d) => (
                  <div key={d} className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] flex items-center gap-2 text-sm text-[var(--ink-1)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--brand)]" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-[var(--brand)]" />
              <div>
                <div className="text-xs text-[var(--ink-2)]">قيادة وتنسيق المبادرة</div>
                <div className="font-bold text-[var(--ink-1)]">{init.lead}</div>
              </div>
            </div>
            <Link
              href="/join"
              className="px-4 py-2 rounded-xl bg-[var(--brand)] text-white text-xs font-bold hover:opacity-90 transition-opacity"
            >
              ساهم في المبادرة
            </Link>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
