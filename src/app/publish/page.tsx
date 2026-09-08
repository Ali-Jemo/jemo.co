"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BioButton from "@/components/BioButton";
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Send, 
  HelpCircle,
  Code2,
  BookOpen,
  Scale,
  Stethoscope,
  Copy,
  Eye,
  Check,
  ArrowLeft
} from "lucide-react";

export default function PublishResearchPage() {
  const [activeTab, setActiveTab] = useState<"form" | "preview" | "guidelines">("form");
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [title, setTitle] = useState("استقصاء ومقارنة 6 نماذج في تصحيح نصوص عربية تراثية");
  const [authorName, setAuthorName] = useState("");
  const [authorHandle, setAuthorHandle] = useState("");
  const [category, setCategory] = useState("AI Synthesis");
  const [question, setQuestion] = useState("");
  const [tools, setTools] = useState("Claude 3.5 Sonnet, ChatGPT-4o, DeepSeek-R1, Google Books");
  const [methodology, setMethodology] = useState("");
  const [findings, setFindings] = useState("");
  const [verification, setVerification] = useState("");
  const [confidence, setConfidence] = useState("مرتفعة - قابل للتكرار");
  const [sources, setSources] = useState("");

  const handleCopyJSON = () => {
    const payload = {
      title,
      author: { name: authorName || "باحث مجتمعي", handle: authorHandle },
      category,
      question,
      tools: tools.split(",").map(t => t.trim()),
      methodology,
      findings,
      verification,
      confidence,
      sources: sources.split("\n").filter(Boolean),
      timestamp: new Date().toISOString(),
      type: "Citizen AI Research Story"
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f7f7f5] pt-24 sm:pt-28 pb-20 text-[#222f30]" dir="rtl">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          
          {/* Top Header & Positioning Banner */}
          <div className="max-w-4xl mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-white font-mono text-xs uppercase tracking-widest text-[#445e5f] mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
              <span>سجل الاكتشافات المفتوح · PROOF OF WORK REGISTRY</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#222f30] mb-6 tracking-tight leading-tight font-kufi">
              وثّق بحثك. احفظ سبقك الفكري.
            </h1>
            
            <p className="text-base sm:text-xl text-[#445e5f] leading-relaxed max-w-3xl">
              <strong className="text-[#222f30]">JEMO ليست مدونة مفتوحة لغثاء الـ AI (AI Slop)؛ بل منصة توثيق وتدقيق للاكتشافات المتقدمة.</strong>{" "}
              نحن نبحث ونصل لنتائج غير مسبوقة يومياً داخل شاشات المحادثة، لكن 99% من هذا الجهد يتبخر دون توثيق. وثّق مسارك عبر قالب التحقق البشري الصارم (Proof of Work) ليتحول اكتشافك إلى مرجع تقني نخبوي باسمك.
            </p>

            {/* Slogan Pill */}
            <div className="mt-6 inline-flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs">
              <Sparkles className="w-5 h-5 text-[#a7e26e] shrink-0" />
              <span className="text-sm sm:text-base font-bold text-[#222f30]">
                "حاسوبك مع واجهة AI يصنع مختبراً لشخص واحد — شرط التحقق البشري الصارم."
              </span>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-3 mb-8 border-b border-[#e4e3e3] pb-4">
            <button
              onClick={() => setActiveTab("form")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === "form"
                  ? "bg-[#222f30] text-white shadow-sm"
                  : "bg-white text-[#55696a] border border-[#e4e3e3] hover:text-[#222f30]"
              }`}
            >
              نموذج التوثيق والنشر
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "preview"
                  ? "bg-[#222f30] text-white shadow-sm"
                  : "bg-white text-[#55696a] border border-[#e4e3e3] hover:text-[#222f30]"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              معاينة سجل الاكتشاف
            </button>
            <button
              onClick={() => setActiveTab("guidelines")}
              className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "guidelines"
                  ? "bg-[#222f30] text-white shadow-sm"
                  : "bg-white text-[#55696a] border border-[#e4e3e3] hover:text-[#222f30]"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              دليل صيغة النشر وضوابط النزاهة
            </button>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left/Main Column: Form or Preview or Guidelines */}
            <div className="lg:col-span-8">
              
              {activeTab === "form" && (
                <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e4e3e3] shadow-sm">
                  {submitted ? (
                    <div className="text-center py-12 space-y-6">
                      <div className="w-16 h-16 rounded-full bg-[#cef79e] text-[#222f30] flex items-center justify-center mx-auto shadow-sm">
                        <Check className="w-8 h-8 stroke-[2.5]" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold font-kufi text-[#222f30]">
                        تم توثيق سجل الاكتشاف بنجاح!
                      </h2>
                      <p className="text-sm sm:text-base text-[#55696a] max-w-lg mx-auto leading-relaxed">
                        أصبح بحثك جاهزاً وموثقاً في سجلات المجتمع. تم إرفاق شارة "مساهمة مجتمعية بمساعدة الذكاء الاصطناعي"، ويمكن الآن للباحثين مراجعته وتكراره.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <BioButton
                          href="/research"
                          label="EXPLORE LOGS"
                          secondaryLabel="استعرض الأبحاث"
                          variant="primary"
                          dir="ltr"
                        />
                        <button
                          onClick={() => setSubmitted(false)}
                          className="px-5 py-2.5 rounded-full border border-[#e4e3e3] text-xs font-bold text-[#55696a] hover:bg-[#f5f8f7]"
                        >
                          توثيق بحث آخر
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      
                      {/* Section 1: Title & Author */}
                      <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[#222f30] font-kufi border-b border-[#e4e3e3] pb-3 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#cef79e] text-[#222f30] text-xs font-mono flex items-center justify-center font-bold">1</span>
                          العنوان وبيانات الباحث
                        </h2>

                        <div>
                          <label className="block text-xs font-bold text-[#222f30] mb-1.5">
                            عنوان الاكتشاف أو الرحلة البحثية *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: هل يستطيع نموذج AI استعادة نص عربي من مخطوطة تالفة جزئياً؟"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e] focus:ring-2 focus:ring-[#a7e26e]/20"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#222f30] mb-1.5">
                              اسمك أو اسم الفريق *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="مثال: عمر الكرخي"
                              value={authorName}
                              onChange={(e) => setAuthorName(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#222f30] mb-1.5">
                              حسابك (GitHub أو X أو بريد)
                            </label>
                            <input
                              type="text"
                              placeholder="@handle أو github.com/..."
                              value={authorHandle}
                              onChange={(e) => setAuthorHandle(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#222f30] mb-1.5">
                            نوع الاكتشاف والتصنيف
                          </label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]"
                          >
                            <option value="Systems & Kernels">أبحاث النظم والأنوية — Ziqa، أنظمة التشغيل، والبرمجة منخفضة المستوى</option>
                            <option value="Deep Debugging & Code">حل معضلات معقدة — تتبع أعطال عميقة في الأكواد والمعمارية</option>
                            <option value="AI Reasoning & Benchmarks">تقييم النماذج والاستدلال — مقارنات واختبارات قياسية بالأرقام</option>
                            <option value="Hallucination Debunking">تفكيك الهلوسة وتصحيحها — إثبات خطأ النموذج بالبيانات والمصادر</option>
                            <option value="Compilers & Architecture">المترجمات واللغات — تجارب في لغات البرمجة والعتاد</option>
                            <option value="Hyper-Individual Discovery">استكشافات فردية فائقة — خوارزميات وحوسبة مدعومة بالبراهين</option>
                          </select>
                        </div>
                      </div>

                      {/* Section 2: The Question & Tools */}
                      <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[#222f30] font-kufi border-b border-[#e4e3e3] pb-3 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#cef79e] text-[#222f30] text-xs font-mono flex items-center justify-center font-bold">2</span>
                          السؤال والأدوات المستخدمة
                        </h2>

                        <div>
                          <label className="block text-xs font-bold text-[#222f30] mb-1.5">
                            ما الذي كنت تحاول معرفته أو حله؟ (The Question) *
                          </label>
                          <textarea
                            required
                            rows={3}
                            placeholder="صِف المسألة بوضوح: ما الفكرة أو المشكلة التي دفعتك للبحث؟"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#222f30] mb-1.5">
                            الأدوات ونماذج الذكاء الاصطناعي والمصادر (What did you use?) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: Claude 3.5 Sonnet, ChatGPT-4o, DeepSeek-R1, Google Books, Python"
                            value={tools}
                            onChange={(e) => setTools(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]"
                          />
                          <p className="text-[11px] text-[#55696a] mt-1 font-mono">
                            افصل بين النماذج والمراجع بفواصل.
                          </p>
                        </div>
                      </div>

                      {/* Section 3: The Journey & Findings */}
                      <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[#222f30] font-kufi border-b border-[#e4e3e3] pb-3 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#cef79e] text-[#222f30] text-xs font-mono flex items-center justify-center font-bold">3</span>
                          مسار البحث والخلاصة
                        </h2>

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
                      </div>

                      {/* Section 4: Human Verification & Transparency (CRITICAL) */}
                      <div className="space-y-4">
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
                            placeholder="سجل الشفافية: مثلاً: 'أصاب Claude في تلخيص السياق لكنه اختلق مصدراً في الفقرة 3 وتم تصحيحه بالرجوع لكتاب كذا...'"
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
                            <select
                              value={confidence}
                              onChange={(e) => setConfidence(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]"
                            >
                              <option value="مرتفعة - تم التحقق والاختبار">مرتفعة — تم التحقق والاختبار العملي</option>
                              <option value="متوسطة - تحتاج لمراجعة إضافية">متوسطة — تحتاج لمراجعة وتأكيد إضافي</option>
                              <option value="استكشافية / أولية">استكشافية / أولية — فكرة قابلة للنقاش والتحدي</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#222f30] mb-1.5">
                              المصادر أو رابط المحادثة (اختياري)
                            </label>
                            <input
                              type="text"
                              placeholder="رابط GitHub أو رابط مشاركة الشات..."
                              value={sources}
                              onChange={(e) => setSources(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#a7e26e]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Safety & Ethics Disclaimer */}
                      <div className="p-4 rounded-2xl bg-[#fffbeb] border border-[#fef3c7] text-[#92400e] text-xs space-y-2 leading-relaxed">
                        <div className="flex items-center gap-2 font-bold">
                          <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0" />
                          <span>ضوابط النزاهة العلمية والمجالات الحساسة (الطب والفتاوى):</span>
                        </div>
                        <p>
                          للحفاظ على الأمان والمصداقية، تُمنع "الأبحاث الاستنتاجية بالذكاء الاصطناعي" التي تقدم تشخيصات طبية أو فتاوى شرعية كحقائق قاطعة. جميع المساهمات المجتمعية تُوسم بوسم شفاف يوضح أنها <strong>"بحث مدعوم بالذكاء الاصطناعي قيد المراجعة المجتمعية"</strong> ولا تعد بديلاً عن الجهات المختصة.
                        </p>
                      </div>

                      {/* Submit Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#e4e3e3]">
                        <button
                          type="button"
                          onClick={handleCopyJSON}
                          className="px-4 py-2.5 rounded-full border border-[#e4e3e3] bg-white text-xs font-bold text-[#55696a] hover:text-[#222f30] hover:bg-[#f5f8f7] flex items-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copied ? "تم نسخ صيغة JSON!" : "نسخ بصيغة مسودة (JSON)"}
                        </button>

                        <button
                          type="submit"
                          className="px-8 py-3 rounded-full bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all flex items-center gap-2 shadow-md hover:-translate-y-0.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>نشر وتوثيق في السجل المفتوح</span>
                        </button>
                      </div>

                    </form>
                  )}
                </div>
              )}

              {activeTab === "preview" && (
                <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e4e3e3] shadow-sm space-y-6">
                  
                  {/* Badges Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#cef79e] text-[#222f30] text-[11px] font-mono font-bold flex items-center gap-1">
                      <BrainCircuit className="w-3.5 h-3.5" />
                      AI-Assisted Research
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#f5f8f7] border border-[#e4e3e3] text-[#445e5f] text-[11px] font-mono">
                      {category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#f5f8f7] border border-[#e4e3e3] text-[#445e5f] text-[11px] font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {confidence}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono">
                      مساهمة مجتمعية · لم تُراجع أكاديمياً
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222f30] font-kufi leading-tight">
                    {title || "عنوان البحث الاكتشافي..."}
                  </h2>

                  <div className="flex items-center gap-3 text-xs text-[#55696a] font-mono pb-4 border-b border-[#e4e3e3]">
                    <span>الباحث: {authorName || "اسم الباحث"}</span>
                    {authorHandle && <span>• {authorHandle}</span>}
                    <span>• التاريخ: {new Date().toLocaleDateString("ar-EG")}</span>
                  </div>

                  {/* Question */}
                  <div className="space-y-2 p-4 rounded-2xl bg-[#f7f7f5] border border-[#e4e3e3]">
                    <span className="text-[11px] font-mono font-bold text-[#445e5f] uppercase tracking-wider block">
                      ما السؤال أو المعضلة؟ (The Question)
                    </span>
                    <p className="text-sm text-[#222f30] leading-relaxed">
                      {question || "لم يتم إدخال السؤال بعد."}
                    </p>
                  </div>

                  {/* Tools */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono font-bold text-[#445e5f] uppercase tracking-wider block">
                      الأدوات والنماذج المستخدمة (Tools Used)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tools.split(",").map((t, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-[#f0f3f2] text-xs font-mono text-[#222f30] border border-[#e4e3e3]">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Findings */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono font-bold text-[#445e5f] uppercase tracking-wider block">
                      ما الذي تم اكتشافه أو التوصل إليه؟ (Findings)
                    </span>
                    <p className="text-sm text-[#222f30] leading-relaxed bg-[#fcfdfc] p-4 rounded-2xl border border-[#e4e3e3]">
                      {findings || "النتيجة النهائية والحل الذي توصلت إليه..."}
                    </p>
                  </div>

                  {/* Verification */}
                  <div className="space-y-2 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                    <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      التحقق البشري وتصحيح الهلوسة (Human Verification)
                    </span>
                    <p className="text-xs text-emerald-900 leading-relaxed">
                      {verification || "بيان أين أصاب الذكاء الاصطناعي وأين هلوس وتم تصحيحه..."}
                    </p>
                  </div>

                </div>
              )}

              {activeTab === "guidelines" && (
                <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e4e3e3] shadow-sm space-y-6 text-sm text-[#445e5f] leading-relaxed">
                  <h2 className="text-xl font-bold text-[#222f30] font-kufi">
                    دليل قالب التحقق البشري (Proof of Work)
                  </h2>
                  <p>
                    لا تطلب منك JEMO كتابة أوراق أكاديمية نمطية مملوءة بالحشو، بل تفرض معياراً هندسياً يضمن ألا تتحول المنصة إلى مكب لغثاء الذكاء الاصطناعي (AI Slop). كل بحث يجب أن يلتزم بالأركان الثلاثة:
                  </p>
                  <ol className="list-decimal list-inside space-y-3 pt-2 font-medium text-[#222f30]">
                    <li><strong>المشكلة والفرضيات (The Problem & Hypotheses):</strong> حدد المشكلة التقنية بدقة وما الفرضية التي أردت اختبارها.</li>
                    <li><strong>مسار البحث والأدوات (Investigation & Tools):</strong> اذكر النماذج المستخدمة بدقة وكيف قادت مسار التفاعل.</li>
                    <li><strong>التحقق البشري الصارم (Human Verification):</strong> الركن الأهم! كيف فحصت النتيجة؟ أين أخطأ النموذج وهلوس وتم تصحيحه يدوياً؟ اذكر الاختبارات (Benchmarks) والشفرات.</li>
                    <li><strong>الأثر والفهرسة (Indexable Value):</strong> كود أو نتيجة قابلة للتكرار تمثل مرجعاً تقنياً يمكن للمطورين الاستناد إليه.</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Right Column: Information Cards & Manifesto */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="p-6 rounded-3xl bg-[#222f30] text-white space-y-4 shadow-md">
                <div className="w-10 h-10 rounded-xl bg-[#cef79e] text-[#222f30] flex items-center justify-center font-bold">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-kufi">
                  لماذا توثق في JEMO بدلاً من X أو GitHub؟
                </h3>
                <p className="text-xs text-white/80 leading-relaxed font-normal">
                  منشورات X سريعة الزوال، وتدوينات GitHub تفتقر للفهرسة المتخصصة. JEMO تمنحك فهرسة تقنية نادرة، توثيقاً للسبق الفكري برابط مرجعي معتمد، وبيئة مخصصة لحفظ أبحاث عصر "التوليد الفردي الفائق".
                </p>
                <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-[#bef264]">
                  #Proof_Of_Work_Research
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#e4e3e3] space-y-4 shadow-xs">
                <h4 className="text-sm font-bold text-[#222f30] font-kufi flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#a7e26e]" />
                  فصل الصلاحيات والشفافية
                </h4>
                <ul className="text-xs text-[#55696a] space-y-2.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e] mt-1.5 shrink-0" />
                    <span><strong>محتوى الفريق:</strong> تجارب معمارية وبرمجية يديرها فريق المبادرة مفتوحة المصدر.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e] mt-1.5 shrink-0" />
                    <span><strong>مساهمات المجتمع:</strong> سجلات وسرديات بحثية يشاركها الزوار وتحمل شارة التحقق ومستوى الثقة.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span><strong>التحدي والتطوير:</strong> يمكن لأي زائر تقديم أدلة مضادة وتحديث الاستنتاج في نسخ متتالية.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#e4e3e3] space-y-3 shadow-xs">
                <h4 className="text-sm font-bold text-[#222f30] font-kufi">
                  أمثلة على أبحاث يمكنك نشرها:
                </h4>
                <div className="space-y-2 text-xs text-[#55696a]">
                  <p className="p-2.5 rounded-xl bg-[#f7f7f5]">
                    "تتبع تسريب ذاكرة غامض في نواة نظام باستخدام تحليل ثنائي."
                  </p>
                  <p className="p-2.5 rounded-xl bg-[#f7f7f5]">
                    "مقارنة دقة 5 نماذج استدلالية في تحويل دوال C++ إلى Assembly."
                  </p>
                  <p className="p-2.5 rounded-xl bg-[#f7f7f5]">
                    "فحص هلوسة نموذج لغوي في استرجاع مصادر تاريخية وإثبات زيفها."
                  </p>
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
