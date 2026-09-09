"use client";

import { useState } from "react";
import Link from "next/link";
import { Paper, ResearchResponse } from "@/lib/data/research-data";
import { 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  UserCheck, 
  ArrowRight, 
  FileText, 
  Download, 
  Database, 
  Code2, 
  Tag, 
  Share2, 
  Copy, 
  Check, 
  GitFork, 
  MessageSquareQuote, 
  Scale, 
  HelpCircle,
  Clock,
  Sparkles,
  Layers,
  Send,
  Eye,
  FlaskConical,
  Wrench,
  BookOpen
} from "lucide-react";
import CitationBox from "@/components/ui/CitationBox";
import PaperReaderModal from "@/components/PaperReaderModal";
import ExportCitationModal from "@/components/ExportCitationModal";

interface ResearchObjectDetailProps {
  paper: Paper;
}

export default function ResearchObjectDetail({ paper }: ResearchObjectDetailProps) {
  // Cognitive Metrics state
  const [metrics, setMetrics] = useState({
    reproduced: paper.metrics?.reproducedCount ?? 12,
    evidenceBacked: paper.metrics?.evidenceBackedCount ?? 24,
    disputed: paper.metrics?.disputedCount ?? 1,
    insightful: paper.metrics?.insightfulCount ?? 38,
  });

  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedJSON, setCopiedJSON] = useState(false);

  // Peer review contribution state
  const [responses, setResponses] = useState<ResearchResponse[]>(paper.responses ?? [
    {
      id: "resp-sample-1",
      type: "replication",
      author: "د. خالد السامرائي (جامعة بغداد)",
      date: "2026-08-18",
      content: "أعدت التجربة على 10 نصوص جديدة من العصر العباسي؛ تكررت نفس نسبة الهلوسة (حوالي 26%) في اختلاق المصادر الفرعية، مما يؤكد صحة استنتاج البحث ودقة المنهجية.",
      verified: true
    },
    {
      id: "resp-sample-2",
      type: "challenge",
      author: "م. أنس البغدادي",
      date: "2026-08-20",
      content: "عند تفعيل نمط التفكير العميق الموصول بقواعد بيانات خارجية، انخفضت نسبة الهلوسة إلى 8%؛ أرجو اختبار النمط المقترن بالاسترجاع (RAG) في النسخة القادمة.",
      verified: false
    }
  ]);

  const [filterType, setFilterType] = useState<string>("all");
  const [showAddResponse, setShowAddResponse] = useState(false);
  const [respType, setRespType] = useState<ResearchResponse["type"]>("replication");
  const [respAuthor, setRespAuthor] = useState("");
  const [respContent, setRespContent] = useState("");
  const [respSubmitted, setRespSubmitted] = useState(false);

  // Ask JEMO AI state
  const [aiQuestion, setAiQuestion] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAskAi = (q: string) => {
    setAiQuestion(q);
    setIsAiLoading(true);
    setTimeout(() => {
      if (q.includes("أضعف نقطة") || q.includes("حدود")) {
        setAiAnswer(
          paper.limitations 
            ? `أضعف نقطة وفق فحص كائن البحث: ${paper.limitations} بالإضافة إلى ضرورة الحذر من اختلاق المصادر عند الاستدراج بمطالب غير موثقة.`
            : "العينة المعتمدة تحتاج لتكرار على عتاد وبيئات تشغيل أوسع، مع ضرورة تقليل الاعتماد على استجابة واحدة للنموذج."
        );
      } else if (q.includes("تناقض") || q.includes("أدلة مضادة")) {
        setAiAnswer(
          "تشير المراجعات المسجلة في الشجرة (Challenge) إلى أنه عند ربط النموذج بقواعد بيانات الويب المباشرة، تنخفض نسبة الخطأ، مما يعني أن الاستنتاج مشروط بنمط التوليد المعزول."
        );
      } else if (q.includes("تكرار") || q.includes("تجربة")) {
        setAiAnswer(
          `لإعادة التجربة: استخدم نفس النماذج (${(paper.toolsUsed || []).join(", ")})، اتبع مسار التوجيه الموثق في القسم 2، واختبر 10 عينات جديدة مع مطابقة النتيجة يدوياً.`
        );
      } else {
        setAiAnswer(`بناءً على كائن البحث: تركز الخلاصة على "${paper.findings || paper.abstract}" مع اشتراط التحقق البشري الصارم.`);
      }
      setIsAiLoading(false);
    }, 400);
  };
  const toggleMetric = (key: keyof typeof metrics) => {
    if (voted[key]) {
      setMetrics((m) => ({ ...m, [key]: m[key] - 1 }));
      setVoted((v) => ({ ...v, [key]: false }));
    } else {
      setMetrics((m) => ({ ...m, [key]: m[key] + 1 }));
      setVoted((v) => ({ ...v, [key]: true }));
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportJSON = () => {
    const data = {
      type: "Research Object",
      title: paper.title,
      titleEn: paper.titleEn,
      authors: paper.authors,
      field: paper.field,
      date: paper.publishDate,
      question: paper.question || paper.abstract,
      tools: paper.toolsUsed || ["AI Models", "Open Datasets"],
      methodology: paper.methodology || paper.abstract,
      findings: paper.findings || paper.abstract,
      humanVerification: paper.humanVerification || { confidence: "مرتفعة" },
      researchTrail: paper.researchTrail || [],
      metrics,
      responses
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  const handleAddResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respAuthor || !respContent) return;
    const newResp: ResearchResponse = {
      id: `resp-${Date.now()}`,
      type: respType,
      author: respAuthor,
      date: new Date().toLocaleDateString("ar-EG"),
      content: respContent,
      verified: respType === "replication"
    };
    setResponses([newResp, ...responses]);
    setRespAuthor("");
    setRespContent("");
    setRespSubmitted(true);
    setTimeout(() => {
      setRespSubmitted(false);
      setShowAddResponse(false);
    }, 1500);
  };

  const filteredResponses = filterType === "all" 
    ? responses 
    : responses.filter((r) => r.type === filterType);

  return (
    <main className="flex-1 py-12 sm:py-16 bg-[#f7f7f5] text-[#222f30]" dir="rtl">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#445e5f] hover:text-[#222f30] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لسجلات الاكتشاف والأبحاث</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-full border border-[#e4e3e3] bg-white text-xs font-mono text-[#445e5f] hover:text-[#222f30] flex items-center gap-1.5 shadow-xs"
              title="مشاركة رابط البحث"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? "تم النسخ!" : "مشاركة"}</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-full border border-[#e4e3e3] bg-white text-xs font-mono text-[#445e5f] hover:text-[#222f30] flex items-center gap-1.5 shadow-xs"
              title="تصدير كائن البحث بصيغة JSON"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedJSON ? "تم نسخ JSON!" : "تصدير كائن البحث"}</span>
            </button>
          </div>
        </div>

        {/* Paper / Research Object Main Header */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e4e3e3] shadow-sm mb-8 space-y-6">
          
          {/* Badges strip */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#cef79e] text-[#222f30] text-xs font-mono font-bold flex items-center gap-1.5 border border-[#a7e26e]">
              <BrainCircuit className="w-4 h-4" />
              كائن بحثي · Research Object
            </span>
            <span className="px-3 py-1 rounded-full bg-[#f5f8f7] border border-[#e4e3e3] text-[#445e5f] text-xs font-mono font-semibold">
              {paper.field}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {paper.humanVerification?.confidence || "مرتفعة - تم التحقق"}
            </span>
            <span className="text-xs font-mono text-[#738284] flex items-center gap-1 ms-auto">
              <Calendar className="w-3.5 h-3.5" />
              {paper.publishDate}
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#222f30] font-kufi leading-snug mb-3">
              {paper.title}
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#738284] dir-ltr text-right">
              {paper.titleEn}
            </p>
          </div>

          {/* Authors list */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-[#e4e3e3]">
            {paper.authors.map((author) => (
              <div
                key={author.slug}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#f7f7f5] border border-[#e4e3e3]"
              >
                <div className="w-7 h-7 rounded-lg bg-[#cef79e] text-[#222f30] flex items-center justify-center font-bold text-xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#222f30]">{author.name}</div>
                  {author.role && <div className="text-[10px] text-[#55696a] font-mono">{author.role}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Cognitive Curation Bar (Reputation & Verifications over Likes) */}
          <div className="pt-6 border-t border-[#e4e3e3]">
            <div className="text-[11px] font-mono font-bold text-[#738284] uppercase tracking-wider mb-3">
              مؤشرات الموثوقية وتدقيق المجتمع (Evidence & Verification):
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => toggleMetric("reproduced")}
                className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  voted.reproduced
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-[#f5f8f7] border-[#e4e3e3] text-[#222f30] hover:border-emerald-500 hover:bg-emerald-50"
                }`}
                title="تمت إعادة التجربة وتكرار النتيجة بنجاح"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:text-white" />
                <span>تم التكرار بنجاح ({metrics.reproduced})</span>
              </button>

              <button
                onClick={() => toggleMetric("evidenceBacked")}
                className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  voted.evidenceBacked
                    ? "bg-[#222f30] text-white border-[#222f30] shadow-xs"
                    : "bg-[#f5f8f7] border-[#e4e3e3] text-[#222f30] hover:border-[#222f30] hover:bg-zinc-100"
                }`}
                title="مدعوم بمصادر وأدلة كافية"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>مدعوم بأدلة ({metrics.evidenceBacked})</span>
              </button>

              <button
                onClick={() => toggleMetric("disputed")}
                className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  voted.disputed
                    ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                    : "bg-[#f5f8f7] border-[#e4e3e3] text-[#222f30] hover:border-amber-500 hover:bg-amber-50"
                }`}
                title="يوجد خلاف أو احتمال هلوسة قيد الفحص"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>يحتوي هلوسة/خطأ ({metrics.disputed})</span>
              </button>

              <button
                onClick={() => toggleMetric("insightful")}
                className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  voted.insightful
                    ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                    : "bg-[#f5f8f7] border-[#e4e3e3] text-[#222f30] hover:border-purple-500 hover:bg-purple-50"
                }`}
                title="طرح ذكي أو منهجية جديدة"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>مثير للاهتمام ({metrics.insightful})</span>
              </button>

              <Link
                href={`/publish?fork=${paper.slug}`}
                className="px-3.5 py-2 rounded-xl border border-[#e4e3e3] bg-white text-xs font-mono font-bold text-[#445e5f] hover:text-[#222f30] hover:border-[#a7e26e] flex items-center gap-1.5 ms-auto"
                title="إنشاء تفريعة أو امتداد لهذا البحث (Research Fork)"
              >
                <GitFork className="w-3.5 h-3.5 text-[#a7e26e]" />
                <span>تفريعة (Fork / Extend)</span>
              </Link>
            </div>
          </div>

        </div>

        {/* The 7 Core Structured Sections of the Research Object */}
        <div className="space-y-6 mb-12">
          
          {/* Section 1: The Question */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#445e5f] uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#cef79e] text-[#222f30] flex items-center justify-center text-[10px]">1</span>
              <span>ما السؤال أو المعضلة الأساسية؟ (The Question)</span>
            </div>
            <p className="text-base sm:text-lg text-[#222f30] leading-relaxed font-semibold">
              {paper.question || paper.abstract}
            </p>
          </section>

          {/* Section 2: AI Tools & Workflow */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#445e5f] uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#cef79e] text-[#222f30] flex items-center justify-center text-[10px]">2</span>
              <span>الأدوات ونماذج الذكاء الاصطناعي (AI Tools & Workflow)</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(paper.toolsUsed || ["Claude 3.5 Sonnet", "ChatGPT-4o", "DeepSeek-R1", "المصادر المفتوحة"]).map((tool, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-[#f5f8f7] border border-[#e4e3e3] text-xs font-mono font-bold text-[#222f30] flex items-center gap-1.5"
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-[#a7e26e]" />
                  {tool}
                </span>
              ))}
            </div>

            {paper.promptWorkflow && (
              <div className="p-4 rounded-2xl bg-[#f7f7f5] border border-[#e4e3e3] text-xs font-mono text-[#445e5f] leading-relaxed">
                <span className="font-bold text-[#222f30] block mb-1">مسار وهندسة التوجيه (Prompt Trail):</span>
                {paper.promptWorkflow}
              </div>
            )}
          </section>

          {/* Section 3: Methodology & Experiments */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#445e5f] uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#cef79e] text-[#222f30] flex items-center justify-center text-[10px]">3</span>
              <span>المنهجية ومسار التجربة (Methodology & Process)</span>
            </div>
            <p className="text-sm sm:text-base text-[#445e5f] leading-relaxed">
              {paper.methodology || paper.abstract}
            </p>
          </section>

          {/* Section 4: Key Findings & Solution */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#445e5f] uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#cef79e] text-[#222f30] flex items-center justify-center text-[10px]">4</span>
              <span>الخلاصة والنتيجة المكتشفة (Findings & Takeaways)</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] text-sm sm:text-base text-[#222f30] font-medium leading-relaxed">
              {paper.findings || paper.abstract}
            </div>
          </section>

          {/* Section 5: Human Verification & Hallucination Debunking (CRITICAL) */}
          <section className="p-6 sm:p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200 shadow-xs space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-900 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">5</span>
              <span>التحقق البشري الصارم وتصحيح الهلوسة (Human Verification & Debunking)</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-emerald-950 leading-relaxed">
              <div className="p-4 rounded-2xl bg-white/90 border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-1">ما تم التحقق منه يدوياً:</span>
                {paper.humanVerification?.accuracyCheck || "تم فحص المخرجات بمطابقتها مع المصادر الأصلية وإعادة الاختبار العملي للكود."}
              </div>

              {paper.humanVerification?.hallucinationCorrected && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    أين هلوس الذكاء الاصطناعي وكيف صُحح؟
                  </span>
                  {paper.humanVerification.hallucinationCorrected}
                </div>
              )}
            </div>
          </section>

          {/* Section 6: Research Trail */}
          {paper.researchTrail && paper.researchTrail.length > 0 && (
            <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#445e5f] uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-[#cef79e] text-[#222f30] flex items-center justify-center text-[10px]">6</span>
                <span>مسار البحث (Research Trail)</span>
              </div>
              <div className="space-y-3">
                {paper.researchTrail.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#f7f7f5] border border-[#e4e3e3]">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-[#e4e3e3] font-mono text-xs font-bold text-[#222f30] shrink-0">
                      {t.step}
                    </span>
                    <p className="text-xs text-[#55696a] leading-relaxed pt-0.5">{t.note}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 7: Limitations & Open Frontiers */}
          {paper.limitations && (
            <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#445e5f] uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-[#cef79e] text-[#222f30] flex items-center justify-center text-[10px]">7</span>
                <span>الحدود وما لم يُحسم بعد (Limitations & Open Questions)</span>
              </div>
              <p className="text-xs sm:text-sm text-[#55696a] leading-relaxed">
                {paper.limitations}
              </p>
            </section>
          )}

        </div>

        {/* Ask JEMO AI Interactive Assistant (Article 17 of Manifesto) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#222f30] text-white shadow-md mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#bef264]">
              <Sparkles className="w-4 h-4" />
              <span>JEMO AI · اسأل الذكاء الاصطناعي عن هذا البحث</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">Grounded in Research Object</span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            اسأل عن نقاط الضعف، الفرضيات البديلة، أو كيفية إعادة التجربة، ويجيبك النموذج مباشرة بالاعتماد على مسار هذا البحث:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {[
              "ما أضعف نقطة في هذا البحث؟",
              "هل هناك أبحاث أو مراجعات تناقض هذه النتيجة؟",
              "كيف يمكنني إعادة التجربة والتحقق بنفسي؟"
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAskAi(q)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                  aiQuestion === q
                    ? "bg-[#bef264] text-[#222f30] border-[#bef264] font-bold"
                    : "bg-white/10 border-white/20 text-zinc-200 hover:bg-white/20 hover:text-white"
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          {aiQuestion && (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/15 text-xs sm:text-sm text-zinc-200 space-y-2 mt-3 font-normal leading-relaxed">
              <div className="font-mono text-[11px] text-[#bef264] font-bold">
                الإجابة الذكية المستندة لكائن البحث:
              </div>
              {isAiLoading ? (
                <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs animate-pulse">
                  <span>جارٍ تفكيك كائن البحث والتحليلات المقارنة...</span>
                </div>
              ) : (
                <p className="leading-relaxed">{aiAnswer}</p>
              )}
            </div>
          )}
        </div>

        {/* Research Lineage Tree & Forks (Article 5 of Manifesto: GitHub in Lineage) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#222f30] uppercase tracking-wider">
              <GitFork className="w-4 h-4 text-[#a7e26e]" />
              <span>شجرة التراكم والتفريعات (Research Lineage & Forks)</span>
            </div>
            <span className="text-[11px] font-mono text-[#738284]">
              {paper.lineage?.replicationsCount || 14} إعادات تجربة · {paper.lineage?.challengesCount || 2} تحديات
            </span>
          </div>

          <p className="text-xs text-[#55696a] leading-relaxed">
            المعرفة في JEMO تتراكم ولا تموت بعد أسبوع. يستطيع أي باحث إعادة نفس التجربة (Replication)، تقديم أدلة مضادة (Challenge)، أو البناء عليها وتوسيعها (Extension):
          </p>

          {/* Visual UI Tree */}
          <div className="p-4 rounded-2xl bg-[#f7f7f5] border border-[#e4e3e3] font-mono text-xs text-[#222f30] space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <span>● Research Root (v1.0)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100">{paper.title.slice(0, 42)}...</span>
            </div>
            <div className="pr-4 pl-2 space-y-2 border-r-2 border-[#e4e3e3] mr-2">
              <div className="flex flex-wrap items-center justify-between text-[#55696a] gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1 font-mono text-xs">
                    <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Replication:</span>
                  </span>
                  <span className="font-bold text-[#222f30]">إعادة تجربة بنجاح ومطابقة لنسبة الهلوسة</span>
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">Verified × 14</span>
              </div>
              <div className="flex flex-wrap items-center justify-between text-[#55696a] gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1 font-mono text-xs">
                    <Scale className="w-3.5 h-3.5 text-amber-600" />
                    <span>Challenge:</span>
                  </span>
                  <span className="font-bold text-[#222f30]">تحدي الدقة عند ربط النموذج بقواعد بيانات حية</span>
                </span>
                <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">Disputed</span>
              </div>
              <div className="flex flex-wrap items-center justify-between text-[#55696a] gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1 font-mono text-xs">
                    <GitFork className="w-3.5 h-3.5 text-purple-600" />
                    <span>Extension:</span>
                  </span>
                  <span className="font-bold text-[#222f30]">امتداد وتوسيع الاختبار لعينة جديدة من المصادر</span>
                </span>
                <span className="text-[10px] text-purple-800 bg-purple-100 px-2 py-0.5 rounded font-bold">Extended</span>
              </div>
            </div>
          </div>
          {/* 3 Fork Actions */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Link
              href={`/publish?replicate=${paper.slug}`}
              className="px-4 py-2 rounded-xl bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <FlaskConical className="w-3.5 h-3.5 text-[#bef264]" />
              <span>أعد التجربة بنفسك (Replicate)</span>
            </Link>
            <Link
              href={`/publish?challenge=${paper.slug}`}
              className="px-4 py-2 rounded-xl bg-white border border-[#e4e3e3] text-[#222f30] text-xs font-bold hover:border-amber-400 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>قدّم دليلاً مضاداً (Challenge)</span>
            </Link>
            <Link
              href={`/publish?extend=${paper.slug}`}
              className="px-4 py-2 rounded-xl bg-white border border-[#e4e3e3] text-[#222f30] text-xs font-bold hover:border-purple-400 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <GitFork className="w-3.5 h-3.5 text-purple-600" />
              <span>ابنِ على هذا البحث (Extend)</span>
            </Link>
          </div>
        </div>

        {/* Action Buttons: Reader, PDF, Dataset, Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12">
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>تحميل الورقة (PDF)</span>
            </a>
          )}

          {paper.datasetUrl ? (
            <a
              href={paper.datasetUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white border border-[#e4e3e3] text-xs font-bold text-[#222f30] hover:border-[#a7e26e] transition-all shadow-xs"
            >
              <Database className="w-4 h-4 text-[#a7e26e]" />
              <span>البيانات والمصادر المفتوحة</span>
            </a>
          ) : (
            <div className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white border border-[#e4e3e3] text-xs font-mono text-[#738284] opacity-60">
              البيانات مدمجة في التقرير
            </div>
          )}

          {paper.codeUrl ? (
            <a
              href={paper.codeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white border border-[#e4e3e3] text-xs font-bold text-[#222f30] hover:border-[#a7e26e] transition-all shadow-xs"
            >
              <Code2 className="w-4 h-4 text-[#a7e26e]" />
              <span>مستودع الكود (GitHub)</span>
            </a>
          ) : (
            <div className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white border border-[#e4e3e3] text-xs font-mono text-[#738284] opacity-60">
              الكود قيد المراجعة المجتمعية
            </div>
          )}
        </div>

        {/* Peer Review & Scientific Discussions (Scientific Responses over Casual Comments) */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e4e3e3] shadow-sm mb-12 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e4e3e3] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-kufi text-[#222f30] flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-[#a7e26e]" />
                المراجعة النظيرة وتحديات المجتمع ({responses.length})
              </h2>
              <p className="text-xs text-[#55696a] mt-1">
                نقاشات محكمة على طريقة مراجعة الأكواد: تكرار تجارب، تقديم أدلة مضادة، وتصحيح للأخطاء.
              </p>
            </div>

            <button
              onClick={() => setShowAddResponse(!showAddResponse)}
              className="px-4 py-2 rounded-full bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all self-start sm:self-auto shadow-xs"
            >
              + أعد التجربة أو أضف مراجعة
            </button>
          </div>

          {/* Filter Response Types */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { id: "all", label: "كافة المراجعات" },
              { id: "replication", label: "إعادة تجربة (Replication)" },
              { id: "challenge", label: "تحدي النتيجة (Challenge)" },
              { id: "evidence", label: "أدلة داعمة (Evidence)" },
              { id: "correction", label: "تصحيح (Correction)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                  filterType === f.id
                    ? "bg-[#cef79e] text-[#222f30] font-bold border border-[#a7e26e]"
                    : "bg-[#f5f8f7] border border-[#e4e3e3] text-[#55696a] hover:text-[#222f30]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Add Response Form */}
          {showAddResponse && (
            <form onSubmit={handleAddResponse} className="p-6 rounded-2xl bg-[#f7f7f5] border border-[#e4e3e3] space-y-4">
              <h3 className="text-sm font-bold text-[#222f30]">
                تسجيل مراجعة علمية أو نتيجة إعادة تكرار:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#222f30] mb-1">اسمك والصفة الأكاديمية/التقنية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: د. أحمد الراوي (مختبر النظم)"
                    value={respAuthor}
                    onChange={(e) => setRespAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e4e3e3] bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#222f30] mb-1">نوع المراجعة *</label>
                  <select
                    value={respType}
                    onChange={(e) => setRespType(e.target.value as ResearchResponse["type"])}
                    className="w-full px-3 py-2 rounded-xl border border-[#e4e3e3] bg-white text-xs"
                  >
                    <option value="replication">إعادة تجربة (Replication) — فحص صحة النتيجة عملياً</option>
                    <option value="challenge">تحدي ودليل مضاد (Challenge) — إثبات خطأ أو هلوسة</option>
                    <option value="evidence">دليل داعم (Supporting Evidence) — مصادر تدعم الخلاصة</option>
                    <option value="correction">تصحيح جزئي (Correction) — تصحيح في الكود أو الأرقام</option>
                    <option value="extension">امتداد وتفريع (Extension) — بناء خطوة إضافية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222f30] mb-1">نص المراجعة والتفاصيل التجريبية *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="صِف كيف قمت بإعادة التجربة، أو ما الدليل المضاد الذي وجدته..."
                  value={respContent}
                  onChange={(e) => setRespContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e4e3e3] bg-white text-xs"
                />
              </div>

              <div className="flex items-center justify-between">
                {respSubmitted && <span className="text-xs font-bold text-emerald-600">تم تسجيل مساهمتك بنجاح!</span>}
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] ms-auto flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  إرسال المراجعة
                </button>
              </div>
            </form>
          )}

          {/* Responses List */}
          <div className="space-y-4">
            {filteredResponses.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#738284] font-mono">
                لا توجد مراجعات من هذا النوع حالياً. كن أول من يعيد التجربة أو يراجعها!
              </div>
            ) : (
              filteredResponses.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-[#fcfdfc] border border-[#e4e3e3] space-y-2 hover:border-[#a7e26e] transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        r.type === "replication" ? "bg-emerald-100 text-emerald-800" :
                        r.type === "challenge" ? "bg-amber-100 text-amber-800" :
                        r.type === "correction" ? "bg-blue-100 text-blue-800" :
                        "bg-[#f0f3f2] text-[#222f30]"
                      }`}>
                        {r.type === "replication" && (
                          <span className="inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>تم التكرار (Replication)</span>
                          </span>
                        )}
                        {r.type === "challenge" && (
                          <span className="inline-flex items-center gap-1">
                            <Scale className="w-3 h-3 text-amber-700" />
                            <span>تحدي ودليل مضاد</span>
                          </span>
                        )}
                        {r.type === "evidence" && (
                          <span className="inline-flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-blue-700" />
                            <span>دليل داعم</span>
                          </span>
                        )}
                        {r.type === "correction" && (
                          <span className="inline-flex items-center gap-1">
                            <Wrench className="w-3 h-3 text-slate-700" />
                            <span>تصحيح</span>
                          </span>
                        )}
                        {r.type === "extension" && (
                          <span className="inline-flex items-center gap-1">
                            <GitFork className="w-3 h-3 text-purple-700" />
                            <span>امتداد للبحث</span>
                          </span>
                        )}
                      </span>
                      <span className="text-xs font-bold text-[#222f30]">{r.author}</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#738284]">{r.date}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#445e5f] leading-relaxed pt-1">
                    {r.content}
                  </p>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Citation Box */}
        <div className="space-y-4 mb-12">
          <h3 className="text-sm font-bold text-[#222f30] font-mono uppercase tracking-wider">
            الاقتباس والأرشفة الأكاديمية (Citation):
          </h3>
          <CitationBox bibtex={paper.citation.bibtex} apa={paper.citation.apa} />
        </div>

      </div>
    </main>
  );
}
