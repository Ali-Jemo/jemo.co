import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import ComputeRequestModal from "@/components/ComputeRequestModal";
import { INFRASTRUCTURE } from "@/lib/data/research-data";
import { Cpu, Server, MapPin, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "البنية التحتية والخوادم (Infrastructure) | JEMO LABS",
  description: "مجموعات الحوسبة فائقة الأداء، خوادم H100، ومنصات اختبار معالجات RISC-V.",
};

export default function InfrastructurePage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono">
              <Server className="w-3.5 h-3.5" />
              <span>القدرات الحوسبية السيادية</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)]">البنية التحتية والتجهيزات الميدانية</h1>
            <p className="text-[var(--ink-2)] text-base leading-relaxed">
              تعتمد أبحاثنا على بنية تحتية حوسبية متقدمة تضمن تفرغ الباحثين وتوفير قوة المعالجة فائقة السرعة.
            </p>
          </div>

          <div className="text-center mb-12">
            <ComputeRequestModal />
          </div>

          <div className="space-y-6 mb-16">
            {INFRASTRUCTURE.map((item) => (
              <Card key={item.id} hover className="p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center font-bold">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-[var(--brand)]">{item.category}</span>
                      <h2 className="text-xl font-bold text-[var(--ink-1)]">{item.name}</h2>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] text-emerald-400 font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    {item.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono text-[var(--ink-2)]">المواصفات العتادية (Specifications):</div>
                  <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs font-mono text-[var(--ink-1)] dir-ltr text-right">
                    {item.specs}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-[var(--ink-2)]">
                  <div>
                    الغرض البحثي: <span className="text-[var(--ink-1)] font-bold">{item.purpose}</span>
                  </div>
                  <div className="font-mono flex items-center gap-1 text-[var(--brand)]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.location}</span>
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
