import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import { Image, Video, Presentation, Download, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "مكتبة الوسائط | JEMO LABS",
  description: "الصور الفيديوهات العروض التقديمية والأرقام والمستندات الإعلامية لـ JEMO LABS.",
};

export default function MediaLibraryPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono">
              <Presentation className="w-3.5 h-3.5" />
              <span>الأرشيف المرئي والوسائط</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)]">مكتبة الوسائط والأصول الرقمية</h1>
            <p className="text-[var(--ink-2)] text-base leading-relaxed">
              صور الفعاليات، مقاطع الفيديو التعريفية، العروض التقديمية، ومحفظة الصحافة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card hover className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center mx-auto">
                <Image className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[var(--ink-1)]">معرض الصور</h2>
              <p className="text-xs text-[var(--ink-2)]">صور المختبرات، الأجهزة، والفعاليات الأكاديمية.</p>
              <a href="/gallery" className="text-xs font-bold text-[var(--brand)] inline-block">
                استعرض الصور →
              </a>
            </Card>

            <Card hover className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center mx-auto">
                <Video className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[var(--ink-1)]">تسجيلات الفيديو</h2>
              <p className="text-xs text-[var(--ink-2)]">شروحات المشاريع والعروض في المؤتمرات.</p>
              <span className="text-xs font-mono text-[var(--ink-2)] block">تتاح قريباً</span>
            </Card>

            <Card hover className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center mx-auto">
                <Presentation className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[var(--ink-1)]">العروض التقديمية</h2>
              <p className="text-xs text-[var(--ink-2)]">شرائح المحاضرات والأبحاث بصيغة PDF.</p>
              <span className="text-xs font-mono text-[var(--ink-2)] block">تتاح قريباً</span>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
