"use client";

import { useState } from "react";
import Link from "next/link";
import ProcedureChecklist from "@/components/iq/ProcedureChecklist";
import {
  BookOpen,
  Star,
  ThumbsUp,
  ThumbsDown,
  Search,
  Share2,
  ChevronDown,
  Check,
  ExternalLink,
  AlertTriangle,
  Clock,
  Wallet
} from "lucide-react";

type PostType = "guide" | "review" | "price" | "alert";

interface IntelPost {
  id: string;
  type: PostType;
  typeLabel: string;
  badgeColor: string;
  title: string;
  content: string;
  district: string;
  authorAlias: string;
  date: string;
  trustedCount: number;
  unreliableCount: number;
  rating?: number;
  placeName?: string;
}

type Guide = {
  id: string;
  title: string;
  fees: string;
  time: string;
  portalLink?: string;
  portalName?: string;
  documents: string[];
  steps: string[];
  tips: string[];
};

const OFFICIAL_GUIDES: Guide[] = [
  {
    id: "g1",
    title: "استخراج الجواز الإلكتروني",
    fees: "91,000 دينار عراقي",
    time: "يوم واحد إلى 3 أيام",
    portalLink: "https://ur.gov.iq",
    portalName: "بوابة أور - حجز الجواز الإلكتروني",
    documents: [
      "البطاقة الوطنية الموحدة (أصلية)",
      "جواز السفر القديم (إن وجد)",
      "بطاقة الدفع الإلكتروني (ماستر كارد / زين كاش)"
    ],
    steps: [
      "الدخول إلى بوابة أور وتعبئة الاستمارة الإلكترونية.",
      "تسديد الرسوم (91,000 دينار) عبر الدفع الإلكتروني وتجنب المكاتب الأهلية.",
      "حجز موعد إلكتروني واختيار مركز الإصدار الأقرب لك.",
      "مراجعة الدائرة في الموعد المحدد لأخذ البصمة والصورة الحية (لا داعي لجلب صور شخصية).",
      "استلام الجواز من نفس الدائرة بعد إنجاز المعاملة."
    ],
    tips: [
      "نصيحة مجربة: احجز الموعد في الصباح الباكر لتجنب الزخم.",
      "احذر من المعقبين الذين يطلبون مبالغ إضافية بحجة 'تسريع المعاملة'، التصوير والدفع كلها فورية ورسمية."
    ]
  },
  {
    id: "g2",
    title: "البطاقة الوطنية الموحدة",
    fees: "5,000 دينار عراقي",
    time: "أسبوع إلى أسبوعين",
    portalLink: "https://ur.gov.iq",
    portalName: "بوابة أور - الحجز الإلكتروني",
    documents: [
      "هوية الأحوال المدنية الأصلية",
      "شهادة الجنسية العراقية",
      "بطاقة السكن",
      "صور شخصية حديثة بخلفية بيضاء (حسب متطلبات بعض الدوائر)"
    ],
    steps: [
      "الحجز الإلكتروني المسبق عبر بوابة أور.",
      "سحب استمارة الحجز مع الباركود.",
      "مراجعة دائرة أحوالك المدنية في يوم الموعد.",
      "تسديد الرسوم البالغة 5,000 دينار حصراً عبر الدفع الإلكتروني.",
      "إجراء التبصيم والتصوير واستلام وصل المراجعة.",
      "استلام البطاقة في الموعد المحدد في الوصل."
    ],
    tips: [
      "نصيحة: تأكد من تطابق بياناتك في الاستمارة مع مستمسكاتك الورقية قبل الحفظ.",
      "المعقبين يبيعون استمارات مجانية بمبالغ عالية، الاستمارة مجانية على بوابة أور."
    ]
  },
  {
    id: "g3",
    title: "تحويل ملكية سيارة وإجازة السوق",
    fees: "حسب الموديل والمحرك (متوسط 150-300 ألف دينار)",
    time: "يوم واحد (في حال عدم وجود غرامات)",
    documents: [
      "السنوية الأصلية للمركبة",
      "البطاقة الوطنية للبائع والمشتري",
      "عقد بيع وشراء مروري معتمد",
      "براءة ذمة من الغرامات"
    ],
    steps: [
      "دفع الغرامات المرورية (إن وجدت) عبر بوابة أور أو في قاطع المرور.",
      "إجراء فحص الهزة (الفحص الفني للمركبة) في مواقع المرور.",
      "عمل عقد بيع وشراء إلكتروني في المكاتب المعتمدة أو مديرية المرور.",
      "دفع الرسوم عبر نقاط الدفع الإلكتروني (POS) في المرور.",
      "طباعة السنوية الجديدة باسم المشتري."
    ],
    tips: [
      "لا تدفع نقد للمرور، كل المعاملات الآن عبر بطاقات الدفع الإلكتروني.",
      "افحص السيارة وتأكد من سلامة الرقم الشاصي قبل البدء بالمعاملة لتجنب المساءلة."
    ]
  },
  {
    id: "g4",
    title: "فتح حساب بنكي وربط بطاقة ماستر كارد / زين كاش",
    fees: "مجاناً (قد يتطلب إيداع أولي 15-25 ألف دينار)",
    time: "فوري إلى 48 ساعة",
    documents: [
      "البطاقة الوطنية الموحدة",
      "بطاقة السكن",
      "جواز السفر (لبعض البنوك الدولية)"
    ],
    steps: [
      "اختيار البنك المعتمد (مثل الطيف، الرافدين، TBI، أو زين كاش للمحافظ الإلكترونية).",
      "ملء استمارة اعرف عميلك (KYC) في الفرع أو عبر التطبيق (للمحافظ).",
      "إيداع المبلغ الأولي المطلوب لتفعيل الحساب.",
      "استلام البطاقة وتفعيلها عبر تطبيق البنك.",
      "تغيير الرمز السري من الصراف الآلي."
    ],
    tips: [
      "تأكد من تفعيل خدمة الشراء عبر الإنترنت (E-commerce) من تطبيق البنك إذا أردت استخدامها للمنصات.",
      "زين كاش أسرع للمدفوعات اليومية المحلية، البنوك أفضل للرواتب والتحويلات الدولية."
    ]
  },
  {
    id: "g5",
    title: "تأسيس مشروع أو محل تجاري",
    fees: "تختلف حسب النشاط والمساحة (200 ألف - 1 مليون دينار)",
    time: "أسبوعين إلى شهر",
    documents: [
      "البطاقة الوطنية وصور شخصية",
      "عقد إيجار المحل مصدق",
      "خريطة موقع المحل",
      "براءة ذمة من الضريبة"
    ],
    steps: [
      "مراجعة البلدية للحصول على إجازة ممارسة المهنة.",
      "تسجيل الاسم التجاري في غرفة التجارة (إذا تطلب النشاط ذلك).",
      "الحصول على موافقة الدفاع المدني (توفير مطافئ حريق وشروط السلامة).",
      "التسجيل في الهيئة العامة للضرائب وفتح ملف ضريبي.",
      "استخراج الإجازات الصحية (للمطاعم والمقاهي)."
    ],
    tips: [
      "إياك أن تتجاهل موافقة الدفاع المدني، فهي الأولى بالإغلاق أثناء حملات التفتيش.",
      "استعن بمحامي لتأسيس الشركات، أما المحلات الفردية فمعاملاتها أبسط ويمكنك إنجازها بنفسك."
    ]
  }
];

const POSTS: IntelPost[] = [
  {
    id: "post-1",
    type: "guide",
    typeLabel: "دليل معاملة رسمية",
    badgeColor: "bg-purple-900/30 text-purple-400 border-purple-800/50",
    title: "خطوات تجديد الجواز الإلكتروني في دائرة الكرخ بدون معقب — تحديث آذار 2026",
    content:
      "1. ادخل بوابة أور وسدد الرسوم إلكترونياً عبر زين كاش أو الماستر (25 ألف دينار ولا تدفع أكثر بالمكاتب الخارجية). 2. احجز موعد الصباح قبل الساعة 10. 3. خذ البطاقة الوطنية الأصلية والجواز القديم فقط، لا يحتاج صور ملونة لأن التصوير فوري بالدائرة. استلمت الجواز خلال ساعتين ونصف فقط.",
    district: "بغداد — الكرخ",
    authorAlias: "مواطن_رقمي_94",
    date: "اليوم",
    trustedCount: 142,
    unreliableCount: 3,
  },
  {
    id: "post-2",
    type: "review",
    typeLabel: "تقييم مكان موثق",
    badgeColor: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50",
    title: "تجربة ورشة المهندس لتصليح السبالت في حي الجامعة",
    content:
      "السبلت كان يفصل كومبريسر بعد الظهر، صاحب الورشة فحص القطعة واكتشف عطل كبستر بسيط وكلف 15 ألف دينار فقط، بينما مصلح ثاني طلب 120 ألف وقال الكومبريسر محروق. رجل ثقة وموجود بخريطة هسه.",
    district: "بغداد — حي الجامعة",
    authorAlias: "أبو_يوسف_البغدادي",
    date: "أمس",
    trustedCount: 88,
    unreliableCount: 1,
    rating: 5.0,
    placeName: "ورشة المهندس لتصليح السبالت",
  },
  {
    id: "post-3",
    type: "price",
    typeLabel: "سعر محلي مشاهد",
    badgeColor: "bg-amber-900/30 text-amber-400 border-amber-800/50",
    title: "تسعيرة أمبير المولد في الدورة لشهر آذار 2026",
    content:
      "مولد فرعنا في شارع 60 فرض 16 ألف للأمبير للخط الذهبي، بعد شكوى المختار ومركز الشرطة نزل السعر للـ 13 ألف الرسمي مع تشغيل 24 ساعة. لا تدفعون أكثر من التسعيرة المحددة من المحافظة.",
    district: "بغداد — الدورة",
    authorAlias: "مهندس_كهرباء_عراقي",
    date: "قبل يومين",
    trustedCount: 65,
    unreliableCount: 2,
  },
  {
    id: "post-4",
    type: "alert",
    typeLabel: "تنبيه محلي مؤقت",
    badgeColor: "bg-rose-900/30 text-rose-400 border-rose-800/50",
    title: "تحويلة مرورية مؤقتة قرب ساحة النسور بسبب أعمال الصيانة",
    content:
      "المرور حوّلوا المسار القادم من دمشق باتجاه حي الكندي عبر النفق السفلي. تجنبوا الزخم بالذروة الصباحية واسلكوا طريق القادسية البديل.",
    district: "بغداد — ساحة النسور",
    authorAlias: "متابع_الطرق",
    date: "قبل 5 ساعات",
    trustedCount: 114,
    unreliableCount: 0,
  },
];

function GuideAccordion({ guide }: { guide: Guide }) {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});

  const toggleDoc = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedDocs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="bg-white border border-[#e4e3e3] rounded-2xl overflow-hidden shadow-xs transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-right cursor-pointer hover:bg-[#f7f7f5] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#cef79e] text-[#222f30] flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-[#222f30]" />
          </div>
          <h2 className="font-kufi font-bold text-[#222f30] text-sm sm:text-base">
            {guide.title}
          </h2>
        </div>
        <ChevronDown className={`w-5 h-5 text-[#55696a] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 pt-0 border-t border-[#e4e3e3] space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
          
          <div className="flex flex-wrap gap-3 mt-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 bg-[#f7f7f5] px-3 py-1.5 rounded-lg border border-[#e4e3e3]">
              <Wallet className="w-3.5 h-3.5 text-[#728825]" />
              <span className="text-[#222f30]">الرسوم: {guide.fees}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f7f7f5] px-3 py-1.5 rounded-lg border border-[#e4e3e3]">
              <Clock className="w-3.5 h-3.5 text-[#728825]" />
              <span className="text-[#222f30]">الوقت: {guide.time}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#222f30] font-kufi flex items-center gap-2">
              <Check className="w-4 h-4 text-[#728825]" />
              المستمسكات المطلوبة (جهزها)
            </h3>
            <ul className="space-y-1.5">
              {guide.documents.map((doc, idx) => (
                <li 
                  key={idx} 
                  onClick={(e) => toggleDoc(idx, e)}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#f7f7f5] cursor-pointer transition-colors group"
                >
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    checkedDocs[idx] 
                      ? "bg-[#222f30] border-[#222f30] text-[#cef79e]" 
                      : "border-[#e4e3e3] group-hover:border-[#728825]"
                  }`}>
                    {checkedDocs[idx] && <Check className="w-3 h-3" strokeWidth={3} />}
                  </div>
                  <span className={`text-sm font-sans transition-colors ${
                    checkedDocs[idx] ? "text-[#55696a]/50 line-through" : "text-[#222f30]"
                  }`}>
                    {doc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#222f30] font-kufi">خطوات المعاملة</h3>
            <div className="space-y-2 pl-2">
              {guide.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3 text-sm font-sans text-[#222f30]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#222f30] text-[#cef79e] flex items-center justify-center text-[10px] font-mono mt-0.5 font-bold">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 space-y-2 text-sm font-sans text-amber-900">
            <h4 className="font-bold flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              نصائح مجربة لتجنب المعقبين والابتزاز
            </h4>
            <ul className="list-disc list-inside space-y-1 pr-2 text-xs sm:text-sm text-amber-800/90 leading-relaxed">
              {guide.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>

          {guide.portalLink && (
            <div className="pt-2">
              <a 
                href={guide.portalLink} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#222f30] hover:bg-[#162021] text-[#cef79e] font-bold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-xs"
              >
                {guide.portalName}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function IqIntelPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("الكل");
  const [search, setSearch] = useState<string>("");
  const [posts, setPosts] = useState<IntelPost[]>(POSTS);

  const handleVote = (id: string, isUp: boolean) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            trustedCount: isUp ? p.trustedCount + 1 : p.trustedCount,
            unreliableCount: !isUp ? p.unreliableCount + 1 : p.unreliableCount,
          };
        }
        return p;
      })
    );
  };

  const filteredPosts = posts.filter((p) => {
    const matchType =
      selectedFilter === "الكل" ||
      (selectedFilter === "معاملات" && p.type === "guide") ||
      (selectedFilter === "تقييمات" && p.type === "review") ||
      (selectedFilter === "أسعار" && p.type === "price") ||
      (selectedFilter === "تنبيهات" && p.type === "alert");

    const matchSearch =
      search === "" ||
      p.title.includes(search) ||
      p.content.includes(search) ||
      p.district.includes(search);

    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8" dir="rtl">
      {/* 1. Header Banner */}
      <section className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[#55696a]">
          <BookOpen className="w-4 h-4 text-[#728825]" />
          <span className="font-bold text-[#222f30]">الباب الثالث · مجتمع الخبرة والأدلة الحية</span>
          <span>·</span>
          <span>معلومات لا يوميات</span>
        </div>
        <h1 className="text-lg sm:text-xl font-kufi font-black text-[#222f30] tracking-tight">
          أدلة المعاملات، تقييمات الأماكن، والأسعار الواقعية.
        </h1>
        <p className="text-xs sm:text-sm text-[#55696a] leading-relaxed font-sans max-w-3xl">
          لا مكان للصور الشخصية أو السوالف الفارغة. هنا تجارب عملية تمنع أن تُنصب عليك، تشرح لك كيف تخلص معاملتك، وتوثق جودة المحلات المسجلة بالخريطة.
        </p>
      </section>

      {/* 2. Interactive Bureaucracy Checklist Builder */}
      <ProcedureChecklist />

      {/* 3. Official Guides Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-kufi font-bold text-[#222f30] px-1">الأدلة الرسمية المعتمدة والمعاملات</h2>
        <div className="space-y-3">
          {OFFICIAL_GUIDES.map(guide => (
            <GuideAccordion key={guide.id} guide={guide} />
          ))}
        </div>
      </section>

      <hr className="border-[#e4e3e3]" />

      {/* 4. Filters Toolbar */}
      <section className="space-y-4">
        <h2 className="text-lg font-kufi font-bold text-[#222f30] px-1">مشاركات المجتمع الحية</h2>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في الأدلة (مثلاً: جواز، بطاقة، سبلت، غرامات، الكرادة)..."
            className="w-full h-11 pr-10 pl-4 bg-white border border-[#e4e3e3] focus:border-[#a7e26e] rounded-xl text-[#222f30] font-sans text-xs sm:text-sm outline-none shadow-xs transition-colors placeholder-[#55696a]/50"
          />
          <Search className="w-4 h-4 text-[#55696a] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Type Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs font-mono">
          {[
            { id: "الكل", label: "كل المشاركات" },
            { id: "معاملات", label: "أدلة المعاملات الحكومية" },
            { id: "تقييمات", label: "تقييمات الأماكن والشركات" },
            { id: "أسعار", label: "أسعار مشاهدة (مولد/غاز)" },
            { id: "تنبيهات", label: "تنبيهات الطرق والخدمات" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                selectedFilter === tab.id
                  ? "bg-[#222f30] text-white font-bold shadow-xs"
                  : "bg-white text-[#55696a] hover:bg-[#f0f2f0] hover:text-[#222f30] border border-[#e4e3e3]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* 5. Posts Stream */}

      {/* 4. Posts Stream */}
      <section className="space-y-4">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e4e3e3] hover:border-[#a7e26e] hover:shadow-sm transition-all space-y-3 shadow-xs"
          >
            {/* Header: Tag + District + Date */}
            <div className="flex items-center justify-between gap-2 text-[11px] font-mono flex-wrap">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-md border font-semibold ${post.badgeColor}`}
                >
                  {post.typeLabel}
                </span>
                <span className="text-[#55696a]">{post.district}</span>
                {post.rating && (
                  <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {post.rating}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[#55696a]">
                <span>بواسطة: {post.authorAlias}</span>
                <span>·</span>
                <span>{post.date}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-kufi font-bold text-base sm:text-lg text-[#222f30] leading-snug">
              {post.title}
            </h3>

            {/* Content body */}
            <p className="text-xs sm:text-sm text-[#222f30] leading-relaxed font-sans bg-[#f7f7f5] p-3.5 rounded-xl border border-[#e4e3e3]">
              {post.content}
            </p>

            {/* Place Link if Review */}
            {post.placeName && (
              <div className="text-xs font-mono pt-1">
                <Link
                  href="/iq/map"
                  className="inline-flex items-center gap-1 text-[#728825] font-bold hover:underline"
                >
                  <span>عرض بطاقة المحل في الخريطة ({post.placeName})</span>
                  <span>←</span>
                </Link>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-[#e4e3e3] flex items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                {/* Trusted Vote Button */}
                <button
                  onClick={() => handleVote(post.id, true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer font-bold"
                  title="أؤكد هذه المعلومة / جربتها بنفسي"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>معلومة موثوقة ({post.trustedCount})</span>
                </button>

                {/* Unreliable Vote Button */}
                <button
                  onClick={() => handleVote(post.id, false)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f7f7f5] hover:bg-[#f0f2f0] text-[#55696a] hover:text-rose-700 border border-[#e4e3e3] transition-colors cursor-pointer"
                  title="المعلومة غير دقيقة أو قديمة"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>غير دقيق ({post.unreliableCount})</span>
                </button>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText?.(window.location.href);
                  alert("تم نسخ رابط الدليل للمشاركة على واتساب!");
                }}
                className="inline-flex items-center gap-1 text-[#55696a] hover:text-[#222f30] transition-colors cursor-pointer"
                title="مشاركة الدليل"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">مشاركة</span>
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
