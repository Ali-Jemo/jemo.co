"use client";

import React, { useState } from "react";
import {
  Key,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  Code2,
  ShieldAlert,
  Eye,
  EyeOff
} from "lucide-react";
import type { ResearcherProfile } from "@/lib/auth-context";
import {
  cardClass,
  enBadgeClass,
  outlineBtnClass,
  IconChip,
} from "@/components/dashboard/ui";

interface ApiHubTabProps {
  profile: ResearcherProfile;
  onUpdateApiKey: (newKey: string) => void;
}

/** Small ghost button for use on dark code panels. */
const codeBtnClass =
  "px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 text-[11px] flex items-center gap-1 cursor-pointer transition-colors";

export default function ApiHubTab({ profile, onUpdateApiKey }: ApiHubTabProps) {
  const currentKey = profile.apiKey || `jemo_live_res_${profile.id.replace(/^user_/, "").slice(0, 16)}`;
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPython, setCopiedPython] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(currentKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في توليد مفتاح API جديد؟ سيتوقف المفتاح القديم عن العمل فوراً.")) {
      setIsRegenerating(true);
      const randomHex = Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      const newKey = `jemo_live_res_${randomHex}`;
      onUpdateApiKey(newKey);
      setTimeout(() => setIsRegenerating(false), 300);
    }
  };

  const pythonSnippet = `from jemo import ResearchRegistry

# التهيئة بمفتاحك الأكاديمي الموثق
client = ResearchRegistry(
    api_key="${currentKey}",
    endpoint="https://jemo.co/api"
)

# نشر كائن بحثي ناتج عن جلسة استدلال
discovery = client.publish_object(
    title="تدقيق استدلالي لنماذج التفكير العميق",
    field="الذكاء الاصطناعي وهندسة الاستدلال",
    research_type="Experiment",
    question="هل تنخفض نسبة الهلوسة عند عزل سياق التدريب؟",
    tools=["Claude 3.7", "DeepSeek-R1", "vLLM-Engine"],
    findings="انخفاض معدل الخطأ في الإعراب بنسبة 34% عند استخدام تقنية CoT المجزأة.",
    confidence="مرتفعة - تم التكرار بنجاح"
)

print(f"تم التوثيق برقم: {discovery.id} | الرابط: {discovery.url}")`;

  const curlSnippet = `curl -X POST https://jemo.co/api/content/schema \\
  -H "Authorization: Bearer ${currentKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "research_object",
    "title": "Automated Benchmark Result",
    "field": "Systems & AI",
    "reproduced": true
  }'`;

  return (
    <div className="space-y-6">
      {/* API Key Box */}
      <div className={`${cardClass} p-5 sm:p-6 space-y-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <IconChip accent="dark" size="lg">
              <Key className="w-5 h-5" />
            </IconChip>
            <div>
              <h2 className="text-lg font-bold font-kufi text-[#222f30] flex flex-wrap items-center gap-2">
                <span>مفتاح الـ <bdi>API</bdi> لرفع الأبحاث آلياً</span>
                <span className={enBadgeClass}>
                  <bdi>CLI & SDK</bdi>
                </span>
              </h2>
              <p className="text-xs text-[#55696a] mt-1">
                مفتاح شخصي معتمد يتيح لك ربط بيئات التدريب ودفاتر Jupyter والأوامر بالمنظومة
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRegenerateKey}
            disabled={isRegenerating}
            className={`${outlineBtnClass} self-start sm:self-center shrink-0`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
            <span>إعادة توليد المفتاح</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1415] text-white font-mono text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-[11px] font-mono">JEMO SECRET API KEY:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className={codeBtnClass}
                title={showKey ? "إخفاء المفتاح" : "إظهار المفتاح"}
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showKey ? "إخفاء" : "إظهار"}</span>
              </button>
              <button
                type="button"
                onClick={handleCopyKey}
                className={`${codeBtnClass} text-[#bef264]`}
              >
                {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? "تم النسخ!" : "نسخ المفتاح"}</span>
              </button>
            </div>
          </div>
          <div className="tracking-wider text-[#bef264] overflow-x-auto py-1 dir-ltr text-left select-all">
            {showKey ? currentKey : `${currentKey.slice(0, 14)}••••••••••••••••••••••••`}
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            عامل هذا المفتاح بسرية تامة ككلمة المرور. لا تقم بتضمينه في مستودعات عامة (Public GitHub Repos) واستخدم متغيرات البيئة <code>JEMO_API_KEY</code> دائماً.
          </span>
        </div>
      </div>

      {/* Code Snippets (Python & CLI) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Python SDK */}
        <div className={`${cardClass} p-5 sm:p-6 space-y-3 flex flex-col justify-between`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#222f30]" />
                <h3 className="text-sm font-bold font-kufi text-[#222f30] flex items-center gap-1.5">
                  <span>حزمة بايثون (JEMO Python SDK)</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(pythonSnippet);
                  setCopiedPython(true);
                  setTimeout(() => setCopiedPython(false), 2000);
                }}
                className="text-xs font-mono text-[#55696a] hover:text-[#222f30] flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f0f2f0] transition-colors cursor-pointer"
              >
                {copiedPython ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPython ? "تم" : "نسخ الكود"}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-[#0c1415] text-zinc-300 font-mono text-[11px] overflow-x-auto dir-ltr text-left leading-relaxed">
              {pythonSnippet}
            </pre>
          </div>

          <span className="text-[11px] text-[#738284] font-mono">
            التثبيت: <code>pip install jemo-sdk</code>
          </span>
        </div>

        {/* cURL CLI */}
        <div className={`${cardClass} p-5 sm:p-6 space-y-3 flex flex-col justify-between`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#222f30]" />
                <h3 className="text-sm font-bold font-kufi text-[#222f30] flex items-center gap-1.5">
                  <span>الطرفية وواجهة الاستدعاء</span>
                  <span className="text-[11px] font-mono text-[#738284] px-1.5 py-0.5 rounded bg-[#f0f2f0]"><bdi>cURL & REST</bdi></span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(curlSnippet);
                  setCopiedCurl(true);
                  setTimeout(() => setCopiedCurl(false), 2000);
                }}
                className="text-xs font-mono text-[#55696a] hover:text-[#222f30] flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f0f2f0] transition-colors cursor-pointer"
              >
                {copiedCurl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCurl ? "تم" : "نسخ الأمر"}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-[#0c1415] text-zinc-300 font-mono text-[11px] overflow-x-auto dir-ltr text-left leading-relaxed">
              {curlSnippet}
            </pre>
          </div>

          <span className="text-[11px] text-[#738284] font-mono">
            يدعم بروتوكول HTTPS المشفر مع حماية الجدار الناري WAF.
          </span>
        </div>
      </div>
    </div>
  );
}
