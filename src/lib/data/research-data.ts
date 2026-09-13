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
  doi?: string;
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
  papers: 15,
  projects: 8,
  researchers: 12,
  fields: 8,
  founded: 2024,
};

export const ABOUT_INFO = {
  nameMeaning: "JEMO (علي حسين هادي) هي الطبقة الهندسية التشاركية بين السؤال والمعرفة، وبين العقل البشري والأنظمة الذكية — مساحة توثيق وحفظ الاكتشافات البرمجية وهندسة النظم.",
  whyCreated: "تأسست المنصة ومبادرات JEMO لتكون سجلاً مفتوحاً لاكتشافات وأبحاث عصر النظم والذكاء الاصطناعي: منصة لحفظ الأبحاث والاستقصاءات الهندسية، وتطوير أنظمة تشغيل سيادية ونوى مدمجة (مثل ZiqaKernel وAxiq-IQ) مع إتاحة المعرفة المفتوحة للجميع في العراق والعالم.",
  coreQuote: "السيادة التقنية هي امتلاك صلاحيات الأدمن على مستقبلنا — من النواة إلى واجهات الذكاء الاصطناعي.",
  mission: "بناء وتوثيق النظم البرمجية من طبقاتها الدنيا، ودعم البحث الهندسي الرصين، وتمكين الشباب العراقي والعربي من امتلاك زمام التكنولوجيا عبر الأنوية المفتوحة ومبادرات الذكاء الاصطناعي التطوعية.",
  vision: "أن تكون JEMO المنصة والمرجع العربي الأول في هندسة النظم، نوى التشغيل، والذكاء الاصطناعي السيادي: رصيد معرفي حي مبني على التحقق البشري الصارم وبرهان العمل (Proof of Work).",
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

export const RESEARCH_LABS: Lab[] = [
  {
    id: "ai-lab",
    slug: "ai-lab",
    name: "مختبر الذكاء الاصطناعي",
    nameEn: "AI Lab",
    description: "يركز على تطوير النماذج اللغوية الكبيرة باللغة العربية، خوارزميات الاستدلال، وتصميم شبكات عصبية كفؤة.",
    leadName: "علي حسين هادي (Jemo)",
    leadSlug: "ali-jemo",
    researchersCount: 18,
    activeProjectsCount: 5,
    publishedPapersCount: 11,
    focusAreas: ["Arabic LLMs", "Neural Architecture Search", "Efficient Inference"],
    iconName: "Cpu"
  },
  {
    id: "os-lab",
    slug: "os-lab",
    name: "مختبر أنظمة التشغيل",
    nameEn: "Operating Systems Lab",
    description: "أبحاث النوى الصغيرة (Microkernels)، الحوسبة الآمنة بلغات مثل Rust، وهندسة المعالجات المعمارية.",
    leadName: "فلان الفلاني (John Doe)",
    leadSlug: "john-doe",
    researchersCount: 12,
    activeProjectsCount: 3,
    publishedPapersCount: 6,
    focusAreas: ["Ziqa Kernel", "Memory Safety", "Real-Time Systems"],
    iconName: "Terminal"
  },
  {
    id: "cv-lab",
    slug: "cv-lab",
    name: "مختبر الرؤية الحاسوبية",
    nameEn: "Computer Vision Lab",
    description: "معالجة الصور الطبية، التعرف على المخطوطات التاريخية العربية، وأنظمة الرؤية للمركبات ذاتية القيادة.",
    leadName: "فلانة الفلانية (Jane Doe)",
    leadSlug: "jane-doe",
    researchersCount: 9,
    activeProjectsCount: 2,
    publishedPapersCount: 4,
    focusAreas: ["Historical OCR", "Medical Imaging", "Edge Vision"],
    iconName: "Eye"
  },
  {
    id: "robotics-lab",
    slug: "robotics-lab",
    name: "مختبر الروبوتات",
    nameEn: "Robotics Lab",
    description: "التحكم الميكاترونيكي، أنظمة الملاحة الذاتية في البيئات القاسية، والروبوتات المساعدة.",
    leadName: "باحث افتراضي (Alex Smith)",
    leadSlug: "alex-smith",
    researchersCount: 7,
    activeProjectsCount: 2,
    publishedPapersCount: 3,
    focusAreas: ["Kinematics", "Autonomous Navigation", "Embedded Control"],
    iconName: "Bot"
  },
  {
    id: "healthcare-ai",
    slug: "healthcare-ai",
    name: "مختبر الذكاء الاصطناعي الصحي",
    nameEn: "Healthcare AI",
    description: "تطبيقات التشخيص المبكر للأمراض وتطوير نماذج المساعدة الطبية بالاعتماد على البيانات الإقليمية.",
    leadName: "باحث تجريبي (Max Mustermann)",
    leadSlug: "max-mustermann",
    researchersCount: 5,
    activeProjectsCount: 1,
    publishedPapersCount: 2,
    focusAreas: ["Diagnostics", "EHR Analysis", "Predictive Medicine"],
    iconName: "Activity"
  },
  {
    id: "bioinformatics",
    slug: "bioinformatics",
    name: "مختبر المعلوماتية الحيوية",
    nameEn: "Bioinformatics Lab",
    description: "تحليل التسلسل الجيني، طي البروتينات، وحوسبة البيولوجيا الجزيئية.",
    leadName: "مساهم افتراضي (Sample Fellow)",
    leadSlug: "sample-fellow",
    researchersCount: 4,
    activeProjectsCount: 1,
    publishedPapersCount: 1,
    focusAreas: ["Genomics", "Protein Folding", "Biostatistics"],
    iconName: "Dna"
  }
];

export const RESEARCHERS: Researcher[] = [
  {
    id: "ali-jemo",
    slug: "ali-jemo",
    name: "علي حسين هادي (Jemo)",
    role: "مهندس أنظمة ومطور أنظمة تشغيل · مؤسس المنصة وفريق Axiq",
    bio: "مهندس أنظمة عراقي ومؤسس فريق Axiq ومطور نواة ZiqaKernel ونظام Axiq-IQ. طالب هندسة تقنيات الحاسوب، يركز على الأنظمة منخفضة المستوى (Rust، C، Linux Kernel)، معمارية أنظمة التشغيل، ومبادرات الذكاء الاصطناعي والسيادة التقنية في العراق.",
    avatar: "/team/ali.jpg",
    labSlug: "ai-lab",
    orcid: "0000-0002-1825-0001",
    github: "https://github.com/Ali-Jemo",
    website: "https://ali.lxds.org/",
    telegram: "https://t.me/alijemo",
    email: "ali.jemo1.9@gmail.com",
    papersCount: 8,
    projectsCount: 8
  },
  {
    id: "john-doe",
    slug: "john-doe",
    name: "فلان الفلاني (John Doe)",
    role: "باحث افتراضي · مختبر أنظمة التشغيل (Dummy Researcher)",
    bio: "ملف افتراضي تجريبي مخصص لاختبار واجهات العرض وهيكلية الملفات الأكاديمية وتوثيق أبحاث النظم في المنصة.",
    avatar: "/jemo-logo.svg",
    labSlug: "os-lab",
    github: "https://github.com",
    email: "dummy.os@jemo.co",
    papersCount: 3,
    projectsCount: 2
  },
  {
    id: "jane-doe",
    slug: "jane-doe",
    name: "فلانة الفلانية (Jane Doe)",
    role: "باحثة افتراضية · مختبر الرؤية الحاسوبية (Dummy Researcher)",
    bio: "ملف افتراضي تجريبي مخصص لاختبار تدفق مراجعة الأقران وتوثيق أبحاث الرؤية الحاسوبية ومعالجة الصور.",
    avatar: "/jemo-logo.svg",
    labSlug: "cv-lab",
    github: "https://github.com",
    email: "dummy.cv@jemo.co",
    papersCount: 3,
    projectsCount: 1
  },
  {
    id: "alex-smith",
    slug: "alex-smith",
    name: "باحث افتراضي (Alex Smith)",
    role: "باحث افتراضي · مختبر الروبوتات (Dummy Researcher)",
    bio: "ملف تجريبي مخصص لاختبار نماذج المحاكاة الحركية وتوثيق مشاريع الروبوتات والأنظمة الذاتية المفتوحة.",
    avatar: "/jemo-logo.svg",
    labSlug: "robotics-lab",
    github: "https://github.com",
    email: "dummy.robotics@jemo.co",
    papersCount: 2,
    projectsCount: 1
  },
  {
    id: "max-mustermann",
    slug: "max-mustermann",
    name: "باحث تجريبي (Max Mustermann)",
    role: "باحث افتراضي · الذكاء الاصطناعي الصحي (Dummy Researcher)",
    bio: "ملف تجريبي مخصص لاختبار مجموعات البيانات الطبية ونماذج التقييم السريرية وتجربة واجهات الباحثين.",
    avatar: "/jemo-logo.svg",
    labSlug: "healthcare-ai",
    github: "https://github.com",
    email: "dummy.health@jemo.co",
    papersCount: 2,
    projectsCount: 1
  },
  {
    id: "sample-fellow",
    slug: "sample-fellow",
    name: "مساهم افتراضي (Sample Fellow)",
    role: "باحث افتراضي · مختبر المعلوماتية الحيوية (Dummy Researcher)",
    bio: "ملف تجريبي مخصص لاختبار خطوط معالجة البيانات الجينومية وتوثيق الأبحاث البيولوجية والحوسبة الجزيئية.",
    avatar: "/jemo-logo.svg",
    labSlug: "bioinformatics",
    github: "https://github.com",
    email: "dummy.bio@jemo.co",
    papersCount: 1,
    projectsCount: 1
  }
];

export const RESEARCH_PAPERS: Paper[] = [
  {
    id: "ai-assisted-arabic-texts-analysis",
    slug: "ai-assisted-arabic-texts-analysis",
    title: "استقصاء ومقارنة 6 نماذج ذكاء اصطناعي في تحليل واستعادة نصوص عربية تراثية",
    titleEn: "Comparative Investigation of 6 LLMs in Arabic Classical Text Retrieval & Analysis",
    abstract: "سجل رحلة بحثية استمرت 8 ساعات قارنت بين Claude 3.5 وGPT-4o وDeepSeek-R1 في تحليل وتصحيح نصوص عربية تالفة جزئياً، مع توثيق دقيق لأماكن هلوسة النماذج والتحقق البشري من المصادر التاريخية الأصلية لتصحيحها.",
    authors: [
      { name: "عمر الكرخي (مساهمة مجتمعية)", slug: "omar-al-karkhi", role: "باحث مواطن • AI-Assisted Research" }
    ],
    publishDate: "2026-08-15",
    doi: "10.1016/j.jemo.2026.08.019",
    pdfUrl: "/papers/arabic-texts-ai-study.pdf",
    datasetUrl: "https://github.com/jemo-labs/open-research-logs",
    codeUrl: "https://github.com/jemo-labs/open-research-logs",
    field: "سجلات الاكتشاف بالذكاء الاصطناعي",
    labSlug: "ai-lab",
    keywords: ["Research Story", "AI-Assisted", "Classical Arabic", "Human Verification", "Discovery Log"],
    citation: {
      bibtex: `@article{karkhi2026arabictexts,
  title={Comparative Investigation of 6 LLMs in Arabic Classical Text Retrieval & Analysis},
  author={Al-Karkhi, Omar},
  journal={JEMO Open Discovery Logs},
  year={2026}
}`,
      apa: "Al-Karkhi, O. (2026). Comparative Investigation of 6 LLMs in Arabic Classical Text Retrieval & Analysis. JEMO Open Discovery Logs, 1(4)."
    },
    featured: true,
    researchType: "Experiment",
    evidenceStatus: "Reproduced",
    lineage: {
      replicationsCount: 14,
      challengesCount: 2,
      extensionsCount: 3,
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
    responses: [
      {
        id: "rep-1",
        type: "replication",
        author: "د. خالد السامرائي",
        date: "2026-08-18",
        content: "أعدت التجربة على 10 مقاطع جديدة من كتاب الحيوان للجاحظ؛ تكررت نفس نسبة الهلوسة (حوالي 26%) في اختلاق المصادر الفرعية، مما يؤكد صحة استنتاج البحث.",
        verified: true
      },
      {
        id: "rep-2",
        type: "challenge",
        author: "م. أنس البغدادي",
        date: "2026-08-20",
        content: "عند تفعيل نمط التفكير العميق والبحث الحي في الويب، انخفضت نسبة الهلوسة إلى 8%؛ أرجو تحديث التجربة باختبار النمط الموصول بقواعد البيانات.",
        verified: false
      }
    ]
  },
  {
    id: "ai-debug-memory-leak-investigation",
    slug: "ai-debug-memory-leak-investigation",
    title: "حل معضلة تسريب الذاكرة في خدمات Node.js عالية الحمل عبر سلاسل التوجيه التكرارية",
    titleEn: "Resolving High-Load Node.js Memory Leak Through Iterative AI Prompt Chains",
    abstract: "توثيق استقصاء برمجي معمق: استخدام النماذج اللغوية لتحليل تفريغ الذاكرة (Heap Snapshot)، واكتشاف خطأ خفي في مصفوفات الإغلاق، مع تسجيل كيف قادت بعض الاقتراحات إلى مسارات خاطئة وكيف تم التحقق والاختبار الفعلي.",
    authors: [
      { name: "م. زيد التميمي (مساهمة مجتمعية)", slug: "zaid-al-tamimi", role: "مطور برمجيات • Bug Solved via AI" }
    ],
    publishDate: "2026-07-28",
    doi: "10.1016/j.jemo.2026.07.031",
    pdfUrl: "/papers/nodejs-memory-leak-ai.pdf",
    codeUrl: "https://github.com/jemo-labs/open-research-logs",
    field: "حلول برمجية بالذكاء الاصطناعي",
    labSlug: "ai-lab",
    keywords: ["Bug Solved via AI", "Node.js", "Memory Leak", "AI Debugging", "Prompt Chains"],
    citation: {
      bibtex: `@article{tamimi2026nodejsleak,
  title={Resolving High-Load Node.js Memory Leak Through Iterative AI Prompt Chains},
  author={Al-Tamimi, Zaid},
  journal={JEMO Open Discovery Logs},
  year={2026}
}`,
      apa: "Al-Tamimi, Z. (2026). Resolving High-Load Node.js Memory Leak Through Iterative AI Prompt Chains. JEMO Open Discovery Logs."
    },
    featured: true,
    researchType: "Quick Investigation",
    evidenceStatus: "Evidence-backed",
    lineage: {
      replicationsCount: 8,
      challengesCount: 1,
      extensionsCount: 2
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
    responses: [
      {
        id: "rep-node-1",
        type: "replication",
        author: "م. عمار الحلبي",
        date: "2026-08-01",
        content: "طبقت نفس تسلسل استجواب الـ Heap Snapshot على خدمة NestJS وتم اكتشاف تسريب مماثل في معالج WebSockets.",
        verified: true
      }
    ]
  },
  {
    id: "ziqa-kernel-paper",
    slug: "ziqa-kernel-architecture",
    title: "نواة Ziqa: مختبر تجريبي لنواة دقيقة آمنة الذاكرة بلغة Rust للأجهزة المدمجة",
    titleEn: "Ziqa Kernel: An Experimental Sandbox for Safe Microkernel Architectures in Rust",
    abstract: "نستعرض في هذه الورقة والمستودع المفتوح معمارية تجريبية (Experimental Sandbox) لنواة دقيقة مكتوبة بلغة Rust لاستكشاف عزل الأخطاء وإدارة الذاكرة الآمنة بدون كود غير آمن. المشروع تجربة استكشافية مفتوحة لدراسة جدوى البنى المصغرة وتطوير أنظمة تشغيل تعلمية خفيفة.",
    authors: [
      { name: "فلان الفلاني (John Doe)", slug: "john-doe", role: "مطور النواة (افتراضي)" },
      { name: "علي حسين هادي (Jemo)", slug: "ali-jemo", role: "مطور النواة والمصمم المعماري" }
    ],
    publishDate: "2026-05-14",
    doi: "10.1016/j.jemo.2026.05.001",
    pdfUrl: "/papers/ziqa-kernel.pdf",
    datasetUrl: "https://github.com/Ali-Jemo/ziqa-kernal",
    codeUrl: "https://github.com/Ali-Jemo/ziqa-kernal",
    field: "تجارب الفريق الاستكشافية",
    labSlug: "os-lab",
    keywords: ["Microkernel", "Rust", "Experimental Sandbox", "Memory Safety", "Ziqa Kernel"],
    citation: {
      bibtex: `@article{furati2026ziqa,
  title={Ziqa Kernel: An Experimental Sandbox for Safe Microkernel Architectures},
  author={Al-Furati, Ahmed and Jemo, Ali},
  journal={JEMO LABS Open Reports},
  year={2026},
  doi={10.1016/j.jemo.2026.05.001}
}`,
      apa: "Al-Furati, A., & Jemo, A. (2026). Ziqa Kernel: An Experimental Sandbox for Safe Microkernel Architectures in Rust. JEMO LABS Open Reports."
    },
    featured: true,
    researchType: "Full Research",
    evidenceStatus: "Evidence-backed",
    lineage: {
      replicationsCount: 19,
      challengesCount: 3,
      extensionsCount: 7
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
    responses: [
      {
        id: "rep-ziqa-1",
        type: "replication",
        author: "د. طارق السويدي",
        date: "2026-06-02",
        content: "تم تشغيل النواة على معالج RISC-V محاكى؛ اختبارات عزل مساحات العناوين أظهرت تطابقاً بنسبة 100% مع الورقة.",
        verified: true
      },
      {
        id: "rep-ziqa-2",
        type: "challenge",
        author: "م. يحيى البصري",
        date: "2026-06-15",
        content: "استهلاك الذاكرة في مرحلة الـ Boot يزيد بنسبة 4% عند تفعيل بروتوكول IPC المتزامن؛ مقترح تحسين تم إرفاقه.",
        verified: true
      }
    ]
  },
  {
    id: "arabic-nlp-paper",
    slug: "open-iraq-arabic-nlp",
    title: "تكييف النماذج اللغوية المفتوحة للهجات العراقية والمصطلحات التخصصية",
    titleEn: "Adapting Open-Weights LLMs for Iraqi Dialects and Domain Terminology",
    abstract: "تستعرض هذه الورقة والمبادرة تجربة ضبط وتكييف دقيق (Fine-tuning & Quantization) لنماذج لغوية مفتوحة المصدر لخدمة اللهجات العراقية والمصطلحات العلمية والتقنية، مع تقييم كفاءة الاستدلال على العتاد المتاح وإتاحة مجموعات الاختبار للباحثين مجاناً.",
    authors: [
      { name: "علي حسين هادي (Jemo)", slug: "ali-jemo", role: "المشرف الهندسي" },
      { name: "فلانة الفلانية (Jane Doe)", slug: "jane-doe", role: "باحث مشارك (افتراضي)" }
    ],
    publishDate: "2026-03-20",
    doi: "10.1016/j.jemo.2026.03.004",
    pdfUrl: "/papers/baghdad-llm.pdf",
    datasetUrl: "https://github.com/jemo-labs/open-iraq-dataset",
    codeUrl: "https://github.com/jemo-labs/baghdad-llm",
    field: "تجارب الفريق الاستكشافية",
    labSlug: "ai-lab",
    keywords: ["Arabic NLP", "Dialect Adaptation", "Open Weights", "Fine-Tuning"],
    citation: {
      bibtex: `@article{jemo2026baghdad,
  title={Adapting Open-Weights LLMs for Iraqi Dialects and Domain Terminology},
  author={Jemo, Ali and Al-Hussaini, Sara},
  journal={JEMO LABS AI Reports},
  year={2026}
}`,
      apa: "Jemo, A., & Al-Hussaini, S. (2026). Adapting Open-Weights LLMs for Iraqi Dialects and Domain Terminology. JEMO LABS AI Reports."
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
      { name: "فلانة الفلانية (Jane Doe)", slug: "jane-doe", role: "المؤلف الرئيسي (افتراضي)" }
    ],
    publishDate: "2026-01-10",
    doi: "10.1016/j.jemo.2026.01.012",
    pdfUrl: "/papers/manuscript-ocr.pdf",
    codeUrl: "https://github.com/jemo-labs/manuscript-ocr",
    field: "الرؤية الحاسوبية",
    labSlug: "cv-lab",
    keywords: ["OCR", "Heritage Restoration", "Document Analysis", "Computer Vision"],
    citation: {
      bibtex: `@article{hussaini2026restoration,
  title={Restoration of Rare Iraqi Manuscripts using Convolutional Vision Networks},
  author={Al-Hussaini, Sara},
  journal={Journal of Heritage Informatics},
  year={2026}
}`,
      apa: "Al-Hussaini, S. (2026). Restoration of Rare Iraqi Manuscripts using Convolutional Vision Networks. Journal of Heritage Informatics."
    }
  },
  {
    id: "efficient-arabic-inference",
    slug: "efficient-arabic-llm-inference",
    title: "استدلال كفؤ للنماذج اللغوية العربية عبر التكميم والإسقاط الانتقائي",
    titleEn: "Efficient Inference for Arabic LLMs via Quantization and Selective Pruning",
    abstract: "نقدم تقنية تكميم وإسقاط انتقائي تقلل حجم نماذج اللغة العربية بنسبة 60% مع الحفاظ على 97% من دقة الاستدلال، مما يجعل النشر على الأجهزة محدودة الموارد ممكناً.",
    authors: [
      { name: "فلانة الفلانية (Jane Doe)", slug: "jane-doe", role: "المؤلف الرئيسي (افتراضي)" },
      { name: "علي حسين هادي (Jemo)", slug: "ali-jemo", role: "المؤلف المشارك" }
    ],
    publishDate: "2026-06-22",
    doi: "10.1016/j.jemo.2026.06.002",
    pdfUrl: "/papers/efficient-arabic-inference.pdf",
    codeUrl: "https://github.com/jemo-labs/baghdad-llm",
    field: "الذكاء الاصطناعي",
    labSlug: "ai-lab",
    keywords: ["Quantization", "Pruning", "Edge Inference", "Arabic NLP"],
    citation: {
      bibtex: `@article{kindif2026efficient,
  title={Efficient Inference for Arabic LLMs via Quantization and Selective Pruning},
  author={Al-Kindif, Noor and Jemo, Ali},
  journal={JEMO LABS AI Reports},
  year={2026},
  doi={10.1016/j.jemo.2026.06.002}
}`,
      apa: "Al-Kindif, N., & Jemo, A. (2026). Efficient Inference for Arabic LLMs via Quantization and Selective Pruning. JEMO LABS AI Reports, 1(2)."
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
      { name: "فلان الفلاني (John Doe)", slug: "john-doe", role: "المؤلف الرئيسي (افتراضي)" }
    ],
    publishDate: "2026-07-05",
    doi: "10.1016/j.jemo.2026.07.001",
    pdfUrl: "/papers/ziqa-scheduler-verification.pdf",
    codeUrl: "https://github.com/Ali-Jemo/ziqa-kernal",
    field: "أنظمة التشغيل",
    labSlug: "os-lab",
    keywords: ["Formal Verification", "Scheduling", "Model Checking", "Rust"],
    citation: {
      bibtex: `@article{furati2026scheduler,
  title={Formal Verification of the Ziqa Kernel Scheduler},
  author={Al-Furati, Ahmed and Al-Basri, Omar},
  journal={JEMO LABS Systems Research},
  year={2026}
}`,
      apa: "Al-Furati, A., & Al-Basri, O. (2026). Formal Verification of the Ziqa Kernel Scheduler. JEMO LABS Systems Research."
    }
  },
  {
    id: "early-tumor-detection-mri",
    slug: "early-tumor-detection-mri",
    title: "كشف الأورام المبكر من صور الرنين المغناطيسي بتكييف إقليمي للنماذج",
    titleEn: "Early Tumor Detection from MRI with Region-Adaptive Model Tuning",
    abstract: "نقترح منهجية لتكييف نماذج التجزئة على البيانات الإشعاعية الإقليمية، محققةً تحسناً بنسبة 18% في الكشف المبكر عن الأورام مقارنة بالنماذج العامة.",
    authors: [
      { name: "فلانة الفلانية (Jane Doe)", slug: "jane-doe", role: "المؤلف الرئيسي (افتراضي)" }
    ],
    publishDate: "2026-04-28",
    doi: "10.1016/j.jemo.2026.04.003",
    pdfUrl: "/papers/early-tumor-detection.pdf",
    datasetUrl: "https://github.com/jemo-labs/open-datasets",
    field: "الرؤية الحاسوبية",
    labSlug: "cv-lab",
    keywords: ["Medical Imaging", "Segmentation", "Transfer Learning", "Healthcare AI"],
    citation: {
      bibtex: `@article{tikriti2026tumor,
  title={Early Tumor Detection from MRI with Region-Adaptive Model Tuning},
  author={Al-Tikriti, Lina and Al-Hussaini, Sara},
  journal={Journal of Medical Imaging and AI},
  year={2026}
}`,
      apa: "Al-Tikriti, L., & Al-Hussaini, S. (2026). Early Tumor Detection from MRI with Region-Adaptive Model Tuning. Journal of Medical Imaging and AI."
    }
  },
  {
    id: "slam-dusty-environments",
    slug: "slam-dusty-environments",
    title: "الملاحة الذاتية والملاحة المكانية في البيئات المغبرة منخفضة الرؤية",
    titleEn: "Robust SLAM in Low-Visibility Dusty Environments",
    abstract: "نقدم نهجاً لدمج بيانات الليدار والرؤية لتعويض تشتت الضوء في البيئات المغبرة، مما يحسّن دقة التموضع الذاتي للروبوتات بنسبة 40%.",
    authors: [
      { name: "باحث افتراضي (Alex Smith)", slug: "alex-smith", role: "المؤلف الرئيسي (افتراضي)" }
    ],
    publishDate: "2026-05-30",
    doi: "10.1016/j.jemo.2026.05.007",
    pdfUrl: "/papers/slam-dusty-environments.pdf",
    codeUrl: "https://github.com/jemo-labs",
    field: "الروبوتات",
    labSlug: "robotics-lab",
    keywords: ["SLAM", "Sensor Fusion", "LiDAR", "Autonomous Navigation"],
    citation: {
      bibtex: `@article{mosuli2026slam,
  title={Robust SLAM in Low-Visibility Dusty Environments},
  author={Al-Mosuli, Mustafa and Al-Baghdadi, Haider},
  journal={JEMO LABS Robotics Reports},
  year={2026}
}`,
      apa: "Al-Mosuli, M., & Al-Baghdadi, H. (2026). Robust SLAM in Low-Visibility Dusty Environments. JEMO LABS Robotics Reports."
    }
  },
  {
    id: "arabic-clinical-nlp",
    slug: "arabic-clinical-nlp-records",
    title: "معالجة لغوية طبية للسجلات الصحية العربية واستخراج التشخيصات",
    titleEn: "Clinical NLP for Arabic Health Records and Diagnosis Extraction",
    abstract: "نموذج لاستخراج الكيانات الطبية والتشخيصات من السجلات الصحية العربية غير المنظمة، بدقة 91% في تجارب على بيانات مستشفيات إقليمية.",
    authors: [
      { name: "باحث تجريبي (Max Mustermann)", slug: "max-mustermann", role: "المؤلف الرئيسي (افتراضي)" }
    ],
    publishDate: "2026-06-12",
    doi: "10.1016/j.jemo.2026.06.005",
    pdfUrl: "/papers/arabic-clinical-nlp.pdf",
    datasetUrl: "https://github.com/jemo-labs/open-datasets",
    field: "الذكاء الاصطناعي الصحي",
    labSlug: "healthcare-ai",
    keywords: ["Clinical NLP", "Named Entity Recognition", "Electronic Health Records", "Arabic"],
    citation: {
      bibtex: `@article{qadisiyya2026clinical,
  title={Clinical NLP for Arabic Health Records and Diagnosis Extraction},
  author={Al-Qadisiyya, Zainab and Al-Babili, Maryam},
  journal={Journal of Healthcare Informatics},
  year={2026}
}`,
      apa: "Al-Qadisiyya, Z., & Al-Babili, M. (2026). Clinical NLP for Arabic Health Records and Diagnosis Extraction. Journal of Healthcare Informatics."
    }
  },
  {
    id: "genomic-variant-pipeline",
    slug: "genomic-variant-calling-pipeline",
    title: "خط معالجة مفتوح المصدر لاستدعاء الطفرات الجينومية على بيانات إقليمية",
    titleEn: "Open-Source Genomic Variant Calling Pipeline for Regional Data",
    abstract: "نبني خط معالجة متوازياً لاستدعاء الطفرات الجينية يدعم البيانات الإقليمية ويقلل زمن التحليل بنسبة 55% عبر الجدولة على وحدات المعالجة الرسومية.",
    authors: [
      { name: "مساهم افتراضي (Sample Fellow)", slug: "sample-fellow", role: "المؤلف الرئيسي (افتراضي)" }
    ],
    publishDate: "2026-03-08",
    doi: "10.1016/j.jemo.2026.03.002",
    pdfUrl: "/papers/genomic-variant-pipeline.pdf",
    codeUrl: "https://github.com/jemo-labs",
    field: "المعلوماتية الحيوية",
    labSlug: "bioinformatics",
    keywords: ["Genomics", "Variant Calling", "GPU Acceleration", "Bioinformatics"],
    citation: {
      bibtex: `@article{kufi2026genomic,
  title={Open-Source Genomic Variant Calling Pipeline for Regional Data},
  author={Al-Kufi, Hussain and Al-Najafi, Youssef},
  journal={JEMO LABS Bioinformatics Reports},
  year={2026}
}`,
      apa: "Al-Kufi, H., & Al-Najafi, Y. (2026). Open-Source Genomic Variant Calling Pipeline for Regional Data. JEMO LABS Bioinformatics Reports."
    }
  },
  {
    id: "open-iraq-benchmark",
    slug: "open-iraq-evaluation-benchmark",
    title: "معيار تقييم مفتوح للنماذج اللغوية في السياق العربي والعراقي",
    titleEn: "An Open Evaluation Benchmark for LLMs in Arabic and Iraqi Contexts",
    abstract: "نقدم مجموعة معايير تقييم مفتوحة تقيس الاستدلال المنطقي والفهم الثقافي للنماذج اللغوية، وتكشف فجوات الأداء في اللهجات والمصطلحات الإقليمية.",
    authors: [
      { name: "فلانة الفلانية (Jane Doe)", slug: "jane-doe", role: "المؤلف الرئيسي (افتراضي)" },
      { name: "علي حسين هادي (Jemo)", slug: "ali-jemo", role: "المؤلف المشارك" }
    ],
    publishDate: "2026-07-18",
    doi: "10.1016/j.jemo.2026.07.004",
    pdfUrl: "/papers/open-iraq-benchmark.pdf",
    datasetUrl: "https://github.com/jemo-labs/open-datasets",
    codeUrl: "https://github.com/jemo-labs/baghdad-llm",
    field: "الذكاء الاصطناعي",
    labSlug: "ai-lab",
    keywords: ["Benchmarks", "Evaluation", "Arabic NLP", "Open Science"],
    citation: {
      bibtex: `@article{kindif2026benchmark,
  title={An Open Evaluation Benchmark for LLMs in Arabic and Iraqi Contexts},
  author={Al-Kindif, Noor and Jemo, Ali},
  journal={JEMO LABS AI Reports},
  year={2026}
}`,
      apa: "Al-Kindif, N., & Jemo, A. (2026). An Open Evaluation Benchmark for LLMs in Arabic and Iraqi Contexts. JEMO LABS AI Reports."
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
    labSlug: "robotics-lab",
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

export const PARTNERS: Partner[] = [
  { name: "جامعة بغداد", type: "جامعات", country: "العراق", logoUrl: "/globe.svg", website: "https://uobaghdad.edu.iq" },
  { name: "جامعة الموصل", type: "جامعات", country: "العراق", logoUrl: "/globe.svg", website: "https://uomisan.edu.iq" },
  { name: "الجامعة التكنولوجية", type: "جامعات", country: "العراق", logoUrl: "/globe.svg", website: "https://uotechnology.edu.iq" },
  { name: "مركز الأبحاث السيادية", type: "مؤسسات أبحاث", country: "الإقليمي", logoUrl: "/globe.svg", website: "#" },
  { name: "شبكة العلوم المفتوحة الدولية", type: "مراكز دولية", country: "عالمي", logoUrl: "/globe.svg", website: "#" }
];

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
    title: "ندوة: الذكاء الاصطناعي في التصوير الطبي",
    date: "2026-11-05",
    location: "قاعة المؤتمرات — الجامعة التكنولوجية",
    type: "ندوة علمية",
    description: "استعراض أحدث تطبيقات الرؤية الحاسوبية في التشخيص الطبي المبكر.",
    speakers: ["علي حسين هادي (Jemo)"]
  },
  {
    id: "event-5",
    title: "هاكاثون المعلوماتية الحيوية والجينوم",
    date: "2026-12-15",
    location: "مجمع JEMO LABS الرقمي",
    type: "هاكاثون",
    description: "تحدي 36 ساعة لتطوير أدوات تحليل الجينوم على البيانات الإقليمية المفتوحة.",
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
  status: "Online" | "Expanding" | "Planned";
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
    id: "hpc-cluster-1",
    name: "Baghdad-1 HPC Compute Cluster",
    category: "AI Supercomputing",
    specs: "32x NVIDIA H100 SXM5 80GB, InfiniBand Quantum-2 400Gbps, 2TB RAM",
    purpose: "Training sovereign Arabic LLMs & large-scale neural architectures",
    location: "JEMO LABS Computing Center",
    status: "Online"
  },
  {
    id: "riscv-lab-rack",
    name: "RISC-V Silicon & Microkernel Hardware Testbed",
    category: "Hardware & Operating Systems",
    specs: "64-node SiFive RISC-V development cluster, FPGA hardware emulators",
    purpose: "Formal verification and microkernel testing for Ziqa OS",
    location: "Embedded Systems Lab",
    status: "Online"
  },
  {
    id: "digitization-scanner",
    name: "Multispectral Manuscript Digitization Scanner",
    category: "Heritage Optics",
    specs: "150MP Phase One Multispectral Imaging Camera, UV/IR light arrays",
    purpose: "Digitizing and restoring ancient Iraqi manuscripts",
    location: "Computer Vision Cleanroom",
    status: "Expanding"
  }
];

export const PEER_REVIEW_POLICY = {
  title: "Open Peer Review & Ethical Research Policy",
  summary: "JEMO LABS operates on rigorous open scientific principles. All papers undergo double-blind internal review followed by immediate public preprint deposit with open reviewer notes.",
  guidelines: [
    "Complete Transparency: Source code, hyper-parameters, and datasets MUST accompany every publication.",
    "Open Reviewer Notes: Peer review reports and revision history are archived alongside the paper DOI.",
    "Ethical Computing: AI models undergo safety evaluation for bias, safety, and non-proliferation.",
    "Reproducibility Guarantee: Independent researchers must be able to reproduce benchmarks within 3 commands."
  ]
};
