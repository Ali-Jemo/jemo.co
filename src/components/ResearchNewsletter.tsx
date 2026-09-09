"use client";

import { useState } from "react";
import { Mail, CheckCircle2, ShieldCheck, ArrowLeft, Check } from "lucide-react";

export default function ResearchNewsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [topics, setTopics] = useState<string[]>(["العلوم الشرعية", "الذكاء الاصطناعي"]);

  const toggleTopic = (topic: string) => {
    if (topics.includes(topic)) {
      setTopics(topics.filter((t) => t !== topic));
    } else {
      setTopics([...topics, topic]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-white border border-[#e4e3e3] rounded-[2.5rem] p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-xs" dir="rtl">
      <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
        
        {/* Header Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-[#f5f8f7] text-[#222f30] text-xs font-mono uppercase tracking-widest shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
          <span>التنبيهات العلمية · SCIENTIFIC ALERTS</span>
        </div>

        <h3 className="text-2xl sm:text-4xl font-black text-[#222f30] tracking-tight font-kufi">
          اشترك في جديد جميع العلوم.
        </h3>

        <p className="text-xs sm:text-base text-[#445e5f] leading-relaxed">
          احصل على الدروس والكتب والأوراق العلمية في الشرعية والذكاء الاصطناعي والطب والطبيعة والإنسانية فور صدورها. بدون إعلانات وبخصوصية مطلقة.
        </p>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 font-mono text-xs sm:text-sm flex items-center justify-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>تم تسجيل بريدك بنجاح! ستتلقى أولى النسخ المسبقة من أبحاث JEMO LABS فور صدورها.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            {/* Topic Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 text-xs font-mono">
              {["العلوم الشرعية", "الذكاء الاصطناعي", "الطب وعلوم الحياة", "الفيزياء والفلك", "العلوم الإنسانية", "التراث والمخطوطات"].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleTopic(t)}
                  className={`px-3.5 py-1.5 rounded-full border text-xs transition-all duration-200 cursor-pointer ${
                    topics.includes(t)
                      ? "bg-[#cef79e] text-[#222f30] border-[#a7e26e] font-bold shadow-xs"
                      : "bg-[#f5f8f7] text-[#445e5f] border-[#e4e3e3] hover:border-[#a7e26e]"
                  }`}
                >
                  {topics.includes(t) ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#222f30]" />
                      <span>{t}</span>
                    </span>
                  ) : (
                    <span>+ {t}</span>
                  )}
                </button>
              ))}
            </div>

            {/* IntegratedBio Pill Input Box + Embedded Submit Button */}
            <div className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto p-1.5 bg-[#f5f8f7] border border-[#e4e3e3] rounded-full shadow-xs focus-within:border-[#a7e26e] transition-colors">
              <div className="relative w-full flex items-center">
                <Mail className="w-4 h-4 text-[#445e5f] absolute right-4 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="أدخل بريدك الأكاديمي..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-11 pl-4 py-2.5 bg-transparent text-xs sm:text-sm text-[#222f30] placeholder-[#738284] outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-[#222f30] hover:bg-[#162021] text-white font-bold font-mono text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-300 shadow-xs cursor-pointer active:scale-95"
              >
                <span>اشترك</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#445e5f]">
              <ShieldCheck className="w-4 h-4 text-[#728825]" />
              <span>خصوصية أكاديمية كاملة — 100% غير تجاري وخالٍ من أي تعقب</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
