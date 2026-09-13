import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { getLivePartners } from "@/lib/live-content";
import { Building2, Globe, GraduationCap, Handshake, ArrowUpLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "الشركاء والتعاون الأكاديمي | JEMO LABS",
  description: "الشركاء الأكاديميون، الجامعات، ومؤسسات الأبحاث التعاونية.",
};

export default async function PartnersPage() {
  const partners = await getLivePartners();

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono">
              <Handshake className="w-3.5 h-3.5" />
              <span>التعاون العلمي المفتوح</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)]">الشركاء الأكاديميون والؤسسات</h1>
            <p className="text-[var(--ink-2)] text-base leading-relaxed">
              نعمل جنباً إلى جنب مع الجامعات والمراكز البحثية لبناء جسور التبادل المعرفي وتطوير الأبحاث.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {partners.map((partner, index) => (
              <Card key={`${partner.name}-${index}`} hover className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center text-[var(--brand)] font-bold">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--ink-1)]">{partner.name}</h3>
                    <div className="text-xs text-[var(--ink-2)] flex items-center gap-2 font-mono">
                      <span>{partner.type}</span> • <span>{partner.country}</span>
                    </div>
                  </div>
                </div>

                {partner.website !== "#" && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </Card>
            ))}
          </div>

          <Card className="p-8 text-center max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-[var(--ink-1)]">هل ترغب بعقد شراكة بحثية؟</h2>
            <p className="text-sm text-[var(--ink-2)]">
              نرحب بالتعاون الأكاديمي وتطوير الأبحاث المشتركة مع الجامعات والمؤسسات البحثية الدولية.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--brand)] text-white text-xs font-bold hover:opacity-90 transition-all"
              >
                <span>تواصل لعقد شراكة</span>
                <ArrowUpLeft className="w-4 h-4" />
              </Link>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
