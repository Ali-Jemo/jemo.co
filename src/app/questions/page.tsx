"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BioButton from "@/components/BioButton";
import { OPEN_QUESTIONS, OpenQuestion } from "@/lib/data/research-data";
import { 
  HelpCircle, 
  BrainCircuit, 
  FlaskConical, 
  CheckCircle2, 
  Clock, 
  Tag, 
  ArrowUpLeft, 
  Sparkles, 
  Search, 
  Send, 
  Filter,
  Layers,
  Scale
} from "lucide-react";

export default function OpenQuestionsPage() {
  const [questions, setQuestions] = useState<OpenQuestion[]>(OPEN_QUESTIONS);
  const [selectedField, setSelectedField] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Suggest New Question Modal/Form State
  const [showSuggestForm, setShowSuggestForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newField, setNewField] = useState("معالجة اللغة الطبيعية");
  const [newDesc, setNewDesc] = useState("");
  const [suggestSubmitted, setSuggestSubmitted] = useState(false);

  const fields = ["all", "معالجة اللغة الطبيعية", "الرؤية الحاسوبية والتراث", "هندسة النظم والبرمجيات", "أنظمة التشغيل والنوى"];
  const statuses = ["all", "مفتوح للنقاش والبحث", "قيد التجارب والتكرار", "غير محسوم بعد", "محلول جزئياً"];

  const filteredQuestions = questions.filter((q) => {
    const matchesField = selectedField === "all" || q.field === selectedField;
    const matchesStatus = selectedStatus === "all" || q.status === selectedStatus;
    const matchesQuery = searchQuery === "" || 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesField && matchesStatus && matchesQuery;
  });

  const handleSuggest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;
    const newQ: OpenQuestion = {
      id: `q-${Date.now()}`,
      slug: `q-${Date.now()}`,
      title: newTitle,
      titleEn: "Community Suggested Open Problem",
      field: newField,
      status: "مفتوح للنقاش والبحث",
      description: newDesc,
      researchCount: 0,
      experimentsCount: 0,
      replicationsCount: 0,
      consensus: "سؤال مفتوح جديد بانتظار أولى المساهمات والتجارب الاستقصائية من المجتمع.",
      tags: ["Open Problem", "Community Suggested"]
    };
    setQuestions([newQ, ...questions]);
    setNewTitle("");
    setNewDesc("");
    setSuggestSubmitted(true);
    setTimeout(() => {
      setSuggestSubmitted(false);
      setShowSuggestForm(false);
    }, 1500);
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f7f7f5] pt-24 sm:pt-28 pb-20 text-[#222f30]" dir="rtl">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          
          {/* Top Hero Banner */}
          <div className="max-w-4xl mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-white font-mono text-xs uppercase tracking-widest text-[#445e5f] mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
              <span>الأسئلة المفتوحة · OPEN RESEARCH PROBLEMS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#222f30] mb-6 tracking-tight leading-tight font-kufi">
              معضلات علمية بانتظار من يستكشفها.
            </h1>

            <p className="text-base sm:text-xl text-[#445e5f] leading-relaxed max-w-3xl">
              في JEMO، لا نكتفي بنشر النتائج الجاهزة، بل نطرح <strong className="text-[#222f30]">الأسئلة المفتوحة (Open Problems)</strong> ككيان مستقل: معضلات لم تُحسم بعد، ليعمل عليها الباحثون والمطورون معاً عبر تجارب متتالية، تكرارات، وتحديات نقدية.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setShowSuggestForm(!showSuggestForm)}
                className="px-5 py-2.5 rounded-full bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all flex items-center gap-2 shadow-xs"
              >
                <HelpCircle className="w-4 h-4 text-[#a7e26e]" />
                <span>+ اطرح سؤالاً أو معضلة بحثية</span>
              </button>
              <Link
                href="/publish"
                className="px-5 py-2.5 rounded-full border border-[#e4e3e3] bg-white text-xs font-bold text-[#445e5f] hover:text-[#222f30] transition-all"
              >
                وثّق بحثك في سؤال موجود
              </Link>
            </div>
          </div>

          {/* Suggest Question Modal / Slide */}
          {showSuggestForm && (
            <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-md max-w-3xl">
              <h3 className="text-lg font-bold text-[#222f30] font-kufi mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#a7e26e]" />
                طرح مسألة أو سؤال مفتوح لمجتمع البحث:
              </h3>
              <p className="text-xs text-[#55696a] mb-4">
                صِف المعضلة التي تحتاج لتحقيق واختبار بالذكاء الاصطناعي ليشارك الآخرون في تجريبها.
              </p>

              <form onSubmit={handleSuggest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#222f30] mb-1">عنوان السؤال أو المسألة المفتوحة *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: هل يمكن تقليل استهلاك ذاكرة النماذج بنسبة 50% دون فقدان دقة الاستدلال؟"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e4e3e3] text-xs focus:outline-none focus:border-[#a7e26e]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#222f30] mb-1">المجال العلمي</label>
                    <select
                      value={newField}
                      onChange={(e) => setNewField(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#e4e3e3] text-xs"
                    >
                      <option value="معالجة اللغة الطبيعية">معالجة اللغة الطبيعية</option>
                      <option value="الرؤية الحاسوبية والتراث">الرؤية الحاسوبية والتراث</option>
                      <option value="هندسة النظم والبرمجيات">هندسة النظم والبرمجيات</option>
                      <option value="أنظمة التشغيل والنوى">أنظمة التشغيل والنوى</option>
                      <option value="العلوم الطبيعية">العلوم الطبيعية</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#222f30] mb-1">وصف المعضلة وما تم التوصل إليه حتى الآن *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="اشرح لماذا هذا السؤال مهم، وما الفرضيات المقترحة لفحصه..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e4e3e3] text-xs focus:outline-none focus:border-[#a7e26e]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {suggestSubmitted && <span className="text-xs font-bold text-emerald-600">تمت إضافة السؤال بنجاح!</span>}
                  <div className="flex gap-2 ms-auto">
                    <button
                      type="button"
                      onClick={() => setShowSuggestForm(false)}
                      className="px-4 py-2 rounded-full border border-[#e4e3e3] text-xs text-[#55696a]"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      نشر المسألة في السجل
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Search & Filters Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#738284] absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث في المعضلات والأسئلة المفتوحة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 text-xs rounded-full border border-[#e4e3e3] bg-[#fcfdfc] focus:outline-none focus:border-[#a7e26e]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[#738284] flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#a7e26e]" />
                الحالة:
              </span>
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                    selectedStatus === st
                      ? "bg-[#222f30] text-white font-bold"
                      : "bg-[#f5f8f7] border border-[#e4e3e3] text-[#55696a] hover:text-[#222f30]"
                  }`}
                >
                  {st === "all" ? "كافة الحالات" : st}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredQuestions.map((q) => (
              <article
                key={q.id}
                className="p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#f5f8f7] border border-[#e4e3e3] text-[#445e5f] text-[11px] font-mono font-bold">
                      {q.field}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      q.status === "محلول جزئياً" ? "bg-emerald-100 text-emerald-800" :
                      q.status === "قيد التجارب والتكرار" ? "bg-blue-100 text-blue-800" :
                      q.status === "غير محسوم بعد" ? "bg-amber-100 text-amber-800" :
                      "bg-zinc-100 text-zinc-800"
                    }`}>
                      {q.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold font-kufi text-[#222f30] group-hover:text-[#1c6442] transition-colors leading-snug">
                    {q.title}
                  </h2>

                  <p className="text-xs text-[#55696a] leading-relaxed">
                    {q.description}
                  </p>

                  {/* Metrics Badges */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#e4e3e3] text-center font-mono">
                    <div className="p-2 rounded-xl bg-[#f7f7f5]">
                      <div className="text-base font-extrabold text-[#222f30]">{q.researchCount}</div>
                      <div className="text-[10px] text-[#738284]">أبحاث موثقة</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#f7f7f5]">
                      <div className="text-base font-extrabold text-[#222f30]">{q.experimentsCount}</div>
                      <div className="text-[10px] text-[#738284]">تجارب واختبارات</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#f7f7f5]">
                      <div className="text-base font-extrabold text-emerald-700">{q.replicationsCount}</div>
                      <div className="text-[10px] text-[#738284]">تكرارات ناجحة</div>
                    </div>
                  </div>

                  {/* Current Scientific Consensus */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 space-y-1">
                    <span className="font-bold font-mono text-emerald-800 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5" />
                      الإجماع العلمي الحالي (Consensus):
                    </span>
                    <p className="leading-relaxed text-[11px] text-emerald-900">
                      {q.consensus}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-6 mt-6 border-t border-[#e4e3e3] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {q.tags.map((t, i) => (
                      <span key={i} className="text-[10px] font-mono text-[#738284]">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/publish?question=${encodeURIComponent(q.title)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold font-mono text-[#222f30] hover:text-[#a7e26e] group-hover:-translate-x-1 transition-all"
                  >
                    <span>ساهم ببحثك في هذا السؤال</span>
                    <ArrowUpLeft className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#e4e3e3] space-y-3">
              <HelpCircle className="w-10 h-10 text-[#a7e26e] mx-auto" />
              <h3 className="text-lg font-bold text-[#222f30]">لم يتم العثور على معضلات مطابقة</h3>
              <p className="text-xs text-[#55696a]">جرب تغيير شروط التصفية أو اطرح سؤالك الآن ليصبح مسألة مفتوحة للمجتمع.</p>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
