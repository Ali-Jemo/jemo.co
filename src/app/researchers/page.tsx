import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { RESEARCHERS } from "@/lib/data/research-data";
import { Users, ArrowUpLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "دليل الباحثين | JEMO LABS",
  description: "العلماء والمهندسون في مختبرات JEMO LABS للأبحاث الرقمية والسيادية.",
};

export default function ResearchersIndexPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono mb-4">
              <Users className="w-3.5 h-3.5" />
              <span>المجتمع الأكاديمي</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)] mb-4">الباحثون والعلماء</h1>
            <p className="text-[var(--ink-2)] leading-relaxed">
              دليل أعضاء الهيئة البحثية والزملاء الأكاديميين في JEMO LABS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {RESEARCHERS.map((r) => (
              <Card key={r.id} hover className="p-8 flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[var(--brand)] flex items-center justify-center font-bold text-xl font-mono mb-6">
                    {r.name.slice(0, 2)}
                  </div>

                  <h2 className="text-2xl font-bold mb-1 text-[var(--ink-1)] hover:text-[var(--brand)] transition-colors">
                    <Link href={`/researchers/${r.slug}`}>{r.name}</Link>
                  </h2>
                  <p className="text-xs font-semibold text-[var(--brand)] mb-4">{r.role}</p>

                  <p className="text-sm text-[var(--ink-2)] leading-relaxed line-clamp-3 mb-6">
                    {r.bio}
                  </p>
                </div>

                <div>
                  {r.orcid && (
                    <div className="text-[10px] font-mono text-[var(--ink-2)] mb-4 dir-ltr">
                      ORCID: {r.orcid}
                    </div>
                  )}

                  <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs">
                    <div className="text-[var(--ink-2)] font-mono">
                      <span>{r.papersCount} أوراق</span> • <span>{r.projectsCount} مشاريع</span>
                    </div>
                    <Link
                      href={`/researchers/${r.slug}`}
                      className="inline-flex items-center gap-1 font-bold text-[var(--brand)] hover:underline"
                    >
                      <span>الملف الأكاديمي</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
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
