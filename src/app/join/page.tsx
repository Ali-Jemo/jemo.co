"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { Users, UserCheck, Code2, Palette, Languages, GraduationCap, HeartHandshake, ArrowUpLeft } from "lucide-react";

const TRACKS = [
  {
    id: "researcher",
    title: "باحث (Researcher)",
    icon: UserCheck,
    desc: "المشاركة في صياغة وتنفيذ الأوراق البحثية ونشر النتائج في مجالات الذكاء الاصطناعي وأنظمة التشغيل.",
  },
  {
    id: "developer",
    title: "مطور (Developer)",
    icon: Code2,
    desc: "كتابة وتطوير النوى والمكتبات البرمجية مفتوحة المصدر بلغات مثل Rust وPython وC++.",
  },
  {
    id: "designer",
    title: "مصمم (Designer)",
    icon: Palette,
    desc: "تصميم واجهات ورسومات أكاديمية، توثيق علمي مرئي، وتصميم الهوية الرقمية للمؤسسة.",
  },
  {
    id: "translator",
    title: "مترجم علمي (Translator)",
    icon: Languages,
    desc: "ترجمة ومراجعة الأوراق والمستندات العلمية والتقنية بين العربية والإنجليزي لخدمة المحتوى العربي.",
  },
  {
    id: "mentor",
    title: "موجه أكاديمي (Mentor)",
    icon: GraduationCap,
    desc: "توجيه ونصح الباحثين الشباب والطلاب وتوفير الإرشاد في النشر الأكاديمي وتحديد المسارات.",
  },
  {
    id: "volunteer",
    title: "متطوع عام (Volunteer)",
    icon: HeartHandshake,
    desc: "المساهمة في تنظيم الفعاليات، أرشفة البيانات، وإدارة المجتمع والمعرفة الرقمية.",
  },
];

export default function JoinUsPage() {

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono">
              <Users className="w-3.5 h-3.5" />
              <span>مجتمع JEMO LABS المعرفي</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)]">انضم إلى بيت الحكمة الرقمي</h1>
            <p className="text-[var(--ink-2)] text-base leading-relaxed">
              هذه ليست صفحة توظيف اعتيادية، بل دعوة لكل عقل مبدع وشغوف بالبحث والعلم للانضمام والمساهمة في بناء بيئة بحثية عراقية سيادية.
            </p>
          </div>

          {/* Tracks Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {TRACKS.map((track) => {
              const Icon = track.icon;
              return (
                <Card
                  key={track.id}
                  className="p-6 transition-all border border-[var(--line)] opacity-90 hover:opacity-100 hover:border-[var(--brand)] hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h2 className="text-lg font-bold mb-2 text-[var(--ink-1)]">{track.title}</h2>
                  <p className="text-xs text-[var(--ink-2)] leading-relaxed">{track.desc}</p>
                </Card>
              );
            })}
          </div>

          {/* Call to Action to official apply page */}
          <div className="text-center mt-12">
            <a
              href="/apply"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[var(--brand)] text-white font-bold text-lg shadow-md hover:opacity-90 transition-all hover:scale-[1.02]"
            >
              <span>الانتقال إلى بوابة التقديم الرسمية</span>
              <ArrowUpLeft className="w-5 h-5" />
            </a>
            <p className="mt-4 text-sm text-[var(--ink-2)]">
              سيتم تحويلك إلى صفحة التقديم الآمنة الخاصة بمؤسسة JEMO LABS.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
