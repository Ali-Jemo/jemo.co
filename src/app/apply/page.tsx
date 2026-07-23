"use client";

import { useState } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Microscope,
  Code2,
  Palette,
  Gamepad2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";

const SECTIONS = [
   { id: "الأبحاث العلمية", label: "الأبحاث العلمية", desc: "بحث علمي، تحليل بيانات، تطوير معرفي", icon: <Microscope className="w-5 h-5" style={{ color: "var(--accent)" }} />, iconBg: "var(--accent-soft)" },
   { id: "التقنية والبرمجة", label: "التقنية والبرمجة", desc: "بناء أدوات ومنصات رقمية", icon: <Code2 className="w-5 h-5" style={{ color: "var(--accent)" }} />, iconBg: "var(--accent-soft)" },
   { id: "التصميم والهوية", label: "التصميم والهوية", desc: "هوية بصرية، تصاميم، UI/UX", icon: <Palette className="w-5 h-5" style={{ color: "var(--accent)" }} />, iconBg: "var(--accent-soft)" },
   { id: "المحتوى والألعاب", label: "المحتوى والألعاب", desc: "محتوى يوتيوب، ألعاب، ترفيه رقمي", icon: <Gamepad2 className="w-5 h-5" style={{ color: "var(--accent)" }} />, iconBg: "var(--accent-soft)" },
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

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "بريد إلكتروني غير صالح";
    if (!formData.section) newErrors.section = "اختر القسم المطلوب";
    if (!formData.experience.trim() || formData.experience.trim().length < 10) newErrors.experience = "اكتب تفاصيل الخبرة (10 أحرف على الأقل)";
    if (!formData.hours) newErrors.hours = "اختر الساعات المتاحة";
    if (!formData.motivation.trim() || formData.motivation.trim().length < 10) newErrors.motivation = "اكتب دافعك للانضمام (10 أحرف على الأقل)";
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
      if (res.ok) setSubmitted(true);
      else {
        const data = await res.json().catch(() => null);
        setSubmitError(data?.error || "حدث خطأ أثناء الإرسال.");
      }
    } catch {
      setSubmitError("تعذر الاتصال بالخادم.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--ink)" }}>
        <Header />
        <main className="flex-grow flex items-center justify-center px-6 pt-32 pb-24">
          <div className="text-center max-w-lg">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
              style={{ background: "var(--accent-soft)", border: "1px solid var(--line)" }}
            >
              <CheckCircle2 className="w-12 h-12" style={{ color: "var(--accent)" }} />
            </div>
            <h1 className="mb-4" style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "var(--accent)" }}>
              تم إرسال طلبك بنجاح!
            </h1>
            <p className="leading-relaxed mb-6" style={{ color: "var(--ink-2)" }}>
              شكراً لانضمامك لـ <span style={{ fontWeight: 600, color: "var(--ink)" }}>Jemo</span>. سنراجع طلبك ونرد عليك قريبًا.
            </p>

            <div
              className="rounded-2xl p-6 mb-8 text-right space-y-3"
              style={{ background: "var(--accent-soft)", border: "1px solid var(--line)" }}
            >
              <div className="flex items-center gap-2" style={{ color: "var(--accent)", fontWeight: 700 }}>
                <Bot className="w-5 h-5" />
                <span>خطوة هامة: استلام الإشعارات عبر تليجرام</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--ink-2)" }}>
                لاستلام قرار القبول وتفاصيل قسمك فوراً عبر تليجرام، اضغط الزر أدناه ثم اضغط <strong>ابدأ (START)</strong> في البوت:
              </p>
              <a
                href={`https://t.me/jemo_coBot?start=link_${encodeURIComponent(formData.email)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 font-bold text-sm rounded-xl"
                style={{ background: "var(--accent)", color: "var(--bg)" }}
              >
                <span>ربط التليجرام واشترك بالبوت الآن</span>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/applications" className="px-7 py-3.5 font-bold rounded-full" style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--ink)" }}>
                تابع حالة طلبك
              </Link>
              <Link href="/" className="px-7 py-3.5 font-semibold rounded-full" style={{ background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--ink-2)" }}>
                العودة للرئيسية
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const inputBase = "w-full rounded-xl px-4 py-3.5 text-sm";
  const inputStyle: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    color: "var(--ink)",
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <Header />
      <main className="flex-grow pt-32 pb-24 px-6 max-w-[720px] mx-auto w-full">
        <SectionHeader
          eyebrow="انضم إلينا"
          title="قدّم طلب الانضمام"
          description="املأ النموذج أدناه وسنراجع طلبك. جميع الحقول المميزة بـ * مطلوبة."
          center
        />

        <form onSubmit={handleSubmit} noValidate className="space-y-8 mt-12">
          <Card>
            <h2 className="mb-6" style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)" }}>
              البيانات الشخصية
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink-2)" }}>
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="أحمد محمد حسين"
                  className={inputBase}
                  style={inputStyle}
                />
                {errors.name && <p className="text-xs mt-1" style={{ color: "var(--accent)" }}>{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink-2)" }}>
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="ahmed@email.com"
                  className={inputBase}
                  style={inputStyle}
                />
                {errors.email && <p className="text-xs mt-1" style={{ color: "var(--accent)" }}>{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink-2)" }}>
                  معرف التليجرام (Telegram Handle)
                </label>
                <input
                  type="text"
                  value={formData.telegram}
                  onChange={(e) => handleChange("telegram", e.target.value)}
                  placeholder="@username"
                  className={inputBase}
                  style={{ ...inputStyle, direction: "ltr", textAlign: "right" }}
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="mb-6" style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)" }}>
              القسم المطلوب
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleChange("section", section.id)}
                  className="p-4 rounded-xl text-right transition-colors"
                  style={
                    formData.section === section.id
                      ? { border: "1px solid var(--accent)", background: "var(--accent-soft)", color: "var(--accent)" }
                      : { border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink-2)" }
                  }
                >
                  <div className="p-2 rounded-lg w-fit mb-2" style={{ border: "1px solid var(--line)", background: "var(--surface-2)" }}>
                    {section.icon}
                  </div>
                  <span className="block text-sm font-semibold">{section.label}</span>
                </button>
              ))}
            </div>
            {errors.section && <p className="text-xs mt-3" style={{ color: "var(--accent)" }}>{errors.section}</p>}
          </Card>

          <Card>
            <h2 className="mb-6" style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)" }}>
              الخبرة والتفاصيل
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink-2)" }}>
                  خبرتك *
                </label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  rows={4}
                  className={inputBase}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
                {errors.experience && <p className="text-xs mt-1" style={{ color: "var(--accent)" }}>{errors.experience}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink-2)" }}>
                  محفظة الأعمال / Portfolio
                </label>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => handleChange("portfolio", e.target.value)}
                  placeholder="https://"
                  className={inputBase}
                  style={{ ...inputStyle, direction: "ltr", textAlign: "right" }}
                />
                {!formData.portfolio && (
                  <p className="text-xs mt-1" style={{ color: "var(--ink-2)" }}>اختياري: رابط معرض أعمال أو منصة أعمالك.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink-2)" }}>
                  الساعات الأسبوعية المتاحة *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {HOURS_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleChange("hours", option)}
                      className="px-3 py-2.5 rounded-xl text-xs font-medium border transition-colors"
                      style={
                        formData.hours === option
                          ? { borderColor: "var(--accent)", background: "var(--accent-soft)", color: "var(--accent)" }
                          : { borderColor: "var(--line)", background: "var(--surface)", color: "var(--ink-2)" }
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {errors.hours && <p className="text-xs mt-3" style={{ color: "var(--accent)" }}>{errors.hours}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink-2)" }}>
                  الدافع *
                </label>
                <textarea
                  value={formData.motivation}
                  onChange={(e) => handleChange("motivation", e.target.value)}
                  rows={4}
                  className={inputBase}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
                {errors.motivation && <p className="text-xs mt-1" style={{ color: "var(--accent)" }}>{errors.motivation}</p>}
              </div>
            </div>
          </Card>

          {submitError && (
            <div
              className="flex items-start gap-2 rounded-xl px-4 py-3 text-sm"
              style={{ background: "var(--accent-soft)", border: "1px solid var(--line)", color: "var(--ink-2)" }}
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
              <span>{submitError}</span>
            </div>
          )}

          <Button type="submit" block disabled={submitting} icon={submitting ? <Loader2 className="animate-spin" /> : <Send />}>
            {submitting ? "جارٍ الإرسال..." : "إرسال الطلب"}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
