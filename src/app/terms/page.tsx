import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Users,
  Lock,
  Scale,
  CreditCard,
  Sparkles,
  Clock,
  Mail,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Server,
  BookOpen,
  HeartHandshake,
  ArrowUpRight,
  Shield,
  FileCheck,
} from "lucide-react";

// ponytail: Static Server Component with native CSS anchors & <details> replaces 1,300 lines of client state/animation

const DESCRIPTION =
  "الشروط والأحكام الرسمية الحاكمة لمنصة ومختبرات JEMO LABS: حماية الملكية الفكرية، سرية البيانات، اتفاقية مستوى الخدمة، وسياسات الاستخدام المسؤول.";

export const metadata: Metadata = {
  title: "الشروط والأحكام والسياسات العامة | JEMO LABS",
  description: DESCRIPTION,
  openGraph: {
    title: "الشروط والأحكام والسياسات العامة | JEMO LABS",
    description: DESCRIPTION,
    type: "website",
    locale: "ar_AR",
  },
  twitter: {
    card: "summary",
    title: "الشروط والأحكام | JEMO LABS",
    description: DESCRIPTION,
  },
};

export const dynamic = "force-dynamic";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://jemo.co/terms",
      "url": "https://jemo.co/terms",
      "name": "الشروط والأحكام والسياسات العامة | JEMO LABS",
      "description": DESCRIPTION,
      "inLanguage": "ar",
      "dateModified": "2026-09-01",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "هل تحتفظ JEMO LABS بأي حقوق ملكية في الأكواد أو النماذج التي أنشئها؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "لا، كل ما تقوم بابتكاره وبنائه عبر المنظومة يظل ملكك الفكري والخاص بنسبة 100% دون أي ادعاء منا بالملكية.",
          },
        },
        {
          "@type": "Question",
          "name": "هل يمكنني تصدير أو حذف جميع بياناتي نهائياً؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "نعم، يمكنك في أي وقت طلب تصدير كامل بياناتك أو المسح النهائي لجميع سجلاتك من خوادمنا خلال 72 ساعة عمل وفق سياسة GDPR.",
          },
        },
        {
          "@type": "Question",
          "name": "ما هي سياسة استرجاع المبالغ المدفوعة للاشتراكات والخدمات؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "نقدم ضمان استرجاع كامل للمبلغ خلال 14 يوماً من بدء الاشتراك في أي خدمة أو باقة مدفوعة دون أي اشتراطات معقدة.",
          },
        },
        {
          "@type": "Question",
          "name": "كيف يتم إبلاغي بأي تعديل على الشروط والسياسات؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "يتم إرسال إشعار مباشر عبر البريد الإلكتروني مع إعلان بارز في المنصة قبل سريان أي شروط جديدة بـ 14 يوماً على الأقل.",
          },
        },
      ],
    },
  ],
};

interface TermClause {
  code: string;
  title: string;
  body: string;
  mandatory?: boolean;
}

interface TermSection {
  id: string;
  number: string;
  title: string;
  icon: typeof ShieldCheck;
  highlight: string;
  clauses: TermClause[];
}

const SECTIONS: TermSection[] = [
  {
    id: "privacy",
    number: "01",
    title: "الخصوصية وحماية البيانات الشخصية",
    icon: Lock,
    highlight: "معالجة بيانات مشفرة بالكامل (AES-256 / TLS 1.3) مع حظر مطلق للمشاركة الإعلانية.",
    clauses: [
      {
        code: "1.1",
        title: "حصر جمع البيانات وأغراض المعالجة",
        body: "نجمع حصرياً البيانات الضرورية لتشغيل حسابك وتقديم الخدمات البحثية والحوسبية (كالاسم، البريد الإلكتروني، وبيانات المصادقة). لا نبيع ولا نشارك بياناتك مع أي شركات إعلانية أو أطراف ثالثة لأغراض التتبع.",
        mandatory: true,
      },
      {
        code: "1.2",
        title: "التشفير ومعايير التخزين السحابي",
        body: "تُشفر جميع البيانات الحساسة أثناء النقل عبر بروتوكول TLS 1.3، وتُخزن في مراكز بيانات مؤمنة وفق معيار التشفير AES-256 مع مراقبة أمنية على مدار الساعة ومسارات وصول معزولة.",
        mandatory: true,
      },
      {
        code: "1.3",
        title: "الحق في التصدير والمحو النهائي (GDPR)",
        body: "يحق لك في أي وقت تصدير كامل بياناتك وسجلات مشاريعك بصيغة معيارية مقروءة آلياً (JSON)، أو تقديم طلب الحذف النهائي لجميع سجلاتك وخوادمك المرتبطة خلال 72 ساعة عمل.",
      },
    ],
  },
  {
    id: "conduct",
    number: "02",
    title: "قواعد السلوك والاستخدام المؤسسي",
    icon: Users,
    highlight: "بيئة تعاونية ترتكز على المهنية والنزاهة العلمية والاحترام المتبادل بين الباحثين والمطورين.",
    clauses: [
      {
        code: "2.1",
        title: "الخطاب المحظور والسلوك المهني",
        body: "يُحظر منعاً باتاً استخدام أي ألفاظ مسيئة، تمييزية، أو تحريضية في مستودعات الأكواد، قنوات النقاش، أو صفحات المشاريع. يحق للإدارة تعليق أو إيقاف الحسابات المخالفة فوراً.",
        mandatory: true,
      },
      {
        code: "2.2",
        title: "الأمانة الأكاديمية ونسب المخرجات",
        body: "يلتزم الباحثون بنسب المساهمات والأفكار لمصادرها الأصلية، والامتناع عن انتحال الأوراق العلمية أو التلاعب بالنتائج التجريبية المنشورة عبر المنظومة.",
        mandatory: true,
      },
      {
        code: "2.3",
        title: "آلية البلاغات والإنصاف الداخلي",
        body: "نوفر قناة مباشرة وسرية للإبلاغ عن أي انتهاكات سلوكية أو نزاعات، ويتعهد الفريق الإداري بالتحقق والرد باتخاذ التدابير المناسبة خلال مهلة أقصاها 48 ساعة.",
      },
    ],
  },
  {
    id: "security",
    number: "03",
    title: "الأمان وحظر الاستغلال البرمجي",
    icon: ShieldCheck,
    highlight: "حماية البنية التحتية وموارد الحوسبة التشاركية لضمان استقرار وسرعة الخدمات للجميع.",
    clauses: [
      {
        code: "3.1",
        title: "منع هجمات الاستغلال والهندسة العكسية",
        body: "يُحظر استغلال أي ثغرات برمجية، أو تنفيذ هجمات حجب الخدمة (DoS/DDoS)، أو تفكيك النواة، أو محاولة تجاوز أنظمة المصادقة والصلاحيات الأمنية للمنصة.",
        mandatory: true,
      },
      {
        code: "3.2",
        title: "الاستخدام الآلي وحدود الاستهلاك (Rate Limits)",
        body: "يُمنع استخدام البوتات وأدوات التجريف أو إغراق الواجهات البرمجية (APIs) بطلبات تتجاوز الحدود المحددة للباقة، بما يهدد أداء الخدمة لعموم المستخدمين.",
        mandatory: true,
      },
      {
        code: "3.3",
        title: "برنامج مكافآت الثغرات الأمنية (Bug Bounty)",
        body: "نرحب بالباحثين الأمنيين لاكتشاف الثغرات والإبلاغ عنها بمسؤولية ونية حسنة وفق سياسة الإفصاح المنسق، مع تقديم مكافآت تقديرية وشهادات مساهمة رسمية.",
      },
    ],
  },
  {
    id: "ip",
    number: "04",
    title: "الملكية الفكرية والحقوق الرقمية",
    icon: Sparkles,
    highlight: "مشاريعك وأبحاثك ملكك الحصري 100%، دون أي ادعاء بالملكية من طرف المختبرات.",
    clauses: [
      {
        code: "4.1",
        title: "ملكية الباحث والمطور الكاملة",
        body: "كافة الأكواد، النماذج، البيانات، والتصاميم التي تقوم بإنشائها أو استضافتها عبر المنظومة تظل ملكك الفكري والخاص بالكامل دون أي حق لنا في استغلالها تجارياً.",
        mandatory: true,
      },
      {
        code: "4.2",
        title: "العلامة التجارية والهوية البصرية",
        body: "الشعارات، الرموز، والأسماء التجارية التابعة لـ JEMO LABS محمية بموجب قوانين الملكية الفكرية، ولا يجوز استخدامها أو تقليدها دون إذن خطي مسبق.",
        mandatory: true,
      },
      {
        code: "4.3",
        title: "المشاع العلمي وتراخيص المصدر المفتوح",
        body: "المشاريع والمكتبات البرمجية المنشورة تحت تراخيص مفتوحة (مثل MIT أو Apache 2.0) تخضع لبنود التراخيص المرفقة بها وتُعامل كأصل معرفي عام للمجتمع.",
      },
    ],
  },
  {
    id: "sla",
    number: "05",
    title: "اتفاقية مستوى الخدمة (SLA) والضمانات",
    icon: Server,
    highlight: "معدل تشغيل مستهدف 99.9% للبنية التحتية والواجهات البرمجية، مع إشعار مسبق بالصيانة.",
    clauses: [
      {
        code: "5.1",
        title: "جاهزية واستقرار الخوادم",
        body: "نلتزم بالحفاظ على معدل جاهزية لا يقل عن 99.9% للأنظمة الأساسية، مع إشعار المستخدمين بأي أعمال صيانة وقائية مجدولة قبل موعدها بـ 48 ساعة على الأقل.",
        mandatory: true,
      },
      {
        code: "5.2",
        title: "النسخ الاحتياطي ومسؤولية البيانات",
        body: "نقوم بإجراء نسخ احتياطية دورية للبيانات التشغيلية، ومع ذلك يُنصح المطورون دائماً بالاحتفاظ بنسخ محلية احتياطية لمشاريعهم الحساسة.",
      },
      {
        code: "5.3",
        title: "حدود المسؤولية وإخلاء الطرف",
        body: "لا تتحمل JEMO LABS المسؤولية عن أي خسائر غير مباشرة أو أضرار ناتجة عن انقطاعات طارئة ناتجة عن قوة قاهرة خارجة عن السيطرة المعقولة.",
      },
    ],
  },
  {
    id: "billing",
    number: "06",
    title: "الاشتراكات والمعاملات المالية",
    icon: CreditCard,
    highlight: "شفافية مطلقة في الفوترة، تجديد اختياري قابل للإلغاء الفوري، وضمان استرجاع لمدة 14 يوماً.",
    clauses: [
      {
        code: "6.1",
        title: "الوضوح المالي والتجديد التلقائي",
        body: "تُعرض رسوم الخطط والموارد الحوسبية بوضوح ودون رسوم خفية. تتجدد الاشتراكات دورياً، ويمكن للمستخدم إيقاف التجديد التلقائي بنقرة واحدة من لوحة التحكم.",
        mandatory: true,
      },
      {
        code: "6.2",
        title: "ضمان الاسترجاع الكامل (14-Day Refund)",
        body: "نمنح ضمان استرداد كامل للمبلغ المدفوع خلال 14 يوماً من تاريخ التفعيل لأي باقة أو خدمة مدفوعة في حال عدم الرضا التام، دون أي استجوابات معقدة.",
        mandatory: true,
      },
      {
        code: "6.3",
        title: "تعديل أسعار الخدمات",
        body: "في حال مراجعة أسعار الباقات، نلتزم بإخطار المشتركين عبر البريد الإلكتروني قبل 30 يوماً من سريان التعديل، مع حفظ حق إنهاء الاشتراك قبل التطبيق.",
      },
    ],
  },
  {
    id: "termination",
    number: "07",
    title: "إنهاء الخدمة وفسخ الحسابات",
    icon: AlertTriangle,
    highlight: "حرية إنهاء الحساب في أي لحظة مع حفظ الحقوق التنظيمية ومحو البيانات الشخصية.",
    clauses: [
      {
        code: "7.1",
        title: "الإنهاء الطوعي من طرف المستخدم",
        body: "يمكنك إنهاء حسابك وفك الارتباط بالمنصة في أي وقت عبر إعدادات الحساب مع إمكانية تحميل نسخة نهائية من كافة مساهماتك.",
      },
      {
        code: "7.2",
        title: "التعليق أو الفسخ للمخالفات الجسيمة",
        body: "تحتفظ الإدارة بحق تعليق أو إنهاء الحسابات التي تنتهك بنود الأمان أو شروط الملكية الفكرية بشكل جسيم ومباشر، مع توجيه إخطار كتابي بالأسباب.",
        mandatory: true,
      },
      {
        code: "7.3",
        title: "الاحتفاظ بالبيانات بعد الإنهاء",
        body: "تُحذف جميع البيانات الشخصية وقواعد بيانات المشاريع نهائياً، مع الاحتفاظ فقط بالسجلات المحاسبية والامتثالية التي يفرضها القانون لفترات محددة.",
      },
    ],
  },
  {
    id: "law",
    number: "08",
    title: "القانون الحاكم وفض النزاعات",
    icon: Scale,
    highlight: "أولوية الحلول الودية والوساطة المؤسسية، مع الامتثال للأنظمة الرقمية المعتمدة.",
    clauses: [
      {
        code: "8.1",
        title: "المرجعية التنظيمية",
        body: "تخضع هذه الاتفاقية وتُفسر وفق الأنظمة والقوانين المنظمة للتعاملات الإلكترونية وحماية البيانات الرقمية والتجارة الإلكترونية المعمول بها.",
        mandatory: true,
      },
      {
        code: "8.2",
        title: "التسوية الودية والوساطة",
        body: "في حال نشوء أي خلاف، يلتزم الطرفان بالسعي لتسويته ودياً عبر التواصل المباشر مع الفريق القانوني لـ JEMO LABS خلال فترة لا تقل عن 30 يوماً.",
        mandatory: true,
      },
      {
        code: "8.3",
        title: "تحديث الشروط وإخطار المستخدمين",
        body: "تُنشر التعديلات على هذه الصفحة مع تحديث تاريخ السريان، ويعد استمرار استخدامك للمنصة بعد الإشعار موافقة على البنود المعدلة.",
      },
    ],
  },
];

const FAQS = [
  {
    q: "هل تحتفظ JEMO LABS بأي حقوق ملكية في الأكواد أو النماذج التي أنشئها؟",
    a: "لا على الإطلاق. كل ما تقوم بابتكاره وتطويره عبر منصاتنا يظل ملكك الفكري الحصري والكامل بنسبة 100% دون أي ادعاء منا بالملكية أو الاستخدام التجاري دون موافقتك.",
  },
  {
    q: "هل يمكنني تصدير أو طلب حذف كامل بياناتي من الخوادم؟",
    a: "نعم، يمكنك في أي وقت تصدير كافة مشاريعك بصيغة معيارية (JSON/ZIP) أو طلب الحذف النهائي لجميع سجلاتك وحسابك خلال 72 ساعة عمل وفق متطلبات اللائحة العامة لحماية البيانات (GDPR).",
  },
  {
    q: "ما هي آلية استرجاع الأموال للباقات والخدمات المدفوعة؟",
    a: "نقدم ضمان استرجاع كامل للمبلغ بنسبة 100% خلال 14 يوماً من تاريخ الاشتراك الأول في حال لم تلبي الخدمة تطلعاتك، بدون أي إجراءات أو أسئلة معقدة.",
  },
  {
    q: "كيف يتم إبلاغ المستخدمين في حال تعديل الشروط والسياسات؟",
    a: "نقوم بإرسال إشعار مباشر عبر البريد الإلكتروني المسجل في حسابك بالإضافة إلى تنبيه بارز في واجهة المنصة قبل سريان الشروط الجديدة بـ 14 يوماً على الأقل.",
  },
];

const KEY_PILLARS = [
  {
    icon: Sparkles,
    badge: "100% Ownership",
    title: "الملكية الفكرية الكاملة",
    desc: "أبحاثك، شفراتك المصدرية، ونماذجك ملكك الخاص بالكامل دون أدنى ادعاء بالملكية من طرفنا.",
  },
  {
    icon: Lock,
    badge: "AES-256 / TLS 1.3",
    title: "خصوصية وتشفير صارم",
    desc: "تشفير شامل للبيانات وحظر كامل للمشاركة أو الاستهداف الإعلاني مع امتثال كامل لـ GDPR.",
  },
  {
    icon: Server,
    badge: "99.9% Uptime",
    title: "اعتمادية البنية التحتية",
    desc: "اتفاقية مستوى خدمة موثوقة تضمن توافر المنصات مع تنبيهات استباقية لأي أعمال صيانة.",
  },
  {
    icon: HeartHandshake,
    badge: "14-Day Guarantee",
    title: "ضمان الاسترجاع المرن",
    desc: "إمكانية إلغاء الاشتراك واسترداد كامل الرسوم خلال 14 يوماً من الاشتراك الأول بكل يسر.",
  },
];

export default function TermsPage() {
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
              <span>الوثائق الرسمية والحوكمة المؤسسية</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--ink-1)] leading-tight">
              الشروط والأحكام والسياسات العامة
            </h1>

            <p className="text-base sm:text-lg text-[var(--ink-2)] leading-relaxed font-normal">
              إطار تنظيمي شفاف يحدد التزاماتنا المتبادلة، يحمي ملكيتك الفكرية الكاملة،
              ويضمن أعلى معايير الخصوصية والأمان لأبحاثك في JEMO LABS.
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

          {/* Key Guarantees Highlights Grid */}
          <section
            aria-label="الضمانات الأساسية"
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

          {/* Main Layout: Sticky Sidebar Navigation + Detailed Clauses */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Sidebar Table of Contents */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <nav
                aria-label="فهرس البنود"
                className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                  <h3 className="font-bold text-sm text-[var(--ink-1)] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                    <span>فهرس الأقسام والبنود</span>
                  </h3>
                  <span className="text-[11px] font-mono text-[var(--ink-2)]">
                    8 بنود قانونية
                  </span>
                </div>

                <ol className="space-y-1.5 text-xs">
                  {SECTIONS.map((sec) => (
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
                      href="#contact"
                      className="flex items-center justify-between p-2 rounded-lg text-[var(--ink-2)] hover:text-[var(--ink-1)] hover:bg-[var(--bg)] transition-colors group"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="font-mono text-[10px] font-semibold text-[var(--ink-2)] group-hover:text-[var(--accent)]">
                          10
                        </span>
                        <span>الاستفسارات القانونية</span>
                      </span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </a>
                  </li>
                </ol>
              </nav>

              {/* Legal Officer Contact Widget */}
              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--ink-1)]">
                  <Mail className="w-4 h-4 text-[var(--accent)]" />
                  <span>المسؤول القانوني وحماية البيانات</span>
                </div>
                <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                  لأي استفسارات بخصوص اتفاقيات مستوى الخدمة، عقود المشاريع الخاصة، أو طلبات الامتثال وحذف البيانات:
                </p>
                <a
                  href="mailto:legal@jemo.co"
                  className="inline-flex items-center justify-center w-full gap-2 px-3 py-2 rounded-lg bg-[var(--bg)] hover:bg-[var(--line)] border border-[var(--line)] text-xs font-mono font-medium text-[var(--ink-1)] transition-colors"
                >
                  <span>legal@jemo.co</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </aside>

            {/* Detailed Clauses Content */}
            <div className="lg:col-span-8 space-y-12 sm:space-y-16">
              {SECTIONS.map((section) => {
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
                          <span>البند</span>
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
                                بند إلزامي
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
                      الأسئلة الشائعة حول الشروط والأحكام
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

              {/* Legal Inquiry Contact Card */}
              <section
                id="contact"
                className="scroll-mt-28 p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)]">
                    <span>قناة التواصل المباشرة</span>
                    <span>•</span>
                    <span>SECTION 10</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink-1)]">
                    هل لديك استفسار قانوني خاص أو اتفاقية مؤسسية؟
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                    فريق الشؤون القانونية وحوكمة البيانات في JEMO LABS متاح للإجابة عن متطلبات الامتثال،
                    صياغة مذكرات التفاهم المخصصة للجامعات والمراكز البحثية، وتنسيق بنود الأمان.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <a
                    href="mailto:legal@jemo.co"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--ink-1)] text-[var(--surface)] text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Mail className="w-4 h-4" />
                    <span>تواصل مع الفريق القانوني: legal@jemo.co</span>
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-1)] text-xs sm:text-sm font-semibold hover:bg-[var(--line)] transition-colors"
                  >
                    <span>نموذج الاتصال العام</span>
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
