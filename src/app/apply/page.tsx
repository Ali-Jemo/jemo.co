"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Microscope,
  Code2,
  Palette,
  Gamepad2,
  Sparkles,
  ArrowUpLeft
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SendButton from "@/components/SendButton";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "الأبحاث العلمية", label: "الأبحاث العلمية", desc: "بحث علمي، تحليل بيانات، تطوير معرفي", icon: <Microscope className="w-5 h-5 text-[var(--brand)]" /> },
  { id: "التقنية والبرمجة", label: "التقنية والبرمجة", desc: "بناء أدوات ومنصات رقمية ومفتوحة المصدر", icon: <Code2 className="w-5 h-5 text-[var(--brand)]" /> },
  { id: "التصميم والهوية", label: "التصميم والهوية", desc: "هوية بصرية، تصاميم، واجهات UI/UX", icon: <Palette className="w-5 h-5 text-[var(--brand)]" /> },
  { id: "المحتوى والألعاب", label: "المحتوى والألعاب", desc: "محتوى يوتيوب، ألعاب، وثائقيات رقمية", icon: <Gamepad2 className="w-5 h-5 text-[var(--brand)]" /> },
];

const HOURS_OPTIONS = ["أقل من 5 ساعات", "5 - 10 ساعات", "10 - 20 ساعة", "أكثر من 20 ساعة"];

interface FormData {
  name: string;
  email: string;
  telegram: string;
  section: string;
  experience: string;
  hours: string;
  portfolio: string;
  motivation: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ApplyPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    telegram: "",
    section: "",
    experience: "",
    hours: "",
    portfolio: "",
    motivation: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [refCode, setRefCode] = useState("");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "الاسم الكامل مطلوب";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "يرجى كتابة بريد إلكتروني صحيح";
    if (!formData.section) newErrors.section = "اختر القسم المناسب لمهاراتك";
    if (!formData.experience.trim() || formData.experience.trim().length < 10) newErrors.experience = "يرجى كتابة تفاصيل خبرتك (10 أحرف على الأقل)";
    if (!formData.hours) newErrors.hours = "اختر عدد الساعات المتاحة أسبوعياً";
    if (!formData.motivation.trim() || formData.motivation.trim().length < 10) newErrors.motivation = "يرجى كتابة دافعك للانضمام (10 أحرف على الأقل)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        setRefCode(`JEMO-2026-${randomNum}`);
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => null);
        setSubmitError(data?.error || "حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.");
      }
    } catch {
      setSubmitError("تعذر الاتصال بالخادم.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)] font-kufi">
        <Header />
        <main className="flex-grow flex items-center justify-center px-6 pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg p-8 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--line)] shadow-2xl relative overflow-hidden"
          >
            <div className="w-20 h-20 rounded-full bg-[var(--brand)]/10 border border-[var(--brand)]/20 flex items-center justify-center mx-auto mb-6 text-[var(--brand)] shadow-lg">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="text-3xl font-bold mb-3 text-[var(--ink)]">
              تم تسجيل طلبك بنجاح!
            </h1>
            <p className="text-[var(--ink-2)] text-base leading-relaxed mb-6">
              شكراً لانضمامك لـ <span className="font-bold text-[var(--brand)]">Jemo Labs</span>. تم توثيق الطلب وإرساله للمراجعة التقنية.
            </p>

            {/* Reference Tracker Badge */}
            {refCode && (
              <div className="mb-8 p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)]">
                <span className="text-xs font-mono text-[var(--ink-2)] block mb-1">رقم المتابعة المرجعي</span>
                <span className="text-xl font-mono font-bold text-[var(--brand)] tracking-widest">{refCode}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/applications"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-[var(--brand)] !text-white shadow-md hover:opacity-90 transition-all"
              >
                <span>متابعة حالة القبولات</span>
                <ArrowUpLeft size={18} />
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-medium text-sm bg-[var(--bg)] text-[var(--ink-2)] border border-[var(--line)] hover:text-[var(--ink)] transition-all"
              >
                الرئيسية
              </a>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const inputBase = "w-full rounded-xl px-4 py-3.5 text-sm bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] placeholder-[var(--ink-2)]/50 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 focus:outline-none transition-all";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)] font-kufi">
      <Header />
      <main className="flex-grow pt-32 pb-24 px-6 max-w-[720px] mx-auto w-full">
        <SectionHeader
          eyebrow="انضم إلينا"
          title="قدّم طلب الانضمام"
          description="املأ النموذج أدناه وسنراجع طلبك في أقرب وقت. جميع الحقول المميزة بـ * مطلوبة."
          center
        />

        <form onSubmit={handleSubmit} noValidate className="space-y-8 mt-12">
          {/* 1. Personal Details */}
          <Card>
            <h2 className="text-lg font-bold mb-6 text-[var(--ink)] flex items-center gap-2">
              <Sparkles size={18} className="text-[var(--brand)]" />
              البيانات الشخصية
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--ink-2)]">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="أحمد محمد حسين"
                  className={inputBase}
                />
                {errors.name && <p className="text-xs mt-1.5 font-medium text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--ink-2)]">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="ahmed@email.com"
                  className={inputBase}
                  dir="ltr"
                />
                {errors.email && <p className="text-xs mt-1.5 font-medium text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--ink-2)]">
                  معرف التليجرام (Telegram Handle)
                </label>
                <input
                  type="text"
                  value={formData.telegram}
                  onChange={(e) => handleChange("telegram", e.target.value)}
                  placeholder="@username"
                  className={inputBase}
                  dir="ltr"
                />
              </div>
            </div>
          </Card>

          {/* 2. Department Selection */}
          <Card>
            <h2 className="text-lg font-bold mb-6 text-[var(--ink)] flex items-center gap-2">
              <Sparkles size={18} className="text-[var(--brand)]" />
              القسم المطلوب
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECTIONS.map((section) => {
                const isSelected = formData.section === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => handleChange("section", section.id)}
                    className={`p-4 rounded-xl text-end transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-md shadow-[var(--brand)]/20 scale-[1.01]"
                        : "bg-[var(--surface)] border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--brand)]/40 hover:text-[var(--ink)]"
                    }`}
                  >
                    <div className="p-2.5 rounded-lg w-fit mb-2 bg-[var(--surface-2)] border border-[var(--line)]">
                      {section.icon}
                    </div>
                    <span className="block text-sm font-bold">{section.label}</span>
                    <span className="block text-[11px] text-[var(--ink-2)] mt-1">{section.desc}</span>
                  </button>
                );
              })}
            </div>
            {errors.section && <p className="text-xs mt-3 font-medium text-red-500">{errors.section}</p>}
          </Card>

          {/* 3. Experience & Commitment */}
          <Card>
            <h2 className="text-lg font-bold mb-6 text-[var(--ink)] flex items-center gap-2">
              <Sparkles size={18} className="text-[var(--brand)]" />
              الخبرة والتفاصيل
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--ink-2)]">
                  تفاصيل خبرتك والتقنيات التي تتقنها *
                </label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  rows={4}
                  placeholder="حدثنا عن أبرز مشاريعك واللغات والتقنيات التي تستخدمها..."
                  className={`${inputBase} resize-y`}
                />
                {errors.experience && <p className="text-xs mt-1.5 font-medium text-red-500">{errors.experience}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--ink-2)]">
                  محفظة الأعمال / Portfolio (اختياري)
                </label>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => handleChange("portfolio", e.target.value)}
                  placeholder="https://github.com/yourhandle"
                  className={inputBase}
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--ink-2)]">
                  الساعات الأسبوعية المتاحة للعمل *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {HOURS_OPTIONS.map((option) => {
                    const isSelected = formData.hours === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleChange("hours", option)}
                        className={`px-3 py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-md shadow-[var(--brand)]/20"
                            : "bg-[var(--surface)] border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--brand)]/40 hover:text-[var(--ink)]"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {errors.hours && <p className="text-xs mt-3 font-medium text-red-500">{errors.hours}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--ink-2)]">
                  لماذا ترغب في الانضمام لـ Jemo Labs؟ *
                </label>
                <textarea
                  value={formData.motivation}
                  onChange={(e) => handleChange("motivation", e.target.value)}
                  rows={4}
                  placeholder="اكتب الدافع والرؤية التي تسعى لتحقيقها معنا..."
                  className={`${inputBase} resize-y`}
                />
                {errors.motivation && <p className="text-xs mt-1.5 font-medium text-red-500">{errors.motivation}</p>}
              </div>
            </div>
          </Card>

          {submitError && (
            <div className="flex items-start gap-2.5 rounded-xl p-4 text-sm bg-red-500/10 border border-red-500/20 text-red-500 font-medium">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <SendButton type="submit" disabled={submitting} loading={submitting}>
            {submitting ? "جارٍ الإرسال..." : "إرسال طلب الانضمام"}
          </SendButton>
        </form>
      </main>
      <Footer />
    </div>
  );
}
