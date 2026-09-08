"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  PlusCircle, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink, 
  Save, 
  Sparkles, 
  Layers, 
  Search,
  Code2,
  Database,
  Download,
  Calendar,
  Tag,
  Users
} from "lucide-react";
import { Paper, RESEARCH_PAPERS } from "@/lib/data/research-data";

interface SiteInfoState {
  announcement: string;
  announcementEn: string;
  activeStatus: string;
  focusHighlight: string;
}

export default function ResearchAdminDashboard() {
  const [activeTab, setActiveTab] = useState<"publish" | "papers" | "siteInfo">("publish");

  // Papers state
  const [customPapers, setCustomPapers] = useState<Paper[]>([]);
  const [isLoadingPapers, setIsLoadingPapers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New paper form state
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [abstract, setAbstract] = useState("");
  const [authorName, setAuthorName] = useState("د. علي الهاشمي");
  const [authorRole, setAuthorRole] = useState("الباحث الرئيسي");
  const [field, setField] = useState("الذكاء الاصطناعي والنماذج اللغوية");
  const [labSlug, setLabSlug] = useState("ai-lab");
  const [publishDate, setPublishDate] = useState(new Date().toISOString().slice(0, 10));
  const [doi, setDoi] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [datasetUrl, setDatasetUrl] = useState("");
  const [codeUrl, setCodeUrl] = useState("");
  const [keywords, setKeywords] = useState("LLMs, Transformers, Arabic NLP, Distributed Systems");
  const [featured, setFeatured] = useState(true);

  // Site info state
  const [siteInfo, setSiteInfo] = useState<SiteInfoState>({
    announcement: "",
    announcementEn: "",
    activeStatus: "",
    focusHighlight: "",
  });
  const [isSavingSiteInfo, setIsSavingSiteInfo] = useState(false);
  const [siteInfoFeedback, setSiteInfoFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Load papers
  const fetchPapers = async () => {
    try {
      setIsLoadingPapers(true);
      const res = await fetch("/api/admin/papers");
      const data = await res.json();
      if (data.custom) {
        setCustomPapers(data.custom);
      }
    } catch (e) {
      console.error("Failed to load papers:", e);
    } finally {
      setIsLoadingPapers(false);
    }
  };

  // Load site info
  const fetchSiteInfo = async () => {
    try {
      const res = await fetch("/api/admin/site-info");
      const data = await res.json();
      if (data) {
        setSiteInfo({
          announcement: data.announcement || "",
          announcementEn: data.announcementEn || "",
          activeStatus: data.activeStatus || "",
          focusHighlight: data.focusHighlight || "",
        });
      }
    } catch (e) {
      console.error("Failed to load site info:", e);
    }
  };

  useEffect(() => {
    fetchPapers();
    fetchSiteInfo();
  }, []);

  // Handle Paper Publish
  const handlePublishPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch("/api/admin/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          titleEn,
          abstract,
          authorName,
          authors: [{ name: authorName, slug: "lead-author", role: authorRole }],
          field,
          labSlug,
          publishDate,
          doi: doi || undefined,
          pdfUrl: pdfUrl || "#",
          datasetUrl: datasetUrl || undefined,
          codeUrl: codeUrl || undefined,
          keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
          featured,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل نشر الورقة");
      }

      setSubmitStatus({
        type: "success",
        message: `تم نشر الورقة بنجاح! الرابط التعريفي: /research/${data.paper.slug}`,
      });

      // Reset fields
      setTitle("");
      setTitleEn("");
      setAbstract("");
      setDoi("");
      setPdfUrl("");
      setDatasetUrl("");
      setCodeUrl("");

      // Refresh list
      fetchPapers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء الحفظ";
      setSubmitStatus({ type: "error", message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Paper Delete
  const handleDeletePaper = async (id: string, paperTitle: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف الورقة: "${paperTitle}"؟`)) return;

    try {
      const res = await fetch(`/api/admin/papers?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCustomPapers((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("فشل حذف الورقة");
      }
    } catch (e) {
      console.error(e);
      alert("خطأ في الاتصال بالخادم");
    }
  };

  // Handle Site Info Save
  const handleSaveSiteInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSiteInfo(true);
    setSiteInfoFeedback(null);

    try {
      const res = await fetch("/api/admin/site-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteInfo),
      });
      if (res.ok) {
        setSiteInfoFeedback({ type: "success", message: "تم حفظ معلومات وإعلانات الموقع بنجاح!" });
      } else {
        throw new Error("فشل الحفظ في السحابة");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ غير متوقع";
      setSiteInfoFeedback({ type: "error", message: msg });
    } finally {
      setIsSavingSiteInfo(false);
    }
  };

  const allVisiblePapers = [...customPapers, ...RESEARCH_PAPERS];
  const filteredPapers = allVisiblePapers.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.field.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink-1)] font-sans">
      {/* Top Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface-1)] sticky top-0 z-40 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-xs font-mono text-[var(--ink-2)] transition-colors border border-[var(--border)]"
          >
            <ArrowRight className="w-3.5 h-3.5 text-[var(--brand)]" />
            <span>مركز لوحات التحكم</span>
          </Link>
          <div className="h-4 w-px bg-[var(--border)]" />
          <h1 className="text-sm font-bold text-[var(--ink-1)] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>لوحة الأبحاث ونشر الأوراق العلمية</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/research"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-xs font-mono text-[var(--ink-2)] transition-colors border border-[var(--border)]"
          >
            <span>معاينة صفحة الأبحاث</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="container max-w-5xl py-8 sm:py-12">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[var(--border)] mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("publish")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === "publish"
                ? "bg-[var(--brand)] text-black shadow-md"
                : "text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>نشر ورقة علمية جديدة</span>
          </button>

          <button
            onClick={() => setActiveTab("papers")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === "papers"
                ? "bg-[var(--brand)] text-black shadow-md"
                : "text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>الأوراق المنشورة ({allVisiblePapers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("siteInfo")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === "siteInfo"
                ? "bg-[var(--brand)] text-black shadow-md"
                : "text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>تحديث إعلانات ومعلومات الموقع</span>
          </button>
        </div>

        {/* TAB 1: PUBLISH NEW PAPER */}
        {activeTab === "publish" && (
          <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl p-6 sm:p-10 shadow-xl">
            <div className="mb-8 border-b border-[var(--border)] pb-6">
              <h2 className="text-xl sm:text-2xl font-black mb-2 text-[var(--ink-1)]">
                نشر ورقة بحثية محكمة جديدة
              </h2>
              <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                أدخل بيانات الورقة العلمية لنشرها مباشرة على الموقع. يتم تخزينها سحابياً في Supabase وتظهر فوراً في المستودع الأكاديمي وفهرس الأبحاث.
              </p>
            </div>

            {submitStatus && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-medium ${
                  submitStatus.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                }`}
              >
                {submitStatus.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <span>{submitStatus.message}</span>
              </div>
            )}

            <form onSubmit={handlePublishPaper} className="space-y-6">
              {/* Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                    عنوان البحث (بالعربية) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: تحسين كفاءة النماذج اللغوية في البيئات منخفضة الموارد"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] placeholder-[var(--ink-3)] text-sm focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                    العنوان بالإنجليزية (English Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Optimizing Transformer Efficiency on Resource-Constrained Environments"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] placeholder-[var(--ink-3)] text-sm focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
              </div>

              {/* Abstract */}
              <div>
                <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                  ملخص البحث (Abstract) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="اكتب خلاصة المنهجية، النتائج، والأهمية العلمية لهذه الورقة..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] placeholder-[var(--ink-3)] text-sm focus:outline-none focus:border-[var(--brand)] leading-relaxed"
                />
              </div>

              {/* Author & Lab */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                    اسم المؤلف الرئيسي *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] text-sm focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                    الصفة / الدور الأكاديمي
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] text-sm focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                    المختبر التابع له
                  </label>
                  <select
                    value={labSlug}
                    onChange={(e) => setLabSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] text-sm focus:outline-none focus:border-[var(--brand)]"
                  >
                    <option value="ai-lab">مختبر الذكاء الاصطناعي (AI Lab)</option>
                    <option value="systems-lab">مختبر النظم والعتاد (Systems Lab)</option>
                    <option value="robotics-lab">مختبر الروبوتات والأنظمة الذاتية</option>
                    <option value="security-lab">مختبر التشفير والأمان</option>
                  </select>
                </div>
              </div>

              {/* Field & Publish Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                    المجال العلمي (Field) *
                  </label>
                  <input
                    type="text"
                    required
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    placeholder="مثال: الذكاء الاصطناعي، الحوسبة الفائقة"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] text-sm focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                    تاريخ النشر (Publish Date) *
                  </label>
                  <input
                    type="date"
                    required
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] text-sm focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
              </div>

              {/* Links & Resources */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                    رابط ملف PDF
                  </label>
                  <input
                    type="url"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    placeholder="https://example.com/paper.pdf"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] text-sm focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                    رابط الكود (GitHub URL)
                  </label>
                  <input
                    type="url"
                    value={codeUrl}
                    onChange={(e) => setCodeUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] text-sm focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                    رابط البيانات (Dataset URL)
                  </label>
                  <input
                    type="url"
                    value={datasetUrl}
                    onChange={(e) => setDatasetUrl(e.target.value)}
                    placeholder="https://huggingface.co/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] text-sm focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
              </div>

              {/* DOI & Keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                    معرف DOI (اختياري)
                  </label>
                  <input
                    type="text"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    placeholder="10.1145/3543873.3584631"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] text-sm focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                    الكلمات المفتاحية (Keywords مفصولة بفواصل)
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] text-sm focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                />
                <label htmlFor="featuredCheck" className="text-sm font-medium cursor-pointer">
                  تمييز الورقة العلمية في الصفحة الرئيسية والأوراق المميزة
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-[var(--border)] flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-bright)] text-black font-bold text-sm transition-all shadow-lg disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? "جاري النشر في السحابة..." : "نشر الورقة العلمية فوراً"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: PUBLISHED PAPERS LIST */}
        {activeTab === "papers" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface-1)] border border-[var(--border)]">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute right-3 top-3 text-[var(--ink-3)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالعنوان أو المجال..."
                  className="w-full pr-9 pl-4 py-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--ink-1)] focus:outline-none"
                />
              </div>
              <div className="text-xs font-mono text-[var(--ink-2)]">
                إجمالي الأوراق: <strong className="text-[var(--ink-1)]">{filteredPapers.length}</strong> ({customPapers.length} منشور سحابياً)
              </div>
            </div>

            {isLoadingPapers ? (
              <div className="p-12 text-center text-xs font-mono text-[var(--ink-2)]">
                جاري تحميل مستودع الأوراق...
              </div>
            ) : filteredPapers.length === 0 ? (
              <div className="p-12 text-center text-xs font-mono text-[var(--ink-3)]">
                لم يتم العثور على أوراق تطابق البحث.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredPapers.map((paper) => {
                  const isCustom = customPapers.some((cp) => cp.id === paper.id);
                  return (
                    <div
                      key={paper.id}
                      className="p-6 rounded-xl bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--brand)]/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {paper.field}
                          </span>
                          {isCustom ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              سحابي مخصص
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--surface-2)] text-[var(--ink-3)]">
                              افتراضي
                            </span>
                          )}
                          <span className="text-xs font-mono text-[var(--ink-3)]">{paper.publishDate}</span>
                        </div>
                        <h3 className="text-base font-bold text-[var(--ink-1)] mb-1">
                          {paper.title}
                        </h3>
                        <p className="text-xs font-mono text-[var(--ink-3)] mb-2">
                          {paper.titleEn}
                        </p>
                        <p className="text-xs text-[var(--ink-2)] line-clamp-2">
                          {paper.abstract}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <Link
                          href={`/research/${paper.slug}`}
                          target="_blank"
                          className="p-2.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--ink-2)] hover:text-white transition-colors border border-[var(--border)]"
                          title="عرض الورقة"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {isCustom && (
                          <button
                            onClick={() => handleDeletePaper(paper.id, paper.title)}
                            className="p-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors border border-rose-500/30"
                            title="حذف الورقة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SITE INFO & ANNOUNCEMENTS */}
        {activeTab === "siteInfo" && (
          <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl p-6 sm:p-10 shadow-xl">
            <div className="mb-8 border-b border-[var(--border)] pb-6">
              <h2 className="text-xl sm:text-2xl font-black mb-2 text-[var(--ink-1)]">
                تحديث إعلانات ومعلومات الموقع
              </h2>
              <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                تعديل شريط الإعلانات الرئيسي، حالة المختبرات، والمجالات البحثية التي تظهر لزوار المنصة.
              </p>
            </div>

            {siteInfoFeedback && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-medium ${
                  siteInfoFeedback.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                }`}
              >
                {siteInfoFeedback.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <span>{siteInfoFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveSiteInfo} className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                  الإعلان الرئيسي للموقع (العربية)
                </label>
                <input
                  type="text"
                  value={siteInfo.announcement}
                  onChange={(e) => setSiteInfo({ ...siteInfo, announcement: e.target.value })}
                  placeholder="مختبر JEMO LABS يطلق برامج الأبحاث المفتوحة للعام 2026"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] text-sm focus:outline-none focus:border-[var(--brand)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                  Main Site Announcement (English)
                </label>
                <input
                  type="text"
                  value={siteInfo.announcementEn}
                  onChange={(e) => setSiteInfo({ ...siteInfo, announcementEn: e.target.value })}
                  placeholder="JEMO LABS launches open research programs for 2026"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] text-sm focus:outline-none focus:border-[var(--brand)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                    حالة استقبال المشاركات
                  </label>
                  <input
                    type="text"
                    value={siteInfo.activeStatus}
                    onChange={(e) => setSiteInfo({ ...siteInfo, activeStatus: e.target.value })}
                    placeholder="نشط — استلام المشاركات البحثية مفتوح"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] text-sm focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--ink-2)] mb-2 font-bold">
                    أبرز مجالات التركيز الحالية
                  </label>
                  <input
                    type="text"
                    value={siteInfo.focusHighlight}
                    onChange={(e) => setSiteInfo({ ...siteInfo, focusHighlight: e.target.value })}
                    placeholder="الذكاء الاصطناعي، الحوسبة الفائقة، والأنظمة الموزعة"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-1)] text-sm focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingSiteInfo}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-bright)] text-black font-bold text-sm transition-all shadow-lg disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSiteInfo ? "جاري الحفظ..." : "حفظ التعديلات في السحابة"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
