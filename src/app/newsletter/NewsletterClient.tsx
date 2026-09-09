"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Mail,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  BookOpen,
  Rss,
  Terminal,
  Cpu,
  CheckCircle2,
  Search,
  Check,
  Copy,
  Flame,
  Users,
  Code,
  BarChart3,
  X,
  FileText,
  Quote,
} from "lucide-react";

interface Issue {
  id: string;
  number: string;
  date: string;
  category: "all" | "systems" | "ai" | "distributed" | "security";
  categoryLabel: string;
  title: string;
  summary: string;
  fullAbstract: string;
  methodology: string;
  takeaways: string[];
  readTime: string;
  tag: string;
  leadAuthor: string;
  labName: string;
  githubUrl?: string;
  paperUrl?: string;
}

const ISSUES: Issue[] = [
  {
    id: "issue-14",
    number: "العدد #14",
    date: "1 سبتمبر 2026",
    category: "systems",
    categoryLabel: "النوى والأنظمة",
    title: "تحليل معماري لنواة الاستدلال السيادية: كفاءة الذاكرة في المعالجة التفرعية",
    summary:
      "دراسة تجريبية لقياس استهلاك ذاكرة VRAM في استدعاء النماذج اللغوية على عتاد محلي منخفض التكلفة مع عزل تام لقنوات الإدخال.",
    fullAbstract:
      "يستعرض هذا العدد تفاصيل المعمارية الداخلية لنواة Jemo Inference Core المطورة بلغة Rust، والتي تهدف إلى تجاوز اختناقات إدارة الذاكرة الشائعة في خوادم vLLM ومكتبات بايثون عند تشغيل النماذج اللغوية العربية الكبيرة (7B/14B). نكشف عن آليات إدارة الصفحات اللحظية (Paged Attention) المعدلة لتقليل التشتت ومضاعفة معدل نقل الموترات عبر ناقل PCIe.",
    methodology:
      "أُجريت الاختبارات على معالجات Apple M3 Max (36GB Unified) وبطاقات NVIDIA RTX 4090 (24GB). تم قياس زمن وصول الرمز الأول (TTFT) ومعدل التوليد المستمر عبر 50,000 استعلام عشوائي محكم.",
    takeaways: [
      "خفض استهلاك الذاكرة اللحظية بنسبة 38.4% مقارنة بنظم vLLM التقليدية.",
      "معدل توليد 42 رمز/ثانية (Tokens/sec) على معالجات M3 Max المحلية.",
      "عزل كامل للبيانات بدون أي استدعاءات سحابية خارجية (Zero-Egress).",
    ],
    readTime: "8 دقائق قراءة",
    tag: "العدد الحالي",
    leadAuthor: "د. عمار الجميلي",
    labName: "مختبر النوى والأنظمة التشغيلية",
    githubUrl: "/open-source",
    paperUrl: "/research",
  },
  {
    id: "issue-13",
    number: "العدد #13",
    date: "15 أغسطس 2026",
    category: "ai",
    categoryLabel: "الذكاء الاصطناعي",
    title: "تدريب النماذج اللغوية العربية على الأجهزة الطرفية: التحديات والفرص",
    summary:
      "استعراض أوزان النماذج المصغرة (Edge LLMs) المدربة على نصوص عربية محكمة، ومنهجية التكميم دون فقدان الدقة الدلالية.",
    fullAbstract:
      "نناقش في هذا العدد تقنيات الضغط والتكميم المتكيف (Adaptive 4-bit Quantization) لنماذج معالجة النصوص العربية، مع التركيز على الاحتفاظ بالدقة الصرفية والنحوية في اللهجات الإقليمية والفصحى دون الحاجة إلى خوادم سحابية ضخمة.",
    methodology:
      "استخدمنا مجموعة بيانات تضم 12 مليون مدخل نحوي وصرفي محكم، وتم تقييم المخرجات باستخدام مقاييس Perplexity ومصفوفات التقييم البشري المزدوج.",
    takeaways: [
      "تقليص حجم النموذج من 14GB إلى 3.8GB بتكميم 4-bit متكيف.",
      "تحقيق دقة 92.6% في اختبارات الفهم التركيبي والمعجمي للغة العربية.",
      "توفير حزم التشغيل لمطوري الأنظمة المدمجة ومشاريع إنترنت الأشياء.",
    ],
    readTime: "11 دقيقة قراءة",
    tag: "نماذج مفتوحة",
    leadAuthor: "م. ريان القيسي",
    labName: "مختبر النماذج واللغويات الحاسوبية",
    githubUrl: "/open-source",
    paperUrl: "/research",
  },
  {
    id: "issue-12",
    number: "العدد #12",
    date: "1 أغسطس 2026",
    category: "distributed",
    categoryLabel: "الحوسبة الموزعة",
    title: "توزيع الأعباء الحوسبية في مزارع الاستدلال اللامركزية",
    summary:
      "بنية تحتية لتنسيق مهام الاستدلال عبر وحدات معالجة موزعة جغرافياً، وتفادي اختناقات زمن الوصول وشبكات النقل.",
    fullAbstract:
      "يقدم هذا العدد مخططاً هندسياً لبناء طبقة تنسيق موزعة تجمع بين الأجهزة الفردية والخوادم المتناثرة جغرافياً لتنفيذ دفعات الاستدلال (Batch Processing) مع ضمان التزامن ومنع الانقطاعات.",
    methodology:
      "اختبار شبكة تجريبية مؤلفة من 48 عقدة موزعة بين بغداد، إسطنبول، وبرلين، وقياس قدرة الخوارزمية على تفادي العقد البطيئة ديناميكياً.",
    takeaways: [
      "خوارزمية موازنة ديناميكية تعتمد على زمن استجابة العقد الحافة.",
      "تقليل زمن التأخير التراكمي بنسبة 29% في شبكات النطاق العريض.",
      "بروتوكول موحد للتحقق من صحة المخرجات الحسابية عبر التجزئة التشفيرية.",
    ],
    readTime: "9 دقائق قراءة",
    tag: "بنية تحتية",
    leadAuthor: "د. هدى السامرائي",
    labName: "مختبر البنية السحابية والموزعة",
    githubUrl: "/open-source",
    paperUrl: "/research",
  },
  {
    id: "issue-11",
    number: "العدد #11",
    date: "15 يوليو 2026",
    category: "security",
    categoryLabel: "الأمان الرقمي",
    title: "بروتوكولات الأمان والتشفير التام في خطوط أنابيب الاستدلال العصبي",
    summary:
      "تطبيق تقنيات الحوسبة السرية (Confidential Computing) لحماية نماذج العملاء من التسريب أثناء المعالجة في السحابة.",
    fullAbstract:
      "تحليل تفصيلي لاستخدام بيئات التنفيذ الموثوقة (TEEs) مثل Intel TDX وAMD SEV-SNP لضمان عدم إمكانية قراءة أوزان النماذج أو مدخلات المستخدمين حتى من قبل مشغلي مراكز البيانات.",
    methodology:
      "بناء نموذج إثبات مفهوم كامل تم إخضاعه لاختبارات حقن الذاكرة وتحليل القنوات الجانبية (Side-Channel Attacks).",
    takeaways: [
      "عزل الذاكرة التشغيلية باستخدام بيئات التنفيذ الموثوقة (TEE).",
      "إثباتات رياضية لعدم إمكانية قراءة الأوزان أثناء مراحل الحساب التفرعي.",
      "دليل تنفيذي للمؤسسات الصحية والمصرفية للامتثال للمعايير الصارمة.",
    ],
    readTime: "7 دقائق قراءة",
    tag: "أمان سيبراني",
    leadAuthor: "م. كريم التميمي",
    labName: "مختبر التشفير والأمان الرقمي",
    githubUrl: "/open-source",
    paperUrl: "/research",
  },
  {
    id: "issue-10",
    number: "العدد #10",
    date: "1 يوليو 2026",
    category: "systems",
    categoryLabel: "التقرير نصف السنوي",
    title: "حصيلة الأوراق المحكمة وتقارير الأثر البحثي للنصف الأول من 2026",
    summary:
      "توثيق شامل للأوراق المنشورة، المستودعات مفتوحة المصدر، والمنح البحثية الممنوحة للجامعات والمراكز الشريكة.",
    fullAbstract:
      "تقرير شامل يلخص مخرجات النصف الأول من عام 2026 في JEMO LABS، بما في ذلك إحصاءات تحميل المستودعات، الأوراق المقبولة في مؤتمرات NeurIPS وICLR، ومعدلات الأداء الحوسبي.",
    methodology:
      "تجميع بيانات المراقبة الداخلية وسجلات النشر المفتوح وتقارير التدقيق المالي المستقل.",
    takeaways: [
      "نشر 18 ورقة محكمة في مؤتمرات النظم والذكاء الاصطناعي الدولية.",
      "تجاوز مستودعات المختبرات حاجز 12,000 نجمة على GitHub.",
      "تفعيل 6 شراكات استراتيجية مع جامعات ومعاهد بحثية رائدة.",
    ],
    readTime: "14 دقيقة قراءة",
    tag: "تقرير مؤسسي",
    leadAuthor: "فريق الإشراف العلمي",
    labName: "JEMO LABS Institutional Board",
    paperUrl: "/publications",
  },
  {
    id: "issue-09",
    number: "العدد #09",
    date: "15 يونيو 2026",
    category: "ai",
    categoryLabel: "الذكاء الاصطناعي",
    title: "هندسة موجهات الاستدلال اللغوي: من التلقين إلى التوليد المنطقي المنظم",
    summary:
      "تحليل مقارن لمنهجيات Chain-of-Thought وTree-of-Thoughts في حل المعضلات الخوارزمية المعقدة باللغة العربية.",
    fullAbstract:
      "يقارن هذا العدد بين أنماط التفكير المتسلسل والشجري للنماذج اللغوية عند معالجة المسائل البرمجية والمنطقية المعقدة المصاغة بالعربية، مع التركيز على تقليل الهلوسات الدلالية.",
    methodology:
      "اختبار 10 نماذج مختلفة على بنك أسئلة يضم 5,000 مسألة رياضية ومنطقية عربية متدرجة الصعوبة.",
    takeaways: [
      "رفع دقة الاستنتاج المنطقي في المسائل الرياضية بنسبة 34%.",
      "أطر عمل قياسية لصياغة الموجهات البرمجية باللغة العربية الفصحى.",
      "مكتبة بايثون مفتوحة المصدر لتوليد ومراجعة مسارات التفكير الآلي.",
    ],
    readTime: "10 دقائق قراءة",
    tag: "خوارزميات",
    leadAuthor: "د. طارق البياتي",
    labName: "مختبر النماذج واللغويات الحاسوبية",
    githubUrl: "/open-source",
    paperUrl: "/research",
  },
];

const BENCHMARKS = [
  { runtime: "JEMO Sovereign Kernel", throughput: 42.0, vram: 4.28, isHero: true },
  { runtime: "vLLM (Standard)", throughput: 28.5, vram: 6.95, isHero: false },
  { runtime: "llama.cpp (Metal/CUDA)", throughput: 24.2, vram: 5.12, isHero: false },
  { runtime: "Ollama Runtime", throughput: 19.8, vram: 5.80, isHero: false },
];

const CATEGORIES = [
  { id: "all", label: "جميع الأعداد" },
  { id: "systems", label: "النوى والأنظمة" },
  { id: "ai", label: "الذكاء الاصطناعي" },
  { id: "distributed", label: "الحوسبة الموزعة" },
  { id: "security", label: "الأمان والتشفير" },
];

const TOPICS_AVAILABLE = [
  "النوى والأنظمة السيادية",
  "الذكاء الاصطناعي العربي",
  "الحوسبة الموزعة والعتاد",
  "الأمان والحوسبة السرية",
  "أوراق المؤتمرات الدولية",
];

const CONTRIBUTING_LABS = [
  {
    name: "مختبر النوى والأنظمة التشغيلية",
    code: "KERNELS & OS LAB",
    desc: "تطوير طبقات استدلال منخفضة المستوى ومعالجة الذاكرة التفرعية للعتاد السيادي.",
    papersCount: "8 أوراق",
  },
  {
    name: "مختبر النماذج واللغويات الحاسوبية",
    code: "ARABIC AI LAB",
    desc: "أبحاث معالجة اللغة الطبيعية، بناء المعاجم الرقمية، وتدريب النماذج اللغوية المتخصصة.",
    papersCount: "12 ورقة",
  },
  {
    name: "مختبر البنية السحابية والموزعة",
    code: "DISTRIBUTED LAB",
    desc: "تصميم مزارع المعالجة اللامركزية وحلول موازنة الأحمال الحوسبية اللحظية.",
    papersCount: "6 أوراق",
  },
  {
    name: "مختبر التشفير والأمان الرقمي",
    code: "SECURITY LAB",
    desc: "بروتوكولات الحوسبة السرية، حماية الأوزان، واختبارات الاختراق للأنظمة العصبية.",
    papersCount: "5 أوراق",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "نشرة JEMO هي المرجع العربي النادر الذي يتناول هندسة النوى الحقيقية والمعادلات الصلبة دون أي تسويق تجاري أو وعود زائفة. كل عدد هو بحث مصغر قابل للتنفيذ المباشر.",
    author: "د. سامي العلوان",
    title: "أستاذ مشارك في هندسة الحوسبة الفائقة",
    affiliation: "جامعة بغداد",
  },
  {
    quote:
      "الشفرات المصدرية المرفقة في كل إصدار وفرت على فريقنا شهوراً من البحث والتجريب عند بناء خوادم الاستدلال الموفرة للطاقة. مستوى عمق تقني استثنائي.",
    author: "م. زينب المهدي",
    title: "مهندسة نظم ذكاء اصطناعي",
    affiliation: "مختبرات النظم الذكية",
  },
  {
    quote:
      "الالتزام الصارم بـ Zero Spam والتركيز الحصري على الأوراق المحكمة والأرقام الدقيقة جعل هذه النشرة قراءة إجبارية صباح كل نصف شهر.",
    author: "د. إبراهيم الخالدي",
    title: "باحث زائر في أمان الذكاء الاصطناعي",
    affiliation: "المعهد التقني المتقدم",
  },
];

export default function NewsletterClient() {
  const [email, setEmail] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "النوى والأنظمة السيادية",
    "الذكاء الاصطناعي العربي",
  ]);
  const [format, setFormat] = useState<"html" | "markdown">("html");
  const [submitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedRss, setCopiedRss] = useState(false);
  const [activeTabCode, setActiveTabCode] = useState<"benchmark" | "config">("benchmark");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [copiedCitation, setCopiedCitation] = useState(false);

  // Restore submission from localStorage if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jemo_newsletter_subscribed");
      if (saved) {
        setEmail(saved);
        setSubmitted(true);
      }
    } catch {}
  }, []);

  // Handle ESC key for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIssue(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubscribe = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
    try {
      localStorage.setItem("jemo_newsletter_subscribed", email);
    } catch {}
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyRss = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/rss.xml`);
      setCopiedRss(true);
      setTimeout(() => setCopiedRss(false), 2000);
    }
  };

  const handleCopyCitation = (issue: Issue) => {
    if (typeof window !== "undefined") {
      const citation = `@article{jemo_dispatch_${issue.id.replace("-", "_")},
  title = {${issue.title}},
  author = {${issue.leadAuthor}},
  journal = {JEMO LABS Research Dispatch},
  volume = {${issue.number}},
  year = {2026},
  url = {https://jemo.co/transparency#${issue.id}}
}`;
      navigator.clipboard.writeText(citation);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2000);
    }
  };

  const filteredIssues = useMemo(() => {
    return ISSUES.filter((issue) => {
      const matchesCategory =
        activeCategory === "all" || issue.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        issue.title.includes(searchQuery) ||
        issue.summary.includes(searchQuery) ||
        issue.leadAuthor.includes(searchQuery) ||
        issue.takeaways.some((t) => t.includes(searchQuery));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Master Subscription Box */}
      <section
        id="subscribe"
        className="p-6 sm:p-10 md:p-14 rounded-3xl bg-[var(--surface)] border border-[var(--line)] shadow-xs relative overflow-hidden"
      >
        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink-2)]">
              <Flame className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>انضم إلى +4,850 باحثاً ومطوراً في الأكاديميا والمراكز البحثية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--ink-1)] tracking-tight font-kufi">
              اشترك في إيداعات الأوراق والشفرات السيادية
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed max-w-xl mx-auto">
              تصلك تحليلات المختبرات مباشرة قبل النشر في المؤتمرات الدولية، بخصوصية تامة وبلا إعلانات.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs sm:text-sm space-y-3 text-center">
              <div className="flex items-center justify-center gap-2 font-bold text-base text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>أنت مشترك نشط في نشرة JEMO DISPATCH!</span>
              </div>
              <p className="text-xs text-emerald-700 font-mono">
                البريد المسجل: <span className="font-bold">{email}</span> • صيغة الاستلام:{" "}
                <span className="font-bold">{format.toUpperCase()}</span>
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    try {
                      localStorage.removeItem("jemo_newsletter_subscribed");
                    } catch {}
                  }}
                  className="text-xs underline text-emerald-800 hover:text-emerald-950 cursor-pointer font-mono"
                >
                  تعديل التفضيلات أو استخدام بريد آخر
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-6">
              {/* Topic Selector Pills */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-mono text-[var(--ink-2)] block">
                  اختر المحاور البحثية التي تهمك (تخصيص المحتوى):
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {TOPICS_AVAILABLE.map((topic) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        type="button"
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer border ${
                          isSelected
                            ? "bg-[var(--accent-tint)] text-[var(--ink-1)] border-[var(--accent)] font-bold shadow-xs"
                            : "bg-[var(--bg)] text-[var(--ink-2)] border-[var(--line)] hover:border-[var(--accent)]"
                        }`}
                      >
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>{topic}</span>
                          </span>
                        ) : (
                          <span>+ {topic}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Format Toggle Pill */}
              <div className="flex items-center justify-center gap-3 text-xs font-mono text-[var(--ink-2)]">
                <span>صيغة الاستلام:</span>
                <button
                  type="button"
                  onClick={() => setFormat("html")}
                  className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                    format === "html"
                      ? "bg-[var(--ink-1)] text-[var(--surface)] border-[var(--ink-1)] font-bold"
                      : "bg-[var(--bg)] border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink-1)]"
                  }`}
                >
                  نسخة HTML منسقة
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("markdown")}
                  className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                    format === "markdown"
                      ? "bg-[var(--ink-1)] text-[var(--surface)] border-[var(--ink-1)] font-bold"
                      : "bg-[var(--bg)] border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink-1)]"
                  }`}
                >
                  نسخة Markdown للمطورين
                </button>
              </div>

              {/* Input & CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 max-w-lg mx-auto p-1.5 bg-[var(--bg)] border border-[var(--line)] rounded-2xl shadow-xs focus-within:border-[var(--brand)] transition-colors">
                <div className="relative w-full flex items-center">
                  <Mail className="w-4 h-4 text-[var(--ink-2)] absolute right-4 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="أدخل بريدك الأكاديمي أو المؤسسي..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pr-11 pl-4 py-2.5 bg-transparent text-xs sm:text-sm text-[var(--ink-1)] placeholder-[var(--ink-2)] outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-[var(--ink-1)] hover:opacity-90 text-[var(--surface)] font-bold font-mono text-xs uppercase px-6 py-3 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <span>اشترك مجاناً</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[var(--ink-2)]">
                <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
                <span>خصوصية أكاديمية صارمة • رسالتان شهرياً كحد أقصى • إلغاء بنقرة واحدة</span>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 2. Spotlight on Current Issue (#14) + Live Benchmark Visualizer */}
      <section aria-label="العدد الحالي المميز" className="space-y-6">
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-[var(--line)]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink-1)]">
              إضاءة على العدد الأحدث (Current Issue Spotlight)
            </h2>
          </div>
          <span className="text-xs font-mono text-[var(--ink-2)] bg-[var(--surface)] px-3 py-1 rounded-md border border-[var(--line)]">
            سبتمبر 2026
          </span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--line)] shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-[var(--ink-2)]">
              <span className="font-bold text-[var(--ink-1)] bg-[var(--bg)] px-2.5 py-0.5 rounded border border-[var(--line)]">
                العدد #14
              </span>
              <span>•</span>
              <span className="text-[var(--accent)] font-semibold">النوى والأنظمة التشغيلية</span>
              <span>•</span>
              <span>8 دقائق قراءة</span>
              <span>•</span>
              <span>المشرف: د. عمار الجميلي</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--ink-1)] leading-snug">
              تحليل معماري لنواة الاستدلال السيادية: كفاءة الذاكرة في المعالجة التفرعية
            </h3>

            <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
              يقدم هذا العدد تحليلاً عملياً لكيفية بناء طبقة كيرنل مصغرة تستدعي النماذج اللغوية على عتاد طرفي محلي، متجاوزة قيود مكتبات بايثون عبر الربط المباشر مع وحدات Metal وCUDA.
            </p>

            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] space-y-2.5">
              <span className="text-xs font-mono font-bold text-[var(--ink-1)] block">
                أبرز النتائج التجريبية في هذا العدد:
              </span>
              <ul className="space-y-1.5 text-xs text-[var(--ink-2)]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>خفض استهلاك ذاكرة VRAM بنسبة 38.4% مقارنة بنظم vLLM.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>معدل توليد مستقر عند 42 رمز/ثانية على شرائح Apple Silicon M3 Max.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>عزل كامل للمدخلات الحساسة بدون أي تسريب عبر الشبكة (Zero-Egress).</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedIssue(ISSUES[0])}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--ink-1)] text-[var(--surface)] text-xs font-mono font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span>قراءة الملخص التنفيذي والأثر</span>
                <BookOpen className="w-3.5 h-3.5" />
              </button>
              <a
                href="/open-source"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink-1)] hover:bg-[var(--line)] transition-colors"
              >
                <Code className="w-3.5 h-3.5" />
                <span>مستودع الكود المصدري</span>
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink-2)] hover:text-[var(--ink-1)] transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "تم النسخ" : "مشاركة"}</span>
              </button>
            </div>
          </div>

          {/* Code & Benchmark Preview */}
          <div className="lg:col-span-5 space-y-4">
            {/* Terminal Window */}
            <div className="w-full rounded-2xl bg-[#162021] text-[#f7f7f5] border border-[#222f30] overflow-hidden shadow-md font-mono text-xs" dir="ltr">
              <div className="flex items-center justify-between px-4 py-3 bg-[#0e1516] border-b border-[#222f30]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-[11px] text-[#738284] ml-2">jemo-kernel-benchmark</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTabCode("benchmark")}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                      activeTabCode === "benchmark" ? "bg-[#222f30] text-[#a7e26e]" : "text-[#738284]"
                    }`}
                  >
                    benchmark.rs
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTabCode("config")}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                      activeTabCode === "config" ? "bg-[#222f30] text-[#a7e26e]" : "text-[#738284]"
                    }`}
                  >
                    kernel.toml
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2 overflow-x-auto text-[11px] leading-relaxed">
                {activeTabCode === "benchmark" ? (
                  <>
                    <p className="text-[#738284]">// JEMO Labs Dispatch #14 — Memory Benchmarks</p>
                    <p className="text-[#a7e26e]">pub struct <span className="text-white">InferenceEngine</span> &#123;</p>
                    <p className="pl-4 text-[#cef79e]">vram_allocated_mb: <span className="text-white">usize</span>,</p>
                    <p className="pl-4 text-[#cef79e]">throughput_tps: <span className="text-white">f32</span>,</p>
                    <p className="pl-4 text-[#cef79e]">zero_egress_enforced: <span className="text-white">bool</span>,</p>
                    <p className="text-[#a7e26e]">&#125;</p>
                    <p className="text-[#738284]">// Benchmarked on Apple M3 Max (36GB Unified)</p>
                    <p className="text-white">assert!(engine.throughput_tps &gt;= <span className="text-amber-300">42.0</span>);</p>
                    <p className="text-white">assert!(engine.vram_allocated_mb &lt;= <span className="text-amber-300">4280</span>);</p>
                  </>
                ) : (
                  <>
                    <p className="text-[#738284]"># Sovereign Kernel Runtime Config</p>
                    <p><span className="text-[#a7e26e]">target_arch</span> = <span className="text-amber-300">&quot;aarch64-unknown-linux-musl&quot;</span></p>
                    <p><span className="text-[#a7e26e]">quantization</span> = <span className="text-amber-300">&quot;q4_k_m&quot;</span></p>
                    <p><span className="text-[#a7e26e]">memory_limit_mb</span> = <span className="text-white">4096</span></p>
                    <p><span className="text-[#a7e26e]">telemetry_egress</span> = <span className="text-red-400">false</span></p>
                    <p><span className="text-[#a7e26e]">audit_mode</span> = <span className="text-emerald-400">&quot;strict-institutional&quot;</span></p>
                  </>
                )}
              </div>
            </div>

            {/* Native SVG Quantitative Benchmark Visualizer */}
            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[var(--ink-1)] flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>مقارنة سرعة التوليد (Tokens/sec)</span>
                </span>
                <span className="text-[10px] text-[var(--ink-2)]">M3 Max 36GB</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {BENCHMARKS.map((b) => (
                  <div key={b.runtime} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={b.isHero ? "font-bold text-[var(--ink-1)]" : "text-[var(--ink-2)]"}>
                        {b.runtime}
                      </span>
                      <span className={b.isHero ? "font-bold text-[var(--accent)]" : "text-[var(--ink-2)]"}>
                        {b.throughput.toFixed(1)} tps
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--bg)] border border-[var(--line)] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          b.isHero ? "bg-[var(--accent)]" : "bg-[var(--ink-2)]/40"
                        }`}
                        style={{ width: `${(b.throughput / 45.0) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Upcoming Issue Radar (#15) */}
      <section
        aria-label="رادار العدد القادم"
        className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--line)] shadow-xs relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink-2)]">
              <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>رادار العدد القادم • الإصدار المرتقب</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--ink-1)]">
              العدد #15: تجزئة النماذج العصبية عبر شبكات الحوسبة المفتوحة
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
              موعد الصدور: <span className="font-bold text-[var(--ink-1)] font-mono">15 سبتمبر 2026</span>.
              يتناول العدد حلول تفادي اختناقات النطاق الترددي عند تقسيم نماذج MoE على عتاد محلي منخفض التكلفة.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href="#subscribe"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--ink-1)] text-[var(--surface)] text-xs font-mono font-medium hover:opacity-90 transition-opacity"
            >
              <span>اشترك ليصلك فور الصدور</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink-1)] hover:bg-[var(--line)] transition-colors"
            >
              <span>اقترح فكرة للعدد القادم</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4. Filterable Issues Archive */}
      <section id="archive" className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink-1)] flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-[var(--accent)]" />
              <span>أرشيف الأعداد السابقة (Dispatches Archive)</span>
            </h2>
            <p className="text-xs text-[var(--ink-2)] mt-1">
              تصفح الإصدارات الـ {ISSUES.length} الأخيرة واطلع على ملخصات الأوراق والأكواد.
            </p>
          </div>

          {/* Search Input in Archive */}
          <div className="relative w-full md:w-72 flex items-center">
            <Search className="w-3.5 h-3.5 text-[var(--ink-2)] absolute right-3 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث بالعنوان، الكاتب، أو الموضوع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--ink-1)] placeholder-[var(--ink-2)] outline-none focus:border-[var(--brand)] transition-colors font-mono"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-colors cursor-pointer border ${
                activeCategory === cat.id
                  ? "bg-[var(--ink-1)] text-[var(--surface)] border-[var(--ink-1)] font-bold shadow-xs"
                  : "bg-[var(--surface)] text-[var(--ink-2)] border-[var(--line)] hover:border-[var(--brand)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Issue Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredIssues.map((issue) => (
            <article
              key={issue.id}
              className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs hover:border-[var(--brand)]/40 transition-all duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--ink-2)]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--ink-1)] bg-[var(--bg)] px-2.5 py-0.5 rounded border border-[var(--line)]">
                      {issue.number}
                    </span>
                    <span>•</span>
                    <span>{issue.date}</span>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--line)] font-medium">
                    {issue.categoryLabel}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[var(--ink-1)] group-hover:text-[var(--brand)] transition-colors leading-snug">
                  {issue.title}
                </h3>

                <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                  {issue.summary}
                </p>

                <div className="pt-2 space-y-1.5 border-t border-[var(--line)]">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-[var(--ink-1)]">النتائج الجوهرية:</span>
                    <span className="text-[var(--ink-2)]">{issue.leadAuthor}</span>
                  </div>
                  <ul className="space-y-1 text-xs text-[var(--ink-2)]">
                    {issue.takeaways.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[var(--accent)] font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-mono text-[var(--ink-2)]">
                <span>{issue.readTime}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedIssue(issue)}
                    className="font-bold text-[var(--ink-1)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>قراءة الملخص</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                  {issue.githubUrl && (
                    <a
                      href={issue.githubUrl}
                      className="hover:text-[var(--ink-1)] transition-colors inline-flex items-center gap-1"
                    >
                      <Code className="w-3 h-3" />
                      <span>الكود</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-12 bg-[var(--surface)] rounded-2xl border border-[var(--line)] text-xs text-[var(--ink-2)] font-mono">
            لا توجد أعداد تطابق معايير البحث المحددة.
          </div>
        )}
      </section>

      {/* 5. Contributing Research Labs Grid */}
      <section aria-label="المختبرات المشاركة في التحرير" className="space-y-6">
        <div className="space-y-1 pb-3 border-b border-[var(--line)]">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink-1)] flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--accent)]" />
            <span>المختبرات والهيئة العلمية المساهمة</span>
          </h2>
          <p className="text-xs text-[var(--ink-2)]">
            تصدر هذه النشرة دورياً بمساهمة الباحثين والمشرفين في المراكز البحثية التابعة لـ JEMO LABS.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTRIBUTING_LABS.map((lab) => (
            <div
              key={lab.name}
              className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-[var(--accent)] font-bold tracking-wider">
                  {lab.code}
                </span>
                <h3 className="text-sm font-bold text-[var(--ink-1)] leading-tight">
                  {lab.name}
                </h3>
                <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                  {lab.desc}
                </p>
              </div>
              <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-[11px] font-mono text-[var(--ink-2)]">
                <span>{lab.papersCount}</span>
                <a href="/labs" className="hover:text-[var(--ink-1)] transition-colors flex items-center gap-1">
                  <span>زيارة المختبر</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Academic Endorsements & Community Testimonials */}
      <section aria-label="شهادات الباحثين" className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink-1)]">
            ماذا يقول الباحثون والمهندسون عن النشرة؟
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink-2)]">
            آراء من المجتمع العلمي والتقني حول دقة المحتوى وعمق الأرقام التجريبية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <Quote className="w-6 h-6 text-[var(--accent)]/60" />
                <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed font-normal">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--line)] text-xs font-mono">
                <div className="font-bold text-[var(--ink-1)]">{t.author}</div>
                <div className="text-[11px] text-[var(--ink-2)]">{t.title}</div>
                <div className="text-[10px] text-[var(--accent)] font-semibold">{t.affiliation}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Open Access & RSS Channels */}
      <section
        aria-label="قنوات الوصول المفتوح والخلاصات"
        className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--line)] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)]">
            <Rss className="w-4 h-4" />
            <span>خلاصات RSS والأرشيف البرمجي المفتوح</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[var(--ink-1)]">
            تفضل قارئ الخلاصات (RSS) أو استعراض مستودعات الأبحاث؟
          </h3>
          <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
            نوفر تغذية RSS لكل عدد يصدر فورياً، مع توثيق الأكواد المصدرية في مستودعات GitHub المفتوحة مجاناً.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopyRss}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs font-mono font-medium text-[var(--ink-1)] hover:bg-[var(--line)] transition-colors cursor-pointer"
          >
            {copiedRss ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Rss className="w-3.5 h-3.5 text-[var(--accent)]" />}
            <span>{copiedRss ? "تم نسخ رابط RSS" : "نسخ رابط RSS Feed"}</span>
          </button>
          <a
            href="/open-source"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--ink-1)] text-[var(--surface)] text-xs font-mono font-medium hover:opacity-90 transition-opacity"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>مستودعات GitHub</span>
          </a>
        </div>
      </section>

      {/* 8. Interactive Dispatch Reader Modal */}
      {selectedIssue && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedIssue(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] bg-[var(--surface)] border border-[var(--line)] rounded-3xl shadow-2xl overflow-y-auto p-6 sm:p-8 space-y-6 relative text-[var(--ink-1)]"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--line)]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--ink-2)]">
                  <span className="font-bold text-[var(--ink-1)] bg-[var(--bg)] px-2 py-0.5 rounded border border-[var(--line)]">
                    {selectedIssue.number}
                  </span>
                  <span>•</span>
                  <span>{selectedIssue.date}</span>
                  <span>•</span>
                  <span className="text-[var(--accent)] font-semibold">{selectedIssue.categoryLabel}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                  {selectedIssue.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="p-2 rounded-full hover:bg-[var(--bg)] text-[var(--ink-2)] hover:text-[var(--ink-1)] transition-colors cursor-pointer shrink-0"
                aria-label="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Author & Lab Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--ink-2)] p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)]">
              <span>الباحث الرئيسي: <strong className="text-[var(--ink-1)]">{selectedIssue.leadAuthor}</strong></span>
              <span>•</span>
              <span>المختبر: <strong className="text-[var(--ink-1)]">{selectedIssue.labName}</strong></span>
              <span>•</span>
              <span>وقت القراءة: <strong className="text-[var(--ink-1)]">{selectedIssue.readTime}</strong></span>
            </div>

            {/* Abstract */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold font-mono text-[var(--ink-1)] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[var(--accent)]" />
                <span>الملخص التنفيذي والأهداف</span>
              </h4>
              <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                {selectedIssue.fullAbstract}
              </p>
            </div>

            {/* Methodology */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold font-mono text-[var(--ink-1)] flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[var(--accent)]" />
                <span>المنهجية وبيئة القياس التجريبي</span>
              </h4>
              <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                {selectedIssue.methodology}
              </p>
            </div>

            {/* Key Findings */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold font-mono text-[var(--ink-1)]">
                النتائج والقياسات المستخلصة:
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[var(--ink-2)]">
                {selectedIssue.takeaways.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions & Citation Button */}
            <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyCitation(selectedIssue)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:text-[var(--ink-1)] transition-colors cursor-pointer"
                >
                  {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Quote className="w-3.5 h-3.5" />}
                  <span>{copiedCitation ? "تم نسخ توثيق BibTeX" : "نسخ توثيق BibTeX"}</span>
                </button>
                {selectedIssue.githubUrl && (
                  <a
                    href={selectedIssue.githubUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:text-[var(--ink-1)] transition-colors"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>الكود المصدري</span>
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-2 rounded-lg bg-[var(--ink-1)] text-[var(--surface)] font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
