// Shared JEMO DISPATCH data — single source of truth for the newsletter page
// (UI client) and the /rss.xml feed route. Keep content in sync here.

export interface Issue {
  id: string;
  number: string;
  date: string;
  /** ISO date for RSS pubDate + sorting */
  isoDate: string;
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
  /** Base reaction / comment counts (user likes stack on top, persisted locally) */
  reactions: number;
  comments: number;
  githubUrl?: string;
  paperUrl?: string;
}

export const ISSUES: Issue[] = [
  {
    id: "issue-14",
    number: "العدد #14",
    date: "1 سبتمبر 2026",
    isoDate: "2026-09-01",
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
    leadAuthor: "علي حسين هادي (Jemo)",
    labName: "مختبر النوى والأنظمة التشغيلية",
    reactions: 48,
    comments: 12,
    githubUrl: "/open-source",
    paperUrl: "/research",
  },
  {
    id: "issue-13",
    number: "العدد #13",
    date: "15 أغسطس 2026",
    isoDate: "2026-08-15",
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
    leadAuthor: "علي حسين هادي (Jemo)",
    labName: "مختبر النماذج واللغويات الحاسوبية",
    reactions: 36,
    comments: 9,
    githubUrl: "/open-source",
    paperUrl: "/research",
  },
  {
    id: "issue-12",
    number: "العدد #12",
    date: "1 أغسطس 2026",
    isoDate: "2026-08-01",
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
    leadAuthor: "فريق Axiq التقني",
    labName: "مختبر البنية السحابية والموزعة",
    reactions: 27,
    comments: 6,
    githubUrl: "/open-source",
    paperUrl: "/research",
  },
  {
    id: "issue-11",
    number: "العدد #11",
    date: "15 يوليو 2026",
    isoDate: "2026-07-15",
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
    leadAuthor: "علي حسين هادي (Jemo)",
    labName: "مختبر التشفير والأمان الرقمي",
    reactions: 52,
    comments: 21,
    githubUrl: "/open-source",
    paperUrl: "/research",
  },
  {
    id: "issue-10",
    number: "العدد #10",
    date: "1 يوليو 2026",
    isoDate: "2026-07-01",
    category: "systems",
    categoryLabel: "التقرير نصف السنوي",
    title: "حصيلة الأوراق المحكمة وتقارير الأثر البحثي للنصف الأول من 2026",
    summary:
      "توثيق شامل للأوراق المنشورة، المستودعات مفتوحة المصدر، والمنح البحثية الممنوحة للجامعات والمراكز الشريكة.",
    fullAbstract:
      "تقرير داخلي يلخص أنشطة النصف الأول من عام 2026 في JEMO LABS كمختبر مستقل ناشئ.",
    methodology:
      "توثيق داخلي لأنشطة المختبر.",
    takeaways: [
      "نشر تقارير ومستودعات مفتوحة المصدر كخطوات تأسيسية.",
      "بناء سجل اكتشافات موثقة بالتحقق البشري.",
      "دعوة مفتوحة للتعاون الأكاديمي — لا شراكات موقعة بعد.",
    ],
    readTime: "14 دقيقة قراءة",
    tag: "تقرير مؤسسي",
    leadAuthor: "فريق الإشراف العلمي",
    labName: "JEMO LABS Institutional Board",
    reactions: 61,
    comments: 18,
    paperUrl: "/publications",
  },
  {
    id: "issue-09",
    number: "العدد #09",
    date: "15 يونيو 2026",
    isoDate: "2026-06-15",
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
    leadAuthor: "علي حسين هادي (Jemo)",
    labName: "مختبر النماذج واللغويات الحاسوبية",
    reactions: 33,
    comments: 7,
    githubUrl: "/open-source",
    paperUrl: "/research",
  },
];

export const BENCHMARKS = [
  { runtime: "JEMO Sovereign Kernel", throughput: 42.0, vram: 4.28, isHero: true },
  { runtime: "vLLM (Standard)", throughput: 28.5, vram: 6.95, isHero: false },
  { runtime: "llama.cpp (Metal/CUDA)", throughput: 24.2, vram: 5.12, isHero: false },
  { runtime: "Ollama Runtime", throughput: 19.8, vram: 5.8, isHero: false },
];

export const CATEGORIES = [
  { id: "all", label: "جميع الأعداد" },
  { id: "systems", label: "النوى والأنظمة" },
  { id: "ai", label: "الذكاء الاصطناعي" },
  { id: "distributed", label: "الحوسبة الموزعة" },
  { id: "security", label: "الأمان والتشفير" },
];

export const TOPICS_AVAILABLE = [
  "النوى والأنظمة السيادية",
  "الذكاء الاصطناعي العربي",
  "الحوسبة الموزعة والعتاد",
  "الأمان والحوسبة السرية",
  "أوراق المؤتمرات الدولية",
];

export const CONTRIBUTING_LABS = [
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

export const TESTIMONIALS = [
  {
    quote:
      "منصة وسجلات JEMO تقدم نموذجاً عربياً حقيقياً يربط بين هندسة النوى الدنيا وبين نماذج الذكاء الاصطناعي مع التزام صارم ببرهان العمل دون ادعاءات تسويقية.",
    author: "علي حسين هادي (Jemo)",
    title: "مطور نواة ZiqaKernel ونظام Axiq-IQ",
    affiliation: "JEMO LABS",
  },
  {
    quote:
      "الشفرات المصدرية المفتوحة والتوثيق الهندسي الدقيق لكل تجربة يمنح المطورين والشباب في العراق مرجعاً تطبيقياً ملموساً لبناء أنظمة مستقلة.",
    author: "فريق Axiq للذكاء الاصطناعي",
    title: "مبادرة شبابية تطوعية",
    affiliation: "بغداد",
  },
  {
    quote:
      "السيادة الرقمية تبدأ من فهم النواة والعتاد وإلغاء التبعية في البرمجيات الحساسة، وهذا بالضبط ما تركز عليه أبحاث ومشاريع JEMO.",
    author: "حركة ++IRAQ للسيادة التقنية",
    title: "رؤية السيادة التكنولوجية",
    affiliation: "العراق",
  },
];

export function getInitials(name: string) {
  const clean = name
    .replace(/^د\.\s*/, "")
    .replace(/^م\.\s*/, "")
    .trim();
  const parts = clean.split(/\s+/).slice(0, 2);
  return parts.map((w) => w[0]).join("");
}

export function parseMinutes(readTime: string) {
  const m = readTime.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

export function parseIssueNumber(number: string) {
  const m = number.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

/** Issues related to `issue`: same category first, then newest — max `limit`. */
export function getRelatedIssues(issue: Issue, limit = 3): Issue[] {
  const others = ISSUES.filter((i) => i.id !== issue.id);
  const sameCat = others.filter((i) => i.category === issue.category);
  const rest = others
    .filter((i) => i.category !== issue.category)
    .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));
  return [...sameCat, ...rest].slice(0, limit);
}

export function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
