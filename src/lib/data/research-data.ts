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
  papers: 27,
  projects: 14,
  researchers: 53,
  fields: 12,
  founded: 2026,
};

export const ABOUT_INFO = {
  nameMeaning: "JEMO هي الطبقة التشاركية بين السؤال والمعرفة، وبين العقل البشري والذكاء الاصطناعي — المكان الذي يذهب إليه الناس بعد أن بحثوا لتوثيق ومشاركة ما اكتشفوه.",
  whyCreated: "تأسست JEMO لتكون سجلاً مفتوحاً لاكتشافات وأبحاث عصر الذكاء الاصطناعي: منصة لحفظ الأبحاث والاستقصاءات التي يجريها الناس يومياً بمساعدة نماذج AI، وتحويل محادثات البحث العميقة التي تضيع في الحسابات الشخصية إلى رصيد معرفي عام ومفتوح للجميع.",
  coreQuote: "كل سؤال يمكن أن يصبح بحثًا، وكل بحث يمكن أن يصبح معرفة.",
  mission: "حفظ وتوثيق نتائج البحث البشري المدعوم بالذكاء الاصطناعي في سجل عام مفتوح، وتمكين أي شخص — أكاديمياً كان أو مطوراً أو باحثاً هاوياً — من توثيق مسار بحثه ومشاركة اكتشافاته وحمايتها من الضياع.",
  vision: "أن تصبح JEMO المنصة المفتوحة الأولى لاكتشافات العقل البشري في عصر الذكاء الاصطناعي: ذاكرة جماعية حية للمعرفة المتطورة، التحدي المجتمعي للنتائج، وحفظ التجارب من النسيان.",
  values: [
    { title: "توثيق مسار البحث (Full Trail)", desc: "لا نكتفي بالنتيجة النهائية، بل نوثق السؤال، النماذج المستخدمة، ومسار التفاعل لنبني معرفة قابلة للفحص." },
    { title: "التحقق البشري الشفاف", desc: "تمييز واضح بين ما أنتجه الذكاء الاصطناعي وما تحقّق منه الباحث بشرياً لتصحيح الهلوسة وحماية المصداقية." },
    { title: "بحث المواطن للجميع", desc: "فتح باب التوثيق والنشر لكل من أجرى بحثاً جاداً، دون اشتراط ألقاب أكاديمية أو انتماءات مؤسسية." },
    { title: "المعرفة الحية المتطورة", desc: "إتاحة التحدي المجتمعي للنتائج، تقديم الأدلة المضادة، وتحديث الاكتشافات بنسخ تراكمية (v1 → v2)." }
  ],
  researchPhilosophy: "منهجية البحث في عصر الذكاء الاصطناعي: سؤال محدد ← أدوات ونماذج مستخدمة ← مسار التفاعل والافتراضات ← نتيجة وخلاصة ← تحقق بشري وتصحيح للهلوثة ← نشر مفتوح قابل للتكرار والتطوير المجتمعي."
};

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: "762",
    title: "بيت الحكمة في بغداد",
    subtitle: "عصر التنوير العلمي العربي",
    description: "تأسيس بيت الحكمة في بغداد كأكبر مركز ترجمة وبحث علمي في العالم، ومنارة شع منها العلم للإنسانية.",
    highlight: true,
  },
  {
    year: "2026",
    title: "تأسيس JEMO LABS",
    subtitle: "إحياء الإرث المعرفي الرقمي",
    description: "انطلاق المؤسسة كمختبر أبحاث سيادي يهدف إلى بناء البنية التحتية العلمية والتقنية المفتوحة في العراق.",
    highlight: true,
  },
  {
    year: "2027",
    title: "أول ورقة علمية مرجعية",
    subtitle: "النشر الأكاديمي الدولي",
    description: "نشر أول ورقة أبحاث محكمة في مؤتمرات الذكاء الاصطناعي وأنظمة التشغيل العالمية مع إتاحة البيانات مجاناً.",
  },
  {
    year: "2028",
    title: "أول تمويل بحثي مستقل",
    subtitle: "الاستدلال المالي والبحثي",
    description: "إطلاق صندوق دعم البحث العلمي العراقي لتوفير منح الباحثين وتوفير الخوادم فائقة الأداء.",
  },
  {
    year: "2030",
    title: "شبكة 100 باحث عراقي",
    subtitle: "التوسع الأكاديمي",
    description: "وصول عدد الباحثين الدائمين والزملاء إلى 100 عالم ومهندس يقودون أبحاثاً متقدمة.",
  },
  {
    year: "2032",
    title: "افتتاح أول مجمع مختبرات ميداني",
    subtitle: "البنية التحتية الفيزياء-رقمية",
    description: "تدشين المقر الرئيسي الميداني لمختبرات JEMO LABS للأبحاث التطبيقية والروبوتات في بغداد.",
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
    leadName: "د. علي الجمو",
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
    leadName: "م. أحمد الفراتي",
    leadSlug: "ahmed-al-furati",
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
    leadName: "د. سارة الحسيني",
    leadSlug: "sara-al-hussaini",
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
    leadName: "م. حيدر البغدادي",
    leadSlug: "haider-al-baghdadi",
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
    leadName: "د. مريم البابلية",
    leadSlug: "maryam-al-babili",
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
    leadName: "د. يوسف النجفي",
    leadSlug: "youssef-al-najafi",
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
    name: "د. علي الجمو",
    role: "رئيس الباحثين ومدير مختبر الذكاء الاصطناعي",
    bio: "باحث متخصص في هندسة النوى الذكية والمعالجة الطبيعية للغة العربية. نال الدكتوراه في علوم الحاسوب وكرس أبحاثه لبناء البنية التحتية الرقمية السيادية.",
    avatar: "/jemo-logo.svg",
    labSlug: "ai-lab",
    orcid: "0000-0002-1825-0001",
    github: "https://github.com/Ali-Jemo",
    linkedin: "https://linkedin.com/in/alijemo",
    scholar: "https://scholar.google.com",
    email: "ali@jemo.co",
    papersCount: 8,
    projectsCount: 4
  },
  {
    id: "ahmed-al-furati",
    slug: "ahmed-al-furati",
    name: "م. أحمد الفراتي",
    role: "كبير مهندسي النوى ومختبر أنظمة التشغيل",
    bio: "مهندس نظم متخصص في Rust والتصميم الآمن للمشغلات الميكروية وتطوير نواة Ziqa Kernel.",
    avatar: "/jemo-logo.svg",
    labSlug: "os-lab",
    orcid: "0000-0003-4412-9981",
    github: "https://github.com/ahmed-furati",
    linkedin: "https://linkedin.com",
    scholar: "https://scholar.google.com",
    email: "ahmed@jemo.co",
    papersCount: 5,
    projectsCount: 3
  },
  {
    id: "sara-al-hussaini",
    slug: "sara-al-hussaini",
    name: "د. سارة الحسيني",
    role: "رئيسة مختبر الرؤية الحاسوبية",
    bio: "باحثة في معالجة الصور الرقمية وتطبيق تقنيات التعلم العميق لفك وترميم المخطوطات التاريخية العربية.",
    avatar: "/jemo-logo.svg",
    labSlug: "cv-lab",
    orcid: "0000-0001-9021-3312",
    github: "https://github.com/sara-hussaini",
    linkedin: "https://linkedin.com",
    scholar: "https://scholar.google.com",
    email: "sara@jemo.co",
    papersCount: 6,
    projectsCount: 2
  },
  {
    id: "haider-al-baghdadi",
    slug: "haider-al-baghdadi",
    name: "م. حيدر البغدادي",
    role: "باحث ورئيس مختبر الروبوتات",
    bio: "متخصص في الأنظمة الميكاترونيكية ودمج المستشعرات ذاتية الحركة في البيئات الميدانية الصعبة.",
    avatar: "/jemo-logo.svg",
    labSlug: "robotics-lab",
    orcid: "0000-0002-7718-4432",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "haider@jemo.co",
    papersCount: 3,
    projectsCount: 2
  },
  {
    id: "maryam-al-babili",
    slug: "maryam-al-babili",
    name: "د. مريم البابلية",
    role: "باحثة أولى في الذكاء الاصطناعي الصحي",
    bio: "تركز على بناء خوارزميات مساعدة التشخيص الطبي والتنبؤ المبكر بناء على السجلات الطبية الوطنية.",
    avatar: "/jemo-logo.svg",
    labSlug: "healthcare-ai",
    orcid: "0000-0002-1189-9900",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "maryam@jemo.co",
    papersCount: 3,
    projectsCount: 1
  },
  {
    id: "youssef-al-najafi",
    slug: "youssef-al-najafi",
    name: "د. يوسف النجفي",
    role: "باحث المعلوماتية الحيوية",
    bio: "خبير حوسبة جينية وتطوير نماذج محاكاة البروتينات والتحليل الجينومي.",
    avatar: "/jemo-logo.svg",
    labSlug: "bioinformatics",
    orcid: "0000-0001-4433-2211",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "youssef@jemo.co",
    papersCount: 2,
    projectsCount: 1
  },
  {
    id: "noor-al-kindif",
    slug: "noor-al-kindif",
    name: "م. نور الكندي",
    role: "باحثة في تقييم النماذج اللغوية — مختبر الذكاء الاصطناعي",
    bio: "متخصصة في هندسة مقاييس التقييم للنماذج اللغوية العربية وتحليل التحيز في المخرجات، وتقود بناء معايير القياس العربية المفتوحة.",
    avatar: "/jemo-logo.svg",
    labSlug: "ai-lab",
    orcid: "0000-0002-5566-7788",
    github: "https://github.com/jemo-labs",
    scholar: "https://scholar.google.com",
    email: "noor@jemo.co",
    papersCount: 4,
    projectsCount: 2
  },
  {
    id: "omar-al-basri",
    slug: "omar-al-basri",
    name: "م. عمر البصري",
    role: "مهندس أمن الأنظمة — مختبر أنظمة التشغيل",
    bio: "باحث في عزل الأخطاء والتشغيل الآمن للنوى الدقيقة، ويعمل على طبقات الحماية الرسمية لنواة Ziqa.",
    avatar: "/jemo-logo.svg",
    labSlug: "os-lab",
    orcid: "0000-0001-2233-4455",
    github: "https://github.com/jemo-labs",
    scholar: "https://scholar.google.com",
    email: "omar@jemo.co",
    papersCount: 3,
    projectsCount: 2
  },
  {
    id: "lina-al-tikriti",
    slug: "lina-al-tikriti",
    name: "د. لينا التكريتي",
    role: "باحثة في التصوير الطبي — مختبر الرؤية الحاسوبية",
    bio: "تطوّر نماذج الرؤية الحاسوبية للكشف المبكر عن الأورام من الصور الإشعاعية، مع التركيز على تكييف النماذج للبيانات الإقليمية.",
    avatar: "/jemo-logo.svg",
    labSlug: "cv-lab",
    orcid: "0000-0003-1122-3344",
    github: "https://github.com/jemo-labs",
    scholar: "https://scholar.google.com",
    email: "lina@jemo.co",
    papersCount: 4,
    projectsCount: 1
  },
  {
    id: "mustafa-al-mosuli",
    slug: "mustafa-al-mosuli",
    name: "م. مصطفى الموصللي",
    role: "باحث في الملاحة الذاتية — مختبر الروبوتات",
    bio: "متخصص في خوارزميات SLAM والملاحة في البيئات غير المهيكلة، ويطوّر أنظمة إدراك للروبوتات الميدانية.",
    avatar: "/jemo-logo.svg",
    labSlug: "robotics-lab",
    orcid: "0000-0002-9988-7766",
    github: "https://github.com/jemo-labs",
    scholar: "https://scholar.google.com",
    email: "mustafa@jemo.co",
    papersCount: 2,
    projectsCount: 2
  },
  {
    id: "zainab-al-qadisiyya",
    slug: "zainab-al-qadisiyya",
    name: "د. زينب القادسية",
    role: "باحثة في المعالجة اللغوية الطبية — الذكاء الاصطناعي الصحي",
    bio: "تدمج بين معالجة اللغة الطبية وتحليل السجلات الصحية لبناء أنظمة مساعدة قرارات سريرية دقيقة.",
    avatar: "/jemo-logo.svg",
    labSlug: "healthcare-ai",
    orcid: "0000-0001-6655-4433",
    github: "https://github.com/jemo-labs",
    scholar: "https://scholar.google.com",
    email: "zainab@jemo.co",
    papersCount: 3,
    projectsCount: 1
  },
  {
    id: "hussain-al-kufi",
    slug: "hussain-al-kufi",
    name: "م. حسين الكوفي",
    role: "باحث في التحليل الجينومي — المعلوماتية الحيوية",
    bio: "يطوّر أدوات تحليل تسلسل الجينوم وحساب التشابه البروتيني لمساعدة الأبحاث الطبية الإقليمية.",
    avatar: "/jemo-logo.svg",
    labSlug: "bioinformatics",
    orcid: "0000-0002-4455-6677",
    github: "https://github.com/jemo-labs",
    scholar: "https://scholar.google.com",
    email: "hussain@jemo.co",
    papersCount: 2,
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
    featured: true
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
    featured: true
  },
  {
    id: "ziqa-kernel-paper",
    slug: "ziqa-kernel-architecture",
    title: "نواة Ziqa: مختبر تجريبي لنواة دقيقة آمنة الذاكرة بلغة Rust للأجهزة المدمجة",
    titleEn: "Ziqa Kernel: An Experimental Sandbox for Safe Microkernel Architectures in Rust",
    abstract: "نستعرض في هذه الورقة والمستودع المفتوح معمارية تجريبية (Experimental Sandbox) لنواة دقيقة مكتوبة بلغة Rust لاستكشاف عزل الأخطاء وإدارة الذاكرة الآمنة بدون كود غير آمن. المشروع تجربة استكشافية مفتوحة لدراسة جدوى البنى المصغرة وتطوير أنظمة تشغيل تعلمية خفيفة.",
    authors: [
      { name: "م. أحمد الفراتي", slug: "ahmed-al-furati", role: "مطور النواة" },
      { name: "د. علي الجمو", slug: "ali-jemo", role: "مستشار التجربة" }
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
    featured: true
  },
  {
    id: "arabic-nlp-paper",
    slug: "open-iraq-arabic-nlp",
    title: "تكييف النماذج اللغوية المفتوحة للهجات العراقية والمصطلحات التخصصية",
    titleEn: "Adapting Open-Weights LLMs for Iraqi Dialects and Domain Terminology",
    abstract: "تستعرض هذه الورقة والمبادرة تجربة ضبط وتكييف دقيق (Fine-tuning & Quantization) لنماذج لغوية مفتوحة المصدر لخدمة اللهجات العراقية والمصطلحات العلمية والتقنية، مع تقييم كفاءة الاستدلال على العتاد المتاح وإتاحة مجموعات الاختبار للباحثين مجاناً.",
    authors: [
      { name: "د. علي الجمو", slug: "ali-jemo", role: "المؤلف الرئيسي" },
      { name: "د. سارة الحسيني", slug: "sara-al-hussaini", role: "باحث مشارك" }
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
      { name: "د. سارة الحسيني", slug: "sara-al-hussaini", role: "المؤلف الرئيسي" }
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
      { name: "م. نور الكندي", slug: "noor-al-kindif", role: "المؤلف الرئيسي" },
      { name: "د. علي الجمو", slug: "ali-jemo", role: "المؤلف المشارك" }
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
      { name: "م. أحمد الفراتي", slug: "ahmed-al-furati", role: "المؤلف الرئيسي" },
      { name: "م. عمر البصري", slug: "omar-al-basri", role: "المؤلف المشارك" }
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
      { name: "د. لينا التكريتي", slug: "lina-al-tikriti", role: "المؤلف الرئيسي" },
      { name: "د. سارة الحسيني", slug: "sara-al-hussaini", role: "المؤلف المشارك" }
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
      { name: "م. مصطفى الموصللي", slug: "mustafa-al-mosuli", role: "المؤلف الرئيسي" },
      { name: "م. حيدر البغدادي", slug: "haider-al-baghdadi", role: "المؤلف المشارك" }
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
      { name: "د. زينب القادسية", slug: "zainab-al-qadisiyya", role: "المؤلف الرئيسي" },
      { name: "د. مريم البابلية", slug: "maryam-al-babili", role: "المؤلف المشارك" }
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
      { name: "م. حسين الكوفي", slug: "hussain-al-kufi", role: "المؤلف الرئيسي" },
      { name: "د. يوسف النجفي", slug: "youssef-al-najafi", role: "المؤلف المشارك" }
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
      { name: "م. نور الكندي", slug: "noor-al-kindif", role: "المؤلف الرئيسي" },
      { name: "د. علي الجمو", slug: "ali-jemo", role: "المؤلف المشارك" }
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
    title: "مختبر نواة Ziqa (Experimental Sandbox)",
    titleEn: "Ziqa Kernel Sandbox",
    description: "مختبر تجريبي استكشافي لنواة دقيقة آمنة الذاكرة مكتوبة بلغة Rust/Zig لاستكشاف معمارية الأنظمة خفيفة الوزن.",
    fullDescription: "مشروع استكشافي تعليمي مفتوح المصدر (Experimental Sandbox) طُوّر لدراسة آليات أمان الذاكرة وعزل المعالجات في النوى المصغرة، متاح بالكامل على GitHub للمطورين والمهتمين.",
    status: "Active",
    team: [
      { name: "م. أحمد الفراتي", slug: "ahmed-al-furati", role: "مطور النواة" },
      { name: "د. علي الجمو", slug: "ali-jemo", role: "مستشار المعمارية" }
    ],
    techStack: ["Rust", "Zig", "Assembly", "QEMU", "RISC-V"],
    labSlug: "os-lab",
    githubUrl: "https://github.com/Ali-Jemo/ziqa-kernal",
    image: "/departments-bg.png",
    featured: true
  },
  {
    id: "baghdad-ai-project",
    slug: "baghdad-ai",
    title: "مبادرة تكييف النماذج اللغوية (Baghdad LLM)",
    titleEn: "Baghdad LLM Adaptation Initiative",
    description: "مبادرة مفتوحة لتكييف وتخصيص النماذج اللغوية مفتوحة المصدر لدعم اللهجات العراقية والمصطلحات المحلية بكفاءة استدلال عالية.",
    fullDescription: "بدلاً من تدريب نماذج ضخمة من الصفر، تركز المبادرة على الاستفادة من النماذج المفتوحة وتخصيصها عبر التكميم (Quantization) وتدريب محولات LoRA لتوفير استدلال سريع ومجاني على العتاد المتاح.",
    status: "Research",
    team: [
      { name: "د. علي الجمو", slug: "ali-jemo", role: "قائد المبادرة" },
      { name: "د. سارة الحسيني", slug: "sara-al-hussaini", role: "باحثة بيانات" }
    ],
    techStack: ["Python", "PyTorch", "HuggingFace", "LoRA", "Quantization"],
    labSlug: "ai-lab",
    githubUrl: "https://github.com/jemo-labs/baghdad-ai",
    image: "/wisdom-bg-new.png",
    featured: true
  },
  {
    id: "arabic-manuscript-ocr",
    slug: "digital-house-of-wisdom-ocr",
    title: "منظومة بيت الحكمة الرقمية",
    titleEn: "Digital House of Wisdom OCR",
    description: "منصة ذكية لأرشفة وترميم التراث العلمي الأكاديمي وتحويله إلى بيانات مفتوحة.",
    fullDescription: "تحويل الآلاف من المخطوطات والكتب العلمية النادرة إلى صيغة نصية رقمية مفسرة باستخدام أحدث نماذج الرؤية الحاسوبية.",
    status: "Prototype",
    team: [
      { name: "د. سارة الحسيني", slug: "sara-al-hussaini", role: "قائد المشروع" }
    ],
    techStack: ["OpenCV", "PyTorch", "Next.js", "TailwindCSS"],
    labSlug: "cv-lab",
    githubUrl: "https://github.com/jemo-labs/heritage-ocr",
    image: "/diwan-bg-astrolabe.png",
    featured: true
  },
  {
    id: "iraq-open-datasets",
    slug: "iraq-open-datasets",
    title: "مستودع بيانات العراق المفتوحة",
    titleEn: "Iraq Open Datasets",
    description: "بنية تحتية لمشاركة وحفظ البيانات الأكاديمية والبيئية والمناخية للباحثين العراقيين.",
    fullDescription: "مستودع موحد يضمن بقاء البيانات العلمية العراقية متاحة مجاناً للباحثين مع دعم معايير النشر والأرشفة الأكاديمية.",
    status: "Completed",
    team: [
      { name: "د. علي الجمو", slug: "ali-jemo", role: "المنسق العام" }
    ],
    techStack: ["PostgreSQL", "Python", "FastAPI", "Docker"],
    labSlug: "ai-lab",
    githubUrl: "https://github.com/jemo-labs/open-datasets",
    image: "/road-bg.png"
  },
  {
    id: "baghdad-llm-infra",
    slug: "baghdad-llm-training-infra",
    title: "بنية تدريب نموذج بغداد",
    titleEn: "Baghdad LLM Training Infrastructure",
    description: "منصة تدريب موزعة لتدريب نموذج اللغة العربية على عناقات الحوسبة السيادية مع جدولة فعالة لوحدات المعالجة الرسومية.",
    fullDescription: "بنية تحتية مفتوحة المصدر لإدارة تدريب النماذج الكبيرة على عناقات GPU محلية، تتضمن جدولة المهام، نقاط الحفظ، وتتبع التجارب العلمية.",
    status: "Active",
    team: [
      { name: "د. علي الجمو", slug: "ali-jemo", role: "قائد البنية" },
      { name: "م. نور الكندي", slug: "noor-al-kindif", role: "مهندسة التقييم" }
    ],
    techStack: ["Python", "PyTorch", "CUDA", "Kubernetes", "Weights & Biases"],
    labSlug: "ai-lab",
    githubUrl: "https://github.com/jemo-labs/baghdad-ai",
    image: "/wisdom-bg-new.png"
  },
  {
    id: "heritage-ocr-platform",
    slug: "heritage-ocr-platform",
    title: "منصة بيت الحكمة لترقيم المخطوطات",
    titleEn: "House of Wisdom Manuscript Digitization Platform",
    description: "منصة ويب تفاعلية لرفع وفك رموز المخطوطات التاريخية وتحويلها لنصوص قابلة للبحث والتحليل.",
    fullDescription: "أداة كاملة تتيح للباحثين والمؤسسات التراثية رفع صور المخطوطات ومعالجتها آلياً باستخدام نماذج الرؤية الحاسوبية ثم تصدير النصوص المنظمة.",
    status: "Prototype",
    team: [
      { name: "د. سارة الحسيني", slug: "sara-al-hussaini", role: "قائدة المشروع" },
      { name: "د. لينا التكريتي", slug: "lina-al-tikriti", role: "مهندسة النماذج" }
    ],
    techStack: ["Next.js", "Python", "OpenCV", "PostgreSQL"],
    labSlug: "cv-lab",
    githubUrl: "https://github.com/jemo-labs/heritage-ocr",
    image: "/diwan-bg-astrolabe.png"
  },
  {
    id: "autonomous-rover",
    slug: "mesopotamia-rover",
    title: "منصة الروفر المتنقل بلاد ما بين النهرين",
    titleEn: "Mesopotamia Autonomous Rover Platform",
    description: "منصة روبوت ميدانية مفتوحة للاختبار في البيئات الصحراوية مع ملاحة ذاتية ودمج مستشعرات.",
    fullDescription: "قاعدة روبوتية قابلة للتكرار تجمع بين الملاحة الذاتية وإدراك البيئة، مصممة للبحث الميداني في الظروف القاسية.",
    status: "Research",
    team: [
      { name: "م. مصطفى الموصللي", slug: "mustafa-al-mosuli", role: "قائد المنصة" },
      { name: "م. حيدر البغدادي", slug: "haider-al-baghdadi", role: "مهندس الأنظمة" }
    ],
    techStack: ["ROS2", "C++", "Python", "LiDAR", "Raspberry Pi"],
    labSlug: "robotics-lab",
    githubUrl: "https://github.com/jemo-labs",
    image: "/road-bg.png"
  },
  {
    id: "clinical-decision-support",
    slug: "clinical-decision-support",
    title: "نظام مساعدة القرارات السريرية",
    titleEn: "Clinical Decision Support System",
    description: "نظام يحلل السجلات الصحية ويقترح تشخيصات محتملة بناء على معالجة لغوية طبية عربية.",
    fullDescription: "أداة مساعدة للأطباء تستخرج المؤشرات السريرية من السجلات وتقدم تنبيهات وتوصيات مبنية على الأدلة، مع احترام تام لخصوصية البيانات.",
    status: "Prototype",
    team: [
      { name: "د. زينب القادسية", slug: "zainab-al-qadisiyya", role: "قائدة المشروع" },
      { name: "د. مريم البابلية", slug: "maryam-al-babili", role: "مستشارة سريرية" }
    ],
    techStack: ["Python", "FastAPI", "Transformers", "FHIR"],
    labSlug: "healthcare-ai",
    githubUrl: "https://github.com/jemo-labs",
    image: "/covenant-bg.png"
  }
];

export const INITIATIVES: Initiative[] = [
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
    lead: "د. علي الجمو",
    leadSlug: "ali-jemo",
    team: ["د. علي الجمو", "م. حيدر البغدادي", "م. أحمد الفراتي"],
    deliverables: ["مجموعة بيانات شاملة", "نماذج أوزان مفتوحة", "دليل الباحث العربي"],
    milestones: [
      { title: "إطلاق المجموعة التدريبية", date: "يناير 2026", done: true },
      { title: "نماذج أوزان أولية", date: "مايو 2026", done: true },
      { title: "دليل الباحث العربي", date: "سبتمبر 2026", done: false },
      { title: "نشر النماذج المتقدمة", date: "ديسمبر 2026", done: false },
    ],
    link: "https://github.com/jemo-labs/open-iraq-ai",
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
    lead: "د. سارة الحسيني",
    leadSlug: "sara-al-hussaini",
    team: ["د. سارة الحسيني", "د. يوسف النجفي"],
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
    lead: "د. علي الجمو",
    leadSlug: "ali-jemo",
    team: ["د. علي الجمو", "د. مريم البابلية"],
    deliverables: ["مكتبة تقطيع النصوص", "معجم المصطلحات التقنية", "مقيم الاستدلال العربي"],
    milestones: [
      { title: "مكتبة تقطيع النصوص", date: "فبراير 2026", done: true },
      { title: "معجم المصطلحات", date: "أغسطس 2026", done: false },
      { title: "مقيم الاستدلال العربي", date: "نوفمبر 2026", done: false },
    ],
    link: "https://github.com/jemo-labs/arabic-nlp",
    tags: ["NLP", "Arabic", "Medical"],
  },
  {
    id: "digital-house-of-wisdom",
    image: "/initiatives/dhw.jpg",
    slug: "digital-house-of-wisdom",
    title: "مبادرة بيت الحكمة الرقمي",
    description: "إعادة بناء التراث العلمي لبغداد برؤية رقمية حديثة تدمج الأبحاث، المخطوطات، والتعليم المفتوح.",
    fullDescription: "إعادة بناء التراث العلمي لبغداد الرقمي باستخدام تقنيات حديثة تدمج الأبحاث والمخطوطات التاريخية والتعليم المفتوح في منصة واحدة شاملة، مستوحاة من روح بيت الحكمة العريق كرمز للمعرفة المفتوحة.",
    vision: "جعل JEMO LABS المنارة الرقمية الحديثة لبيت الحكمة العريق.",
    progress: 85,
    status: "Scaling",
    lead: "م. أحمد الفراتي",
    leadSlug: "ahmed-al-furati",
    team: ["م. أحمد الفراتي", "د. سارة الحسيني"],
    deliverables: ["متحف العلوم الرقمي", "أرشيف الأوراق المفتوحة", "دليل الباحث المستقل"],
    milestones: [
      { title: "المتحف الرقمي", date: "أبريل 2026", done: true },
      { title: "أرشيف الأوراق", date: "يوليو 2026", done: true },
      { title: "دليل الباحث المستقل", date: "سبتمبر 2026", done: false },
    ],
    link: "https://github.com/jemo-labs/digital-house-of-wisdom",
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
    lead: "د. مريم البابلية",
    leadSlug: "maryam-al-babili",
    team: ["د. مريم البابلية", "د. علي الجمو", "د. سارة الحسيني"],
    deliverables: ["برنامج توجيه أكاديمي", "تمويل نشر الأوراق", "توفير الموارد الحاسوبية"],
    milestones: [
      { title: "بدء التوظيف", date: "يناير 2026", done: true },
      { title: "الزمالة الأولى", date: "يونيو 2026", done: true },
      { title: "50 باحث مؤهل", date: "ديسمبر 2026", done: false },
      { title: "الهدف الكامل 100", date: "2028", done: false },
    ],
    link: "https://github.com/jemo-labs/100-iraqi-researchers",
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
    content: "نجح الفريق في إثبات قدرة النواة على العمل تحت أقصى حظر تشغيلي وبأقل استهلاك للموارد."
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
    description: "Safe and Lightweight Microkernel written in Rust for Critical & Embedded Systems.",
    url: "https://github.com/Ali-Jemo/ziqa-kernal",
    license: "MIT / Apache-2.0",
    stars: 342,
    forks: 58,
    language: "Rust"
  },
  {
    name: "baghdad-llm",
    description: "Open weights and fine-tuning suite for Arabic Reasoning and Dialect understanding.",
    url: "https://github.com/jemo-labs/baghdad-llm",
    license: "Apache-2.0",
    stars: 512,
    forks: 89,
    language: "Python"
  },
  {
    name: "open-iraq-datasets",
    description: "Open access datasets for Iraqi environmental, historical, and linguistic research.",
    url: "https://github.com/jemo-labs/open-datasets",
    license: "CC-BY-4.0",
    stars: 189,
    forks: 34,
    language: "Python"
  },
  {
    name: "arabic-manuscript-ocr",
    description: "Convolutional Neural Network tools for restoration and digitizing rare Arabic manuscripts.",
    url: "https://github.com/jemo-labs/manuscript-ocr",
    license: "MIT",
    stars: 230,
    forks: 41,
    language: "Python / C++"
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
    speakers: ["م. أحمد الفراتي", "د. علي الجمو"]
  },
  {
    id: "event-2",
    title: "هاكاثون الذكاء الاصطناعي العربي مفتوح المصدر",
    date: "2026-10-01",
    location: "مجمع JEMO LABS الرقمي",
    type: "هاكاثون",
    description: "تحدي 48 ساعة لتطوير تطبيقات وحلول تعتمد على نماذج بغداد اللغوية.",
    speakers: ["د. سارة الحسيني", "د. مريم البابلية"]
  },
  {
    id: "event-3",
    title: "ورشة عمل: بناء النوى الآمنة بلغة Rust",
    date: "2026-09-12",
    location: "بغداد / عبر الإنترنت",
    type: "ورشة عمل",
    description: "ورشة عملية مكثفة لتصميم مكونات نواة آمنة الذاكرة باستخدام Rust ونظام Ziqa.",
    speakers: ["م. أحمد الفراتي", "م. عمر البصري"]
  },
  {
    id: "event-4",
    title: "ندوة: الذكاء الاصطناعي في التصوير الطبي",
    date: "2026-11-05",
    location: "قاعة المؤتمرات — الجامعة التكنولوجية",
    type: "ندوة علمية",
    description: "استعراض أحدث تطبيقات الرؤية الحاسوبية في التشخيص الطبي المبكر.",
    speakers: ["د. لينا التكريتي", "د. مريم البابلية"]
  },
  {
    id: "event-5",
    title: "هاكاثون المعلوماتية الحيوية والجينوم",
    date: "2026-12-15",
    location: "مجمع JEMO LABS الرقمي",
    type: "هاكاثون",
    description: "تحدي 36 ساعة لتطوير أدوات تحليل الجينوم على البيانات الإقليمية المفتوحة.",
    speakers: ["د. يوسف النجفي", "م. حسين الكوفي"]
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
