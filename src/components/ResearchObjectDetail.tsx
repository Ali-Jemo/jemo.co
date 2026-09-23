"use client";

import { useState, useRef, useEffect } from "react";
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
  BookOpen,
  RotateCcw,
  Bot
} from "lucide-react";
import CitationBox from "@/components/ui/CitationBox";
import PaperReaderModal from "@/components/PaperReaderModal";
import ExportCitationModal from "@/components/ExportCitationModal";
import { isSafeHttpUrl } from "@/lib/security-client";

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
  const [responses, setResponses] = useState<ResearchResponse[]>(paper.responses ?? []);

  const [filterType, setFilterType] = useState<string>("all");
  const [showAddResponse, setShowAddResponse] = useState(false);
  const [respType, setRespType] = useState<ResearchResponse["type"]>("replication");
  const [respAuthor, setRespAuthor] = useState("");
  const [respContent, setRespContent] = useState("");
  const [respSubmitted, setRespSubmitted] = useState(false);
  // JEMO AI Full Chat State with Jev System One Router
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    route?: { targetModel: string; confidence: number };
    timestamp: string;
  }>>([
    {
      id: "init",
      role: "assistant",
      content: `مرحباً بك في JEMO AI! أنا المساعد الحواري لهذا البحث ("${paper.title}").\n\nيمكنك سؤالي بحرية عن المنهجية، نقاط الضعف، كيفية إعادة التجربة، أو أي استفسار حول النتائج وسأجيبك فوراً بتوجيه ذكي عبر Jev.`,
      timestamp: "الآن",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [modNotice, setModNotice] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

  const handleSendChatMessage = async (textOverride?: string) => {
    const text = (textOverride ?? chatInput).trim();
    if (!text || isChatLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: text,
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    };

    const nextMessages = [...chatMessages, userMessage];
    setChatMessages(nextMessages);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/jev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          query: text,
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          paperTitle: paper.title,
          paperFindings: paper.findings || paper.abstract,
          paperTools: paper.toolsUsed,
          paperLimitations: paper.limitations,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `asst-${Date.now()}`,
            role: "assistant",
            content: data.message.content,
            route: data.route ? { targetModel: data.route.targetModel, confidence: data.route.confidence } : undefined,
            timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `asst-fallback-${Date.now()}`,
          role: "assistant",
          content: `بناءً على كائن البحث "${paper.title}":\n\nالخلاصة: ${paper.findings || paper.abstract}\n\nالأدوات المستخدمة: ${(paper.toolsUsed || []).join(", ") || "موثقة في الورقة"}.`,
          route: { targetModel: "fast_retrieval", confidence: 0.9 },
          timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleResetChat = () => {
    setChatMessages([
      {
        id: `init-${Date.now()}`,
        role: "assistant",
        content: `تم بدء جلسة حوارية جديدة حول بحث "${paper.title}". اسألني أي سؤال تريده!`,
        timestamp: "الآن",
      },
    ]);
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

  const handleAddResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!respAuthor || !respContent) return;
    setIsSubmittingResponse(true);
    setModNotice(null);

    try {
      const res = await fetch("/api/jev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "moderate",
          text: respContent,
          author: respAuthor,
        }),
      });
      if (res.status === 401) {
        setModNotice("يلزم تسجيل الدخول لإرسال مراجعة");
        setIsSubmittingResponse(false);
        return;
      }
      if (!res.ok) {
        setModNotice("تعذر التحقق آلياً مؤقتاً");
        setIsSubmittingResponse(false);
        return;
      }
      const data = await res.json();
      if (data.success && data.result) {
        if (!data.result.isConstructive) {
          setModNotice("تم استبعاد التعليق آلياً لعدم استيفائه معايير النقاش التقني البنّاء.");
          setIsSubmittingResponse(false);
          return;
        }
      }
    } catch {
      setModNotice("تعذر التحقق آلياً مؤقتاً");
      setIsSubmittingResponse(false);
      return;
    }

    const newResp: ResearchResponse = {
      id: `resp-${Date.now()}`,
      type: respType,
      author: respAuthor,
      date: new Date().toLocaleDateString("ar-EG"),
      content: respContent,
      verified: false,
    };
    setResponses([newResp, ...responses]);
    setRespAuthor("");
    setRespContent("");
    setRespSubmitted(true);
    setIsSubmittingResponse(false);
    setTimeout(() => {
      setRespSubmitted(false);
      setShowAddResponse(false);
      setModNotice(null);
    }, 1500);
  };

  const filteredResponses = filterType === "all" 
    ? responses 
    : responses.filter((r) => r.type === filterType);

  return (
    <main className="flex-1 py-8 sm:py-16 bg-[#f7f7f5] text-[#222f30]" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#445e5f] hover:text-[#222f30] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لسجلات الاكتشاف والأبحاث</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#ask-ai"
              className="px-3 py-1.5 rounded-full border border-emerald-300 bg-emerald-50 text-xs font-mono font-bold text-emerald-900 hover:bg-emerald-100 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>اسأل الذكاء الاصطناعي (JEMO AI)</span>
            </a>
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
        <div className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl bg-white border border-[#e4e3e3] shadow-sm mb-6 sm:mb-8 space-y-5 sm:space-y-6">
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
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#222f30] font-kufi leading-snug mb-2 sm:mb-3">
              {paper.title}
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#738284] dir-ltr text-right">
              {paper.titleEn}
            </p>
          </div>

          {/* Authors list */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-[#e4e3e3]">
            {(paper.authors ?? []).map((author, idx) => {
              const name = typeof author === "string" ? author : author?.name || "باحث";
              const slug = typeof author === "string" ? `author-${idx}` : author?.slug || `author-${idx}`;
              const role = typeof author === "object" ? author?.role : undefined;
              return (
                <div
                  key={slug}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#f7f7f5] border border-[#e4e3e3]"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#cef79e] text-[#222f30] flex items-center justify-center font-bold text-xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#222f30]">{name}</div>
                    {role && <div className="text-[10px] text-[#55696a] font-mono">{role}</div>}
                  </div>
                </div>
              );
            })}
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
          <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#445e5f] uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#cef79e] text-[#222f30] flex items-center justify-center text-[10px]">1</span>
              <span>ما السؤال أو المعضلة الأساسية؟ (The Question)</span>
            </div>
            <p className="text-base sm:text-lg text-[#222f30] leading-relaxed font-semibold">
              {paper.question || paper.abstract}
            </p>
          </section>

          {/* Section 2: AI Tools & Workflow */}
          <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-4">
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
          <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#445e5f] uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#cef79e] text-[#222f30] flex items-center justify-center text-[10px]">3</span>
              <span>المنهجية ومسار التجربة (Methodology & Process)</span>
            </div>
            <p className="text-sm sm:text-base text-[#445e5f] leading-relaxed">
              {paper.methodology || paper.abstract}
            </p>
          </section>

          {/* Section 4: Key Findings & Solution */}
          <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#445e5f] uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#cef79e] text-[#222f30] flex items-center justify-center text-[10px]">4</span>
              <span>الخلاصة والنتيجة المكتشفة (Findings & Takeaways)</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] text-sm sm:text-base text-[#222f30] font-medium leading-relaxed">
              {paper.findings || paper.abstract}
            </div>
          </section>

          {/* Section 5: Human Verification & Hallucination Debunking (CRITICAL) */}
          <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-emerald-50/60 border border-emerald-200 shadow-xs space-y-4">
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
            <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-4">
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
            <section className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
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

        {/* Ask JEMO AI Full Conversational Assistant (Grounded with Jev System One Router) */}
        <div id="ask-ai" className="rounded-3xl bg-[#1e292b] text-white shadow-xl mb-10 overflow-hidden border border-emerald-500/20 scroll-mt-24">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>JEMO AI · المحادثة الذكية حول البحث</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold border border-emerald-400/30">
                    Jev Router
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  توجيه استدلالي ذكي فوري (<bdi className="font-mono">&lt;100ms</bdi>) مستند إلى بيانات وتجارب هذا البحث
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
              title="بدء جلسة حوارية جديدة"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>محادثة جديدة</span>
            </button>
          </div>

          {/* Quick Starter Chips */}
          <div className="px-4 sm:px-6 pt-3 pb-2 bg-black/20 border-b border-white/5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-400 ml-1">اقتراحات سريعة:</span>
            {[
              "ما أضعف نقطة في هذا البحث؟",
              "كيف يمكنني إعادة التجربة عملياً؟",
              "هل توجد مراجعات أو أدلة تناقض هذه النتيجة؟",
              "ما المنهجية والأدوات المعتمدة؟",
            ].map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendChatMessage(q)}
                disabled={isChatLoading}
                className="px-2.5 py-1 rounded-lg text-xs font-mono text-zinc-300 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-emerald-400/50 transition-all cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div ref={chatContainerRef} className="p-4 sm:p-6 space-y-4 min-h-[260px] max-h-[460px] overflow-y-auto font-sans text-xs sm:text-sm">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-start" : "items-end"}`}
              >
                <div
                  className={`p-4 rounded-2xl max-w-[92%] sm:max-w-[85%] space-y-2 leading-relaxed ${
                    msg.role === "user"
                      ? "bg-emerald-600/90 text-white rounded-tr-xs shadow-sm"
                      : "bg-white/[0.08] text-zinc-100 rounded-tl-xs border border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] font-mono opacity-80 border-b border-white/10 pb-1.5">
                    <span className="font-bold flex items-center gap-1">
                      {msg.role === "user" ? (
                         <span>أنت</span>
                      ) : (
                        <span className="text-[#bef264] flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5" />
                          <span>JEMO Assistant</span>
                        </span>
                      )}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-line text-xs sm:text-[13px] leading-relaxed">
                    {msg.content}
                  </div>

                  {msg.route && (
                    <div className="pt-2 mt-1 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>توجيه Jev System One:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold">
                        {msg.route.targetModel} ({Math.round(msg.route.confidence * 100)}% ثقة)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex flex-col items-end">
                <div className="p-3.5 rounded-2xl rounded-tl-xs bg-white/[0.08] border border-white/10 max-w-[70%] flex items-center gap-2.5 text-xs font-mono text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>جارٍ التوجيه عبر Jev واسترجاع سياق البحث...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChatMessage();
            }}
            className="p-3 sm:p-4 bg-black/30 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="اطرح أي سؤال تفصيلي حول هذا البحث، كوده، أو نتائجه..."
              disabled={isChatLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.07] border border-white/15 text-white placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatLoading}
              className="px-4 sm:px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#162224] font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs shrink-0"
            >
              <span>إرسال</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
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
          {paper.pdfUrl && isSafeHttpUrl(paper.pdfUrl) && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>تحميل الورقة (PDF)</span>
            </a>
          )}

          {paper.datasetUrl && isSafeHttpUrl(paper.datasetUrl) ? (
            <a
              href={paper.datasetUrl}
              target="_blank"
              rel="noopener noreferrer"
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

          {paper.codeUrl && isSafeHttpUrl(paper.codeUrl) ? (
            <a
              href={paper.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
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
        <div className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl bg-white border border-[#e4e3e3] shadow-sm mb-8 sm:mb-12 space-y-5 sm:space-y-6">
          
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

              {modNotice && <p className="text-xs font-bold text-rose-600">{modNotice}</p>}
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
