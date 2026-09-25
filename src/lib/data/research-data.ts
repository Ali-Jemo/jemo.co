export interface ResearchResponse {
  id: string;
  type: "replication" | "challenge" | "evidence" | "correction" | "extension";
  author: string;
  date: string;
  content: string;
  verified?: boolean;
}

export interface Paper {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  abstract: string;
  authors: { name: string; slug: string; role?: string }[];
  publishDate: string;
  /** Persistent lab identifier, e.g. jemo:2026-08-019. Replaces fake Elsevier DOIs. */
  jemoId?: string;
  pdfUrl: string;
  datasetUrl?: string;
  codeUrl?: string;
  field: string;
  labSlug: string;
  keywords: string[];
  citation: {
    bibtex: string;
    apa: string;
  };
  featured?: boolean;
  // Research Object Structured Extensions
  researchType?: "Experiment" | "Quick Investigation" | "Full Research" | "Research Note" | "Discovery" | "Replication" | "Book" | "Novel";
  publicationType?: "research" | "book" | "novel";
  subtitle?: string;
  synopsis?: string;
  language?: string;
  manuscriptUrl?: string;
  tableOfContents?: string;
  rightsConfirmed?: boolean;
  evidenceStatus?: "Evidence-backed" | "Reproduced" | "Under Review" | "Disputed" | "Expert Reviewed";
  question?: string;
  toolsUsed?: string[];
  promptWorkflow?: string;
  methodology?: string;
  findings?: string;
  humanVerification?: {
    accuracyCheck: string;
    hallucinationCorrected?: string;
    confidence: "مرتفعة - تم التكرار بنجاح" | "متوسطة - قيد المراجعة" | "استكشافية / أولية";
  };
  researchTrail?: { step: string; note: string }[];
  limitations?: string;
  metrics?: {
    reproducedCount: number;
    evidenceBackedCount: number;
    disputedCount: number;
    insightfulCount: number;
  };
  lineage?: {
    replicationsCount: number;
    challengesCount: number;
    extensionsCount: number;
    forkedFrom?: string;
  };
  responses?: ResearchResponse[];
  jevEvaluation?: {
    status: "pending" | "completed" | "failed";
    rigorScore: number | null;
    rigorNormalized: number | null;
    reproducibilityProbability: number | null;
    reproducibilityPercent: number | null;
    contribution: string | null;
    isRelevant?: boolean;
    confidence: Record<string, number> | { rigor: number; contribution: number } | null;
    evaluatedAt: string;
  };
};

export type ResearchObject = Paper;
export interface OpenQuestion {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  field: string;
  status: "مفتوح للنقاش والبحث" | "قيد التجارب والتكرار" | "غير محسوم بعد" | "محلول جزئياً";
  description: string;
  researchCount: number;
  experimentsCount: number;
  replicationsCount: number;
  consensus: string;
  tags: string[];
}
export interface Project {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  fullDescription: string;
  status: "Research" | "Prototype" | "Active" | "Completed";
  team: { name: string; slug: string; role: string }[];
  techStack: string[];
  labSlug: string;
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  image: string;
  featured?: boolean;
}

export interface Lab {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  leadName: string;
  leadSlug: string;
  researchersCount: number;
  activeProjectsCount: number;
  publishedPapersCount: number;
  focusAreas: string[];
  iconName: string;
  category?: string;
}

export interface Researcher {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  labSlug: string;
  orcid?: string;
  github?: string;
  linkedin?: string;
  scholar?: string;
  website?: string;
  telegram?: string;
  email: string;
  papersCount: number;
  projectsCount: number;
}

export interface Initiative {
  id: string;
  slug: string;
  title: string;
  description: string;
  fullDescription?: string;
  vision: string;
  progress: number;
  status: "Research" | "Active" | "Scaling" | "Completed";
  lead: string;
  leadSlug?: string;
  team?: string[];
  deliverables: string[];
  milestones?: { title: string; date: string; done: boolean }[];
  link?: string;
  tags?: string[];
  image?: string;
  gallery?: string[];
}


export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: "أخبار المؤسسة" | "أخبار المشاريع" | "المؤتمرات" | "الجوائز" | "التعاونات";
  date: string;
  summary: string;
  content: string;
  image?: string;
  labSlug?: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  highlight?: boolean;
}

export interface OpenSourceRepo {
  name: string;
  description: string;
  url: string;
  license: string;
  stars: number;
  forks: number;
  language: string;
}

export interface FAQItem {
  category: "النشر العلمي" | "الانضمام" | "التمويل والمنح" | "الملكية الفكرية";
  question: string;
  answer: string;
}

export interface Partner {
  name: string;
  type: "جامعات" | "شركات" | "مؤسسات أبحاث" | "مراكز دولية";
  country: string;
  logoUrl: string;
  website: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  type: "ورشة عمل" | "ندوة علمية" | "هاكاثون" | "مؤتمر";
  description: string;
  speakers: string[];
}

export const INSTITUTION_STATS = {
  papers: 12,
  projects: 8,
  researchers: 1,
  fields: 4,
  founded: 2026,
};

export const ABOUT_INFO = {
  nameMeaning: "JEMO (علي حسين هادي) هي الطبقة الهندسية التشاركية بين السؤال والمعرفة، وبين العقل البشري والأنظمة الذكية — مساحة توثيق وحفظ الاكتشافات البرمجية وهندسة النظم.",
  whyCreated: "تأسست المنصة ومبادرات JEMO لتكون سجلاً مفتوحاً لاكتشافات وأبحاث عصر النظم والذكاء الاصطناعي: منصة لحفظ الأبحاث والاستقصاءات الهندسية، وتطوير أنظمة تشغيل سيادية ونوى مدمجة (مثل ZiqaKernel وAxiq-IQ) مع إتاحة المعرفة المفتوحة للجميع في العراق والعالم.",
  coreQuote: "السيادة التقنية هي امتلاك صلاحيات الأدمن على مستقبلنا — من النواة إلى واجهات الذكاء الاصطناعي.",
  mission: "بناء وتوثيق النظم البرمجية من طبقاتها الدنيا، ودعم البحث الهندسي الرصين، وتمكين الشباب العراقي والعربي من امتلاك زمام التكنولوجيا عبر الأنوية المفتوحة ومبادرات الذكاء الاصطناعي التطوعية.",
  vision: "أن تكون JEMO المنصة والمرجع العربي الأول في هندسة النظم، نوى التشغيل، والذكاء الاصطناعي السيادي: رصيد معرفي حي مبني على برهان العمل الصارم: توثيق آلي، ومراجعة المؤسس، ثم تحقق مجتمعي مفتوح (Proof of Work).",
  values: [
    { title: "هندسة النظم أولاً (Low-level First)", desc: "الانطلاق من العتاد، النوى، وإدارة الذاكرة الآمنة لبناء أنظمة راسخة ومستقلة." },
    { title: "التحقق البشري الصارم (Proof of Work)", desc: "تمييز واضح بين مخرجات النماذج التوليدية وبين الفحص والتصحيح البشري العملي على أرض الواقع." },
    { title: "السيادة والمعرفة المفتوحة", desc: "إتاحة الشيفرات والمصادر مجاناً للعموم لبناء مجتمع تقني عربي يصنع العلم ولا يستهلكه فقط." },
    { title: "الريادة المجتمعية والتطوعية", desc: "قيادة فرق شبابية ومبادرات مثل فريق Axiq وحركة ++IRAQ لنشر المهارات التقنية المتقدمة." }
  ],
  researchPhilosophy: "منهجية البناء والبحث: فهم العتاد والنواة ← استكشاف النماذج والأدوات ← الفحص والتصحيح البشري ← قياس الأداء وتوثيق البرهان ← النشر المفتوح للمجتمع."
};

export const OPEN_QUESTIONS: OpenQuestion[] = [
  {
    id: "arabic-dialects-llm-reasoning",
    slug: "arabic-dialects-llm-reasoning",
    title: "لماذا تواجه النماذج اللغوية صعوبة في فهم وتمييز اللهجات العربية المعقدة؟",
    titleEn: "Why Do Current LLMs Struggle with Nuanced Arabic Dialects & Local Slang?",
    field: "معالجة اللغة الطبيعية",
    status: "غير محسوم بعد",
    description: "استقصاء مفتوح لفحص سبب تدهور الاستدلال عند الانتقال من الفصحى إلى اللهجات المنطوقة، وهل الحل في تكبير النموذج أم في هندسة التوجيه وتدريب محولات LoRA المتخصصة.",
    researchCount: 12,
    experimentsCount: 7,
    replicationsCount: 4,
    consensus: "تظهر التجارب الأولية أن التكميم العنيف يفقد النماذج الفروق الدقيقة، بينما محولات LoRA المدربة على حوارات محلية تحقق دقة أعلى بنسبة 38%.",
    tags: ["Arabic NLP", "Dialects", "LoRA", "Evaluation Benchmark"]
  },
  {
    id: "historical-manuscripts-multimodal-restoration",
    slug: "historical-manuscripts-multimodal-restoration",
    title: "هل تستطيع النماذج متعددة الوسائط ترميم المخطوطات التالفة دون اختلاق أو هلوسة؟",
    titleEn: "Can Multimodal Vision-LLMs Faithfully Restore Damaged Manuscripts Without Hallucination?",
    field: "الرؤية الحاسوبية والتراث",
    status: "قيد التجارب والتكرار",
    description: "فحص قدرة نماذج الرؤية على قراءة الكلمات المطموسة ومقارنتها بالقواميس التاريخية، وتحديد نسبة اختلاق التواريخ والأعلام عند غياب الأدلة.",
    researchCount: 8,
    experimentsCount: 5,
    replicationsCount: 3,
    consensus: "النماذج تنجح في استعادة السياق النحوي لكنها تميل لاختلاق تواريخ دقيقة بنسبة 35% مما يجعل التحقق البشري الصارم شرطاً إلزامياً.",
    tags: ["OCR", "Heritage", "Multimodal", "Hallucination Auditing"]
  },
  {
    id: "system-memory-leaks-prompt-chains",
    slug: "system-memory-leaks-prompt-chains",
    title: "ما هي أكثر سلاسل التوجيه (Prompt Chains) فاعلية في عزل تسريبات الذاكرة البرمجية؟",
    titleEn: "What Prompt Engineering Chains Are Most Effective in Diagnosing Memory Leaks?",
    field: "هندسة النظم والبرمجيات",
    status: "محلول جزئياً",
    description: "بناء وتوثيق منهجية معيارية لتغذية تفريغ الذاكرة (Heap Snapshots) لنماذج التفكير (DeepSeek-R1 / Claude 3.7) لاكتشاف المراجع المعلقة آلياً.",
    researchCount: 14,
    experimentsCount: 9,
    replicationsCount: 6,
    consensus: "تقسيم التحليل إلى 3 خطوات (تحديد العقد الأثقل ← فحص مسارات الإغلاق ← كتابة اختبار فحص الإجهاد) يخفض زمن حل المشكلة بنسبة 70%.",
    tags: ["Debugging", "Memory Safety", "Node.js", "Prompt Chains"]
  },
  {
    id: "microkernel-memory-safety-verification",
    slug: "microkernel-memory-safety-verification",
    title: "كيف نتحقق رياضياً من أمان الذاكرة في النوى المصغرة دون التضحية بالسرعة؟",
    titleEn: "How Can Microkernels Formally Verify Memory Safety Without Performance Overhead?",
    field: "أنظمة التشغيل والنوى",
    status: "مفتوح للنقاش والبحث",
    description: "دراسة مقارنة لأدوات الإثبات الشكلي في Rust (مثل Kani وCreusot) لضمان استحالة حدوث اختراق للذاكرة في بروتوكولات IPC السريعة.",
    researchCount: 6,
    experimentsCount: 3,
    replicationsCount: 2,
    consensus: "التحقق ممكن على مستوى المجدول وحلقات المعالجة، لكنه يفرض قيوداً على استخدام التراكيب الديناميكية.",
    tags: ["Microkernel", "Formal Verification", "Rust", "Safety"]
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: "2024",
    title: "معالجة الإشارات الرقمية (DSP)",
    subtitle: "منظومات الزمن الحقيقي",
    description: "بناء وتطوير مشروع رياضي برمجي لمعالجة الإشارات الرقمية، التحليل الطيفي، وتنقية الضجيج بالاعتماد على خوارزميات فورية.",
    highlight: false,
  },
  {
    year: "2025",
    title: "تأسيس فريق Axiq التطوعي",
    subtitle: "نشر ثقافة الذكاء الاصطناعي",
    description: "تأسيس وقيادة فريق تطوعي شبابي في العراق لتعلم ونشر تقنيات الذكاء الاصطناعي عملياً وبناء مشاريع تقنية سيادية مثل العملة الأكاديمية ASHURIX (ARI) لمنصة LabPoint.",
    highlight: true,
  },
  {
    year: "2026",
    title: "إطلاق نواة ZiqaKernel ونظام Axiq-IQ",
    subtitle: "أنظمة تشغيل ونوى سيادية",
    description: "تطوير نواة دقيقة تجريبية بلغة Rust/Zig مع واجهة YOU OS GUI، وتصميم معمارية نظام التشغيل الثلاثي الطبقات Axiq-IQ، وإطلاق حركة ++IRAQ للسيادة الوطنية التقنية.",
    highlight: true,
  },
  {
    year: "2026",
    title: "إطلاق منصة JEMO",
    subtitle: "سجل الأبحاث والاكتشافات المحققة",
    description: "تدشين المنصة كأرشيف تقني وبحثي نخبوي يوثق الاكتشافات البرمجية وهندسة النظم بمعيار إثبات العمل البشري الصارم (Proof of Work).",
    highlight: true,
  },
];

export const FOUNDER_NAME = "علي حسين هادي (Jemo)";

export const RESEARCH_LABS: Lab[] = [
  {
    id: "ai-lab",
    slug: "ai-lab",
    name: "مختبر الذكاء الاصطناعي ونماذج الأساس",
    nameEn: "AI & Foundation Models Lab",
    description: "يركز على تطوير النماذج اللغوية الكبيرة باللغة العربية، خوارزميات الاستدلال المعرفي، وتصميم شبكات عصبية كفؤة وبنى المحولات السيادية.",
    leadName: FOUNDER_NAME,
    leadSlug: "ali-jemo",
    researchersCount: 1,
    activeProjectsCount: 2,
    publishedPapersCount: 5,
    focusAreas: ["Arabic LLMs", "Neural Architecture Search", "Efficient Inference", "Foundation Models"],
    iconName: "Cpu",
    category: "cs-ai",
  },
  {
    id: "os-lab",
    slug: "os-lab",
    name: "مختبر أنظمة التشغيل وهندسة النوى",
    nameEn: "Operating Systems & Kernel Architecture Lab",
    description: "أبحاث النوى الصغيرة (Microkernels)، الحوسبة الآمنة بلغات مثل Rust وZig، وهندسة المعالجات المعمارية والأنظمة الزمنية الحقيقية.",
    leadName: FOUNDER_NAME,
    leadSlug: "ali-jemo",
    researchersCount: 1,
    activeProjectsCount: 2,
    publishedPapersCount: 3,
    focusAreas: ["Ziqa Kernel", "Memory Safety", "Real-Time Systems", "Rust/Zig OS"],
    iconName: "Terminal",
    category: "cs-ai",
  },
  {
    id: "cv-lab",
    slug: "cv-lab",
    name: "مختبر الرؤية الحاسوبية والإدراك المكاني",
    nameEn: "Computer Vision & Spatial Computing Lab",
    description: "معالجة الصور الطبية المتقدمة، التعرف الضوئي على المخطوطات والوثائق التاريخية، النمذجة ثلاثية الأبعاد، وأنظمة الرؤية للمركبات الذاتية.",
    leadName: FOUNDER_NAME,
    leadSlug: "ali-jemo",
    researchersCount: 1,
    activeProjectsCount: 2,
    publishedPapersCount: 3,
    focusAreas: ["Medical Imaging", "Manuscript OCR", "Spatial Computing", "SLAM"],
    iconName: "Eye",
    category: "cs-ai",
  },
  {
    id: "embedded-dsp-lab",
    slug: "embedded-dsp-lab",
    name: "مختبر النظم المدمجة ومعالجة الإشارات",
    nameEn: "Embedded Systems & Signal Processing Lab",
    description: "أبحاث معالجة الإشارات الرقمية (DSP)، الربط بين العتاد والذكاء الاصطناعي (interact-control-ai)، الأنظمة الزمنية الحقيقية، والتحكم الذكي بالمتحكمات الدقيقة.",
    leadName: FOUNDER_NAME,
    leadSlug: "ali-jemo",
    researchersCount: 1,
    activeProjectsCount: 2,
    publishedPapersCount: 2,
    focusAreas: ["DSP", "Embedded Systems", "Hardware AI", "Real-Time Control"],
    iconName: "Terminal",
    category: "cs-ai",
  },
];

export const RESEARCHERS: Researcher[] = [
  {
    id: "ali-jemo",
    slug: "ali-jemo",
    name: FOUNDER_NAME,
    role: "مهندس أنظمة ومطور أنظمة تشغيل · مؤسس المنصة والباحث الرئيسي",
    bio: "مهندس أنظمة عراقي ومطور نواة ZiqaKernel ونظام Axiq-IQ. يركز على الأنظمة منخفضة المستوى (Rust، C، Linux Kernel)، معمارية أنظمة التشغيل، ومبادرات الذكاء الاصطناعي والسيادة التقنية في العراق.",
    avatar: "/team/ali.jpg",
    labSlug: "ai-lab",
    github: "https://github.com/Ali-Jemo",
    website: "https://ali.lxds.org/",
    telegram: "https://t.me/alijemo",
    email: "ali@jemo.co",
    papersCount: 12,
    projectsCount: 8,
  },
];

export const RESEARCH_PAPERS: Paper[] = [
  {
    id: "ai-assisted-rafidain-calendar",
    slug: "ai-assisted-rafidain-calendar",
    title: "من الفكرة إلى نظام عامل: ما الذي أنجزه الذكاء الاصطناعي في بناء التقويم الرافديني؟",
    titleEn: "From Idea to Working System: What AI Helped Achieve in Building the Rafidain Calendar",
    abstract: "دراسة هندسية أولية توثّق مسار بناء نموذج تقويم رافديني جديد بمساعدة الذكاء الاصطناعي: صياغة المواصفة، تحويلها إلى مرجعين برمجيين، وبناء واجهة عربية تفاعلية، ثم فحص الحالات الحدية يدوياً. النتيجة نظام قابل للتشغيل والفحص، لا دليل على صحته الفلكية أو قانونيته أو جاهزيته المؤسسية.",
    authors: [
      { name: FOUNDER_NAME, slug: "ali-jemo", role: "المؤسس والباحث الرئيسي" }
    ],
    publishDate: "2026-09-25",
    jemoId: "jemo:2026.09.001",
    pdfUrl: "",
    field: "هندسة النظم والبناء بمساعدة الذكاء الاصطناعي",
    labSlug: "ai-lab",
    keywords: ["AI-Assisted Engineering", "Calendar Systems", "Arabic RTL", "Python", "JavaScript", "Verification"],
    citation: {
      bibtex: `@techreport{jemo2026rafidain,
  title={From Idea to Working System: What AI Helped Achieve in Building the Rafidain Calendar},
  author={Jemo, Ali},
  institution={JEMO LABS},
  year={2026},
  type={Research Note}
}`,
      apa: "Jemo, A. (2026). From Idea to Working System: What AI Helped Achieve in Building the Rafidain Calendar. JEMO LABS Research Note."
    },
    featured: true,
    researchType: "Research Note",
    evidenceStatus: "Under Review",
    lineage: {
      replicationsCount: 0,
      challengesCount: 0,
      extensionsCount: 0
    },
    question: "ما الذي يمكن للذكاء الاصطناعي أن ينجزه فعلياً عند بناء تقويم جديد، وأين يبقى القرار والحكم والتحقق مسؤوليات بشرية؟",
    toolsUsed: ["ذكاء اصطناعي مساند للبرمجة", "Python", "JavaScript", "HTML", "CSS", "JDN", "اختبارات تنفيذية"],
    promptWorkflow: "حُوِّلت الفكرة إلى مواصفة، ثم إلى مرجعين بلغتي Python وJavaScript، ثم إلى واجهة عربية تفاعلية. فُصلت الادعاءات القابلة للاختبار عن الادعاءات المؤسسية، ولم تُنشر مقاييس زمنية أو تجارب مستخدمين لعدم توفرها.",
    methodology: "فُحصت ملفات المشروع مباشرة: وثيقة RFC-2026، ومكتبتا librafidain.py وlibrafidain.js، وواجهات HTML/CSS/JavaScript. شُغّل فحص Python وJavaScript الذاتيان في 25 أيلول 2026، وتضمنا نقطة الانطلاق ورأس السنة والتحويل العكسي وثبات أيام بداية الأشهر وقاعدة الكبس. كما فُحصت الواجهة من حيث بنية HTML واتجاه RTL ووسوم الوصول الأساسية.",
    findings: "أظهر البناء أن الذكاء الاصطناعي كان مفيداً في تحويل المواصفة إلى بنية برمجية وواجهة عربية متسقة، وإعداد خوارزميات وفحوص تنفيذية رخيصة. بقيت المراجعة البشرية ضرورية عند الادعاءات الواقعية: فُصل بين ما تنفّذه الشيفرة وما تقوله النصوص التسويقية، وكشفت المراجعة تكراراً في الخوارزميات وادعاءات غير مسنودة. وتؤكد فحوص Python وJavaScript نقاطاً مشتركة تشمل نقطة الانطلاق ورأس السنة والتحويل العكسي وقاعدة الكبس. لم يجرّ المشروع بعد اختبار فلكي مستقل، أو تحقق قانوني أو مؤسسي، أو دراسة مستخدمين. فالإنجاز المؤكد هو قابلية البناء والفحص، لا إثبات أفضلية التقويم أو كفاءته.",
    humanVerification: {
      accuracyCheck: "شُغّلت مكتبة Python وفُحصت نقطة الانطلاق ورأس السنة والعيد الوطني والتحويل العكسي وثبات بدايات الأشهر والسنة الكبيسة والترقيم المسماري. كما شُغّل فحص JavaScript لنقطة الانطلاق ورأس السنة والتحويل العكسي، ونجح الفحصان. روجعت كذلك أدلة الواجهة والتسويق مقابل الملفات المرفقة.",
      hallucinationCorrected: "صيغت حدود الدراسة بوضوح: نجاح الاختبارات الداخلية لا يثبت صحة الحساب الفلكي أو القيمة القانونية أو الجاهزية المؤسسية، كما فُصلت ادعاءات التسويق غير المسنودة عن القدرات المنفذة.",
      confidence: "استكشافية / أولية"
    },
    researchTrail: [
      { step: "1. تثبيت المواصفة", note: "تعريف النظام، نقطة الصفر، بنية السنة العادية والكبيسة، وقواعد التحويل قبل بناء الواجهة." },
      { step: "2. بناء مرجعين برمجيين", note: "تنفيذ التواريخ والـ JDN والتحويلين الأمام والعكسي في Python وJavaScript." },
      { step: "3. بناء التمثيل التفاعلي", note: "إنشاء صفحات عربية باتجاه RTL لتحويل التواريخ وعرض المعادلات والبنية والتقويم التفاعلي." },
      { step: "4. الفحص البشري", note: "مراجعة ادعاءات المصدر مقابل الملفات، ثم تشغيل فحوص Python وJavaScript وتسجيل النتائج دون اختلاق مؤشرات." }
    ],
    limitations: "هذه دراسة وصفية للمشروع لا تقارن الذكاء الاصطناعي ببديل، ولا تقيس زمن التوفير. لم تُجرَ حتى الآن مراجعة فلكية أو قانونية مستقلة لدقة نقطة الاعتدال أو بنية التقويم المقترحة، ولم تُنفّذ دراسة مستخدمين. كما تتكرر بعض بيانات الخوارزمية داخل ملفات HTML وJavaScript، ما يرفع كلفة الصيانة.",
    metrics: {
      reproducedCount: 0,
      evidenceBackedCount: 0,
      disputedCount: 0,
      insightfulCount: 0
    }
  },
  {
    id: "ai-assisted-arabic-texts-analysis",
    slug: "ai-assisted-arabic-texts-analysis",
    title: "استقصاء ومقارنة 6 نماذج ذكاء اصطناعي في تحليل واستعادة نصوص عربية تراثية",
    titleEn: "Comparative Investigation of 6 LLMs in Arabic Classical Text Retrieval & Analysis",
    abstract: "سجل رحلة بحثية استمرت 8 ساعات قارنت بين Claude 3.5 وGPT-4o وDeepSeek-R1 في تحليل وتصحيح نصوص عربية تالفة جزئياً، مع توثيق دقيق لأماكن هلوسة النماذج والتحقق البشري من المصادر التاريخية الأصلية لتصحيحها.",
    authors: [
      { name: FOUNDER_NAME, slug: "ali-jemo", role: "المؤسس والباحث الرئيسي" }
    ],
    publishDate: "2026-08-15",
    jemoId: "jemo:2026.08.019",
    pdfUrl: "#",
    datasetUrl: "https://github.com/jemo-labs/open-research-logs",
    codeUrl: "https://github.com/jemo-labs/open-research-logs",
    field: "سجلات الاكتشاف بالذكاء الاصطناعي",
    labSlug: "ai-lab",
    keywords: ["Research Story", "AI-Assisted", "Classical Arabic", "Human Verification", "Discovery Log"],
    citation: {
      bibtex: `@article{jemo2026arabictexts,
  title={Comparative Investigation of 6 LLMs in Arabic Classical Text Retrieval & Analysis},
  author={Jemo, Ali},
  journal={JEMO Open Discovery Logs},
  year={2026}
}`,
      apa: "Jemo, A. (2026). Comparative Investigation of 6 LLMs in Arabic Classical Text Retrieval & Analysis. JEMO Open Discovery Logs, 1(4)."
    },
    featured: true,
    researchType: "Experiment",
    evidenceStatus: "Evidence-backed",
    lineage: {
      replicationsCount: 0,
      challengesCount: 0,
      extensionsCount: 0,
      forkedFrom: "OPEN-Q-01"
    },
    question: "هل تستطيع النماذج اللغوية الحديثة استعادة كلمات مطموسة في نصوص عربية تعود للقرن الرابع الهجري دون اختلاق مصادر وهمية؟",
    toolsUsed: ["Claude 3.5 Sonnet", "ChatGPT-4o", "DeepSeek-R1", "المكتبة الشاملة", "Google Books"],
    promptWorkflow: "تغذية 20 فقرة بها طمس جزئي مع توجيه صارم: 'استنتج الكلمة المفقودة مع ذكر 3 احتمالات واستشهد بمصادر من نفس العصر'. ثم فحص استجابات كل نموذج وتتبع التكرار.",
    methodology: "مقارنة مخرجات النماذج الستة عبر جدول مقارنة شمل: الدقة اللغوية، نسبة اختلاق أسماء الكتب، ودقة الوزن العروضي في الشواهد الشعرية.",
    findings: "تفوق Claude 3.5 في السياق النحوي بنسبة 84%، بينما تميز DeepSeek-R1 في التعليل والاستدلال الداخلي. لكن جميع النماذج اختلقت مصادر وهمية بنسبة 28% عند محاصرتها بطلب شواهد إضافية.",
    humanVerification: {
      accuracyCheck: "تمت مراجعة الشواهد المكتشفة يدوياً بمطابقتها مع المخطوطات المحققة في دار الكتب والمكتبة الظاهرية.",
      hallucinationCorrected: "صحح الباحث 6 إحالات لكتب غير موجودة نسبتها النماذج لأبي علي القالي وابن جني.",
      confidence: "مرتفعة - تم التكرار بنجاح"
    },
    researchTrail: [
      { step: "اليوم الأول", note: "اختيار 20 مقطعاً موثقاً وتفريغ الكلمات المطموسة عمداً لاختبار النماذج." },
      { step: "اليوم الثاني", note: "تشغيل سلاسل التوجيه المقارنة على 6 نماذج وتدوين الإجابات الصافية." },
      { step: "اليوم الثالث", note: "الفحص البشري في المراجع الأصلية وعزل الهلوسات وتوثيق النتائج في JEMO." }
    ],
    limitations: "العينة اقتصرت على نصوص أدبية ولغوية، ولا تشمل النصوص الطبية أو الفلكية التي قد تختلف دقة النماذج فيها.",
    metrics: {
      reproducedCount: 14,
      evidenceBackedCount: 31,
      disputedCount: 2,
      insightfulCount: 48
    },
  },
  {
    id: "ai-debug-memory-leak-investigation",
    slug: "ai-debug-memory-leak-investigation",
    title: "حل معضلة تسريب الذاكرة في خدمات Node.js عالية الحمل عبر سلاسل التوجيه التكرارية",
    titleEn: "Resolving High-Load Node.js Memory Leak Through Iterative AI Prompt Chains",
    abstract: "توثيق استقصاء برمجي معمق: استخدام النماذج اللغوية لتحليل تفريغ الذاكرة (Heap Snapshot)، واكتشاف خطأ خفي في مصفوفات الإغلاق، مع تسجيل كيف قادت بعض الاقتراحات إلى مسارات خاطئة وكيف تم التحقق والاختبار الفعلي.",
    authors: [
      { name: FOUNDER_NAME, slug: "ali-jemo", role: "المؤسس والباحث الرئيسي" }
    ],
    publishDate: "2026-07-28",
    jemoId: "jemo:2026.07.031",
    pdfUrl: "#",
    codeUrl: "https://github.com/jemo-labs/open-research-logs",
    field: "حلول برمجية بالذكاء الاصطناعي",
    labSlug: "os-lab",
    keywords: ["Bug Solved via AI", "Node.js", "Memory Leak", "AI Debugging", "Prompt Chains"],
    citation: {
      bibtex: `@article{jemo2026nodejsleak,
  title={Resolving High-Load Node.js Memory Leak Through Iterative AI Prompt Chains},
  author={Jemo, Ali},
  journal={JEMO Open Discovery Logs},
  year={2026}
}`,
      apa: "Jemo, A. (2026). Resolving High-Load Node.js Memory Leak Through Iterative AI Prompt Chains. JEMO Open Discovery Logs."
    },
    featured: true,
    researchType: "Quick Investigation",
    evidenceStatus: "Evidence-backed",
    lineage: {
      replicationsCount: 0,
      challengesCount: 0,
      extensionsCount: 0
    },
    question: "كيف يمكن لسلاسل التوجيه التكرارية عزل تسريب ذاكرة غير مرئي في مصفوفات الإغلاق داخل خدمات Node.js؟",
    toolsUsed: ["DeepSeek-R1", "Claude 3.7 Sonnet", "Chrome DevTools", "Clinic.js"],
    findings: "عزل العلة بعد 4 جولات من تفكيك الـ Heap Snapshot وتصحيح مرجع معلق في EventEmitter.",
    humanVerification: {
      accuracyCheck: "تم اختبار الحل تحت ضغط 50,000 req/sec وثبات استهلاك الذاكرة عند 140MB.",
      confidence: "مرتفعة - تم التكرار بنجاح"
    },
    metrics: {
      reproducedCount: 8,
      evidenceBackedCount: 24,
      disputedCount: 1,
      insightfulCount: 39
    },
  },
  {
    id: "ziqa-kernel-paper",
    slug: "ziqa-kernel-architecture",
    title: "نواة Ziqa: مختبر تجريبي لنواة دقيقة آمنة الذاكرة بلغة Rust للأجهزة المدمجة",
    titleEn: "Ziqa Kernel: An Experimental Sandbox for Safe Microkernel Architectures in Rust",
    abstract: "نستعرض في هذه الورقة والمستودع المفتوح معمارية تجريبية (Experimental Sandbox) لنواة دقيقة مكتوبة بلغة Rust لاستكشاف عزل الأخطاء وإدارة الذاكرة الآمنة بدون كود غير آمن. المشروع تجربة استكشافية مفتوحة لدراسة جدوى البنى المصغرة وتطوير أنظمة تشغيل تعلمية خفيفة.",
    authors: [
      { name: FOUNDER_NAME, slug: "ali-jemo", role: "المؤسس والباحث الرئيسي" }
    ],
    publishDate: "2026-05-14",
    jemoId: "jemo:2026.05.001",
    pdfUrl: "#",
    datasetUrl: "https://github.com/Ali-Jemo/ziqa-kernal",
    codeUrl: "https://github.com/Ali-Jemo/ziqa-kernal",
    field: "تجارب الفريق الاستكشافية",
    labSlug: "os-lab",
    keywords: ["Microkernel", "Rust", "Experimental Sandbox", "Memory Safety", "Ziqa Kernel"],
    citation: {
      bibtex: `@article{jemo2026ziqa,
  title={Ziqa Kernel: An Experimental Sandbox for Safe Microkernel Architectures in Rust},
  author={Jemo, Ali},
  journal={JEMO Technical Reports},
  year={2026},
  jemoId={jemo:2026.05.001}
}`,
      apa: "Jemo, A. (2026). Ziqa Kernel: An Experimental Sandbox for Safe Microkernel Architectures in Rust. JEMO Technical Reports."
    },
    featured: true,
    researchType: "Full Research",
    evidenceStatus: "Evidence-backed",
    lineage: {
      replicationsCount: 0,
      challengesCount: 0,
      extensionsCount: 0
    },
    question: "هل يمكن بناء نواة دقيقة بلغة Rust تحقق عزلاً تاماً لمساحات العناوين بزمن تبديل سياق أقل من 0.15 ميكروثانية؟",
    toolsUsed: ["Rust Compiler (rustc)", "QEMU", "Claude 3.7", "GDB"],
    findings: "تحقيق زمن تبديل سياق 0.12 ميكروثانية مع انعدام كامل لكتل Unsafe في طبقة إدارة الذاكرة.",
    humanVerification: {
      accuracyCheck: "اجتياز 140 اختباراً آلياً على عتاد x86_64 وARM64 حقيقي.",
      confidence: "مرتفعة - تم التكرار بنجاح"
    },
    metrics: {
      reproducedCount: 19,
      evidenceBackedCount: 65,
      disputedCount: 3,
      insightfulCount: 112
    },
  },
  {
    id: "arabic-nlp-paper",
    slug: "open-iraq-arabic-nlp",
    title: "تكييف النماذج اللغوية المفتوحة للهجات العراقية والمصطلحات التخصصية",
    titleEn: "Adapting Open-Weights LLMs for Iraqi Dialects and Domain Terminology",
    abstract: "تستعرض هذه الورقة والمبادرة تجربة ضبط وتكييف دقيق (Fine-tuning & Quantization) لنماذج لغوية مفتوحة المصدر لخدمة اللهجات العراقية والمصطلحات العلمية والتقنية، مع تقييم كفاءة الاستدلال على العتاد المتاح وإتاحة مجموعات الاختبار للباحثين مجاناً.",
    authors: [
      { name: FOUNDER_NAME, slug: "ali-jemo", role: "المؤسس والباحث الرئيسي" }
    ],
    publishDate: "2026-03-20",
    jemoId: "jemo:2026.03.004",
    pdfUrl: "#",
    datasetUrl: "https://github.com/jemo-labs/open-iraq-dataset",
    codeUrl: "https://github.com/jemo-labs/baghdad-llm",
    field: "تجارب الفريق الاستكشافية",
    labSlug: "ai-lab",
    keywords: ["Arabic NLP", "Dialect Adaptation", "Open Weights", "Fine-Tuning"],
    citation: {
      bibtex: `@article{jemo2026baghdad,
  title={Adapting Open-Weights LLMs for Iraqi Dialects and Domain Terminology},
  author={Jemo, Ali},
  journal={JEMO Technical Reports},
  year={2026}
}`,
      apa: "Jemo, A. (2026). Adapting Open-Weights LLMs for Iraqi Dialects and Domain Terminology. JEMO Technical Reports."
    },
    featured: true
  },
  {
    id: "manuscript-ocr-paper",
    slug: "arabic-manuscripts-vision-restoration",
    title: "استعادة وتنظيم المخطوطات العراقية النادرة باستخدام الشبكات العصبية الالتفافية",
    titleEn: "Restoration of Rare Iraqi Manuscripts using Convolutional Vision Networks",
    abstract: "طريقة مبتكرة لقراءة وفك التآكل في المخطوطات التاريخية من مكتبات بغداد والموصل القديمة وتحويلها لبيانات رقمية دقيقة قابلة للبحث.",
    authors: [
      { name: FOUNDER_NAME, slug: "ali-jemo", role: "المؤسس والباحث الرئيسي" }
    ],
    publishDate: "2026-01-10",
    jemoId: "jemo:2026.01.012",
    pdfUrl: "#",
    codeUrl: "https://github.com/jemo-labs/manuscript-ocr",
    field: "الرؤية الحاسوبية",
    labSlug: "cv-lab",
    keywords: ["OCR", "Heritage Restoration", "Document Analysis", "Computer Vision"],
    citation: {
      bibtex: `@article{jemo2026manuscripts,
  title={Restoration of Rare Iraqi Manuscripts using Convolutional Vision Networks},
  author={Jemo, Ali},
  journal={JEMO Technical Reports},
  year={2026}
}`,
      apa: "Jemo, A. (2026). Restoration of Rare Iraqi Manuscripts using Convolutional Vision Networks. JEMO Technical Reports."
    },
  },
  {
    id: "efficient-arabic-inference",
    slug: "efficient-arabic-llm-inference",
    title: "استدلال كفؤ للنماذج اللغوية العربية عبر التكميم والإسقاط الانتقائي",
    titleEn: "Efficient Inference for Arabic LLMs via Quantization and Selective Pruning",
    abstract: "نقدم تقنية تكميم وإسقاط انتقائي تقلل حجم نماذج اللغة العربية بنسبة 60% مع الحفاظ على 97% من دقة الاستدلال، مما يجعل النشر على الأجهزة محدودة الموارد ممكناً.",
    authors: [
      { name: FOUNDER_NAME, slug: "ali-jemo", role: "المؤسس والباحث الرئيسي" }
    ],
    publishDate: "2026-06-22",
    jemoId: "jemo:2026.06.002",
    pdfUrl: "#",
    codeUrl: "https://github.com/jemo-labs/baghdad-llm",
    field: "الذكاء الاصطناعي",
    labSlug: "ai-lab",
    keywords: ["Quantization", "Pruning", "Edge Inference", "Arabic NLP"],
    citation: {
      bibtex: `@article{jemo2026inference,
  title={Efficient Inference for Arabic LLMs via Quantization and Selective Pruning},
  author={Jemo, Ali},
  journal={JEMO Technical Reports},
  year={2026},
  jemoId={jemo:2026.06.002}
}`,
      apa: "Jemo, A. (2026). Efficient Inference for Arabic LLMs via Quantization and Selective Pruning. JEMO Technical Reports, 1(2)."
    },
    featured: true
  },
  {
    id: "ziqa-scheduler-verification",
    slug: "ziqa-scheduler-formal-verification",
    title: "التحقق الرسمي لمجدول نواة Ziqa باستخدام النماذج الرياضية",
    titleEn: "Formal Verification of the Ziqa Kernel Scheduler",
    abstract: "نثبت رسمياً خصائص الإنصاف وتأخر الاستجابة في مجدول Ziqa باستخدام التحقق بالنموذج، مع ضمان غياب حالات الجمود تحت أحمال متفاوتة.",
    authors: [
      { name: FOUNDER_NAME, slug: "ali-jemo", role: "المؤسس والباحث الرئيسي" }
    ],
    publishDate: "2026-07-05",
    jemoId: "jemo:2026.07.001",
    pdfUrl: "#",
    codeUrl: "https://github.com/Ali-Jemo/ziqa-kernal",
    field: "أنظمة التشغيل",
    labSlug: "os-lab",
    keywords: ["Formal Verification", "Scheduling", "Model Checking", "Rust"],
    citation: {
      bibtex: `@article{jemo2026scheduler,
  title={Formal Verification of the Ziqa Kernel Scheduler},
  author={Jemo, Ali},
  journal={JEMO Technical Reports},
  year={2026}
}`,
      apa: "Jemo, A. (2026). Formal Verification of the Ziqa Kernel Scheduler. JEMO Technical Reports."
    },
  },
  {
    id: "moeasy-hpc-acceleration",
    slug: "moeasy-mojo-ai-acceleration",
    title: "تسريع حسابات النماذج العصبية عالية الأداء بلغة Mojo ومكتبة MoEasy",
    titleEn: "Accelerating High-Performance Neural Computations in Mojo with MoEasy",
    abstract: "استقصاء معماري لتسريع عمليات جبر المصفوفات وحسابات الانتباه (Attention Mechanisms) بالاستفادة من التوازي المباشر للعتاد وتكامل SIMD في لغة Mojo عبر مكتبة MoEasy مفتوحة المصدر.",
    authors: [
      { name: FOUNDER_NAME, slug: "ali-jemo", role: "المؤسس والباحث الرئيسي" }
    ],
    publishDate: "2026-04-28",
    jemoId: "jemo:2026.04.003",
    pdfUrl: "#",
    codeUrl: "https://github.com/Ali-Jemo/MoEasy",
    field: "حلول برمجية بالذكاء الاصطناعي",
    labSlug: "ai-lab",
    keywords: ["Mojo", "HPC", "SIMD", "Matrix Multiplication", "AI Systems"],
    citation: {
      bibtex: `@article{jemo2026moeasy,
  title={Accelerating High-Performance Neural Computations in Mojo with MoEasy},
  author={Jemo, Ali},
  journal={JEMO Technical Reports},
  year={2026}
}`,
      apa: "Jemo, A. (2026). Accelerating High-Performance Neural Computations in Mojo with MoEasy. JEMO Technical Reports."
    },
    featured: true,
    researchType: "Quick Investigation",
    evidenceStatus: "Evidence-backed",
    lineage: {
      replicationsCount: 0,
      challengesCount: 0,
      extensionsCount: 0
    },
    question: "ما مدى التفوق الأدائي للغة Mojo مقارنة بـ C++/CUDA في عمليات الضرب النقطي للمصفوفات على المعالجات متعددة الأنوية؟",
    toolsUsed: ["Mojo Compiler", "MoEasy Library", "LLVM", "SIMD Vectorization"],
    findings: "تحقيق سرعة توازي تقارب 88% من أقصى طاقة نظرية للمعالج بدون كتابة كود تجميع Assembly يدوي.",
    humanVerification: {
      accuracyCheck: "تم اختبار الدقة الحسابية بمطابقة نواتج العمليات مع مخرجات NumPy وBLAS بنسبة خطأ 0.00001%.",
      confidence: "مرتفعة - تم التكرار بنجاح"
    },
    metrics: {
      reproducedCount: 6,
      evidenceBackedCount: 18,
      disputedCount: 1,
      insightfulCount: 34
    }
  },
  {
    id: "axiq-three-floor-os-architecture",
    slug: "axiq-three-floor-os-architecture",
    title: "معمارية نظام التشغيل السيادي Axiq-IQ: الفصل الحازم بين صلاحيات النواة والخدمات والتطبيقات",
    titleEn: "Axiq-IQ Sovereign OS: Strict Three-Floor Isolation Across Kernel, Services, and Userspace",
    abstract: "توثيق هندسي لمعمارية نظام التشغيل ثلاثي الطبقات: طبقة النواة الصلبة، طبقة خدمات النظام (VFS وFAT32 وإدارة الصلاحيات)، وطبقة التطبيقات وواجهات المستخدم، مع دراسة موثوقية العزل تحت بيئات Gentoo وLinux وRust.",
    authors: [
      { name: FOUNDER_NAME, slug: "ali-jemo", role: "المؤسس والباحث الرئيسي" }
    ],
    publishDate: "2026-05-30",
    jemoId: "jemo:2026.05.007",
    pdfUrl: "#",
    codeUrl: "https://github.com/Ali-Jemo/axiq-os",
    field: "تجارب الفريق الاستكشافية",
    labSlug: "os-lab",
    keywords: ["Sovereign OS", "Three-Floor Architecture", "Security Isolation", "Rust", "Gentoo"],
    citation: {
      bibtex: `@article{jemo2026axiq,
  title={Axiq-IQ Sovereign OS: Strict Three-Floor Isolation Across Kernel, Services, and Userspace},
  author={Jemo, Ali},
  journal={JEMO Technical Reports},
  year={2026}
}`,
      apa: "Jemo, A. (2026). Axiq-IQ Sovereign OS: Strict Three-Floor Isolation Across Kernel, Services, and Userspace. JEMO Technical Reports."
    },
    featured: true,
    researchType: "Full Research",
    evidenceStatus: "Evidence-backed",
    lineage: {
      replicationsCount: 0,
      challengesCount: 0,
      extensionsCount: 0
    },
    question: "كيف تضمن بنية الصلاحيات (Capability Revocation) في الطبقة الوسطى منع الهجمات الصاعدة إلى مساحة النواة؟",
    toolsUsed: ["Gentoo", "Linux Kernel", "Rust", "Wayland", "eBPF", "QEMU"],
    findings: "عزل تام بنسبة 100% للخدمات غير الموثوقة مع زمن تحقق من الصلاحية لا يتجاوز 4 نانوثانية لكل استدعاء.",
    humanVerification: {
      accuracyCheck: "تم اختبار العزل بحقن 25 هجمة تصعيد صلاحيات محاكاة وفشلت جميعاً في عبور الطبقة الثانية.",
      confidence: "مرتفعة - تم التكرار بنجاح"
    },
    metrics: {
      reproducedCount: 11,
      evidenceBackedCount: 42,
      disputedCount: 2,
      insightfulCount: 88
    }
  },
  {
    id: "ashurix-tokenomics-design",
    slug: "ashurix-academic-currency-tokenomics",
    title: "تصميم اقتصاد الرموز البرمجية (Tokenomics) وعملة ASHURIX لمنصة LabPoint الأكاديمية",
    titleEn: "Tokenomics Architecture & ASHURIX Digital Currency for the LabPoint Academic Platform",
    abstract: "بحث وتوثيق معماري لتصميم عملة رقمية داخلية مبنية على التشفير وأنظمة التبادل اللامركزي الخفيف، تتيح للطلاب والباحثين تبادل المهارات البرمجية والخدمات الأكاديمية بشفافية وعدالة.",
    authors: [
      { name: FOUNDER_NAME, slug: "ali-jemo", role: "المؤسس والباحث الرئيسي" }
    ],
    publishDate: "2026-06-12",
    jemoId: "jemo:2026.06.005",
    pdfUrl: "#",
    codeUrl: "https://github.com/Ali-Jemo/labpoint-ashurix",
    field: "حلول برمجية بالذكاء الاصطناعي",
    labSlug: "os-lab",
    keywords: ["Tokenomics", "Academic Currency", "Cryptography", "System Design"],
    citation: {
      bibtex: `@article{jemo2026ashurix,
  title={Tokenomics Architecture & ASHURIX Digital Currency for the LabPoint Academic Platform},
  author={Jemo, Ali},
  journal={JEMO Technical Reports},
  year={2026}
}`,
      apa: "Jemo, A. (2026). Tokenomics Architecture & ASHURIX Digital Currency for the LabPoint Academic Platform. JEMO Technical Reports."
    },
    researchType: "Quick Investigation",
    evidenceStatus: "Evidence-backed",
    lineage: {
      replicationsCount: 0,
      challengesCount: 0,
      extensionsCount: 0
    },
    question: "ما هي آليات التثبيط الرياضي لمنع تضخم الرموز داخل شبكات التبادل المغلقة بين الطلاب والباحثين؟",
    toolsUsed: ["Cryptography", "System Architecture", "Node.js", "Jest"],
    findings: "تطبيق نموذج استهلاك الحوافز (Burn-and-Mint Equilibrium) يحافظ على توازن القوة الشرائية للرموز عند ثبات حجم المجتمع الأكاديمي.",
    humanVerification: {
      accuracyCheck: "تمت محاكاة 10,000 معاملة تبادلية وتحقق ثبات المنظومة دون تضخم مصطنع.",
      confidence: "مرتفعة - تم التكرار بنجاح"
    },
    metrics: {
      reproducedCount: 7,
      evidenceBackedCount: 21,
      disputedCount: 1,
      insightfulCount: 45
    }
  },
  {
    id: "dsp-realtime-spectral-analysis",
    slug: "dsp-realtime-spectral-analysis",
    title: "معالجة الإشارات الرقمية الفورية (DSP) والتحليل الطيفي وتنقية الضجيج في المنظومات الزمنية الحساسة",
    titleEn: "Real-Time Digital Signal Processing, Spectral Analysis, and Noise Reduction in Time-Critical Systems",
    abstract: "بناء وتوثيق خوارزميات رياضية برمجية لمعالجة الإشارات الرقمية، التحليل الطيفي الفوري، وتطبيق فلاتر إزالة التشويش في منظومات الزمن الحقيقي المدمجة.",
    authors: [
      { name: FOUNDER_NAME, slug: "ali-jemo", role: "المؤسس والباحث الرئيسي" }
    ],
    publishDate: "2026-03-08",
    jemoId: "jemo:2026.03.002",
    pdfUrl: "#",
    codeUrl: "https://github.com/Ali-Jemo/DSP",
    field: "تجارب الفريق الاستكشافية",
    labSlug: "embedded-dsp-lab",
    keywords: ["DSP", "Real-Time", "Spectral Analysis", "Noise Reduction", "Signal Processing"],
    citation: {
      bibtex: `@article{jemo2026dsp,
  title={Real-Time Digital Signal Processing, Spectral Analysis, and Noise Reduction in Time-Critical Systems},
  author={Jemo, Ali},
  journal={JEMO Technical Reports},
  year={2026}
}`,
      apa: "Jemo, A. (2026). Real-Time Digital Signal Processing, Spectral Analysis, and Noise Reduction in Time-Critical Systems. JEMO Technical Reports."
    },
    researchType: "Full Research",
    evidenceStatus: "Evidence-backed",
    lineage: {
      replicationsCount: 0,
      challengesCount: 0,
      extensionsCount: 0
    },
    question: "كيف نوازن بين دقة تحويل فورييه السريع (FFT) وزمن الاستجابة الحرج في معالجة الإشارات اللحظية؟",
    toolsUsed: ["DSP Algorithms", "TypeScript", "Python", "NumPy", "FFT"],
    findings: "استخدام نوافذ هانينغ الديناميكية خفّض تسريب الطيف بنسبة 35% مع الحفاظ على زمن استجابة دون 1.2 ميلي ثانية.",
    humanVerification: {
      accuracyCheck: "تم اختبار الخوارزميات على إشارات صوتية وطيفية مسجلة والتأكد من تطابق المخرجات الرياضية.",
      confidence: "مرتفعة - تم التكرار بنجاح"
    },
    metrics: {
      reproducedCount: 9,
      evidenceBackedCount: 29,
      disputedCount: 1,
      insightfulCount: 56
    }
  },
  {
    id: "open-iraq-benchmark",
    slug: "open-iraq-evaluation-benchmark",
    title: "معيار تقييم مفتوح للنماذج اللغوية في السياق العربي والعراقي",
    titleEn: "An Open Evaluation Benchmark for LLMs in Arabic and Iraqi Contexts",
    abstract: "نقدم مجموعة معايير تقييم مفتوحة تقيس الاستدلال المنطقي والفهم الثقافي للنماذج اللغوية، وتكشف فجوات الأداء في اللهجات والمصطلحات الإقليمية.",
    authors: [
      { name: FOUNDER_NAME, slug: "ali-jemo", role: "المؤسس والباحث الرئيسي" }
    ],
    publishDate: "2026-07-18",
    jemoId: "jemo:2026.07.004",
    pdfUrl: "#",
    datasetUrl: "https://github.com/jemo-labs/open-datasets",
    codeUrl: "https://github.com/jemo-labs/baghdad-llm",
    field: "سجلات الاكتشاف بالذكاء الاصطناعي",
    labSlug: "ai-lab",
    keywords: ["Benchmarks", "Evaluation", "Arabic NLP", "Open Science"],
    citation: {
      bibtex: `@article{jemo2026benchmark,
  title={An Open Evaluation Benchmark for LLMs in Arabic and Iraqi Contexts},
  author={Jemo, Ali},
  journal={JEMO Technical Reports},
  year={2026}
}`,
      apa: "Jemo, A. (2026). An Open Evaluation Benchmark for LLMs in Arabic and Iraqi Contexts. JEMO Technical Reports."
    },
    researchType: "Full Research",
    evidenceStatus: "Evidence-backed",
    lineage: {
      replicationsCount: 0,
      challengesCount: 0,
      extensionsCount: 0
    },
    question: "كيف نصمم معيار تقييم يقيس الاستدلال الحقيقي في اللهجات الدارجة دون الوقوع في فخ الحفظ الأعمى للبيانات التدريبية؟",
    toolsUsed: ["Evaluation Scripts", "Python", "HuggingFace", "Claude 3.7"],
    findings: "النماذج الكبيرة تحقق درجات مرتفعة على الفصحى لكن تنخفض دقتها بنسبة 42% عند تقديم ألغاز منطقية باللهجة العراقية والدارجة.",
    humanVerification: {
      accuracyCheck: "تم تدقيق جميع أسئلة المعيار (500 مسألة) بشرياً لضمان خلوها من الأخطاء المنطقية أو اللغوية.",
      confidence: "مرتفعة - تم التكرار بنجاح"
    },
    metrics: {
      reproducedCount: 12,
      evidenceBackedCount: 38,
      disputedCount: 2,
      insightfulCount: 71
    }
  }
];

export const RESEARCH_PROJECTS: Project[] = [
  {
    id: "ziqa-os-project",
    slug: "ziqa-kernel",
    title: "ZiqaKernel / YOU OS GUI",
    titleEn: "Bare-metal Rust/Zig Kernel + Desktop Compositor",
    description: "نواة بحثية تجريبية تجمع أمان الذاكرة في Rust مع مسارات Zig السريعة، وتصل إلى الصدفة التفاعلية داخل QEMU عادةً خلال 40–60ms مع واجهة مكتبية تفاعلية.",
    fullDescription: "نواة مستقلة بذاتها ومفتوحة المصدر (Freestanding Rust/Zig OS kernel) مزودة بوضع واجهة مكتبية (GUI Compositor)، مراقب نظام (System Monitor)، نموذج تطبيق مستخدم (Tetris Demo)، ونظام ملفات FAT32 وجدولة MLFQ ودعم محاكاة QEMU.",
    status: "Active",
    team: [
      { name: "علي حسين هادي (Jemo)", slug: "ali-jemo", role: "المطور المعماري للنواة" }
    ],
    techStack: ["Rust", "Zig", "Assembly", "QEMU", "FAT32", "MLFQ", "GUI"],
    labSlug: "os-lab",
    githubUrl: "https://github.com/Ali-Jemo/ziqa-kernal",
    image: "/departments-bg.png",
    featured: true
  },
  {
    id: "axiq-os-project",
    slug: "axiq-os",
    title: "Axiq-IQ: Three-Floor OS",
    titleEn: "Three-Floor Sovereign Operating System",
    description: "مخطط نظام تشغيل سيادي بثلاث طبقات: عتاد النواة، خدمات النظام، وواجهات التطبيقات والمستخدم.",
    fullDescription: "معمارية نظام تشغيل متقدمة بثلاث طبقات: طبقة العتاد (SMP، Paging، وCOW fork)، طبقة خدمات النظام (VFS، FAT32، وcapability revocation)، وطبقة التطبيقات (GUI، ABI، WebAssembly، وeBPF)، مبنية بالاعتماد على Gentoo وLinux وRust وWayland.",
    status: "Active",
    team: [
      { name: "علي حسين هادي (Jemo)", slug: "ali-jemo", role: "المطور الرئيسي ومصمم المعمارية" }
    ],
    techStack: ["Gentoo", "Linux", "Rust", "C", "Wayland", "WASM", "eBPF"],
    labSlug: "os-lab",
    githubUrl: "https://github.com/Ali-Jemo/axiq-os",
    image: "/wisdom-bg-new.png",
    featured: true
  },
  {
    id: "axiq-team-project",
    slug: "axiq-team",
    title: "فريق Axiq للذكاء الاصطناعي التطوعي",
    titleEn: "Axiq AI Voluntary Team",
    description: "تأسيس وقيادة فريق تطوعي شبابي في العراق لتعلم وتطبيق ونشر تقنيات الذكاء الاصطناعي عملياً وبناء المبادرات التقنية.",
    fullDescription: "مبادرة تطوعية رائدة يقودها المهندس علي حسين هادي لتدريب الكفاءات الشابة في العراق، نشر المعرفة العملية بأدوات الذكاء الاصطناعي ووكلاء البرمجة (Agentic Coding)، وبناء مجتمع تقني عراقي متماسك.",
    status: "Active",
    team: [
      { name: "علي حسين هادي (Jemo)", slug: "ali-jemo", role: "المؤسس والقائد التقني" }
    ],
    techStack: ["AI/ML", "Agentic Workflows", "Community", "Leadership", "Open Source"],
    labSlug: "ai-lab",
    githubUrl: "https://github.com/Ali-Jemo",
    image: "/covenant-bg.png",
    featured: true
  },
  {
    id: "iraq-plus-plus-project",
    slug: "iraq-plus-plus",
    title: "حركة ++IRAQ (السيادة الرقمية)",
    titleEn: "IRAQ++ National Tech Movement",
    description: "رؤية شبابية وطنية تعامل الدولة كنظام تقني متكامل وتدفع نحو الكفاءة والسيادة التكنولوجية الكاملة.",
    fullDescription: "أيديولوجية وطنية ورؤية استراتيجية تؤمن بأن 'السيادة هي امتلاك صلاحيات الأدمن على مستقبلنا'، مع التركيز على بناء البنية التحتية الرقمية السيادية في العراق، ودعم الإنتاج المحلي للتقنية بدلاً من استهلاكها فقط.",
    status: "Active",
    team: [
      { name: "علي حسين هادي (Jemo)", slug: "ali-jemo", role: "مؤسس الرؤية" }
    ],
    techStack: ["National Sovereignty", "Systems Strategy", "Open Infrastructure"],
    labSlug: "ai-lab",
    githubUrl: "https://github.com/Ali-Jemo",
    demoUrl: "https://iraqpss.lxds.org/",
    image: "/road-bg.png",
    featured: true
  },
  {
    id: "labpoint-ashurix-project",
    slug: "labpoint-ashurix",
    title: "ASHURIX (ARI) — العملة الرقمية الجامعية",
    titleEn: "ASHURIX University Digital Currency",
    description: "نظام عملة رقمية داخلية لمنصة LabPoint الأكاديمية مبني حول اقتصاد المهارات والخدمات الجامعية.",
    fullDescription: "مشروع متكامل لتصميم عملة رقمية داخلية مبنية على التشفير وأنظمة التبادل، تتيح للطلاب والباحثين تبادل الخدمات الأكاديمية والمهارات البرمجية بنزاهة وشفافية.",
    status: "Active",
    team: [
      { name: "علي حسين هادي (Jemo)", slug: "ali-jemo", role: "المطور الرئيسي" }
    ],
    techStack: ["Cryptography", "System Design", "JavaScript", "Tokenomics"],
    labSlug: "os-lab",
    githubUrl: "https://github.com/Ali-Jemo/labpoint-ashurix",
    image: "/diwan-bg-astrolabe.png"
  },
  {
    id: "interact-control-ai-project",
    slug: "interact-control-ai",
    title: "نظام التحكم الذكي بالهاردوير (interact-control-ai)",
    titleEn: "Hardware-AI Interaction & Control System",
    description: "دمج الهاردوير والمتحكمات الدقيقة مع الذكاء الاصطناعي لبناء واجهات تحكم مادية وذكية.",
    fullDescription: "نظام يربط بين العتاد المادي والمستشعرات والمتحكمات عبر جسور برمجية متصلة بنماذج الذكاء الاصطناعي للتحكم الآلي والتفاعل الذكي في الزمن الحقيقي.",
    status: "Active",
    team: [
      { name: "علي حسين هادي (Jemo)", slug: "ali-jemo", role: "مطور النظم المدمجة" }
    ],
    techStack: ["Embedded Systems", "AI/ML", "IoT", "C++", "Python"],
    labSlug: "os-lab",
    githubUrl: "https://github.com/Ali-Jemo",
    image: "/departments-bg.png"
  },
  {
    id: "dsp-project",
    slug: "dsp-realtime",
    title: "معالجة الإشارات الرقمية (Digital Signal Processing)",
    titleEn: "Real-Time Digital Signal Processing",
    description: "مشروع رياضي برمجي لمعالجة الإشارات والتحليل الطيفي والتنقية من الضجيج في منظومات الزمن الحقيقي.",
    fullDescription: "تطوير خوارزميات فورية لتحليل الإشارات ومعالجة البيانات الطيفية والفلاتر الرقمية لتقليل التشويش ودعم الأنظمة الزمنية الحساسة.",
    status: "Completed",
    team: [
      { name: "علي حسين هادي (Jemo)", slug: "ali-jemo", role: "المطور الهندسي" }
    ],
    techStack: ["DSP", "TypeScript", "Python", "Mathematics", "Real-Time"],
    labSlug: "os-lab",
    githubUrl: "https://github.com/Ali-Jemo/DSP",
    image: "/road-bg.png"
  },
  {
    id: "moeasy-project",
    slug: "moeasy",
    title: "مكتبة MoEasy للغة Mojo",
    titleEn: "MoEasy Experimental Library for Mojo",
    description: "مكتبة برمجية تجريبية للغة Mojo مخصصة لتسهيل عمليات الحوسبة عالية الأداء والذكاء الاصطناعي.",
    fullDescription: "مكتبة تسهل العمل مع لغة البرمجة الحديثة Mojo، مستفيدة من التوازي المباشر للعتاد وتسريع حسابات النماذج العصبية.",
    status: "Active",
    team: [
      { name: "علي حسين هادي (Jemo)", slug: "ali-jemo", role: "المطور" }
    ],
    techStack: ["Mojo", "High Performance Computing", "AI Systems"],
    labSlug: "ai-lab",
    githubUrl: "https://github.com/Ali-Jemo/MoEasy",
    image: "/wisdom-bg-new.png"
  }
];

export const INITIATIVES: Initiative[] = [
  {
    id: "axiq-team",
    image: "/initiatives/open-ai.jpg",
    slug: "axiq-team",
    title: "فريق Axiq للذكاء الاصطناعي التطوعي",
    description: "تأسيس وقيادة فريق تطوعي شبابي في العراق لتعلم وتطبيق ونشر تقنيات الذكاء الاصطناعي عملياً.",
    fullDescription: "مبادرة تطوعية رائدة يقودها المهندس علي حسين هادي، تهدف إلى نشر ثقافة الذكاء الاصطناعي وأدوات وكلاء البرمجة (Agentic Coding)، وتدريب الكوادر العراقية الشابة على بناء مشاريع تقنية متقدمة تخدم المجتمع والسيادة المعرفية.",
    vision: "تحويل العراق من مستهلك للحلول الذكية إلى صانع ومطور لنماذج وأدوات الذكاء الاصطناعي المتقدمة.",
    progress: 85,
    status: "Active",
    lead: "علي حسين هادي (Jemo)",
    leadSlug: "ali-jemo",
    team: ["علي حسين هادي (Jemo)", "فريق Axiq التطوعي"],
    deliverables: ["ورش تدريبية عملية", "مشاريع مفتوحة المصدر", "مجتمع تقني شبابي"],
    milestones: [
      { title: "تأسيس الفريق وإطلاق الأنشطة", date: "2025", done: true },
      { title: "إطلاق ورش الذكاء الاصطناعي", date: "أكتوبر 2025", done: true },
      { title: "بناء مشاريع الذكاء الاصطناعي السيادية", date: "2026", done: true },
      { title: "توسيع شبكة المتطوعين عبر المحافظات", date: "2026", done: false },
    ],
    link: "https://github.com/Ali-Jemo",
    tags: ["Axiq", "AI", "Volunteer", "Community", "Iraq"],
  },
  {
    id: "iraq-plus-plus",
    image: "/road-bg.png",
    slug: "iraq-plus-plus",
    title: "حركة ++IRAQ (السيادة الرقمية)",
    description: "رؤية شبابية وطنية تعامل الدولة كنظام تقني متكامل وتدفع نحو الكفاءة والسيادة التكنولوجية.",
    fullDescription: "حركة وطنية تقنية تؤمن بأن 'السيادة هي امتلاك صلاحيات الأدمن على مستقبلنا'. تركز على مواءمة البنى التحتية، الأنوية، والبرمجيات لتكون مستقلة ومملوكة وطنياً بعيداً عن التبعية التقنية.",
    vision: "سيادة تقنية وطنية كاملة عبر إنتاج النظم والبرمجيات محلياً بسواعد عراقية.",
    progress: 70,
    status: "Active",
    lead: "علي حسين هادي (Jemo)",
    leadSlug: "ali-jemo",
    team: ["علي حسين هادي (Jemo)", "شباب حركة ++IRAQ"],
    deliverables: ["الوثيقة الفكرية للسيادة التقنية", "منصة ++IRAQ الرقمية", "أدلة البنية التحتية المفتوحة"],
    milestones: [
      { title: "إطلاق الموقع الرسمي والمبادرة", date: "2026", done: true },
      { title: "نشر الرؤية الهندسية للدولة", date: "2026", done: true },
      { title: "ملتقيات السيادة التقنية", date: "2026", done: false },
    ],
    link: "https://iraqpss.lxds.org/",
    tags: ["Sovereignty", "National", "Iraq++", "Strategy"],
  },
  {
    id: "open-iraq-ai",
    image: "/initiatives/open-ai.jpg",
    slug: "open-iraq-ai",
    title: "مبادرة الذكاء الاصطناعي العراقي المفتوح",
    description: "توفير النماذج والبيانات والأدوات الأساسية لجميع الباحثين والطلاب مجاناً ودون قيود تجارية.",
    fullDescription: "تهدف هذه المبادرة إلى بناء منظومة شاملة من نماذج الذكاء الاصطناعي والبيانات والمكتبات البرمجية التي يمكن لأي باحث عراقي الوصول إليها واستخدامها وتعديلها وتوزيعها. نؤمن أن التكنولوجيا يجب أن تكون أداة تمكين جماعية وليست سلطة احتكارية، وأن كل باحث في العراق يستحق أدوات متقدمة لبناء مستقبله الرقمي.",
    vision: "ضمان عدم احتكار التكنولوجيا وتمكين أي باحث عراقي من بناء وتطوير نماذج ذكاء اصطناعي سيادية ذات جودة عالمية.",
    progress: 75,
    status: "Active",
    lead: "علي حسين هادي (Jemo)",
    leadSlug: "ali-jemo",
    team: ["علي حسين هادي (Jemo)"],
    deliverables: ["مجموعة بيانات شاملة", "نماذج أوزان مفتوحة", "دليل الباحث العربي"],
    milestones: [
      { title: "إطلاق المجموعة التدريبية", date: "يناير 2026", done: true },
      { title: "نماذج أوزان أولية", date: "مايو 2026", done: true },
      { title: "دليل الباحث العربي", date: "سبتمبر 2026", done: false },
      { title: "نشر النماذج المتقدمة", date: "ديسمبر 2026", done: false },
    ],
    link: "https://github.com/Ali-Jemo",
    tags: ["AI", "Arabic LLMs", "Open Data"],
  },
  {
    id: "open-datasets-iraq",
    image: "/initiatives/datasets.jpg",
    slug: "open-datasets-iraq",
    title: "بيانات العراق المفتوحة",
    description: "تجميع وأرشفة البيانات الجغرافية، البيئية، والتاريخية العراقية في مستودعات أكاديمية سهلة الاستخدام.",
    fullDescription: "تجمع هذه المبادرة البيانات الجغرافية والبيئية والتاريخية العراقية في مستودعات أكاديمية موحدة وسهلة الاستخدام، مع واجهات برمجية API مجانية تسمح للباحثين والمطورين بالوصول إلى هذه البيانات وبناء تطبيقات تستند إلى الواقع العراقي.",
    vision: "توفير أرضية صلبة للأبحاث التطبيقية المبنية على واقع البيئة والمجتمع العراقي.",
    progress: 90,
    status: "Scaling",
    lead: "علي حسين هادي (Jemo)",
    leadSlug: "ali-jemo",
    team: ["علي حسين هادي (Jemo)"],
    deliverables: ["منصة أرشفة مفتوحة", "واجهة برمجية API مجانية", "دليل النشر الرقمي"],
    milestones: [
      { title: "إطلاق المنصة", date: "مارس 2026", done: true },
      { title: "واجهة API الأولى", date: "يونيو 2026", done: true },
      { title: "دليل النشر الرقمي", date: "أغسطس 2026", done: true },
      { title: "التوسع للبيانات البيئية", date: "ديسمبر 2026", done: false },
    ],
    tags: ["Data", "Geospatial", "API"],
  },
  {
    id: "arabic-nlp-initiative",
    image: "/initiatives/nlp.jpg",
    slug: "arabic-nlp",
    title: "مبادرة معالجة اللغة العربية العلمية",
    description: "تطوير أدوات ومكتبات برمجية متخصصة في فهم النصوص الطبية والأكاديمية باللغة العربية.",
    fullDescription: "تطوير مجموعة متكاملة من الأدوات والمكتبات البرمجية المتخصصة في فهم النصوص الطبية والأكاديمية باللغة العربية، بما في ذلك أدوات التقطيع والمعجمات المتخصصة ومقيمات الاستدلال التي تدعم البحث العلمي العربي.",
    vision: "سد الفجوة المعرفية بين المحتوى الأكاديمي العالمي والمحتوى المتاح باللغة العربية.",
    progress: 60,
    status: "Research",
    lead: "علي حسين هادي (Jemo)",
    leadSlug: "ali-jemo",
    team: ["علي حسين هادي (Jemo)"],
    deliverables: ["مكتبة تقطيع النصوص", "معجم المصطلحات التقنية", "مقيم الاستدلال العربي"],
    milestones: [
      { title: "مكتبة تقطيع النصوص", date: "فبراير 2026", done: true },
      { title: "معجم المصطلحات", date: "أغسطس 2026", done: false },
      { title: "مقيم الاستدلال العربي", date: "نوفمبر 2026", done: false },
    ],
    link: "https://github.com/Ali-Jemo",
    tags: ["NLP", "Arabic", "Medical"],
  },
  {
    id: "digital-house-of-wisdom",
    image: "/initiatives/dhw.jpg",
    slug: "digital-house-of-wisdom",
    title: "مبادرة بيت الحكمة الرقمي",
    description: "إعادة بناء التراث العلمي لبغداد برؤية رقمية حديثة تدمج الأبحاث، المخطوطات، والتعليم المفتوح.",
    fullDescription: "إعادة بناء التراث العلمي لبغداد الرقمي باستخدام تقنيات حديثة تدمج الأبحاث والمخطوطات التاريخية والتعليم المفتوح في منصة واحدة شاملة، مستوحاة من روح بيت الحكمة العريق كرمز للمعرفة المفتوحة.",
    vision: "جعل JEMO المنارة الرقمية الحديثة لبيت الحكمة العريق.",
    progress: 85,
    status: "Scaling",
    lead: "علي حسين هادي (Jemo)",
    leadSlug: "ali-jemo",
    team: ["علي حسين هادي (Jemo)"],
    deliverables: ["متحف العلوم الرقمي", "أرشيف الأوراق المفتوحة", "دليل الباحث المستقل"],
    milestones: [
      { title: "المتحف الرقمي", date: "أبريل 2026", done: true },
      { title: "أرشيف الأوراق", date: "يوليو 2026", done: true },
      { title: "دليل الباحث المستقل", date: "سبتمبر 2026", done: false },
    ],
    link: "https://github.com/Ali-Jemo",
    tags: ["Heritage", "Digital", "Education"],
  },
  {
    id: "100-iraqi-researchers",
    image: "/initiatives/researchers.jpg",
    slug: "100-iraqi-researchers",
    title: "مبادرة 100 باحث عراقي",
    description: "برنامج زمالة ودعم لـ 100 عقل عراقي شاب لتأهيلهم لنشر أبحاث عالمية المستوى.",
    fullDescription: "برنامج زمالة مكثف ودعم شامل لـ 100 عقل عراقي شاب لتأهيلهم لنشر أبحاث عالمية المستوى، يشمل التوجيه الأكاديمي من كبار الباحثين وتمويل نشر الأوراق وتوفير الموارد الحاسوبية المتقدمة اللازمة لإجراء الأبحاث.",
    vision: "بناء الرصيد البشري العلمي الذي سيقود التحول التكنولوجي في المنطقة.",
    progress: 50,
    status: "Research",
    lead: "علي حسين هادي (Jemo)",
    leadSlug: "ali-jemo",
    team: ["علي حسين هادي (Jemo)"],
    deliverables: ["برنامج توجيه أكاديمي", "تمويل نشر الأوراق", "توفير الموارد الحاسوبية"],
    milestones: [
      { title: "بدء التوظيف", date: "يناير 2026", done: true },
      { title: "الزمالة الأولى", date: "يونيو 2026", done: true },
      { title: "50 باحث مؤهل", date: "ديسمبر 2026", done: false },
      { title: "الهدف الكامل 100", date: "2028", done: false },
    ],
    link: "https://github.com/Ali-Jemo",
    tags: ["Fellowship", "Talent", "Mentorship"],
  }
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "news-1",
    slug: "jemo-labs-founding-announcement",
    title: "إطلاق JEMO LABS كمؤسسة أبحاث مستقلة لبناء بيت الحكمة الرقمي",
    category: "أخبار المؤسسة",
    date: "2026-06-01",
    summary: "أعلنت JEMO LABS اليوم عن انطلاق أعمالها الأكاديمية والبحثية لتقديم نموذج جديد للمؤسسات العلمية المفتوحة في الشرق الأوسط.",
    content: "تأتي هذه الخطوة استجابة للحاجة الماسة لوجود بيئة بحثية مستقلة تضع المعرفة المفتوحة والسيادة التكنولوجية في مقدمة أولوياتها."
  },
  {
    id: "news-2",
    slug: "ziqa-kernel-first-release",
    title: "مختبر أنظمة التشغيل يعلن عن نتائج اختبارات أداء نواة Ziqa Kernel",
    category: "أخبار المشاريع",
    date: "2026-05-18",
    summary: "حققت نواة Ziqa أداءً استثنائياً في اختبارات الكفاءة وعزل أخطاء الذاكرة مقارنة بالنوى التقليدية.",
    content: "نجح الفريق في إثبات قدرة النواة على العمل تحت أقصى حظر تشغيلي وبأقل استهلاك للموارد.",
    labSlug: "os-lab",
  },
  {
    id: "news-3",
    slug: "baghdad-conference-2026",
    title: "JEMO LABS تشارك في المؤتمر العربي للذكاء الاصطناعي والأنظمة السيادية",
    category: "المؤتمرات",
    date: "2026-04-10",
    summary: "استعرض باحثو المؤسسة 3 أوراق علمية حول نماذج اللغة العربية والسيادة الرقمية.",
    content: "شهدت مشاركة المؤسسة اهتماماً واسعاً من الأوساط الأكاديمية والجامعات العراقية والإقليمية."
  },
  {
    id: "news-4",
    slug: "efficient-inference-paper-published",
    title: "نشر ورقة بحثية جديدة عن الاستدلال الكفؤ للنماذج اللغوية العربية",
    category: "أخبار المشاريع",
    date: "2026-06-23",
    summary: "حققت تقنية التكميم والإسقاط تقليل حجم النماذج بنسبة 60% مع الحفاظ على دقة الاستدلال.",
    content: "تفتح هذه الورقة الباب لنشر نماذج عربية قوية على أجهزة محدودة الموارد، وهو إنجاز في سبيل السيادة الرقمية."
  },
  {
    id: "news-5",
    slug: "formal-verification-milestone",
    title: "إثبات رسمي لخلو مجدول Ziqa من حالات الجمود",
    category: "أخبار المشاريع",
    date: "2026-07-06",
    summary: "أكمل مختبر أنظمة التشغيل التحقق الرسمي الكامل لخصائص الإنصاف وتأخر الاستجابة في المجدول.",
    content: "يشكل هذا الإثبات خطوة نحو الاعتماد في الأنظمة الحرجة عالية الموثوقية."
  },
  {
    id: "news-6",
    slug: "university-partnership-signed",
    title: "توقيع اتفاقية تعاون بحثي مع الجامعة التكنولوجية",
    category: "التعاونات",
    date: "2026-05-20",
    summary: "تعاون مشترك في مجالات الرؤية الحاسوبية والذكاء الاصطناعي الصحي وتبادل الباحثين.",
    content: "تنص الاتفاقية على إتاحة الموارد الحاسوبية للطلبة وإشراكهم في المشاريع مفتوحة المصدر."
  },
  {
    id: "news-7",
    slug: "open-dataset-release",
    title: "إصدار مجموعة بيانات العراق المفتوحة للمعالجة اللغوية",
    category: "أخبار المؤسسة",
    date: "2026-07-19",
    summary: "أكبر مجموعة بيانات نصية علمية عربية متاحة مجاناً للباحثين بموجب رخصة مفتوحة.",
    content: "تدعم مجموعة البيانات تدريب وتقييم النماذج اللغوية على السياقات الإقليمية واللهجات."
  },
  {
    id: "news-8",
    slug: "hackathon-winners-announced",
    title: "إعلان الفائزين بهاكاثون الذكاء الاصطناعي العربي",
    category: "الجوائز",
    date: "2026-10-03",
    summary: "توجت ثلاثة مشاريع مبتكرة اعتمدت على نموذج بغداد في حلول الرعاية الصحية والتعليم.",
    content: "يحصل الفائزون على منح بحثية وفرصة تطوير مشاريعهم ضمن مختبرات المؤسسة."
  }
];

export const OPEN_SOURCE_REPOS: OpenSourceRepo[] = [
  {
    name: "ziqa-kernal",
    description: "Freestanding Rust/Zig OS kernel with GUI compositor mode, System Monitor, and QEMU build flow.",
    url: "https://github.com/Ali-Jemo/ziqa-kernal",
    license: "MIT / Apache-2.0",
    stars: 45,
    forks: 12,
    language: "Rust"
  },
  {
    name: "axiq-os",
    description: "Three-Floor Sovereign Operating System architecture & services: hardware core, OS services, and userspace ABI.",
    url: "https://github.com/Ali-Jemo/axiq-os",
    license: "GPL-3.0 / MIT",
    stars: 32,
    forks: 8,
    language: "C"
  },
  {
    name: "MoEasy",
    description: "Experimental library for the Mojo programming language accelerating AI workflows.",
    url: "https://github.com/Ali-Jemo/MoEasy",
    license: "Apache-2.0",
    stars: 28,
    forks: 5,
    language: "Mojo"
  },
  {
    name: "waybar-config",
    description: "Complete Waybar configuration for Hyprland/Sway with multi-theme support, custom scripts, and agent workflow.",
    url: "https://github.com/Ali-Jemo/waybar-config",
    license: "MIT",
    stars: 22,
    forks: 4,
    language: "Shell"
  },
  {
    name: "DSP",
    description: "Real-time digital signal processing, spectral analysis, and noise reduction algorithms.",
    url: "https://github.com/Ali-Jemo/DSP",
    license: "MIT",
    stars: 19,
    forks: 3,
    language: "TypeScript"
  },
  {
    name: "zk-skill-package",
    description: "Agentic workflow and terminal automation skill package for systems engineering.",
    url: "https://github.com/Ali-Jemo/zk-skill-package",
    license: "MIT",
    stars: 16,
    forks: 2,
    language: "Shell"
  },
  {
    name: "ziqa-setting_app",
    description: "Desktop settings and control panel application for Ziqa OS.",
    url: "https://github.com/Ali-Jemo/ziqa-setting_app",
    license: "MIT",
    stars: 14,
    forks: 2,
    language: "Rust"
  },
  {
    name: "labpoint-ashurix",
    description: "Internal digital currency and tokenomics system for the LabPoint academic platform.",
    url: "https://github.com/Ali-Jemo/labpoint-ashurix",
    license: "MIT",
    stars: 18,
    forks: 4,
    language: "JavaScript"
  }
];

export const FINANCIAL_SUPPORTS = {
  quote: "كل دولار يتلقاه المختبر يُوجه بنسبة 100% لتطوير الأبحاث وتوفير البنية التحتية المفتوحة.",
  breakdown: [
    { title: "تمويل الأبحاث ورواتب الباحثين", percentage: 50, desc: "تفرغ العقول العلمية للبحث الصافي." },
    { title: "شراء الأجهزة والمعدات الحاسوبية", percentage: 25, desc: "خوادم GPU فائقة الأداء والتجهيزات الميدانية." },
    { title: "رسوم نشر الأوراق والمؤتمرات", percentage: 15, desc: "ضمان وصول الأوراق للمؤتمرات العالمية المفتوحة." },
    { title: "استضافة الخوادم والنطاقات", percentage: 10, desc: "إتاحة مستودعات البيانات والموقع للعموم مجاناً." }
  ],
  commitments: [
    "تقرير مالي سنوي منشور ومحقق تدقيقياً للعموم.",
    "عدم قبول أي تمويل مشروط يوجه أو يحد من حرية ونشر نتائج الأبحاث.",
    "كافة المخرجات الممولَة تُتاح فوراً تحت رخص المصادر المفتوحة."
  ]
};

export type FinancialSupports = typeof FINANCIAL_SUPPORTS;

export const PARTNERS: Partner[] = [];

export const EVENTS: EventItem[] = [
  {
    id: "event-1",
    title: "سمبوزيوم أنظمة التشغيل السيادية والنوى الآمنة",
    date: "2026-08-15",
    location: "بغداد / عبر الإنترنت",
    type: "ندوة علمية",
    description: "ورشة مكثفة تجمع مهندسي النوى لاستعراض معمارية Rust في الأنظمة الحرجة.",
    speakers: ["علي حسين هادي (Jemo)"]
  },
  {
    id: "event-2",
    title: "هاكاثون الذكاء الاصطناعي العربي مفتوح المصدر",
    date: "2026-10-01",
    location: "مجمع JEMO LABS الرقمي",
    type: "هاكاثون",
    description: "تحدي 48 ساعة لتطوير تطبيقات وحلول تعتمد على نماذج بغداد اللغوية.",
    speakers: ["علي حسين هادي (Jemo)"]
  },
  {
    id: "event-3",
    title: "ورشة عمل: بناء النوى الآمنة بلغة Rust",
    date: "2026-09-12",
    location: "بغداد / عبر الإنترنت",
    type: "ورشة عمل",
    description: "ورشة عملية مكثفة لتصميم مكونات نواة آمنة الذاكرة باستخدام Rust ونظام Ziqa.",
    speakers: ["علي حسين هادي (Jemo)"]
  },
  {
    id: "event-4",
    title: "ندوة: تسريع حسابات الذكاء الاصطناعي وهندسة الحوسبة بلغة Mojo",
    date: "2026-11-05",
    location: "قاعة المؤتمرات — بغداد / عبر الإنترنت",
    type: "ندوة علمية",
    description: "استعراض عملي لمكتبة MoEasy وكيفية استغلال مسارات العتاد المتوازي في الحسابات العصبية.",
    speakers: ["علي حسين هادي (Jemo)"]
  },
  {
    id: "event-5",
    title: "هاكاثون النظم المدمجة ومعالجة الإشارات (Embedded DSP)",
    date: "2026-12-15",
    location: "مجمع JEMO الرقمي",
    type: "هاكاثون",
    description: "تحدي 36 ساعة لتطوير واجهات تحكم مادية وخوارزميات معالجة إشارات فورية على منصات مدمجة مفتوحة المصدر.",
    speakers: ["علي حسين هادي (Jemo)"]
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    category: "النشر العلمي",
    question: "كيف يتم تقييم ونشر الأبحاث في JEMO LABS؟",
    answer: "تخضع كافة الأوراق لتدقيق داخلي محكم من لجنة الأبحاث قبل إرسالها للمؤتمرات الدولية المرموقة، وتُنشر النسخ المسبقة (Preprints) فوراً في مستودعنا المفتوح."
  },
  {
    category: "النشر العلمي",
    question: "هل تتوفر البيانات والشيفرات المصدرية للأبحاث؟",
    answer: "نعم، النشر في JEMO LABS يشترط إتاحة الكود المصدري ومجموعات البيانات تحت رخص مفتوحة مثل MIT أو Apache-2.0."
  },
  {
    category: "الانضمام",
    question: "كيف يمكنني الانضمام كباحث أو متطوع؟",
    answer: "يمكنك التقدم عبر صفحة 'الانضمام إلينا' باختيار مسارك المناسب (باحث، مطور، مصمم، مترجم، موجه). نقيم الطلبات بناءً على الشغف والأثر والمؤهلات."
  },
  {
    category: "التمويل والمنح",
    question: "من أين تأتي تمويلات JEMO LABS؟",
    answer: "نعتمد على التمويل الذاتي، التبرعات المستقلة غير المشروطة، والمنح الأكاديمية غير الربحية التي لا تؤثر على حرية ونشر الأبحاث."
  },
  {
    category: "الملكية الفكرية",
    question: "ما هي سياسة الملكية الفكرية في المختبرات؟",
    answer: "كافة الابتكارات والشيفرات والأوراق المنتجة هي ملكية عامة للمجتمع العلمي، مرخصة برخص مفتوحة تضمن حق الجميع في الاستخدام والتطوير."
  }
];
export interface Benchmark {
  id: string;
  name: string;
  category: string;
  description: string;
  metricName: string;
  jemoScore: string;
  baselineScore: string;
  sotaScore: string;
  paperSlug: string;
  datasetUrl: string;
}

export interface InfrastructureItem {
  id: string;
  name: string;
  category: string;
  specs: string;
  purpose: string;
  location: string;
  status: "Online" | "Expanding" | "Planned" | "مُستخدم";
}

export const BENCHMARKS: Benchmark[] = [
  {
    id: "baghdad-arabic-reasoning",
    name: "Baghdad LLM Arabic Reasoning Leaderboard",
    category: "Natural Language Processing",
    description: "Evaluates multi-turn reasoning and scientific domain understanding across Arabic dialects and formal MSA.",
    metricName: "Accuracy (%)",
    jemoScore: "87.4%",
    baselineScore: "74.1%",
    sotaScore: "85.2%",
    paperSlug: "open-iraq-arabic-nlp",
    datasetUrl: "https://github.com/jemo-labs/open-datasets"
  },
  {
    id: "ziqa-latency-bench",
    name: "Ziqa Microkernel IPC Latency Benchmark",
    category: "Operating Systems",
    description: "Measures Inter-Process Communication (IPC) context switch overhead in microseconds under stress.",
    metricName: "Latency (μs)",
    jemoScore: "0.42 μs",
    baselineScore: "0.85 μs",
    sotaScore: "0.48 μs",
    paperSlug: "ziqa-kernel-architecture",
    datasetUrl: "https://github.com/Ali-Jemo/ziqa-kernal"
  },
  {
    id: "manuscript-ocr-cer",
    name: "Arabic Historical Manuscript OCR Character Error Rate",
    category: "Computer Vision",
    description: "Measures accuracy on heavily degraded 10th-14th century Baghdad manuscript scans.",
    metricName: "Character Error Rate (CER)",
    jemoScore: "2.1%",
    baselineScore: "8.4%",
    sotaScore: "3.2%",
    paperSlug: "arabic-manuscripts-vision-restoration",
    datasetUrl: "https://github.com/jemo-labs/manuscript-ocr"
  }
];

export const INFRASTRUCTURE: InfrastructureItem[] = [
  {
    id: "cloudflare-edge",
    name: "شبكة الحوسبة السحابية الطرفية (Cloudflare Workers)",
    category: "Edge & Serverless",
    specs: "V8 Isolate Edge Runtime, Global CDN, OpenNext Architecture, DDoS Shield",
    purpose: "استضافة وتوزيع منصة JEMO وخدمة استجابات الـ API بسرعة استجابة عالية",
    location: "Cloudflare Global Edge",
    status: "مُستخدم"
  },
  {
    id: "supabase-db",
    name: "قاعدة البيانات وإدارة السجلات (Supabase PostgreSQL)",
    category: "Database & Storage",
    specs: "PostgreSQL Engine, Citext Extensions, Row Level Security, Automated Backups",
    purpose: "حفظ واسترجاع كائنات البحث، المراجعات، الاستمارات، وتتبع الطلبات",
    location: "Supabase Cloud Infrastructure",
    status: "مُستخدم"
  },
  {
    id: "clerk-auth",
    name: "منظومة التوثيق والتحقق من الهوية (Clerk)",
    category: "Identity & Access",
    specs: "Token Handshake, OAuth2, RBAC, Server-side Session Guards",
    purpose: "إدارة هويات الباحثين وتأمين مسارات ولوحة الإدارة",
    location: "Managed Cloud Auth",
    status: "مُستخدم"
  },
  {
    id: "dev-workstations",
    name: "بيئة التطوير والاختبار التجريبي (Dev Workstations)",
    category: "Development & Testing",
    specs: "Rust Toolchain, QEMU Emulation (RISC-V / x86_64), Linux Dev Environments",
    purpose: "تطوير واختبار معمارية نواة Ziqa، محاكاة الذاكرة، وبناء الأدوات البرمجية",
    location: "العراق (محلي)",
    status: "مُستخدم"
  }
];

export const PEER_REVIEW_POLICY = {
  title: "سياسة النشر والتحقق المفتوح",
  summary: "يُفحص أي كائن بحثي قبل النشر عبر بوابة الذكاء الاصطناعي (Jev) للفحص الآلي — لا توجد هيئة تحرير بشرية مستقلة، ولا نلتزم بإصدار DOI لكل عمل.",
  guidelines: [
    "الشفافية الكاملة: نشر الكود البرمجي والمنهجية المتبعة مع كل عمل كلما أمكن ذلك.",
    "المراجعة المجتمعية المفتوحة: تتاح مراجعات التكرار والتحديات المضادة للجمهور مباشرة في شجرة التراكم.",
    "التحقق الآلي: فحص مدخلات الأبحاث آلياً لتقييم الدقة والصلة والتصنيف دون ادعاء مراجعة بشرية مؤسسية.",
    "استقلالية النشر: النشر مجاني ومفتوح بلا أي رسوم نشر أو اشتراكات تجارية."
  ]
};
