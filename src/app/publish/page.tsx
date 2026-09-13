"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BioButton from "@/components/BioButton";
import { useAuth } from "@/lib/auth-context";
import type { Paper } from "@/lib/data/research-data";
import {
  Sparkles,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Eye,
  HelpCircle,
  Code2,
  BookOpen,
  Scale,
  Stethoscope,
  Copy,
  Check,
  Zap,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Send,
  ChevronDown,
} from "lucide-react";

const STEPS = [
  { id: "author", label: "العنوان والباحث", en: "Title & Author" },
  { id: "question", label: "السؤال والأدوات", en: "Question & Tools" },
  { id: "journey", label: "المسار والخلاصة", en: "Journey & Findings" },
  { id: "verification", label: "التحقق البشري", en: "Human Verification" },
] as const;

const PUBLICATION_TYPES = [
  { id: "research", label: "بحث / اكتشاف", desc: "نتيجة أو استقصاء موثّق", icon: Sparkles },
  { id: "book", label: "كتاب علمي", desc: "كتاب أو مخطوط بحثي كامل", icon: BookOpen },
  { id: "novel", label: "رواية", desc: "عمل أدبي تريد حفظه ونشره", icon: BookOpen },
] as const;

const RESEARCH_TYPES = [
  { id: "Experiment", label: "Experiment", icon: BookOpen, desc: "تجربة عملية" },
  { id: "Quick Investigation", label: "Investigation", icon: Zap, desc: "استقصاء سريع" },
  { id: "Full Research", label: "Full Paper", icon: BookOpen, desc: "بحث متكامل" },
  { id: "Discovery", label: "Discovery",  icon: Sparkles, desc: "اكتشاف" },
  { id: "Replication", label: "Replication", icon: CheckCircle2, desc: "إعادة تجربة" },
] as const;

const CATEGORIES = [
  { value: "Systems & Kernels", label: "أبحاث النظم والأنوية — Ziqa، أنظمة التشغيل، والبرمجة منخفضة المستوى" },
  { value: "Deep Debugging & Code", label: "حل معضلات معقدة — تتبع أعطال عميقة في الأكواد والمعمارية" },
  { value: "AI Reasoning & Benchmarks", label: "تقييم النماذج والاستدلال — مقارنات واختبارات قياسية بالأرقام" },
  { value: "Hallucination Debunking", label: "تفكيك الهلوسة وتصحيحها — إثبات خطأ النموذج بالبيانات والمصادر" },
  { value: "Compilers & Architecture", label: "المترجمات واللغات — تجارب في لغات البرمجة والعتاد" },
  { value: "Hyper-Individual Discovery", label: "استكشافات فردية فائقة — خوارزميات وحوسبة مدعومة بالبراهين" },
] as const;

const CONFIDENCE_OPTIONS = [
  { value: "مرتفعة - تم التحقق والاختبار", label: "مرتفعة — تم التحقق والاختبار العملي" },
  { value: "متوسطة - تحتاج لمراجعة إضافية", label: "متوسطة — تحتاج لمراجعة وتأكيد إضافي" },
  { value: "استكشافية / أولية", label: "استكشافية / أولية — فكرة قابلة للنقاش والتحدي" },
] as const;

export default function PublishResearchPage() {
  const { profile, publishPaper, loginAsDemo } = useAuth();
  const [publicationType, setPublicationType] = useState<"research" | "book" | "novel">("research");
  const [subtitle, setSubtitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [language, setLanguage] = useState("العربية");
  const [manuscriptUrl, setManuscriptUrl] = useState("");
  const [tableOfContents, setTableOfContents] = useState("");
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importConsent, setImportConsent] = useState(false);
  const [importText, setImportText] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [importing, setImporting] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [authorHandle, setAuthorHandle] = useState("");
  const [category, setCategory] = useState("Systems & Kernels");
  const [question, setQuestion] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdPaper, setCreatedPaper] = useState<Paper | null>(null);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [researchType, setResearchType] = useState<string>("Experiment");
  const [title, setTitle] = useState("استقصاء ومقارنة 6 نماذج في تصحيح نصوص عربية تراثية");
  const [trail, setTrail] = useState("اليوم 1: تفريغ العينات ← اليوم 2: مقارنة النماذج ← اليوم 3: التحقق بالمصادر");
  const [tools, setTools] = useState("Claude 3.5 Sonnet, ChatGPT-4o, DeepSeek-R1, Google Books");
  const [methodology, setMethodology] = useState("");
  const [findings, setFindings] = useState("");
  const [verification, setVerification] = useState("");
  const [confidence, setConfidence] = useState("مرتفعة - تم التحقق والاختبار");
  const [sources, setSources] = useState("");
  const handleCopyJSON = () => {
    const payload = {
      type: publicationType === "research" ? "Research Object" : publicationType,
      publicationType,
      title,
      subtitle,
      synopsis,
      language,
      manuscriptUrl,
      tableOfContents,
      rightsConfirmed,
      author: { name: authorName || "باحث مجتمعي", handle: authorHandle },
      category,
      question,
      trail,
      tools: tools.split(",").map((t) => t.trim()).filter(Boolean),
      methodology,
      findings,
      verification,
      confidence,
      sources: sources.split("\n").filter(Boolean),
      timestamp: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const importConversation = async () => {
    if (!importConsent) {
      setImportMessage("فعّل موافقتك أولاً حتى نستخدم النص في تجهيز مسودة النشر.");
      return;
    }
    const rawInput = importText.trim();
    if (!rawInput) {
      setImportMessage("ألصق نسخة المحادثة أو رابط مشاركة عام أولاً.");
      return;
    }

    setImporting(true);
    setImportMessage("جارٍ قراءة المصدر...");
    let sourceText = rawInput;
    try {
      const sourceUrl = new URL(rawInput);
      if (!["http:", "https:"].includes(sourceUrl.protocol)) throw new Error("unsupported");
      const response = await fetch(`/api/conversation-import?url=${encodeURIComponent(sourceUrl.toString())}`);
      const result = await response.json() as { text?: string; error?: string };
      if (!response.ok || !result.text) throw new Error(result.error || "تعذر قراءة رابط المشاركة");
      sourceText = result.text;
    } catch (error) {
      if (error instanceof TypeError || error instanceof Error && error.message === "unsupported") {
        setImportMessage("تعذر قراءة الرابط. استخدم رابط مشاركة عام من Gemini أو ألصق نص المحادثة مباشرة.");
      } else {
        setImportMessage(error instanceof Error ? error.message : "تعذر قراءة رابط المشاركة.");
      }
      setImporting(false);
      return;
    }

    const lines = sourceText.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    if (!lines.length) {
      setImportMessage("لم نجد نصاً قابلاً للتحويل في المصدر.");
      setImporting(false);
      return;
    }
    const importedTitle = lines[0].replace(/^(العنوان|title)\s*[:：-]\s*/i, "").trim();
    setTitle(importedTitle.slice(0, 140));
    setQuestion(lines.slice(1, 3).join(" "));
    setMethodology(lines.slice(3, 7).join("\n"));
    setFindings(lines.slice(7).join("\n"));
    setSources(rawInput.startsWith("http") ? `مصدر مستورد من رابط مشاركة: ${rawInput}` : "مصدر مستورد من محادثة AI — يحتاج مراجعة بشرية");
    setVerification("تم توليد المسودة من محادثة AI؛ لم تُراجع بعد.");
    setImportMessage("جهّزنا مسودة أولية. راجع كل حقل قبل النشر.");
    setImporting(false);
    setCurrentStep(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const needsRights = publicationType === "book" || publicationType === "novel";
    if (needsRights && !rightsConfirmed) {
      setCurrentStep(3);
      return;
    }
    if (needsRights && !manuscriptUrl.trim()) {
      setCurrentStep(3);
      return;
    }
    const normalizedTitle = title.trim();
    if (!normalizedTitle || !authorName.trim()) {
      setCurrentStep(0);
      return;
    }
    const paper = publishPaper({
      title: normalizedTitle,
      researchType: (publicationType === "book" ? "Book" : publicationType === "novel" ? "Novel" : researchType) as Paper["researchType"],
      publicationType,
      subtitle: subtitle.trim() || undefined,
      synopsis: synopsis.trim() || undefined,
      language: language.trim() || "العربية",
      manuscriptUrl: manuscriptUrl.trim() || undefined,
      tableOfContents: tableOfContents.trim() || undefined,
      rightsConfirmed,
      field: category,
      question: question.trim() || undefined,
      toolsUsed: tools.split(",").map((tool) => tool.trim()).filter(Boolean),
      methodology: methodology.trim() || undefined,
      findings: findings.trim() || undefined,
      authors: [{
        name: authorName.trim(),
        slug: (authorHandle || profile?.handle || "researcher").replace(/^@/, ""),
        role: profile?.role || "باحث مساهم",
      }],
      humanVerification: {
        accuracyCheck: verification.trim() || "تم التحقق البشري الصارم وتصحيح الهلوسات.",
        confidence: (
          confidence.includes("مرتفعة")
            ? "مرتفعة - تم التكرار بنجاح"
            : confidence.includes("متوسطة")
              ? "متوسطة - قيد المراجعة"
              : "استكشافية / أولية"
        ) as NonNullable<Paper["humanVerification"]>["confidence"],
      },
    });
    setCreatedPaper(paper);
    setSubmitted(true);
  };
  const [currentStep, setCurrentStep] = useState(0);

  // Pre-populate author details when profile is active
  const completedSections = useMemo(() => {
    const completed: number[] = [];
    if (title && authorName) completed.push(1);
    if (question || synopsis) completed.push(2);
    if (methodology && findings) completed.push(3);
    if (verification && ((publicationType === "research") || rightsConfirmed)) completed.push(4);
    return completed;
  }, [title, authorName, question, synopsis, methodology, findings, verification, publicationType, rightsConfirmed]);

  const goToStep = (index: number) => {
    if (index < 0 || index >= STEPS.length) return;
    setCurrentStep(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (publicationType === "book" || publicationType === "novel") {
      if (currentStep === 0 && !title.trim()) return;
      if (currentStep === 1 && !synopsis.trim()) return;
      if (currentStep === 2 && !manuscriptUrl.trim()) return;
    }
    if (currentStep < STEPS.length - 1) goToStep(currentStep + 1);
  };
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f2f3ef] pt-24 sm:pt-32 pb-16 sm:pb-24 text-[#182526] relative overflow-hidden" dir="rtl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_78%_0%,rgba(190,242,100,0.2),transparent_46%),linear-gradient(180deg,#e8eee8_0%,#f2f3ef_82%)]" />
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14">
          <header className="max-w-5xl mx-auto text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#cfd8ce] bg-white/80 backdrop-blur text-[10px] sm:text-xs font-mono tracking-wide text-[#48605d] shadow-[0_8px_24px_rgba(24,37,38,0.05)] mb-5">
              <span className="w-2 h-2 rounded-full bg-[#a7e26e] shadow-[0_0_0_4px_rgba(167,226,110,0.18)]" />
              سجل الاكتشافات المفتوح · PROOF OF WORK REGISTRY
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#182526] mb-5 tracking-[-0.04em] leading-[1.05] font-kufi">
              وثّق بحثك. <span className="text-[#657775]">احفظ سبقك الفكري.</span>
            </h1>
            <p className="text-sm sm:text-lg text-[#526663] leading-8 max-w-3xl mx-auto">
              <strong className="text-[#182526]">JEMO ليست مدونة مفتوحة لغثاء الـ AI؛ بل منصة توثيق وتدقيق للاكتشافات المتقدمة.</strong>{" "}
              وثّق مسارك عبر قالب التحقق البشري الصارم (Proof of Work) ليتحول اكتشافك إلى مرجع تقني نخبوي باسمك.
            </p>
            <div className="mt-6 mx-auto max-w-2xl inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/75 border border-[#dce3dc] text-xs sm:text-sm font-bold text-[#263635] shadow-[0_10px_30px_rgba(24,37,38,0.06)]">
              <Sparkles className="w-4 h-4 text-[#83b83b] shrink-0" />
              <span>"حاسوبك مع واجهة AI يصنع مختبراً لشخص واحد — شرط التحقق البشري الصارم."</span>
            </div>
          </header>
          {/* ===== Publishing Path ===== */}
          <nav className="max-w-5xl mx-auto mb-6 p-2 rounded-2xl bg-white/80 border border-[#dce3dc] shadow-[0_8px_24px_rgba(24,37,38,0.05)]" aria-label="مسار النشر">
            <div className="flex items-center justify-between gap-2 text-[10px] sm:text-xs font-mono text-[#627572]">
              <Link href={profile ? "/dashboard" : "/sign-in?redirect_url=/publish"} prefetch className="flex items-center gap-1.5 hover:text-[#182526]">
                <span className={`w-5 h-5 rounded-full ${profile ? "bg-emerald-600 text-white" : "bg-[#edf1ec]"} flex items-center justify-center`}>{profile ? "✓" : "1"}</span>
                <span className="hidden sm:inline">{profile ? profile.name : "الهوية والتسجيل"}</span>
              </Link>
              <span className="h-px flex-1 bg-[#dce3dc]" />
              <span className="flex items-center gap-1.5 font-bold text-[#182526]">
                <span className="w-5 h-5 rounded-full bg-[#182526] text-white flex items-center justify-center">2</span>
                <span>نشر وتوثيق البحث</span>
              </span>
              <span className="h-px flex-1 bg-[#dce3dc]" />
              <Link href="/dashboard" className="flex items-center gap-1.5 hover:text-[#182526]">
                <span className="w-5 h-5 rounded-full bg-[#edf1ec] flex items-center justify-center">3</span>
                <span className="hidden sm:inline">لوحة التحكم والسجل</span>
              </Link>
            </div>
          </nav>

          {/* ===== Status Banner ===== */}
          {profile ? (
            <div className="mb-6 p-4 rounded-2xl bg-[#f8fdf2] border border-[#cef79e] text-xs text-[#222f30] flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-4xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#222f30] text-[#bef264] flex items-center justify-center font-bold font-mono">
                  {profile.name.slice(0, 2)}
                </div>
                <div>
                  <div className="font-bold flex items-center gap-2">
                    <span>الباحث الموثق: {profile.name}</span>
                    <span className="font-mono text-[10px] text-[#55696a]">{profile.handle}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                      {profile.researchId}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#55696a] mt-0.5">
                    هذا البحث سيُسجَّل تلقائياً في محفظتك البحثية وسيظهر في لوحة تحكمك فور النشر.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-xl border border-[#cef79e] bg-white text-xs font-bold text-[#222f30] hover:bg-[#cef79e]/20 transition-all flex items-center gap-1.5 shrink-0"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                <span>لوحة التحكم</span>
              </Link>
            </div>
          ) : (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-3 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>أنت تنشر حالياً كضيف (Guest) — لربط هذا البحث بملفك وسجلك البحثي:</span>
                </span>
                <button
                  type="button"
                  onClick={() => loginAsDemo("karkhi")}
                  className="text-[11px] font-bold text-amber-900 bg-amber-200/60 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer w-fit"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-700" />
                  <span>دخول تجريبي فوري (عمر الكرخي)</span>
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200/60 text-[11px]">
                <Link
                  href="/sign-in?redirect_url=/publish"
                  aria-label="الانتقال إلى تسجيل الدخول"
                  className="px-3 py-1.5 rounded-lg bg-[#222f30] text-white font-bold hover:bg-[#162224] transition-all flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>تسجيل الدخول</span>
                </Link>
                <Link
                  href="/sign-up?redirect_url=/publish"
                  prefetch
                  className="px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-amber-900 font-bold hover:bg-amber-100 transition-all flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>إنشاء حساب باحث جديد</span>
                </Link>
                <span className="text-amber-800/80 mr-2">أو أكمل النموذج أدناه للنشر المباشر.</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-7 lg:order-2">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* ===== Sticky Step Indicator ===== */}
                  <div className="mb-6 sm:mb-8 rounded-2xl bg-white border border-[#dce3dc] p-3 shadow-[0_8px_24px_rgba(24,37,38,0.04)]">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-[11px] font-mono text-[#657775]">المرحلة {currentStep + 1} من {STEPS.length}</span>
                      <span className="text-xs font-bold text-[#182526]">{STEPS[currentStep].label}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#edf1ec] overflow-hidden mb-3">
                      <div className="h-full rounded-full bg-[#a7e26e] transition-all" style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} />
                    </div>
                    <nav className="grid grid-cols-4 gap-1.5" aria-label="خطوات النشر">
                      {STEPS.map((step, idx) => {
                        const isComplete = completedSections.includes(idx + 1);
                        const isActive = currentStep === idx;
                        return (
                          <button key={step.id} type="button" aria-label={`الانتقال إلى ${step.label}`} onClick={() => goToStep(idx)} className={`flex items-center justify-center gap-1.5 rounded-xl px-1 py-2 text-[10px] sm:text-xs transition-all ${isActive ? "bg-[#182526] text-white" : "text-[#657775] hover:bg-[#f1f4f0]"}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${isComplete ? "bg-emerald-600 text-white" : isActive ? "bg-white/20 text-white" : "bg-[#edf1ec] text-[#657775]"}`}>
                              {isComplete ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                            </span>
                            <span className="hidden sm:inline">{step.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  {/* ===== Section 1: Title & Author ===== */}
                  {currentStep === 0 && (
                  <section id="step-author" className="space-y-4 scroll-mt-24 rounded-3xl bg-white border border-[#dce3dc] p-5 sm:p-7 shadow-[0_12px_32px_rgba(24,37,38,0.05)]">
                    <h2 className="text-xl font-bold text-[#222f30] font-kufi border-b border-[#e4e3e3] pb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#cef79e] text-[#222f30] text-xs font-mono flex items-center justify-center font-bold">1</span>
                      العنوان وبيانات الباحث
                    </h2>

                    <div className="space-y-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-bold text-[#222f30] font-kufi">ماذا تريد أن تنشر؟</h2>
                          <p className="text-xs text-[#657775] mt-1">اختر مساراً يناسب نوع المعرفة التي تريد حفظها في مكتبة JEMO.</p>
                        </div>
                        <BookOpen className="w-5 h-5 text-[#83b83b] shrink-0" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {PUBLICATION_TYPES.map((type) => {
                          const Icon = type.icon;
                          const selected = publicationType === type.id;
                          return (
                            <button key={type.id} type="button" onClick={() => setPublicationType(type.id)} aria-pressed={selected} className={`rounded-2xl border p-3 text-right transition-all ${selected ? "border-[#222f30] bg-[#222f30] text-white shadow-md" : "border-[#e4e3e3] bg-white text-[#55696a] hover:border-[#222f30]"}`}>
                              <Icon className={`w-4 h-4 mb-2 ${selected ? "text-[#bef264]" : "text-[#83b83b]"}`} />
                              <div className="text-sm font-bold">{type.label}</div>
                              <div className="text-[10px] mt-1 opacity-75">{type.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="rounded-2xl border border-[#dce3dc] bg-[#f8fbf7] p-3 text-xs text-[#55696a] flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-[#83b83b] shrink-0 mt-0.5" />
                        <span>يمكن للباحث نشر بحث كامل، ويمكن للكاتب حفظ كتابه أو روايته في مكتبة مفتوحة مع توضيح الحقوق ونسخة المخطوط.</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#222f30] mb-1.5">عنوان {publicationType === "novel" ? "الرواية" : publicationType === "book" ? "الكتاب" : "كائن البحث"} *</label>
                      <input type="text" required placeholder={publicationType === "novel" ? "مثال: مدن لا تنام" : "مثال: هل يستطيع نموذج AI استعادة نص عربي؟"} value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e] focus:ring-2 focus:ring-[#a7e26e]/20" />
                    </div>
                    {(publicationType === "book" || publicationType === "novel") && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#222f30] mb-1.5">العنوان الفرعي</label>
                          <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="عنوان فرعي اختياري" className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#222f30] mb-1.5">لغة العمل</label>
                          <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="العربية" className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]" />
                        </div>
                      </div>
                    )}
                    {(publicationType === "book" || publicationType === "novel") && (
                      <div>
                        <label className="block text-xs font-bold text-[#222f30] mb-1.5">{publicationType === "novel" ? "نبذة عن الرواية" : "ملخص الكتاب"} *</label>
                        <textarea required rows={4} value={synopsis} onChange={(e) => setSynopsis(e.target.value)} placeholder="ما الذي سيجده القارئ؟ وما سياق العمل؟" className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]" />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-[#222f30] mb-1.5">اسمك أو اسم الفريق *</label>
                      <input type="text" required placeholder="مثال: عمر الكرخي" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#222f30] mb-1.5">حسابك (GitHub أو X أو بريد)</label>
                      <input type="text" placeholder="@handle أو github.com/..." value={authorHandle} onChange={(e) => setAuthorHandle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#222f30] mb-1.5">نوع الاكتشاف والتصنيف</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]">
                        {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div className="rounded-2xl border border-[#dce3dc] bg-white p-4">
                      <button type="button" onClick={() => setImportOpen((open) => !open)} className="flex w-full items-center justify-between text-right text-sm font-bold text-[#222f30]">
                        <span className="flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-[#83b83b]" />لديك محادثة AI؟ حوّلها إلى مسودة</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${importOpen ? "rotate-180" : ""}`} />
                      </button>
                      {importOpen && (
                        <div className="mt-4 space-y-3">
                          <p className="text-[11px] leading-6 text-[#657775]">ألصق نسخة المحادثة أو رابط مشاركة عام من Gemini أو ChatGPT. إذا كان الرابط خاصاً أو محمياً، سيطلب منك النظام لصق النص يدوياً.</p>
                          <textarea rows={5} value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="ألصق نسخة المحادثة أو خلاصة الحوار هنا..." className="w-full px-3 py-2.5 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-xs focus:outline-none focus:border-[#a7e26e]" />
                          <label className="flex items-start gap-2 text-[11px] leading-5 text-[#55696a]">
                            <input type="checkbox" checked={importConsent} onChange={(e) => setImportConsent(e.target.checked)} className="mt-1 accent-[#222f30]" />
                            أوافق على استخدام النص الذي ألصقته فقط لتجهيز هذه المسودة، وسأراجعه قبل النشر.
                          </label>
                          <button type="button" disabled={importing} onClick={importConversation} className="rounded-xl bg-[#222f30] px-4 py-2 text-xs font-bold text-white hover:bg-[#162224] disabled:cursor-wait disabled:opacity-60">
                            {importing ? "جارٍ تجهيز المسودة..." : "تجهيز المسودة"}
                          </button>
                          {importMessage && <p className="text-[11px] font-bold text-[#55715c]">{importMessage}</p>}
                        </div>
                      )}
                    </div>
                  </section>
                  )}

                  {/* ===== Section 2: The Question & Tools ===== */}
                  {currentStep === 1 && (
                  <section id="step-question" className="space-y-4 scroll-mt-24 rounded-3xl bg-white border border-[#dce3dc] p-5 sm:p-7 shadow-[0_12px_32px_rgba(24,37,38,0.05)]">
                    <h2 className="text-xl font-bold text-[#222f30] font-kufi border-b border-[#e4e3e3] pb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#cef79e] text-[#222f30] text-xs font-mono flex items-center justify-center font-bold">2</span>
                      السؤال والأدوات المستخدمة
                    </h2>
                    <div>
                      <label className="block text-xs font-bold text-[#222f30] mb-1.5">ما الذي كنت تحاول معرفته أو حله؟ (The Question) *</label>
                      <textarea required rows={3} placeholder="صِف المسألة بوضوح: ما الفكرة أو المشكلة التي دفعتك للبحث؟" value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#222f30] mb-1.5">الأدوات ونماذج الذكاء الاصطناعي والمصادر (What did you use?) *</label>
                      <input type="text" required placeholder="مثال: Claude 3.5 Sonnet, ChatGPT-4o, DeepSeek-R1, Google Books, Python" value={tools} onChange={(e) => setTools(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]" />
                      <p className="text-[11px] text-[#55696a] mt-1 font-mono">افصل بين النماذج والمراجع بفواصل.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#55696a] mb-1.5">مسار البحث (Research Trail) — ملخص الخطوات</label>
                      <textarea rows={2} placeholder="مثال: اليوم 1: تفريغ العينات ← اليوم 2: مقارنة النماذج ← اليوم 3: التحقق بالمصادر" value={trail} onChange={(e) => setTrail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]" />
                      <p className="text-[11px] text-[#55696a] mt-1 font-mono">افصل بين الخطوات بعلامة ← أو | لربطها بصورة مرئية.</p>
                    </div>
                  </section>
                  )}

                  {/* ===== Section 3: The Journey & Findings ===== */}
                  {currentStep === 2 && (
                  <section id="step-journey" className="space-y-4 scroll-mt-24 rounded-3xl bg-white border border-[#dce3dc] p-5 sm:p-7 shadow-[0_12px_32px_rgba(24,37,38,0.05)]">
                    <div>
                      <label className="block text-xs font-bold text-[#222f30] mb-1.5">
                        ماذا فعلت؟ مسار التفاعل والتجربة (Methodology & Process) *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="كيف قادت المحادثة مع النماذج؟ ما الفرضيات التي طرحتها؟ كيف استدرجت التحليل؟"
                        value={methodology}
                        onChange={(e) => setMethodology(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#222f30] mb-1.5">
                        ما الذي وجدته؟ النتيجة النهائية أو الحل (What did you find?) *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="الخلاصة الملموسة: الحل، الشفرة، المقارنة، أو الحقيقة المعرفية التي تم الوصول إليها."
                        value={findings}
                        onChange={(e) => setFindings(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]"
                      />
                    </div>
                  </section>
                  )}

                  {/* ===== Section 4: Human Verification ===== */}
                  {currentStep === 3 && (
                  <section id="step-verification" className="space-y-4 scroll-mt-24 rounded-3xl bg-white border border-[#dce3dc] p-5 sm:p-7 shadow-[0_12px_32px_rgba(24,37,38,0.05)]">
                    <h2 className="text-xl font-bold text-[#222f30] font-kufi border-b border-[#e4e3e3] pb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#cef79e] text-[#222f30] text-xs font-mono flex items-center justify-center font-bold">4</span>
                      التحقق البشري وتصحيح الهلوسة (Verification)
                    </h2>
                    <div>
                      <label className="block text-xs font-bold text-[#222f30] mb-1.5">
                        أين أصاب الذكاء الاصطناعي وأين أخطأ وتم تصحيحه يدوياً؟ *
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="سجل الشفافية: مثال: 'أصاب Claude في تلخيص السياق لكنه اختلق مصدراً في الفقرة 3 وتم تصحيحه بالرجوع لكتاب كذا...'"
                        value={verification}
                        onChange={(e) => setVerification(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#222f30] mb-1.5">
                          مستوى الثقة في النتيجة
                        </label>
                        <select value={confidence} onChange={(e) => setConfidence(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]">
                          {CONFIDENCE_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-[#222f30] mb-1.5">{publicationType === "research" ? "رابط أو ملف المخطوط (اختياري)" : "رابط النسخة أو ملف المخطوط"} {publicationType !== "research" ? "*" : ""}</label>
                          <input type="url" required={publicationType !== "research"} value={manuscriptUrl} onChange={(e) => setManuscriptUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]" />
                        </div>
                        {(publicationType === "book" || publicationType === "novel") && (
                          <div>
                            <label className="block text-xs font-bold text-[#222f30] mb-1.5">الفهرس أو بنية الفصول</label>
                            <textarea rows={3} value={tableOfContents} onChange={(e) => setTableOfContents(e.target.value)} placeholder={"الفصل الأول...\nالفصل الثاني..."} className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]" />
                          </div>
                        )}
                        {(publicationType === "book" || publicationType === "novel") && (
                          <label className="flex items-start gap-2 rounded-xl bg-[#f8fbf7] p-3 text-xs leading-6 text-[#55696a]">
                            <input type="checkbox" required checked={rightsConfirmed} onChange={(e) => setRightsConfirmed(e.target.checked)} className="mt-1 accent-[#222f30]" />
                            أؤكد أنني أملك حق نشر هذا العمل أو أملك تفويضاً واضحاً من صاحبه، وأوافق على عرضه للمراجعة قبل إدراجه في المكتبة.
                          </label>
                        )}
                        <div>
                          <label className="block text-xs font-bold text-[#222f30] mb-1.5">المصادر أو رابط المحادثة (اختياري)</label>
                          <input type="text" placeholder="رابط GitHub أو رابط مشاركة الشات..." value={sources} onChange={(e) => setSources(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]" />
                        </div>
                      </div>
                    </div>
                  </section>
                  )}

                  {currentStep === 3 && (
                    <>
                      {/* ===== Safety & Ethics Disclaimer ===== */}
                      <div className="p-4 rounded-2xl bg-[#fffbeb] border border-[#fef3c7] text-[#92400e] text-xs space-y-2 leading-relaxed">
                        <div className="flex items-center gap-2 font-bold">
                          <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0" />
                          <span>ضوابط النزاهة العلمية والمجالات الحساسة (الطب والفتاوى):</span>
                        </div>
                        <p>
                          للحفاظ على الأمان والمصداقية، تُمنع "الأبحاث الاستنتاجية بالذكاء الاصطناعي" التي تقدّم تشخيصات طبية أو فتاوى شرعية كحقائق قاطعة. جميع المساهمات المجتمعية تُوسم بوسم شفاف يوضح أنها <strong>"بحث مدعوم بالذكاء الاصطناعي قيد المراجعة المجتمعية"</strong> ولا تعد بديلاً عن الجهات المختصة.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#e4e3e3]">
                        <button type="button" onClick={handleCopyJSON} className="px-4 py-2.5 rounded-full border border-[#e4e3e3] bg-white text-xs font-bold text-[#55696a] hover:text-[#222f30] hover:bg-[#f5f8f7] flex items-center gap-1.5">
                          <Copy className="w-3.5 h-3.5" />
                          {copied ? "تم نسخ صيغة JSON!" : "نسخ بصيغة مسودة (JSON)"}
                        </button>
                        <button type="submit" className="px-8 py-3 rounded-full bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all flex items-center gap-2 shadow-md hover:-translate-y-0.5">
                          <Send className="w-3.5 h-3.5" />
                          <span>نشر وتوثيق في السجل المفتوح</span>
                        </button>
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-between gap-3 pt-5">
                    <button type="button" onClick={() => goToStep(currentStep - 1)} disabled={currentStep === 0} className="px-5 py-2.5 rounded-xl border border-[#dce3dc] bg-white text-xs font-bold text-[#55696a] disabled:opacity-40">
                      السابق
                    </button>
                    {currentStep < STEPS.length - 1 ? (
                      <button type="button" onClick={handleNext} className="px-6 py-2.5 rounded-xl bg-[#182526] text-white text-xs font-bold hover:bg-[#29403d] transition-colors">
                        التالي · {STEPS[currentStep + 1].label}
                      </button>
                    ) : null}
                  </div>
                </form>
              ) : (
                /* ===== SUCCESS STATE ===== */
                <div className="text-center py-10 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-[#cef79e] text-[#222f30] flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
                      VERIFIED & INDEXED · مسار النشر المكتمل
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-kufi text-[#222f30]">
                      تم توثيق ونشر كائن البحث بنجاح!
                    </h2>
                  </div>

                  {createdPaper && (
                    <div className="max-w-xl mx-auto p-5 rounded-2xl bg-[#f7f7f5] border border-[#e4e3e3] text-right space-y-2">
                      <div className="flex items-center justify-between font-mono text-[11px] text-[#55696a]">
                        <span className="px-2 py-0.5 rounded-md bg-[#222f30] text-[#bef264] font-bold">
                          {createdPaper.id}
                        </span>
                        <span>{createdPaper.publishDate}</span>
                      </div>
                      <h3 className="text-base font-bold font-kufi text-[#222f30]">
                        {createdPaper.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#55696a]">
                        <span>
                          الباحث:{" "}
                          {typeof createdPaper.authors?.[0] === "string"
                            ? createdPaper.authors[0]
                            : createdPaper.authors?.[0]?.name || "باحث"}
                        </span>
                        <span>•</span>
                        <Link href="/dashboard" className="text-[#a7e26e] font-bold hover:underline">
                          العودة للوحة التحكم →
                        </Link>
                      </div>
                    </div>
                  )}

                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#bef264]" />
                    <span>عرض البحث في لوحة التحكم</span>
                  </Link>
                </div>
              )}
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━ LEFT PANEL: LIVE PREVIEW ━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className="lg:col-span-5 lg:order-1">
              <div className="sticky top-24 space-y-5">

                {/* ===== Live Preview Card ===== */}
                <div className="p-5 sm:p-7 rounded-[2rem] bg-[#182526] text-white border border-[#29403d] shadow-[0_24px_60px_rgba(24,37,38,0.18)]">
                  <div className="flex sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#a7e26e]" />
                      <span className="text-xs font-bold text-white/70 font-mono uppercase tracking-wider">معاينة مباشرة</span>
                    </div>

                    {/* Progress pills */}
                    <div className="flex items-center gap-1">
                      {STEPS.map((_, idx) => {
                        const isComplete = completedSections.includes(idx + 1);
                        return (
                          <span
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all ${
                              isComplete
                                ? "bg-emerald-600 w-4"
                                : "bg-[#e4e3e3]"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Badges Bar (live from form state) */}
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="px-3 py-1 rounded-full bg-[#cef79e] text-[#182526] text-[11px] font-mono font-bold flex items-center gap-1">
                      <BrainCircuit className="w-3.5 h-3.5" />
                      AI-Assisted Research
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 text-[11px] font-mono">
                      {category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 text-[11px] font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#a7e26e]" />
                      {confidence.split(" - ")[0] || "مرتفعة"}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-200/10 border border-amber-200/20 text-amber-100 text-[10px] font-mono">
                      مساهمة مجتمعية · لم تُراجع أكاديمياً
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-white font-kufi leading-tight mb-3">
                    {title || "عنوان البحث الاكتشافي..."}
                  </h2>

                  <div className="flex items-center gap-3 text-xs text-white/55 font-mono pb-3 border-b border-white/10 mb-4">
                    <span>الباحث: {authorName || "اسم الباحث"}</span>
                    {authorHandle && <span>• {authorHandle}</span>}
                    <span>• التاريخ: {new Date().toLocaleDateString("ar-EG")}</span>
                  </div>

                  {/* Question */}
                  {question && (
                    <div className="space-y-2 p-4 rounded-2xl bg-white/8 border border-white/10 mb-4">
                      <span className="text-[11px] font-mono font-bold text-[#b7d6ad] uppercase tracking-wider block">
                        ما السؤال أو المعضلة؟ (The Question)
                      </span>
                      <p className="text-sm text-white/85 leading-relaxed">
                        {question}
                      </p>
                    </div>
                  )}

                  {/* Tools */}
                  {tools && (
                    <div className="space-y-2 mb-4">
                      <span className="text-[11px] font-mono font-bold text-[#b7d6ad] uppercase tracking-wider block">
                        الأدوات والنماذج المستخدمة (Tools Used)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tools.split(",").map((t, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-mono text-white/80 border border-white/10">
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Findings */}
                  {findings && (
                    <div className="space-y-2 mb-4">
                      <span className="text-[11px] font-mono font-bold text-[#b7d6ad] uppercase tracking-wider block">
                        ما الذي تم اكتشافه أو التوصل إليه؟ (Findings)
                      </span>
                      <p className="text-sm text-white/85 leading-relaxed bg-white/8 p-4 rounded-2xl border border-white/10">
                        {findings}
                      </p>
                    </div>
                  )}

                  {/* Verification */}
                  {verification && (
                    <div className="space-y-2 p-4 rounded-2xl bg-[#a7e26e]/10 border border-[#a7e26e]/20">
                      <span className="text-[11px] font-mono font-bold text-[#c9f2b9] uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#a7e26e]" />
                        التحقق البشري وتصحيح الهلوسة (Human Verification)
                      </span>
                      <p className="text-xs text-white/80 leading-relaxed">
                        {verification}
                      </p>
                    </div>
                  )}

                  {/* Empty-state hints for missing fields */}
                  {!question && !findings && !verification && (
                    <div className="text-center py-8 text-white/45">
                      <Eye className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="text-xs">معاينة حية ستظهر هنا كما تكتب النموذج.</p>
                    </div>
                  )}
                </div>

                {/* ===== Guidelines Collapsible ===== */}
                <div className="rounded-2xl bg-white border border-[#e4e3e3] shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setGuidelinesOpen((v) => !v)}
                    className="w-full flex items-center justify-between gap-2 px-5 py-3 text-xs font-bold text-[#222f30] font-kufi hover:bg-[#f5f8f7] transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#a7e26e]" />
                      دليل قالب التحقق البشري (Proof of Work)
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#55696a] transition-transform ${guidelinesOpen ? "rotate-180" : ""}`} />
                  </button>

                  {guidelinesOpen && (
                    <div className="px-5 pb-5 text-xs text-[#445e5f] leading-relaxed">
                      <p className="mb-3">
                        لا تطلب منك JEMO كتابة أوراق أكاديمية نمطية مملوءة بالحشو، بل تفرض معياراً هندسياً يضمن ألا تتحول المنصة إلى مكب لغثاء الذكاء الاصطناعي (AI Slop). كل بحث يجب أن يلتزم بالأركان الثلاثة:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 pt-1 font-medium text-[#222f30]">
                        <li><strong>المشكلة والفرضيات (The Problem & Hypotheses):</strong> حدد المشكلة التقنية بدقة وما الفرضية التي أردت اختبارها.</li>
                        <li><strong>مسار البحث والأدوات (Investigation & Tools):</strong> اذكر النماذج المستخدمة بدقة وكيف قادت مسار التفاعل.</li>
                        <li><strong>التحقق البشري الصارم (Human Verification):</strong> الركن الأهم! كيف فحصت النتيجة؟ أين أخطأ النموذج وهلوس وتم تصحيحه يدوياً؟ اذكر الاختبارات (Benchmarks) والشفرات.</li>
                        <li><strong>الأثر والفهرسة (Indexable Value):</strong> كود أو نتيجة قابلة للتكرار تمثل مرجعاً تقنياً يمكن للمطورين الاستناد إليه.</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
