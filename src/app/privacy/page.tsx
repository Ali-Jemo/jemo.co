import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  DownloadCloud,
  FileCheck,
  Clock,
  CheckCircle2,
  BookOpen,
  ArrowUpRight,
  Mail,
  ChevronDown,
  Database,
  Cpu,
  Cookie,
  Trash2,
  UserCheck,
  Shield,
} from "lucide-react";

// ponytail: Static Server Component with native CSS anchors & <details> replaces client bloat

const DESCRIPTION =
  "السياسة الرسمية للخصوصية وحماية البيانات في JEMO LABS: التشفير التام (AES-256 / TLS 1.3)، حظر المشاركة الإعلانية، حقوق التصدير والحذف، والامتثال للائحة GDPR.";

export const metadata: Metadata = {
  title: "سياسة الخصوصية وحماية البيانات | JEMO LABS",
  description: DESCRIPTION,
  openGraph: {
    title: "سياسة الخصوصية وحماية البيانات | JEMO LABS",
    description: DESCRIPTION,
    type: "website",
    locale: "ar_AR",
  },
  twitter: {
    card: "summary",
    title: "سياسة الخصوصية وحماية البيانات | JEMO LABS",
    description: DESCRIPTION,
  },
};

export const dynamic = "force-dynamic";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://jemo.co/privacy",
      "url": "https://jemo.co/privacy",
      "name": "سياسة الخصوصية وحماية البيانات | JEMO LABS",
      "description": DESCRIPTION,
      "inLanguage": "ar",
      "dateModified": "2026-09-01",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "هل تشارك JEMO LABS بياناتي أو أبحاثي مع أي جهات إعلانية؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "مطلقاً. نلتزم بحظر تام لأي استغلال إعلاني أو بيع للبيانات الشخصية والبحثية، ولا نشارك البيانات إلا بالحد الأدنى اللازم لتشغيل البنية السحابية.",
          },
        },
        {
          "@type": "Question",
          "name": "كيف يمكنني طلب حذف حسابي وجميع البيانات المرتبطة به؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "يمكنك تقديم طلب مباشر عبر إعدادات الحساب أو مراسلة مسؤول حماية البيانات (privacy@jemo.co) وسيتم مسح جميع سجلاتك خلال 72 ساعة عمل.",
          },
        },
        {
          "@type": "Question",
          "name": "ما هي معايير التشفير المستخدمة لحماية البيانات والمشاريع؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "نستخدم بروتوكول TLS 1.3 لتشفير حركة البيانات، وتشفير AES-256 للبيانات المخزنة في قواعد البيانات والخوادم السحابية.",
          },
        },
        {
          "@type": "Question",
          "name": "هل تدعم المنظومة متطلبات اللائحة العامة لحماية البيانات (GDPR)؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "نعم، تدعم المنظومة الامتثال الكامل لحقوق الوصول، التصحيح، النقل، ومحو البيانات (الحق في النسيان).",
          },
        },
      ],
    },
  ],
};

interface PrivacyClause {
  code: string;
  title: string;
  body: string;
  mandatory?: boolean;
}

interface PrivacySection {
  id: string;
  number: string;
  title: string;
  icon: typeof ShieldCheck;
  highlight: string;
  clauses: PrivacyClause[];
}

const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: "principles",
    number: "01",
    title: "المبادئ الأساسية لحوكمة الخصوصية",
    icon: ShieldCheck,
    highlight: "الشفافية، حصر الأغراض، تقليل جمع البيانات، والتشفير كمعيار افتراضي (Privacy by Design).",
    clauses: [
      {
        code: "1.1",
        title: "الخصوصية في صلب التصميم (Privacy by Design)",
        body: "تُبنى أنظمتنا البرمجية وبنيتنا التحتية وفق مبدأ حماية الخصوصية بالتصميم والافتراض، بحيث تُعزل بيئات الاختبار والأبحاث عن أي معالجة غير مصرح بها.",
        mandatory: true,
      },
      {
        code: "1.2",
        title: "تقليل جمع البيانات (Data Minimization)",
        body: "نمتنع عن جمع أي بيانات تزيد عن الحاجة المباشرة لتشغيل الحساب، إدارة الموارد الحوسبية، وتسهيل التعاون البحثي بين المطورين.",
        mandatory: true,
      },
      {
        code: "1.3",
        title: "الشفافية التامة في المعالجة",
        body: "يحق لكل باحث ومستخدم معرفة نوع البيانات المخزنة، مسار انتقالها، والجهة التقنية المسؤولة عن معالجتها في أي وقت عبر لوحة التحكم.",
      },
    ],
  },
  {
    id: "data-collected",
    number: "02",
    title: "البيانات التي نجمعها وكيفية جمعها",
    icon: Database,
    highlight: "جمع محدود لبيانات التسجيل الأساسية، سجلات الاستهلاك التقني، وتفاصيل المشاريع المعلنة طوعاً.",
    clauses: [
      {
        code: "2.1",
        title: "بيانات الهوية والحساب الشخصي",
        body: "تشمل الاسم، عنوان البريد الإلكتروني، رابط حساب GitHub أو ORCID، وصورة الملف الشخصي التي يقدمها المستخدم طوعاً عند إنشاء الحساب.",
        mandatory: true,
      },
      {
        code: "2.2",
        title: "بيانات الاستخدام التشغيلي وسجلات السيرفر",
        body: "تشمل عنوان بروتوكول الإنترنت (IP) المشفر جزئياً، نوع المتصفح، وسجلات أداء استدعاء الواجهات البرمجية (API Latency) لأغراض فنية وتشخيصية بحتة.",
      },
      {
        code: "2.3",
        title: "الأكواد والمستودعات والمخرجات البحثية",
        body: "تُعامل المشاريع والمستودعات المرفوعة وفق مستوى الخصوصية المحدد من قبلك (مستودع خاص أو مفتوح المصدر)، ولا نطلع على المشاريع الخاصة إلا لتقديم الدعم الفني بناءً على طلبك الصريح.",
        mandatory: true,
      },
    ],
  },
  {
    id: "purposes",
    number: "03",
    title: "أغراض المعالجة والأساس القانوني",
    icon: Cpu,
    highlight: "معالجة محكومة بتنفيذ الاتفاقية البحثية، استقرار الخدمات الحوسبية، والامتثال للأنظمة القانونية.",
    clauses: [
      {
        code: "3.1",
        title: "تنفيذ الاتفاقية وتقديم الخدمات",
        body: "استخدام البيانات لإنشاء الحساب، تخصيص حصص المعالجة الحاسوبية (Compute Quotas)، وتمكين العمل التشاركي في الفرق البحثية.",
        mandatory: true,
      },
      {
        code: "3.2",
        title: "أمن وسلامة البنية التحتية",
        body: "الكشف المبكر عن محاولات الاختراق، هجمات حجب الخدمة، أو الاستغلال المؤذي للواجهات البرمجية لضمان سلامة موارد الجميع.",
        mandatory: true,
      },
      {
        code: "3.3",
        title: "التواصل والإشعارات الرسمية",
        body: "إرسال إشعارات الأمان الضرورية، تحديثات السياسات، وفواتير الاشتراكات. لا نرسل أي رسائل دعائية ترويجية دون موافقة مسبقة.",
      },
    ],
  },
  {
    id: "security-storage",
    number: "04",
    title: "التشفير والأمان الفني والتخزين السحابي",
    icon: Lock,
    highlight: "تشفير TLS 1.3 أثناء النقل، وAES-256 في السكون، داخل مراكز بيانات متوافقة مع معايير SOC 2 وISO 27001.",
    clauses: [
      {
        code: "4.1",
        title: "بروتوكولات التشفير المتقدم",
        body: "تشفير جميع جلسات الاتصال وقنوات نقل البيانات عبر بروتوكول TLS 1.3 مع شهادات أمان معتمدة وتشفير كامل لقواعد البيانات عبر مفاتيح AES-256.",
        mandatory: true,
      },
      {
        code: "4.2",
        title: "عزل الصلاحيات وحماية المفاتيح",
        body: "تطبيق مبدأ الصلاحيات الدنيا (Principle of Least Privilege)، وتخزين المفاتيح الحساسة في وحدات إدارة مفاتيح أمنية معزولة (KMS).",
        mandatory: true,
      },
      {
        code: "4.3",
        title: "المراقبة الدورية واختبار الاختراق",
        body: "إجراء فحوصات دورية للكشف عن الثغرات واختبارات اختراق دورية من فرق أمنية مستقلة لضمان متانة الحماية.",
      },
    ],
  },
  {
    id: "sharing",
    number: "05",
    title: "مشاركة البيانات والجهات الخارجية",
    icon: EyeOff,
    highlight: "حظر قاطع للمشاركة أو الاستغلال الإعلاني، وحصر النقل السحابي على مزودي البنية التحتية الموثوقين.",
    clauses: [
      {
        code: "5.1",
        title: "حظر بيع ومشاركة البيانات لأغراض إعلانية",
        body: "تلتزم JEMO LABS التزاماً صارماً بعدم بيع، تأجير، أو مشاركة أي بيانات للمستخدمين مع شركات الإعلانات أو شبكات التتبع التجارية تحت أي ظرف.",
        mandatory: true,
      },
      {
        code: "5.2",
        title: "مزودو البنية السحابية المعتمدون",
        body: "قد تتم معالجة البيانات عبر مزودي استضافة سحابية موثوقين (مثل Cloudflare وAWS) يخضعون لاتفاقيات حماية بيانات صارمة متوافقة مع GDPR.",
        mandatory: true,
      },
      {
        code: "5.3",
        title: "الطلبات القانونية والتنظيمية",
        body: "لا نفصح عن أي بيانات إلا بموجب أمر قضائي ملزم أو إخطار رسمي وفق الإجراءات القانونية النافذة، مع إشعار المستخدم فوراً ما لم يحظر القانون ذلك.",
      },
    ],
  },
  {
    id: "user-rights",
    number: "06",
    title: "حقوقك الرقمية وإدارة البيانات (GDPR)",
    icon: UserCheck,
    highlight: "حق كامل في تصدير البيانات، تصحيح السجلات، والمحو النهائي التام (الحق في النسيان) خلال 72 ساعة.",
    clauses: [
      {
        code: "6.1",
        title: "حق الوصول والتصدير (Data Portability)",
        body: "يمكنك في أي وقت تنزيل وتصدير كامل ملفاتك ومشاريعك وسجلاتك بصيغ مفتوحة قابلة للقراءة الآلية (JSON/ZIP).",
        mandatory: true,
      },
      {
        code: "6.2",
        title: "حق المحو النهائي (Right to Erasure)",
        body: "لك الحق في طلب حذف حسابك وبياناتك بالكامل من خوادمنا، ويتم تنفيذ المسح التام والنهائي خلال 72 ساعة عمل من تاريخ الطلب.",
        mandatory: true,
      },
      {
        code: "6.3",
        title: "حق التصحيح والتقييد",
        body: "يمكنك تحديث بياناتك الشخصية في أي وقت من الإعدادات، أو طلب تقييد معالجة أي بيانات في حال وجود اعتراض فني.",
      },
    ],
  },
  {
    id: "cookies",
    number: "07",
    title: "ملفات تعريف الارتباط والتحليلات",
    icon: Cookie,
    highlight: "ملفات ارتباط وظيفية فقط للمصادقة وتفضيلات الجلسة، دون ملفات تتبع تجارية لطرف ثالث.",
    clauses: [
      {
        code: "7.1",
        title: "ملفات تعريف الارتباط الضرورية",
        body: "نستخدم فقط ملفات الارتباط اللازمة تقنياً لإدارة تسجيل الدخول، حفظ جلسات الأمان، وتحديد تفضيلات العرض واللغة.",
        mandatory: true,
      },
      {
        code: "7.2",
        title: "غياب ملفات التتبع الإعلاني",
        body: "لا نزرع أي أكواد تتبع من شبكات إعلانية أو منصات تسويق خارجية على الإطلاق داخل منصات jemo labs.",
        mandatory: true,
      },
      {
        code: "7.3",
        title: "تحليلات الأداء المجمعة دون هوية",
        body: "أي إحصائيات حول حركة المنصة تكون مجهولة الهوية بالكامل ومجمعة بهدف قياس استقرار الخوادم ومعدلات استهلاك الموارد.",
      },
    ],
  },
  {
    id: "retention",
    number: "08",
    title: "الاحتفاظ بالبيانات وسياسة المحو",
    icon: Trash2,
    highlight: "حذف البيانات الشخصية فور إغلاق الحساب، مع حفظ السجلات المالية فقط للمدد القانونية الملزمة.",
    clauses: [
      {
        code: "8.1",
        title: "فترة الاحتفاظ بحسابات المستخدمين",
        body: "نحتفظ ببياناتك طالما كان حسابك نشطاً. عند طلب الإغلاق، تُزال كافة البيانات الشخصية والملفات الحساسة نهائياً.",
        mandatory: true,
      },
      {
        code: "8.2",
        title: "السجلات المالية والمحاسبية",
        body: "تُحفظ سجلات الدفع والفواتير فقط للمدد التي تتطلبها القوانين المحاسبية والضريبية المعتمدة، بمعزل عن بيانات الاستخدام.",
      },
      {
        code: "8.3",
        title: "مسح النسخ الاحتياطية",
        body: "تُمسح البيانات المحذوفة تلقائياً من دورات النسخ الاحتياطي التتابعي وفق جدول التدوير الفني خلال 30 يوماً كحد أقصى.",
      },
    ],
  },
];

const FAQS = [
  {
    q: "هل تشارك JEMO LABS بياناتي أو أبحاثي مع أي جهات إعلانية؟",
    a: "مطلقاً. نلتزم بحظر تام لأي استغلال إعلاني أو بيع للبيانات الشخصية والبحثية، ولا نشارك البيانات إلا بالحد الأدنى اللازم لتشغيل البنية السحابية.",
  },
  {
    q: "كيف يمكنني طلب حذف حسابي وجميع البيانات المرتبطة به؟",
    a: "يمكنك تقديم طلب مباشر عبر إعدادات الحساب أو مراسلة مسؤول حماية البيانات (privacy@jemo.co) وسيتم مسح جميع سجلاتك خلال 72 ساعة عمل.",
  },
  {
    q: "ما هي معايير التشفير المستخدمة لحماية البيانات والمشاريع؟",
    a: "نستخدم بروتوكول TLS 1.3 لتشفير حركة البيانات، وتشفير AES-256 للبيانات المخزنة في قواعد البيانات والخوادم السحابية.",
  },
  {
    q: "هل تدعم المنظومة متطلبات اللائحة العامة لحماية البيانات (GDPR)؟",
    a: "نعم، تدعم المنظومة الامتثال الكامل لحقوق الوصول، التصحيح، النقل، ومحو البيانات (الحق في النسيان).",
  },
];

const KEY_PILLARS = [
  {
    icon: EyeOff,
    badge: "Zero Ad Tracking",
    title: "عدم بيع أو مشاركة البيانات",
    desc: "حظر قاطع للمشاركة الإعلانية والتتبع التجاري. بياناتك ليست سلعة ولن تكون كذلك.",
  },
  {
    icon: Lock,
    badge: "AES-256 / TLS 1.3",
    title: "تشفير كامل ومتقدم",
    desc: "قنوات اتصال مشفرة بالكامل أثناء النقل وفي حالة السكون في مراكز بيانات عالية الأمان.",
  },
  {
    icon: DownloadCloud,
    badge: "GDPR Compliant",
    title: "حق التصدير والمحو التام",
    desc: "إمكانية تحميل كامل بياناتك بصيغة معيارية أو طلب حذفها نهائياً خلال 72 ساعة عمل.",
  },
  {
    icon: ShieldCheck,
    badge: "Privacy by Design",
    title: "تقليل جمع البيانات",
    desc: "جمع محدود ومحصور بالحد الأدنى التقني اللازم لتشغيل الحسابات والمشاريع البحثية.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />

      <main className="min-h-screen bg-[var(--bg)] text-[var(--ink-1)] py-12 md:py-20">
        <div className="container max-w-6xl px-4 sm:px-6 mx-auto">
          {/* Hero Section */}
          <header className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--line)] shadow-xs text-xs font-mono text-[var(--ink-2)]">
              <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>الحوكمة وحماية البيانات الرقمية</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--ink-1)] leading-tight">
              سياسة الخصوصية وحماية البيانات
            </h1>

            <p className="text-base sm:text-lg text-[var(--ink-2)] leading-relaxed font-normal">
              التزام مؤسسي راسخ بحماية سرية أبحاثك، تشفير بياناتك، والامتثال الصارم للحقوق الرقمية
              ولائحة حماية البيانات العامة (GDPR).
            </p>

            {/* Document Metadata Strip */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-[var(--ink-2)]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--surface)] border border-[var(--line)]">
                <FileCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>الإصدار 3.0</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--surface)] border border-[var(--line)]">
                <Clock className="w-3.5 h-3.5 text-[var(--ink-2)]" />
                <span>تاريخ السريان: 1 سبتمبر 2026</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--surface)] border border-[var(--line)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>الحالة: سارية المفعول</span>
              </span>
            </div>
          </header>

          {/* Key Privacy Highlights Grid */}
          <section
            aria-label="مبادئ الخصوصية الأساسية"
            className="mb-16 md:mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {KEY_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="p-5 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-xs hover:border-[var(--brand)]/30 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center text-[var(--ink-1)]">
                        <Icon className="w-4 h-4 text-[var(--accent)]" />
                      </div>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg)] text-[var(--ink-2)] border border-[var(--line)]">
                        {pillar.badge}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-[var(--ink-1)]">
                      {pillar.title}
                    </h2>
                    <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Main Layout: Sticky Sidebar Navigation + Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Sidebar Table of Contents */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <nav
                aria-label="فهرس سياسة الخصوصية"
                className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                  <h3 className="font-bold text-sm text-[var(--ink-1)] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                    <span>فهرس سياسة الخصوصية</span>
                  </h3>
                  <span className="text-[11px] font-mono text-[var(--ink-2)]">
                    8 محاور رئيسية
                  </span>
                </div>

                <ol className="space-y-1.5 text-xs">
                  {PRIVACY_SECTIONS.map((sec) => (
                    <li key={sec.id}>
                      <a
                        href={`#${sec.id}`}
                        className="flex items-center justify-between p-2 rounded-lg text-[var(--ink-2)] hover:text-[var(--ink-1)] hover:bg-[var(--bg)] transition-colors group"
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          <span className="font-mono text-[10px] font-semibold text-[var(--ink-2)] group-hover:text-[var(--accent)]">
                            {sec.number}
                          </span>
                          <span className="truncate">{sec.title}</span>
                        </span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </a>
                    </li>
                  ))}
                  <li className="pt-2 border-t border-[var(--line)]">
                    <a
                      href="#faq"
                      className="flex items-center justify-between p-2 rounded-lg text-[var(--ink-2)] hover:text-[var(--ink-1)] hover:bg-[var(--bg)] transition-colors group"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="font-mono text-[10px] font-semibold text-[var(--ink-2)] group-hover:text-[var(--accent)]">
                          09
                        </span>
                        <span>الأسئلة الشائعة (FAQ)</span>
                      </span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#dpo"
                      className="flex items-center justify-between p-2 rounded-lg text-[var(--ink-2)] hover:text-[var(--ink-1)] hover:bg-[var(--bg)] transition-colors group"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="font-mono text-[10px] font-semibold text-[var(--ink-2)] group-hover:text-[var(--accent)]">
                          10
                        </span>
                        <span>مسؤول حماية البيانات (DPO)</span>
                      </span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </a>
                  </li>
                </ol>
              </nav>

              {/* DPO Inquiry Widget */}
              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--ink-1)]">
                  <Mail className="w-4 h-4 text-[var(--accent)]" />
                  <span>مكتب حماية البيانات والامتثال</span>
                </div>
                <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                  لطلبات تصدير البيانات، المحو النهائي، أو التبليغ عن أي مخاوف تتعلق بالخصوصية:
                </p>
                <div className="space-y-2 pt-1">
                  <a
                    href="mailto:privacy@jemo.co"
                    className="inline-flex items-center justify-center w-full gap-2 px-3 py-2 rounded-lg bg-[var(--bg)] hover:bg-[var(--line)] border border-[var(--line)] text-xs font-mono font-medium text-[var(--ink-1)] transition-colors"
                  >
                    <span>privacy@jemo.co</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="mailto:legal@jemo.co"
                    className="inline-flex items-center justify-center w-full gap-2 px-3 py-2 rounded-lg bg-[var(--bg)] hover:bg-[var(--line)] border border-[var(--line)] text-xs font-mono font-medium text-[var(--ink-2)] transition-colors"
                  >
                    <span>legal@jemo.co</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </aside>

            {/* Detailed Clauses Content */}
            <div className="lg:col-span-8 space-y-12 sm:space-y-16">
              {PRIVACY_SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-28 space-y-5"
                  >
                    {/* Section Header */}
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--line)]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)]">
                          <span>المحور</span>
                          <span>•</span>
                          <span>SECTION {section.number}</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink-1)] flex items-center gap-2.5">
                          <span>{section.title}</span>
                        </h2>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center text-[var(--ink-1)] shrink-0 shadow-xs">
                        <Icon className="w-5 h-5 text-[var(--accent)]" />
                      </div>
                    </div>

                    {/* Section Highlight Banner */}
                    <div className="p-4 rounded-xl bg-[var(--surface)] border-r-4 border-r-[var(--accent)] border border-[var(--line)] text-xs sm:text-sm text-[var(--ink-1)] leading-relaxed font-medium">
                      {section.highlight}
                    </div>

                    {/* Clauses List */}
                    <div className="space-y-3.5">
                      {section.clauses.map((clause) => (
                        <article
                          key={clause.code}
                          id={`clause-${clause.code.replace(".", "-")}`}
                          className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-sm sm:text-base font-bold text-[var(--ink-1)] flex items-center gap-2">
                              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)]">
                                {clause.code}
                              </span>
                              <span>{clause.title}</span>
                            </h3>
                            {clause.mandatory && (
                              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)] shrink-0">
                                بند أساسي
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                            {clause.body}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}

              {/* Native FAQ Section */}
              <section id="faq" className="scroll-mt-28 space-y-6 pt-6">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--line)]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)]">
                      <span>الاستفسارات الشائعة</span>
                      <span>•</span>
                      <span>SECTION 09</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink-1)]">
                      الأسئلة الشائعة حول الخصوصية والبيانات
                    </h2>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center text-[var(--ink-1)] shrink-0 shadow-xs">
                    <BookOpen className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                </div>

                <div className="space-y-3">
                  {FAQS.map((faq, idx) => (
                    <details
                      key={idx}
                      className="group p-5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-xs transition-all duration-200 open:border-[var(--brand)]/30"
                    >
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-sm sm:text-base text-[var(--ink-1)] select-none">
                        <span>{faq.q}</span>
                        <ChevronDown className="w-4 h-4 text-[var(--ink-2)] group-open:rotate-180 transition-transform duration-200 shrink-0" />
                      </summary>
                      <p className="mt-3.5 pt-3.5 border-t border-[var(--line)] text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </section>

              {/* DPO Contact Card */}
              <section
                id="dpo"
                className="scroll-mt-28 p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)]">
                    <span>قناة الامتثال المباشرة</span>
                    <span>•</span>
                    <span>SECTION 10</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink-1)]">
                    تواصل مع مسؤول حماية البيانات (DPO)
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                    نلتزم بالرد على كافة طلبات الخصوصية، استفسارات حماية البيانات، وإجراءات ممارسة حقوق GDPR
                    خلال مهلة أقصاها 48 ساعة عمل.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <a
                    href="mailto:privacy@jemo.co"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--ink-1)] text-[var(--surface)] text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Mail className="w-4 h-4" />
                    <span>مراسلة مسؤول الخصوصية: privacy@jemo.co</span>
                  </a>
                  <a
                    href="/terms"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-1)] text-xs sm:text-sm font-semibold hover:bg-[var(--line)] transition-colors"
                  >
                    <span>الشروط والأحكام العامة</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
