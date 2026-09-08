"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ShieldCheck,
  Users,
  Globe,
  CheckCircle,
  Search,
  Sparkles,
  ShieldAlert,
  Copy,
  Check,
  HelpCircle,
  ChevronDown,
  CreditCard,
  UserX,
  Scale,
  Printer,
  ThumbsUp,
  ThumbsDown,
  History,
  Bookmark,
  BookOpen,
  ToggleLeft,
  ToggleRight,
  Sliders,
  HelpCircle as QuizIcon,
  Award,
  XCircle,
  ArrowUp,
  X,
  Link2
} from "lucide-react";
import GlowingBorder from "@/components/GlowingBorder";
import MagneticCard from "@/components/MagneticCard";
import GlowButton from "@/components/GlowButton";
import { motion, AnimatePresence, useScroll, useSpring, MotionConfig } from "framer-motion";
interface Clause {
  code: string;
  title: string;
  text: string;
  mandatory?: boolean;
}

interface TermSection {
  id: string;
  num: number;
  title: string;
  category: string;
  icon: React.ElementType;
  summary: string;
  clauses: Clause[];
  highlight?: string;
}

const categories = [
  { id: "all", label: "الكل" },
  { id: "privacy", label: "الخصوصية والبيانات" },
  { id: "conduct", label: "السلوك والأمان" },
  { id: "rights", label: "الملكية الفكرية" },
  { id: "financial", label: "المالية والخدمات" },
  { id: "legal", label: "القانون والنزاعات" },
];

const termsData: TermSection[] = [
  {
    id: "privacy",
    num: 1,
    title: "الخصوصية وحماية البيانات الشخصية",
    category: "privacy",
    icon: ShieldCheck,
    summary: "نضمن تشفير وحفظ بياناتك وفق أقصى معايير الأمان مع التزام صريح بعدم مشاركتها إعلانياً.",
    highlight: "معالجة بيانات مشفرة بالكامل AES-256",
    clauses: [
      {
        code: "1.1",
        title: "تجميع البيانات واستخدامها",
        text: "نجمع فقط البيانات الضرورية لتشغيل حسابك وتقديم الخدمة (مثل الاسم، البريد الإلكتروني، وبيانات التسجيل). لا نستخدم بياناتك لأغراض التتبع الإعلاني أو استهداف الطرف الثالث.",
        mandatory: true
      },
      {
        code: "1.2",
        title: "التشفير والتخزين السحابي",
        text: "يتم نقل وتخزين كافة الشفرات والبيانات الحساسة باستخدام بروتوكولات تشفير TLS 1.3 وتشفير خوادم AES-256 المستضافة في مراكز بيانات عالية الأمان.",
        mandatory: true
      },
      {
        code: "1.3",
        title: "حقوق حذف وتصدير البيانات (GDPR Compliance)",
        text: "يحق لك في أي وقت التقديم على طلب لتصدير كامل ملفاتك وبياناتك بصيغة JSON، أو طلب المسح النهائي لجميع سجلاتك من خوادمنا خلال 72 ساعة.",
        mandatory: false
      }
    ]
  },
  {
    id: "conduct",
    num: 2,
    title: "قواعد السلوك والاستخدام المجتمعي",
    category: "conduct",
    icon: Users,
    summary: "بيئة jemo labs تبنى على الاحترام المتبادل بين المطورين والمصممين والمبدعين.",
    highlight: "الاحترام والمهنية هما شرط المشاركة الأساسي",
    clauses: [
      {
        code: "2.1",
        title: "الخطاب المحظور والسلوك المسيء",
        text: "يُمنع استخدام أي عبارات تحريضية، عنصرية، أو مسيئة في النقاشات أو تعليقات المستودعات أو البروفايلات الشخصية. يحق للمنتدى تعليق الحسابات المخالفة فورا.",
        mandatory: true
      },
      {
        code: "2.2",
        title: "الملكية الفكرية للمجتمع",
        text: "احترم الملكية الفكرية لأعضاء المجتمع الآخرين. لا تقم بنسخ أو إعادة استخدام أعمال غيرك دون إذن أو ترخيص مفتوح المصدر واضح.",
        mandatory: true
      },
      {
        code: "2.3",
        title: "آلية الإبلاغ عن المخالفات",
        text: "توفر المنظومة نظام إبلاغ فوري عن أي انتهاك سلوكي، وتتعهد الإدارة بمراجعة البلاغات وتطبيق الإجراءات المناسبة خلال 24 ساعة.",
        mandatory: false
      }
    ]
  },
  {
    id: "security",
    num: 3,
    title: "الأمان وحظر الاستغلال البرمجي",
    category: "conduct",
    icon: Globe,
    summary: "حماية بنيتنا التحتية وأدواتنا لضمان سرعة واستقرار الخدمات للجميع.",
    highlight: "حظر أدوات الأتمتة الضارة ومحاولات اختراق النواة",
    clauses: [
      {
        code: "3.1",
        title: "منع هجمات الاستغلال والهندسة العكسية",
        text: "يُحظر استخدام أي تقنيات أو أدوات هدفها تعطيل الخوادم (DoS/DDoS) أو فحص الثغرات بدون تصريح كتابي أو محاولة كسر التشفير.",
        mandatory: true
      },
      {
        code: "3.2",
        title: "الاستخدام الآلي والاستعلامات المكثفة",
        text: "يمنع تشغيل البوتات أو أدوات الكشط (Scrapers) التي تسبب ضغطاً غير متناسب على الواجهات البرمجية (APIs) خارج حدود الاستخدام المصرح بها.",
        mandatory: true
      },
      {
        code: "3.3",
        title: "برنامج مكافآت الثغرات الأمنية (Bug Bounty)",
        text: "نشجع الباحثين الأمنيين على الإبلاغ عن الثغرات عبر مسار الأمان الخاص بنا بنية حسنة دون إلحاق الضرر بالبيانات أو المستخدمين.",
        mandatory: false
      }
    ]
  },
  {
    id: "rights",
    num: 4,
    title: "الملكية الفكرية والحقوق الرقمية",
    category: "rights",
    icon: Sparkles,
    summary: "تحديد ملكية العلامة التجارية، الأدوات المصممة، وتراخيص المشاريع.",
    highlight: "مشاريعك ملكك الكامل 100%",
    clauses: [
      {
        code: "4.1",
        title: "ملكية محتوى المطور",
        text: "كل شفرة برمجية أو تصميم أو مشروع تقوم بإنشائه ونشره على منصة jemo labs يظل ملكك الفكري والخاص بالكامل دون أدنى ادعاء منا بالملكية.",
        mandatory: true
      },
      {
        code: "4.2",
        title: "حقوق علامة jemo labs",
        text: "الشعارات، الهوية البصرية، التصاميم الأصلية، والنصوص الخاصة بـ jemo labs هي علامات محاطة بالحماية الفكرية ولا يجوز إعادة استخدامها تجارياً دون ترخيص.",
        mandatory: true
      },
      {
        code: "4.3",
        title: "التراخيص مفتوحة المصدر",
        text: "المستودعات والأدوات المطروحة تحت ترخيص MIT أو Apache تخضع لبنود التراخيص المعنية كما هي موضحة في مستودعاتها الرسمية.",
        mandatory: false
      }
    ]
  },
  {
    id: "sla",
    num: 5,
    title: "اتفاقية مستوى الخدمة (SLA) وإخلاء الطرف",
    category: "legal",
    icon: ShieldAlert,
    summary: "مستويات الجودة والتوافر ومسؤوليات النسخ الاحتياطي.",
    highlight: "معدل تشغيل مستهدف 99.9%",
    clauses: [
      {
        code: "5.1",
        title: "توافر الخوادم والصيانة الدورية",
        text: "نعمل على تحقيق معدل تشغيل واستجابة 99.9%. يتم الإعلان عن أوقات الصيانة المجدولة مسبقاً بفترة لا تقل عن 48 ساعة.",
        mandatory: true
      },
      {
        code: "5.2",
        title: "إخلاء المسؤولية عن النسخ الاحتياطية",
        text: "بالرغم من قيامنا بإجراء نسخ احتياطية دورية، يتحمل المستخدم المسؤولية النهائية عن الاحتفاظ بنسخ محلية من مشاريعه وبياناته الهامة.",
        mandatory: true
      },
      {
        code: "5.3",
        title: "الأضرار التبعية غير المباشرة",
        text: "لا تتحمل jemo labs أي مسؤولية عن خسائر الأرباح أو تعطل الأعمال الناتج عن الظروف القاهرة الخارجة عن السيطرة الاستثنائية.",
        mandatory: false
      }
    ]
  },
  {
    id: "financial",
    num: 6,
    title: "الاشتراكات والمعاملات المالية",
    category: "financial",
    icon: CreditCard,
    summary: "شفافية الفوترة، تجديد الاشتراكات، وسياسات الاسترجاع.",
    highlight: "سياسة استرجاع مرنة خلال 14 يوماً",
    clauses: [
      {
        code: "6.1",
        title: "رسوم الخدمات والتجديد التلقائي",
        text: "يتم توضيح رسوم خطط المطورين والخدمات المدفوعة مسبقاً. تتجدد الاشتراكات دورياً مالم يقم المستخدم بطلب التوقف قبل تاريخ الفوترة.",
        mandatory: true
      },
      {
        code: "6.2",
        title: "حق الاسترجاع (Refund Policy)",
        text: "يمكن للمستخدم طلب استرداد المبلغ بالكامل خلال 14 يوماً من تاريخ الاشتراك الأول في حال عدم الرضا عن الخدمة دون تعقيدات.",
        mandatory: true
      },
      {
        code: "6.3",
        title: "تعديل أسعار الباقات",
        text: "في حال تعديل أسعار الخدمة، يلتزم النظام بإرسال إشعار للمستخدمين المشتركين قبل 30 يوماً على الأقل من بدء تطبيق الأسعار الجديدة.",
        mandatory: false
      }
    ]
  },
  {
    id: "termination",
    num: 7,
    title: "فسخ الاتفاقية وإنهاء الحسابات",
    category: "legal",
    icon: UserX,
    summary: "شروط إغلاق الحساب سواء بطلب المستخدم أو بسبب المخالفات.",
    highlight: "حق الإلغاء الفوري في أي وقت",
    clauses: [
      {
        code: "7.1",
        title: "الإنهاء بطلب من المستخدم",
        text: "يمكنك إنهاء اتفاقيتك مع jemo labs وإغلاق حسابك فوراً من إعدادات البروفايل أو عبر التواصل مع فريق الدعم الفني.",
        mandatory: true
      },
      {
        code: "7.2",
        title: "تعليق الحساب للمخالفة الجسيمة",
        text: "تحتفظ الإدارة بحق تعليق أو إغلاق الحسابات التي تنتهك بنود الأمان أو السلوك المجتمعي انتهاكاً صارخاً بعد توجيه إنذار كتابي.",
        mandatory: true
      },
      {
        code: "7.3",
        title: "فترة الاحتفاظ بالبيانات بعد الإنهاء",
        text: "تتم إزالة كافة البيانات الشخصية نهائياً، مع الاحتفاظ بالسجلات المخصصة للامتثال المحاسبي أو القانوني وفق المهل النظامية فقط.",
        mandatory: false
      }
    ]
  },
  {
    id: "jurisdiction",
    num: 8,
    title: "القانون الواجب التطبيق وحل النزاعات",
    category: "legal",
    icon: Scale,
    summary: "المرجعية القانونية وآليات تسوية أية خلافات طارئة.",
    highlight: "التسوية الودية أولاً ثم التحكيم المستقل",
    clauses: [
      {
        code: "8.1",
        title: "المرجعية النظامية",
        text: "تخضع هذه الاتفاقية وتفسر وفق الأنظمة والقوانين المحلية والدولية المنظمة للتعاملات الإلكترونية وحماية البيانات الرقمية.",
        mandatory: true
      },
      {
        code: "8.2",
        title: "التسوية الودية والوساطة",
        text: "في حال نشوء أي خلاف، يلتزم الطرفان بمحاولة تسويته ودياً عبر التواصل المباشر وفريق الدعم القانوني خلال فترة 30 يوماً.",
        mandatory: true
      },
      {
        code: "8.3",
        title: "تحديث الشروط وإخطار المستخدم",
        text: "أي تعديلات جوهرية على هذه الشروط يتم نشرها مع تواريخ السريان، ويعد استمرار الاستخدام قبولاً صريحاً بالاتفاقية المعدلة.",
        mandatory: false
      }
    ]
  }
];

const legalGlossary = [
  { term: "AES-256", desc: "معيار تشفير المتقدم بطول مفتاح 256-بت المستعمل دولياً لحماية البيانات الأكثر حساسية." },
  { term: "GDPR Compliant", desc: "الالتزام باللائحة العامة الأوروبية لحماية البيانات وحق المستخدم في المحو والوصول." },
  { term: "SLA 99.9%", desc: "اتفاقية ضمان تشغيل واستجابة الخدمات الإلكترونية طوال العام بنسبة توافر 99.9%." },
  { term: "TLS 1.3", desc: "أحدث بروتوكولات تأمين وتشفير قنوات الاتصال بين متصفح المستخدم وخوادم المنظومة." },
  { term: "DDoS Mitigation", desc: "أنظمة الحماية التلقائية والتخفيف من هجمات حجب الخدمة الموزعة الضارة." },
  { term: "Bug Bounty", desc: "برنامج تقديم المكافآت المالية والتقدير للباحثين الأمنيين الذين يكتشفون ثغرات بنية حسنة." },
];

const termsComparison = [
  {
    aspect: "شفافية وتسهيل البنود",
    traditional: "وثائق من 40 صفحة مليئة بالمصطلحات المعقدة",
    jemo: "بنود مبسطة ومقسمة بوضوح مع شروحات مباشرة"
  },
  {
    aspect: "ملكية الشفرة والمحتوى",
    traditional: "ادعاء ملكية جزئية للمحتوى المرفوع أو حقوق ترخيص عامة",
    jemo: "ملكية المطور الكاملة 100% لمشاريعه دون أدنى نزاع"
  },
  {
    aspect: "مشاركة البيانات والإعلانات",
    traditional: "بيع أو مشاركة البيانات مع شركات الإعلانات والتتبع",
    jemo: "عدم مشاركة أو بيع أي بيانات شخصية أو برمجية مطلقاً"
  },
  {
    aspect: "استرجاع المبالغ المالية",
    traditional: "شروط استرجاع معقدة أو رفض تام بعد الشراء",
    jemo: "ضمان استرجاع 100% خلال 14 يوماً دون أسئلة معقدة"
  }
];

const quizQuestions = [
  {
    id: 1,
    q: "هل تملك jemo labs أي حق في الشفرات والمشاريع التي تقوم بإنشائها؟",
    options: ["نعم، ملكية مشتركة", "لا، مشاريعك ملكك الكامل 100%", "تعتمد على حجم المشروع"],
    correct: 1
  },
  {
    id: 2,
    q: "في حال رغبتك بحذف حسابك وبياناتك، كم تستغرق عملية المحو النهائي؟",
    options: ["خلال 72 ساعة", "30 يوماً", "لا يمكن حذف الحساب"],
    correct: 0
  },
  {
    id: 3,
    q: "ما هي المهلة الزمنية المتاحة لاسترداد المبلغ كاملاً عند الاشتراك؟",
    options: ["لا يوجد استرجاع", "7 أيام", "14 يوماً ضمان استرجاع كامل"],
    correct: 2
  }
];

const complianceMatrix = [
  { feature: "تشفير البيانات في حالة الثبات والنقل", level: "AES-256 / TLS 1.3", standard: "عالمي" },
  { feature: "حق حذف وتصدير كامل البيانات", level: "خلال 72 ساعة", standard: "GDPR Compliant" },
  { feature: "الاسترداد المالي للاشتراكات", level: "14 يوماً ضمان كامل", standard: "شفافية 100%" },
  { feature: "إشعار التعديلات الجوهرية على الشروط", level: "قبل 14–30 يوماً", standard: "إشعار كتابي" },
  { feature: "معدل توافر الخدمات وتتبع الأعطال", level: "99.9% Uptime", standard: "مراقبة مستمرة" },
];

const changelogData = [
  { version: "v2.2", date: "23 يوليو 2026", details: "تحديث بنود المعاملات المالية، تعزيز بند حماية بيانات المطور وتوضيح اتفاقية SLA." },
  { version: "v2.0", date: "15 يناير 2026", details: "إضافة معايير تشفير البيانات وتنسيق سياسات السلوك المجتمعي والشفافية." },
  { version: "v1.0", date: "01 أكتوبر 2025", details: "الإطلاق الأولي لاتفاقية الشروط والأحكام الخاصة بـ jemo labs." },
];

const faqData = [
  {
    q: "هل يمكنني طلب حذف كامل بياناتي من jemo labs؟",
    a: "نعم، يمكنك في أي وقت تقديم طلب عبر التواصل معنا وسيتم مسح جميع بياناتك وحسابك نهائياً خلال 72 ساعة وفق سياسة GDPR."
  },
  {
    q: "كيف يتم إبلاغي في حال تعديل الشروط والأحكام؟",
    a: "نقوم بإرسال إشعار مباشر عبر البريد الإلكتروني المنسوب لحسابك، بالإضافة إلى إعلان بارز أعلى المنصة قبل بدء تطبيق الشروط الجديدة بـ 14 يوماً."
  },
  {
    q: "هل المشاريع المطورة عبر jemo labs مملوكة لي؟",
    a: "بالتأكيد، كل ما تقوم بابتكاره وبنائه هو ملكك الخاص بنسبة 100% ما لم يخضع لتراخيص مفتوحة المصدر تم التوافق عليها مسبقاً."
  },
  {
    q: "ما هي سياسة استرجاع الأموال للاشتراكات؟",
    a: "نقدم ضمان استرجاع كامل للمبلغ خلال 14 يوماً من تفعيل الاشتراك في حال لم تكن الخدمة ملبية لتوقعاتك، دون أي أسئلة معقدة."
  }
];

const TERMS_VERSION = "v2.2";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatch(text: string, query: string): React.ReactNode {
  const q = query.trim();
  if (!q) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "g"));
  if (parts.length <= 1) return text;
  return parts.map((p, i) =>
    p === q ? (
      <mark key={i} className="bg-[var(--brand)]/15 text-inherit rounded px-0.5">
        {p}
      </mark>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    )
  );
}

export default function TermsClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showChangelog, setShowChangelog] = useState(false);
  const [feedbackState, setFeedbackState] = useState<Record<string, "yes" | "no">>(() => {
    try {
      if (typeof window === "undefined") return {};
      const fb = localStorage.getItem("jemo-terms-feedback");
      return fb ? (JSON.parse(fb) as Record<string, "yes" | "no">) : {};
    } catch {
      return {};
    }
  });
  const [copiedClause, setCopiedClause] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopyClauseLink = (code: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(
        `${window.location.origin}${window.location.pathname}#clause-${code}`
      );
      setCopiedLink(code);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  // Read acknowledgement (persisted per version)
  const [acceptedAt, setAcceptedAt] = useState<string | null>(() => {
    try {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(`jemo-terms-accept-${TERMS_VERSION}`);
    } catch {
      return null;
    }
  });

  const handleAccept = () => {
    const now = new Date().toISOString();
    setAcceptedAt(now);
    try {
      localStorage.setItem(`jemo-terms-accept-${TERMS_VERSION}`, now);
    } catch {}
  };

  const handleResetAccept = () => {
    setAcceptedAt(null);
    try {
      localStorage.removeItem(`jemo-terms-accept-${TERMS_VERSION}`);
    } catch {}
  };

  // "/" focuses search, Esc clears it
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        setSearchTerm("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Cookie Preferences State
  const [perfCookies, setPerfCookies] = useState(true);
  const [analyticsCookies, setAnalyticsCookies] = useState(true);
  const [preferencesSaved, setPreferencesSaved] = useState(false);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Reading progress + scrollspy + back-to-top
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id^='section-']"));
    if (!sections.length || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [searchTerm, selectedCategory]);

  const totalClauses = useMemo(
    () => termsData.reduce((acc, s) => acc + s.clauses.length, 0),
    []
  );

  const scrollToTop = () => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyClause = (code: string, text: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`[بند ${code}] ${text}`);
      setCopiedClause(code);
      setTimeout(() => setCopiedClause(null), 2000);
    }
  };

  const handleFeedback = (sectionId: string, value: "yes" | "no") => {
    setFeedbackState((prev) => {
      const next = { ...prev, [sectionId]: value };
      try {
        localStorage.setItem("jemo-terms-feedback", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSaveCookiePreferences = () => {
    setPreferencesSaved(true);
    setTimeout(() => setPreferencesSaved(false), 3000);
  };

  const calculateQuizScore = () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) score++;
    });
    return score;
  };

  const filteredTerms = termsData.filter((term) => {
    const matchesCategory =
      selectedCategory === "all" || term.category === selectedCategory;
    const matchesSearch =
      term.title.includes(searchTerm) ||
      term.summary.includes(searchTerm) ||
      term.clauses.some(
        (c) => c.title.includes(searchTerm) || c.text.includes(searchTerm)
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <MotionConfig reducedMotion="user">
    <div dir="rtl" className="min-h-screen bg-[var(--bg)] py-12 px-4 sm:px-6 lg:px-8 font-kufi text-[var(--ink)] scroll-smooth">
      {/* Reading progress */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progressScale }}
        className="fixed top-0 right-0 left-0 h-1 z-[60] origin-right bg-gradient-to-l from-[var(--brand)] via-[var(--brand)] to-[var(--brand-700)] print:hidden"
      />
      {/* Print-only document header */}
      <div className="hidden print:block text-center mb-8">
        <p className="font-bold text-lg">الشروط والأحكام المنظمة — jemo labs ({TERMS_VERSION})</p>
        <p className="text-xs mt-1">آخر تحديث: 23 يوليو 2026 • jemo.co/terms</p>
      </div>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center relative">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--brand)]/20 bg-[var(--brand)]/5 text-[var(--brand)] text-xs font-mono shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
              <span className="font-semibold tracking-wider">TERMS & COMPLIANCE v2.2</span>
            </div>
            <button
              onClick={() => setShowChangelog(!showChangelog)}
              aria-expanded={showChangelog}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--ink-2)] hover:text-[var(--brand)] font-mono transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
            >
              <History size={13} className="text-[var(--brand)]" />
              <span>آخر تحديث: 23 يوليو 2026</span>
            </button>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--ink)] mb-4 text-balance">
            الشروط <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand)] to-[var(--brand-700)] italic">والأحكام المنظمة</span>
          </h1>
          <p className="text-base md:text-lg text-[var(--ink-2)] max-w-3xl mx-auto leading-relaxed mb-6 text-pretty">
            وثيقة قانونية وفنية تفصيلية تهدف لترسيخ حقوقك، حماية بياناتك، وتحديد التزامات المنظومة داخل منصة jemo labs.
          </p>
          <p className="text-xs font-mono text-[var(--ink-2)] mb-8 tabular-nums">
            {termsData.length} أقسام • {totalClauses} بند • قراءة ≈ 12 دقيقة
          </p>

          {/* Header Action Controls */}
          <div className="flex flex-wrap justify-center items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)]/40 text-[var(--ink-2)] hover:text-[var(--ink)] transition-all cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-500" />
                  <span>تم نسخ الرابط</span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-[var(--brand)]" />
                  <span>مشاركة وثيقة الشروط</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)]/40 text-[var(--ink-2)] hover:text-[var(--ink)] transition-all cursor-pointer shadow-xs print:hidden"
            >
              <Printer size={14} className="text-[var(--brand)]" />
              <span>طباعة الوثيقة</span>
            </button>
          </div>
        </header>

        {/* Changelog Accordion Modal */}
        <AnimatePresence>
          {showChangelog && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 bg-[var(--surface)] border border-[var(--brand)]/30 rounded-2xl p-6 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4 border-b border-[var(--line)] pb-3">
                <div className="flex items-center gap-2 font-bold text-base text-[var(--ink)]">
                  <History className="text-[var(--brand)]" size={18} />
                  <span>سجل تحديثات الشروط والسياسات (Version History)</span>
                </div>
                <button
                  onClick={() => setShowChangelog(false)}
                  className="text-xs text-[var(--ink-2)] hover:text-[var(--ink)] cursor-pointer"
                >
                  إغلاق ✕
                </button>
              </div>
              <div className="space-y-3">
                {changelogData.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-[var(--brand)]/10 text-[var(--brand)]">{item.version}</span>
                      <span className="font-semibold text-[var(--ink)]">{item.details}</span>
                    </div>
                    <span className="text-[var(--ink-2)] font-mono text-[11px] shrink-0">{item.date}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Traditional vs jemo labs Comparison Matrix */}
        <div className="mb-12 bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <Award size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">فلسفتنا مقارنة بالشروط التقليدية</h2>
              <p className="text-xs text-[var(--ink-2)]">لماذا تم تصميم شروط jemo labs لتكون الأكثر شفافية وعدالة</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {termsComparison.map((item, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[var(--bg)] border border-[var(--line)] space-y-3">
                <h3 className="text-sm font-bold text-[var(--ink)] border-b border-[var(--line)] pb-2 flex items-center gap-2">
                  <Sparkles size={14} className="text-[var(--brand)]" />
                  <span>{item.aspect}</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-red-500/90 dark:text-red-400">
                    <XCircle size={14} className="shrink-0 mt-0.5" />
                    <span><strong>الشروط التقليدية:</strong> {item.traditional}</span>
                  </div>
                  <div className="flex items-start gap-2 text-green-600 dark:text-green-400 font-medium">
                    <CheckCircle size={14} className="shrink-0 mt-0.5 text-[var(--brand)]" />
                    <span><strong>منهج jemo labs:</strong> {item.jemo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Nav Anchor Bar (sticky + scrollspy) */}
        <nav aria-label="التنقل بين أقسام الشروط" className="mb-10 sticky top-16 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 bg-[var(--bg)]/85 backdrop-blur-md print:hidden">
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-xs font-bold text-[var(--ink-2)] pl-2 flex items-center gap-1 shrink-0">
              <Bookmark size={13} className="text-[var(--brand)]" /> الانتقال السريع:
            </span>
            {termsData.map((sec) => {
              const isActive = activeSection === `section-${sec.id}`;
              return (
              <a
                key={sec.id}
                href={`#section-${sec.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  isActive
                    ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-sm"
                    : "bg-[var(--surface)] border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--brand)] hover:border-[var(--brand)]/40"
                }`}
              >
                {sec.num}. {sec.title.split(" ")[0]}
              </a>
              );
            })}
          </div>
        </div>
        </nav>

        {/* Search & Category Filter Section */}
        <div className="mb-12 space-y-5 print:hidden">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ink-2)] pointer-events-none" size={18} />
            <input
              ref={searchRef}
              type="search"
              role="searchbox"
              aria-label="ابحث داخل بنود الشروط"
              placeholder="ابحث داخل بنود الشروط (مثال: تشفير، استرجاع، اختراق، تراخيص...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-11 pl-11 py-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] text-sm text-[var(--ink)] placeholder-[var(--ink-2)] focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 transition-all shadow-xs"
            />
            {!searchTerm && (
              <kbd
                aria-hidden="true"
                className="absolute left-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-[var(--bg)] border border-[var(--line)] text-[11px] font-mono text-[var(--ink-2)] pointer-events-none"
              >
                /
              </kbd>
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                aria-label="مسح البحث"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>
          {(searchTerm || selectedCategory !== "all") && (
            <p aria-live="polite" className="text-center text-xs text-[var(--ink-2)] tabular-nums">
              {filteredTerms.length} من {termsData.length} أقسام مطابقة
            </p>
          )}

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="تصفية حسب الفئة">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                aria-pressed={selectedCategory === cat.id}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--brand)] ${
                  selectedCategory === cat.id
                    ? "bg-[var(--brand)] text-white shadow-sm"
                    : "bg-[var(--surface)] text-[var(--ink-2)] border border-[var(--line)] hover:text-[var(--ink)] hover:border-[var(--brand)]/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Terms Detailed Content Grid */}
        {filteredTerms.length > 0 ? (
          <div className="space-y-8">
            {filteredTerms.map((section) => {
              const Icon = section.icon;
              const isFeedbackGiven = feedbackState[section.id];

              return (
                <motion.section
                  id={`section-${section.id}`}
                  key={section.id}
                  className="scroll-mt-32"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <MagneticCard className="w-full">
                    <GlowingBorder className="w-full">
                      <div className="bg-[var(--surface)] rounded-3xl p-6 sm:p-8 border border-[var(--line)] shadow-xs transition-all">
                        {/* Section Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[var(--line)] pb-6">
                          <div className="flex items-start sm:items-center gap-4">
                            <div className="p-3.5 rounded-2xl bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] shrink-0 shadow-xs">
                              <Icon size={26} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 text-xs font-mono text-[var(--brand)] mb-1">
                                <span className="font-bold">قسم {section.num}</span>
                                <span>•</span>
                                <span className="uppercase">{section.category}</span>
                              </div>
                              <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">
                                {highlightMatch(section.title, searchTerm)}
                              </h2>
                            </div>
                          </div>

                          {section.highlight && (
                            <div className="self-start md:self-center px-3.5 py-2 rounded-xl bg-[var(--brand)]/5 border border-[var(--brand)]/15 text-xs font-semibold text-[var(--brand)] flex items-center gap-2 shrink-0">
                              <Sparkles size={14} />
                              <span>{section.highlight}</span>
                            </div>
                          )}
                        </div>

                        {/* Section Summary */}
                        <p className="text-sm md:text-base text-[var(--ink-2)] leading-relaxed mb-8 bg-[var(--bg)]/50 p-4 rounded-2xl border border-[var(--line)]/60">
                          {highlightMatch(section.summary, searchTerm)}
                        </p>

                        {/* Clauses List */}
                        <div className="space-y-6 mb-8">
                          {section.clauses.map((clause) => (
                            <div
                              key={clause.code}
                              id={`clause-${clause.code}`}
                              className="p-5 rounded-2xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--brand)]/30 hover:shadow-sm transition-all group relative scroll-mt-32"
                            >
                              <div className="flex items-center justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2.5">
                                  <a
                                    href={`#clause-${clause.code}`}
                                    title="رابط مباشر لهذا البند"
                                    aria-label={`رابط مباشر للبند ${clause.code}`}
                                    className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--brand)]/10 text-[var(--brand)] hover:bg-[var(--brand)]/20 transition-colors tabular-nums"
                                  >
                                    البند {clause.code}
                                  </a>
                                  <h3 className="text-base font-bold text-[var(--ink)]">
                                    {highlightMatch(clause.title, searchTerm)}
                                  </h3>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {clause.mandatory && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                                      إجباري
                                    </span>
                                  )}
                                  <button
                                    onClick={() => handleCopyClauseLink(clause.code)}
                                    title="نسخ رابط البند"
                                    aria-label={`نسخ رابط البند ${clause.code}`}
                                    className="p-1.5 rounded-lg text-[var(--ink-2)] hover:text-[var(--brand)] hover:bg-[var(--surface)] transition-all opacity-70 group-hover:opacity-100 cursor-pointer print:hidden focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
                                  >
                                    {copiedLink === clause.code ? (
                                      <Check size={14} className="text-green-500" />
                                    ) : (
                                      <Link2 size={14} />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleCopyClause(clause.code, clause.text)}
                                    title="نسخ نص البند"
                                    aria-label={`نسخ نص البند ${clause.code}`}
                                    className="p-1.5 rounded-lg text-[var(--ink-2)] hover:text-[var(--brand)] hover:bg-[var(--surface)] transition-all opacity-70 group-hover:opacity-100 cursor-pointer print:hidden focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
                                  >
                                    {copiedClause === clause.code ? (
                                      <Check size={14} className="text-green-500" />
                                    ) : (
                                      <Copy size={14} />
                                    )}
                                  </button>
                                </div>
                              </div>

                              <p className="text-xs md:text-sm text-[var(--ink-2)] leading-relaxed font-medium">
                                {highlightMatch(clause.text, searchTerm)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Section Feedback Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-[var(--line)] text-xs text-[var(--ink-2)] print:hidden">
                          <span>هل هذا القسم واضح ومفهوم؟</span>
                          <div className="flex items-center gap-2">
                            {isFeedbackGiven ? (
                              <span className="text-green-600 font-semibold flex items-center gap-1">
                                <CheckCircle size={13} /> شكراً لإبداء رأيك!
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleFeedback(section.id, "yes")}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:border-green-500/40 hover:text-green-600 transition-all cursor-pointer"
                                >
                                  <ThumbsUp size={13} /> نعم
                                </button>
                                <button
                                  onClick={() => handleFeedback(section.id, "no")}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:border-red-500/40 hover:text-red-600 transition-all cursor-pointer"
                                >
                                  <ThumbsDown size={13} /> يحتاج توضيح
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </GlowingBorder>
                  </MagneticCard>
                </motion.section>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-8">
            <HelpCircle size={40} className="mx-auto text-[var(--ink-2)] mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-[var(--ink)] mb-1">لم نجد أي بنود مطابقة لمفردات البحث</h3>
            <p className="text-xs text-[var(--ink-2)] mb-4">جرب كتابة مصطلح آخر أو تصفح كافة الأقسام.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl hover:bg-[var(--brand-700)] transition-colors cursor-pointer"
            >
              عرض كافة البنود
            </button>
          </div>
        )}

        {/* Cookie & Data Preference Manager */}
        <div className="mt-16 bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 shadow-xs print:hidden">
          <div className="flex items-center gap-3 mb-6 border-b border-[var(--line)] pb-4">
            <div className="p-2.5 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <Sliders size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">تفضيلات الخصوصية والكوكيز</h2>
              <p className="text-xs text-[var(--ink-2)]">التحكم المباشر في نوعية ملفات تعريف الارتباط المخزنة في متصفحك</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {/* Essential Cookies */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)]">
              <div>
                <div className="flex items-center gap-2 font-bold text-sm text-[var(--ink)]">
                  <span>ملفات تعريف الارتباط الأساسية والتشغيلية</span>
                  <span className="text-[10px] bg-[var(--brand)]/10 text-[var(--brand)] font-mono font-bold px-2 py-0.5 rounded">إجبارية</span>
                </div>
                <p className="text-xs text-[var(--ink-2)] mt-1">ضرورية لتشغيل الجلسة، الحفاظ على الأمان والتنقل السلس داخل المنصة.</p>
              </div>
              <div className="text-[var(--brand)] opacity-60">
                <CheckCircle size={24} />
              </div>
            </div>

            {/* Performance Cookies */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)]">
              <div>
                <div className="font-bold text-sm text-[var(--ink)]">كوكيز تسريع الأداء الفني</div>
                <p className="text-xs text-[var(--ink-2)] mt-1">تساعد في حفظ الخيارات المفضلة وتخزين البيانات المؤقتة لتسريع الاستجابة.</p>
              </div>
              <button
                onClick={() => setPerfCookies(!perfCookies)}
                role="switch"
                aria-checked={perfCookies}
                aria-label="كوكيز تسريع الأداء الفني"
                className="text-[var(--brand)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--brand)] rounded-full"
              >
                {perfCookies ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-[var(--ink-2)]" />}
              </button>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)]">
              <div>
                <div className="font-bold text-sm text-[var(--ink)]">كوكيز تحسين التجربة والتحليلات</div>
                <p className="text-xs text-[var(--ink-2)] mt-1">تساعدنا في فهم كيفية تفاعل المطورين مع الصفحة لتطوير الميزات المستقبلية (بدون تتبع شخصي).</p>
              </div>
              <button
                onClick={() => setAnalyticsCookies(!analyticsCookies)}
                role="switch"
                aria-checked={analyticsCookies}
                aria-label="كوكيز تحسين التجربة والتحليلات"
                className="text-[var(--brand)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--brand)] rounded-full"
              >
                {analyticsCookies ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-[var(--ink-2)]" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSaveCookiePreferences}
              className="px-5 py-2.5 bg-[var(--brand)] text-white text-xs font-bold rounded-xl hover:bg-[var(--brand-700)] transition-all cursor-pointer shadow-sm"
            >
              حفظ تفضيلات الخصوصية
            </button>
            {preferencesSaved && (
              <span className="text-xs font-semibold text-green-600 flex items-center gap-1 animate-pulse">
                <CheckCircle size={14} /> تم حفظ التفضيلات بنجاح في متصفحك!
              </span>
            )}
          </div>
        </div>

        {/* Legal Glossary Section */}
        <div className="mt-16 bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <BookOpen size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">قاموس المصطلحات الفنية والقانونية</h2>
              <p className="text-xs text-[var(--ink-2)]">دليل توضيحي مبسط للمصطلحات التقنية الواردة في الاتفاقية</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {legalGlossary.map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--brand)]/30 transition-colors">
                <div className="font-mono font-bold text-sm text-[var(--brand)] mb-1">{item.term}</div>
                <div className="text-xs text-[var(--ink-2)] leading-relaxed font-medium">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Compliance Quiz */}
        <div className="mt-16 bg-[var(--surface)] border border-[var(--brand)]/20 rounded-3xl p-6 sm:p-8 shadow-xs print:hidden">
          <div className="flex items-center justify-between gap-4 mb-6 border-b border-[var(--line)] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
                <QuizIcon size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--ink)]">اختبار استيعاب الشروط والأحكام</h2>
                <p className="text-xs text-[var(--ink-2)]">اختبار سريع من 3 أسئلة للتأكد من وضوح الحقوق والالتزامات</p>
              </div>
            </div>
            {quizSubmitted && (
              <div className="px-3 py-1.5 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] font-bold text-xs font-mono">
                النتيجة: {calculateQuizScore()} / {quizQuestions.length}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q) => (
              <div key={q.id} className="p-5 rounded-2xl bg-[var(--bg)] border border-[var(--line)]">
                <h3 className="text-sm font-bold text-[var(--ink)] mb-3 flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--brand)]/10 text-[var(--brand)]">{q.id}</span>
                  <span>{q.q}</span>
                </h3>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = quizAnswers[q.id] === optIdx;
                    const isCorrect = q.correct === optIdx;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => {
                          setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                          setQuizSubmitted(true);
                        }}
                        aria-pressed={isSelected}
                        className={`w-full text-right p-3 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer border focus-visible:outline-2 focus-visible:outline-[var(--brand)] ${
                          isSelected
                            ? isCorrect
                              ? "bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-300 font-bold"
                              : "bg-red-500/10 border-red-500/40 text-red-700 dark:text-red-300 font-bold"
                            : "bg-[var(--surface)] border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--brand)]/30 hover:text-[var(--ink)]"
                        }`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isSelected && (
                          <span>{isCorrect ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Matrix Table */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] mb-2">
              جدول <span className="text-[var(--brand)]">الامتثال والشفافية</span>
            </h2>
            <p className="text-sm text-[var(--ink-2)]">ملخص معايير الأمان ومستويات الضمان الملتزم بها</p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-[var(--bg)] border-b border-[var(--line)] text-xs font-bold text-[var(--ink)]">
                    <th className="p-4 sm:p-5">معيار الشفافية / الخيار</th>
                    <th className="p-4 sm:p-5">مستوى الالتزام والتطبيق</th>
                    <th className="p-4 sm:p-5">المعيار المتبع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)] text-xs md:text-sm text-[var(--ink-2)] font-medium">
                  {complianceMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[var(--bg)]/50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-[var(--ink)] flex items-center gap-2">
                        <CheckCircle size={15} className="text-[var(--brand)] shrink-0" />
                        <span>{row.feature}</span>
                      </td>
                      <td className="p-4 sm:p-5 font-mono text-[var(--brand)] font-semibold">{row.level}</td>
                      <td className="p-4 sm:p-5">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-[11px] font-mono font-bold">
                          {row.standard}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] mb-2">
              أسئلة شائعة حول <span className="text-[var(--brand)]">الشروط والخصوصية</span>
            </h2>
            <p className="text-sm text-[var(--ink-2)]">إجابات سريعة ومستفيضة على تساؤلات المطورين والمستخدمين</p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqData.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full p-5 text-right flex items-center justify-between gap-4 font-bold text-sm md:text-base text-[var(--ink)] hover:text-[var(--brand)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--brand)] rounded-2xl"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[var(--brand)] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-5 text-xs md:text-sm text-[var(--ink-2)] leading-relaxed border-t border-[var(--line)]/50 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Read acknowledgement */}
        <div className="mt-16 bg-[var(--surface)] border border-[var(--brand)]/20 rounded-3xl p-6 sm:p-8 shadow-xs print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--ink)]">إقرار الاطلاع على الشروط</h2>
                <p className="text-xs text-[var(--ink-2)] mt-1 leading-relaxed">
                  بتأكيد الاطلاع تُسجَّل موافقتك محلياً في متصفحك على النسخة {TERMS_VERSION} فقط — لا تُرسل أي بيانات لخوادمنا.
                </p>
                {acceptedAt && (
                  <p className="text-xs font-semibold text-green-600 dark:text-green-400 mt-2 tabular-nums">
                    تم الإقرار بتاريخ{" "}
                    {new Date(acceptedAt).toLocaleString("ar", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {acceptedAt ? (
                <>
                  <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-300 text-xs font-bold">
                    <Check size={14} /> تم الإقرار
                  </span>
                  <button
                    onClick={handleResetAccept}
                    className="px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                  >
                    تراجع
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAccept}
                  className="px-5 py-2.5 bg-[var(--brand)] text-white text-xs font-bold rounded-xl hover:bg-[var(--brand-700)] transition-all cursor-pointer shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
                >
                  أقر بأنني قرأت الشروط ({TERMS_VERSION})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Support Banner */}
        <div className="mt-16 text-center bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xs print:hidden flex flex-col items-center justify-center">
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)" }}
          />
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] mb-3 text-center">لديك استفسار خاص حول هذه الشروط؟</h2>
          <p className="text-[var(--ink-2)] mb-8 text-sm md:text-base max-w-lg mx-auto text-center leading-relaxed">
            فريق jemo labs القانوني والتقني جاهز للتوضيح والإجابة على أي استفسار بشفافية كاملة.
          </p>
          <div className="flex justify-center items-center">
            <GlowButton href="/apply">قدّم طلبك الآن</GlowButton>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <AnimatePresence>
        {showBackTop && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={scrollToTop}
            aria-label="العودة إلى أعلى الصفحة"
            className="fixed bottom-6 left-6 z-40 p-3.5 rounded-2xl bg-[var(--brand)] text-white shadow-lg hover:bg-[var(--brand-700)] transition-colors cursor-pointer print:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
    </MotionConfig>
  );
}
