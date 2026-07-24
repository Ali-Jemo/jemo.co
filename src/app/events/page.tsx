import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import { EVENTS } from "@/lib/data/research-data";
import { Calendar, MapPin, Users, ArrowUpLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "المؤتمرات والفعاليات الأكاديمية | JEMO LABS",
  description: "الورش العلمية، الندوات، والهاكاثونات المفتوحة في JEMO LABS.",
};

export default function EventsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <span>اللقاءات المعرفية</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)]">المؤتمرات والفعاليات العلمية</h1>
            <p className="text-[var(--ink-2)] text-base leading-relaxed">
              ورش عمل، ندوات تخصصية، وهاكاثونات تجمع الباحثين والمطورين لتبادل الخبرات.
            </p>
          </div>

          <div className="space-y-6 mb-16">
            {EVENTS.map((evt) => (
              <Card key={evt.id} hover className="p-8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 font-mono text-xs">
                  <span className="px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] font-bold">
                    {evt.type}
                  </span>
                  <span className="text-[var(--ink-2)] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {evt.date}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-[var(--ink-1)] mb-2">{evt.title}</h2>
                <p className="text-sm text-[var(--ink-2)] leading-relaxed mb-4">{evt.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--line)] text-xs">
                  <div className="flex items-center gap-4 text-[var(--ink-2)] font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[var(--brand)]" />
                      {evt.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[var(--brand)]" />
                      المتحدثون: {evt.speakers.join(" ، ")}
                    </span>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 font-bold text-[var(--brand)] hover:underline"
                  >
                    <span>التسجيل والمشاركة</span>
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
