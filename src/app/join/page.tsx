"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BioButton from "@/components/BioButton";
import { UserCheck, Code2, Palette, Languages, GraduationCap, HeartHandshake } from "lucide-react";
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
      <main className="flex-1 pt-24 sm:pt-28 pb-20 bg-[#f7f7f5]" dir="rtl">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-4xl mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-white font-mono text-xs uppercase tracking-widest text-[#445e5f] mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
              <span>المسارات والزمالات · WORK WITH US</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#222f30] mb-4 tracking-tight leading-tight font-kufi">
              انضم إلى مجتمع JEMO LABS العلمي.
            </h1>
            <p className="text-base sm:text-xl text-[#445e5f] leading-relaxed max-w-2xl">
              دعوة مفتوحة لكل باحث، مطور، ومصمم يؤمن بأن المعرفة تُنتج ولا تُستهلك فقط، للمساهمة في بناء بيئة بحثية عراقية سيادية.
            </p>
          </div>

          {/* Tracks Selection */}
          {/* Tracks Grid (IntegratedBio rounded-3xl cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {TRACKS.map((track) => {
              const Icon = track.icon;
              return (
                <div
                  key={track.id}
                  className="group p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] text-[#222f30] flex items-center justify-center mb-6 group-hover:bg-[#cef79e] transition-colors">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h2 className="text-xl font-bold mb-3 text-[#222f30] font-kufi">{track.title}</h2>
                    <p className="text-sm text-[#445e5f] leading-relaxed">{track.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action to official apply page */}
          {/* Call to Action using BioButton */}
          <div className="flex flex-col items-center text-center mt-16 pt-12 border-t border-[#e4e3e3] space-y-4">
            <BioButton
              href="/apply"
              label="APPLY TO FELLOWSHIP"
              secondaryLabel="بوابة التقديم الرسمية"
              variant="primary"
              dir="ltr"
            />
            <p className="text-xs sm:text-sm font-mono text-[#445e5f] pt-2">
              سيتم تحويلك إلى صفحة التقديم الآمنة الخاصة بمؤسسة JEMO LABS.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
