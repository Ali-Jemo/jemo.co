"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { useState } from "react";
import { Users, UserCheck, Code2, Palette, Languages, GraduationCap, HeartHandshake, Check, ArrowUpLeft } from "lucide-react";

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
  const [selectedTrack, setSelectedTrack] = useState<string>("researcher");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", bio: "", links: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
              const isSelected = selectedTrack === track.id;
              return (
                <Card
                  key={track.id}
                  hover
                  onClick={() => setSelectedTrack(track.id)}
                  className={`p-6 cursor-pointer transition-all ${
                    isSelected
                      ? "border-2 border-[var(--brand)] bg-[var(--brand)]/5"
                      : "border border-[var(--line)] opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-[var(--brand)] font-bold" />}
                  </div>

                  <h2 className="text-lg font-bold mb-2 text-[var(--ink-1)]">{track.title}</h2>
                  <p className="text-xs text-[var(--ink-2)] leading-relaxed">{track.desc}</p>
                </Card>
              );
            })}
          </div>

          {/* Application Form */}
          <Card className="p-8 md:p-10">
            <h2 className="text-2xl font-bold text-[var(--ink-1)] mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--brand)]" />
              <span>تقديم طلب الانضمام مسار: {TRACKS.find((t) => t.id === selectedTrack)?.title}</span>
            </h2>

            {submitted ? (
              <div className="p-8 text-center bg-[var(--brand)]/10 rounded-2xl border border-[var(--brand)]/30 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[var(--brand)] text-white flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--ink-1)]">تم استلام طلبك بنجاح!</h3>
                <p className="text-sm text-[var(--ink-2)]">
                  شكراً لشغفك ورغبتك في بناء بيت الحكمة الرقمي. سيتواصل معك فريق الأبحاث قريباً.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[var(--ink-1)] mb-2">الاسم الكامل *</label>
                    <input
                      required
                      type="text"
                      placeholder="أدخل اسمك الكريم"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[var(--brand)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[var(--ink-1)] mb-2">البريد الإلكتروني *</label>
                    <input
                      required
                      type="email"
                      placeholder="name@domain.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[var(--brand)] outline-none dir-ltr text-right"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[var(--ink-1)] mb-2">نبذة عن خبراتك وشغفك المعرفي *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="حدثنا عن خلفيتك الأكاديمية أو البرمجية وما تأمل تقديمه..."
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[var(--brand)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[var(--ink-1)] mb-2">روابط ذات صلة (GitHub / ORCID / LinkedIn)</label>
                  <input
                    type="text"
                    placeholder="https://github.com/username"
                    value={form.links}
                    onChange={(e) => setForm({ ...form, links: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[var(--brand)] outline-none dir-ltr text-right"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[var(--brand)] text-white font-bold text-base shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span>إرسال طلب الانضمام</span>
                  <ArrowUpLeft className="w-5 h-5" />
                </button>
              </form>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
