/**
 * Iraqi Social Knowledge Hub Data & Types (دليل وتجارب هسه)
 * "أظهر عقلي لا وجهي — منصة المعرفة والتجارب العراقية"
 */

export type IntelPostCategory = "place_review" | "local_intel" | "ai_research" | "anonymous_ask" | "procedure";

export interface IntelComment {
  id: string;
  authorName: string;
  authorBadge?: string;
  isAnonymous: boolean;
  isIraqiEmailVerified?: boolean;
  date: string;
  content: string;
  likesCount: number;
}

export interface IntelSocialPost {
  id: string;
  category: IntelPostCategory;
  categoryLabel: string;
  badgeBg: string;
  badgeText: string;
  title: string;
  content: string;
  governorate: string;
  district?: string;
  authorName: string;
  authorHandle?: string;
  authorAvatar?: string;
  authorBadge?: string;
  isAnonymous: boolean;
  isIraqiEmailVerified?: boolean;
  date: string;
  upvotesCount: number;
  repostsCount: number;
  commentsCount: number;
  viewsCount: string;
  comments: IntelComment[];
  rating?: number; // For restaurant / place reviews
  placeName?: string;
  aiToolsUsed?: string[]; // For AI mini-research
  methodology?: string;
  tags: string[];
}

export interface IraqiTrendingTopic {
  id: string;
  category: string;
  tag: string;
  postsCount: string;
}

export const IRAQI_TRENDING: IraqiTrendingTopic[] = [
  { id: "t1", category: "سوق وعملة · متداول", tag: "الدولار_اليوم", postsCount: "٢.٤ ألف" },
  { id: "t2", category: "طاقة وكهرباء · بغداد", tag: "سبالت_الإنفرتر", postsCount: "١.١ ألف" },
  { id: "t3", category: "معاملات حكومية · شائع", tag: "الجواز_الإلكتروني", postsCount: "٣.٢ ألف" },
  { id: "t4", category: "مطاعم وتجارب · الكرادة", tag: "كباب_أبو_حيدر", postsCount: "٨٤٠" },
  { id: "t5", category: "تقنية واتصالات · البصرة", tag: "إنترنت_الألياف", postsCount: "٦٥٠" },
];

export interface SuggestedIraqiUser {
  id: string;
  name: string;
  handle: string;
  badge: string;
  bio: string;
  isVerified: boolean;
}

export const SUGGESTED_USERS: SuggestedIraqiUser[] = [
  {
    id: "u1",
    name: "م. سنان العبيدي",
    handle: "sinan_tech",
    badge: "موثق ببريد وطني 🇮🇶",
    bio: "أبحاث الطاقة والذكاء الاصطناعي في بغداد",
    isVerified: true,
  },
  {
    id: "u2",
    name: "ذواق بغدادي",
    handle: "baghdad_food",
    badge: "ناقد مطاعم مستقل",
    bio: "تقييمات حقيقية للأكل الشعبي بدون إعلانات",
    isVerified: true,
  },
  {
    id: "u3",
    name: "دليل المعاملات الحي",
    handle: "iq_procedures",
    badge: "مواطن رقمي",
    bio: "خطوات المعاملات الرسمية بدون معقبين",
    isVerified: true,
  },
];
// ponytail: only sovereign Iraqi domains earn the verified 🇮🇶 badge; Gmail/etc must NOT.
const IRAQI_EMAIL_DOMAINS = ["@jemo.co", "@iraq.iq"];
export function isIraqiEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  if (!e.includes("@") || e.startsWith("@") || e.endsWith("@")) return false;
  return IRAQI_EMAIL_DOMAINS.some((d) => e.endsWith(d));
}

export const SEEDED_INTEL_POSTS: IntelSocialPost[] = [
  {
    id: "post-ai-1",
    category: "ai_research",
    categoryLabel: "بحث بالذكاء الاصطناعي",
    badgeBg: "bg-emerald-50 border-emerald-300",
    badgeText: "text-emerald-800",
    title: "تحليل استهلاك الطاقة لسبالت الإنفرتر بالعراق باستخدام نماذج التنبؤ الحراري",
    content:
      "قمت بمقارنة بيانات استهلاك 4 أجهزة سبلت إنفرتر (2 طن) داخل بيت بغدادي خلال شهر تموز بحرارة 48 مئوية باستخدام Claude وPython. النتيجة: التوفير الحقيقي بالكهرباء الوطنية والمولد يبلغ 38% بشرط ضبط العزل والحرارة على 24 وليس 18.",
    governorate: "بغداد",
    district: "اليرموك",
    authorName: "م. سنان العبيدي",
    authorHandle: "sinan_tech",
    authorAvatar: "س",
    repostsCount: 38,
    viewsCount: "١٢.٤ ألف",
    isAnonymous: false,
    isIraqiEmailVerified: true,
    date: "قبل ساعتين",
    upvotesCount: 184,
    commentsCount: 26,
    aiToolsUsed: ["Claude 3.7 Sonnet", "Python / NumPy", "حساسات Shelly"],
    methodology: "جمع قراءات 30 يوم من عداد ذكي ومطابقتها مع توقعات النموذج اللغوي لمعادلة الحمل الحراري.",
    tags: ["ذكاء_اصطناعي", "طاقة", "سبالت", "إنفرتر"],
    comments: [
      {
        id: "c-1",
        authorName: "عراقي_تقني",
        isAnonymous: false,
        isIraqiEmailVerified: true,
        date: "قبل ساعة",
        content: "تجربة ممتازة وواقعية جداً، أغلب الناس تضبط على 16 ويشتكون من عدم التوفير لأن الكومبريسر ما يفصل.",
        likesCount: 19,
      },
      {
        id: "c-2",
        authorName: "مجهول #491",
        isAnonymous: true,
        date: "قبل 45 دقيقة",
        content: "ممكن رابط شفرة التحليل أو الجدول؟ يفيدنا بمشروع التخرج بهندسة بغداد.",
        likesCount: 8,
      },
    ],
  },
  {
    id: "post-rev-1",
    category: "place_review",
    categoryLabel: "تقييم وتجربة مكان",
    badgeBg: "bg-amber-50 border-amber-300",
    badgeText: "text-amber-800",
    title: "مطعم كباب أبو حيدر في الكرادة: الجودة الحقيقية وسر اللحم البلدي",
    content:
      "بعيداً عن إعلانات المؤثرين المدفوعة بالإنستغرام: الكباب عراقي بلدي 100% بدون دهن مستورد ولا خلط فول صويا. السعر 14 ألف للنفر مع المقبلات والخبز الحار من الفرن. الخدمة سريعة جداً وماكو تأخير حتى بوقت ذروة الغداء.",
    governorate: "بغداد",
    district: "الكرادة داخل",
    authorName: "ذواق بغدادي",
    authorHandle: "baghdad_food",
    authorAvatar: "ذ",
    isAnonymous: false,
    isIraqiEmailVerified: true,
    date: "اليوم 01:30 م",
    upvotesCount: 142,
    repostsCount: 29,
    viewsCount: "٨.٦ ألف",
    commentsCount: 18,
    rating: 4.9,
    placeName: "كباب أبو حيدر — الكرادة",
    tags: ["مطاعم", "كباب", "الكرادة", "تجربة_حقيقية"],
    comments: [
      {
        id: "c-3",
        authorName: "أحمد الفراتي",
        isAnonymous: false,
        isIraqiEmailVerified: true,
        date: "قبل 30 دقيقة",
        content: "أؤيدك 100%، هذا المطعم أتعامل معه من 2018 وثابت على جودته وما غير اللحم بعد صعود الأسعار.",
        likesCount: 14,
      },
    ],
  },
  {
    id: "post-anon-1",
    category: "anonymous_ask",
    categoryLabel: "سؤال مجهول · Tellonym",
    badgeBg: "bg-sky-50 border-sky-300",
    badgeText: "text-sky-800",
    title: "سؤال لموظفي المصارف: شنو أحسن ماستر كارد عراقي للسفر والدفع أونلاين بدون عمولات مخفية؟",
    content:
      "أريد أسافر قريباً وأحتاج بطاقة ماستر أو فيزا أودع بيها بالدينار العراقي وتسحب دولار برة بدون فرق تصريف جائر أو عمولة استقطاع مبالغ بيها. جربت بطاقة مصرف معين وقطعوا 6% فرق صرف!",
    governorate: "كل العراق",
    authorName: "عراقي مجهول",
    authorHandle: "anon_iq_492",
    authorAvatar: "🎭",
    authorBadge: "أظهر عقلي لا وجهي 🎭",
    isAnonymous: true,
    date: "قبل 4 ساعات",
    upvotesCount: 96,
    repostsCount: 14,
    viewsCount: "٥.١ ألف",
    commentsCount: 31,
    tags: ["اسأل_العراقيين", "بنوك", "ماستر_كارد", "سفر"],
    comments: [
      {
        id: "c-4",
        authorName: "موظف_مصرف_TBI",
        authorBadge: "موثق ببريد عراقي",
        isAnonymous: false,
        isIraqiEmailVerified: true,
        date: "قبل ساعتين",
        content: "بطاقات المحافظ مثل زين كاش ممتازة للمبالغ الصغيرة، لكن للمبالغ الأكبر فيزا بنك TBI أو الطيف الصرف بيها يتم بالسعر الرسمي للبنك المركزي بدون عمولة وسيط إضافية.",
        likesCount: 42,
      },
    ],
  },
  {
    id: "post-proc-1",
    category: "procedure",
    categoryLabel: "دليل معاملة حية",
    badgeBg: "bg-purple-50 border-purple-300",
    badgeText: "text-purple-800",
    title: "خطوات تجديد إجازة السوق الخصوصي في موقع الكندي بدون أي معقب",
    content:
      "1. الفحص الطبي في مستوصف العلوية (15 ألف). 2. الحجز على استمارة المرور من النت وطباعتها مجاناً. 3. الفحص النظري وإشارة المرور بالساحة. 4. تسديد الرسوم 50 ألف عبر نقطة الدفع الإلكتروني (POS). استلمت الإجازة المطبوعة بخلال 3 ساعات ونصف.",
    governorate: "بغداد",
    district: "موقع الكندي المروري",
    authorName: "عمر العاني",
    authorHandle: "omar_alani",
    authorAvatar: "ع",
    isAnonymous: false,
    isIraqiEmailVerified: true,
    date: "أمس",
    upvotesCount: 167,
    repostsCount: 45,
    viewsCount: "١٤.٢ ألف",
    commentsCount: 12,
    tags: ["إجازة_سوق", "المرور", "معاملات_حكومية", "بدون_معقب"],
    comments: [],
  },
  {
    id: "post-intel-1",
    category: "local_intel",
    categoryLabel: "معلومة وخبرة محلية",
    badgeBg: "bg-emerald-50 border-emerald-300",
    badgeText: "text-emerald-800",
    title: "معلومة لأهل البصرة: خط إنترنت الألياف الضوئية (FTTH) ومقارنة الكابينات",
    content:
      "كابينات شركة سمفوني وسيسكو في منطقة البراضعية والجبيلة سرعتها الحقيقية توصل 60 ميغابت ثابتة حتى بأوقات الذروة 9 مساءً، بينما الوايرلس ينهار بهالوقت. قبل لا تشترك اسأل عن رقم الكابينة وتأكد إنها مربوطة بالمسار السيادي.",
    governorate: "البصرة",
    district: "البراضعية / الجبيلة",
    authorName: "مهندس_شبكات_جنوبي",
    authorHandle: "basra_net",
    authorAvatar: "ب",
    isAnonymous: false,
    isIraqiEmailVerified: true,
    date: "قبل يومين",
    upvotesCount: 124,
    repostsCount: 19,
    viewsCount: "٦.٨ ألف",
    commentsCount: 15,
    tags: ["البصرة", "إنترنت", "ألياف_ضوئية", "نصيحة"],
    comments: [],
  },
];
