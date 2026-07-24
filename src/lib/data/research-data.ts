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
  vision: string;
  progress: number;
  lead: string;
  deliverables: string[];
  link?: string;
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
  fields: 8,
  founded: 2026,
};

export const ABOUT_INFO = {
  nameMeaning: "اسم JEMO LABS مستوحى من شغف الاكتشاف والابتكار الجذري، ورمز لاستعادة ريادة العراق العلمية والمعرفية.",
  whyCreated: "تأسست JEMO LABS لتكون مركز أبحاث مستقل يركز على تطوير التقنيات المتقدمة، بناء المعرفة المفتوحة، وتأهيل الباحثين العراقيين لقيادة مستقبل التكنولوجيا والعلوم.",
  coreQuote: "نؤمن أن المعرفة يجب أن تكون مفتوحة، وأن العراق قادر على إنتاج العلم لا استهلاكه فقط.",
  mission: "بناء بيئة بحثية عراقية رائدة تنتج حلولاً علمية وتقنية مفتوحة المصدر ذات أثر عالمي وتثري بيت الحكمة الرقمي.",
  vision: "أن تصبح JEMO LABS المؤسسة البحثية الأولى في الشرق الأوسط في مجالات الذكاء الاصطناعي وأنظمة التشغيل والتقنيات السيادية.",
  values: [
    { title: "الشفافية المفتوحة", desc: "نشر كافة الأبحاث، الشيفرات، والبيانات مجاناً وللجميع." },
    { title: "الأثر الفعلي", desc: "التركيز على ابتكارات تحل مشاكل حقيقية وتخدم المجتمع العلمية." },
    { title: "الاستقلالية العلمية", desc: "أبحاث موجهة بالدقة المعرفية الخالصة بعيداً عن التبعية." },
    { title: "التميز والصرامة", desc: "تطبيق أعلى المعايير الأكاديمية الدولية في التدقيق والنشر." }
  ],
  researchPhilosophy: "نتبع فلسفة الأبحاث الجريئة من المبادئ الأولى (First Principles): لا نكتفي بتكييف الحلول الموجودة، بل نعيد كتابة الخوارزميات وتصميم الأنظمة من النواة لضمان السيادة الرقمية."
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
  }
];

export const RESEARCH_PAPERS: Paper[] = [
  {
    id: "ziqa-kernel-paper",
    slug: "ziqa-kernel-architecture",
    title: "تصميم نواة Ziqa: بنية خفيفة وآمنة الذاكرة مخصصة للأنظمة الحرجة",
    titleEn: "Ziqa Kernel: Safe and Lightweight Microkernel Architecture for Critical Systems",
    abstract: "نقدم في هذه الورقة البحثية تصميم ونواة Ziqa Kernel المكتوبة بلغة Rust مع استعراض نتائج الأداء وعزل الأخطاء مقارنة بالنوى التقليدية. تُظهر النتائج تقليل وقت الاستجابة بنسبة 35% وضمان عدم حدوث تسريب في الذاكرة تحت أقصى حظر تشغيلي.",
    authors: [
      { name: "م. أحمد الفراتي", slug: "ahmed-al-furati", role: "المؤلف الرئيسي" },
      { name: "د. علي الجمو", slug: "ali-jemo", role: "المؤلف المشارك" }
    ],
    publishDate: "2026-05-14",
    doi: "10.1016/j.jemo.2026.05.001",
    pdfUrl: "/papers/ziqa-kernel.pdf",
    datasetUrl: "https://github.com/Ali-Jemo/ziqa-kernal",
    codeUrl: "https://github.com/Ali-Jemo/ziqa-kernal",
    field: "أنظمة التشغيل",
    labSlug: "os-lab",
    keywords: ["Microkernel", "Rust", "Memory Safety", "Ziqa Kernel", "Real-Time"],
    citation: {
      bibtex: `@article{furati2026ziqa,
  title={Ziqa Kernel: Safe and Lightweight Microkernel Architecture},
  author={Al-Furati, Ahmed and Jemo, Ali},
  journal={JEMO LABS Research Papers},
  year={2026},
  doi={10.1016/j.jemo.2026.05.001}
}`,
      apa: "Al-Furati, A., & Jemo, A. (2026). Ziqa Kernel: Safe and Lightweight Microkernel Architecture for Critical Systems. JEMO LABS Research Papers, 1(1), 14-29."
    },
    featured: true
  },
  {
    id: "arabic-nlp-paper",
    slug: "open-iraq-arabic-nlp",
    title: "نموذج 'بغداد': استدلال متقدم باللغة العربية مع تكييف اللهجات العراقية",
    titleEn: "Baghdad LLM: Advanced Arabic Reasoning and Iraqi Dialect Adaptation",
    abstract: "تستعرض هذه الورقة هندسة نموذج 'بغداد' المطور في JEMO LABS، والذي يجمع بين فهم الفصحى الدقيقة واستيعاب المصطلحات التقنية واللهجات العراقية. حقق النموذج نتائج قياسية في اختبارات الاستدلال المنطقي العربي.",
    authors: [
      { name: "د. علي الجمو", slug: "ali-jemo", role: "المؤلف الرئيسي" },
      { name: "د. سارة الحسيني", slug: "sara-al-hussaini", role: "باحث مشارك" }
    ],
    publishDate: "2026-03-20",
    doi: "10.1016/j.jemo.2026.03.004",
    pdfUrl: "/papers/baghdad-llm.pdf",
    datasetUrl: "https://github.com/jemo-labs/open-iraq-dataset",
    codeUrl: "https://github.com/jemo-labs/baghdad-llm",
    field: "الذكاء الاصطناعي",
    labSlug: "ai-lab",
    keywords: ["Arabic NLP", "Dialect Adaptation", "Large Language Models", "Open Science"],
    citation: {
      bibtex: `@article{jemo2026baghdad,
  title={Baghdad LLM: Advanced Arabic Reasoning and Iraqi Dialect Adaptation},
  author={Jemo, Ali and Al-Hussaini, Sara},
  journal={JEMO LABS AI Reports},
  year={2026}
}`,
      apa: "Jemo, A., & Al-Hussaini, S. (2026). Baghdad LLM: Advanced Arabic Reasoning and Iraqi Dialect Adaptation. JEMO LABS AI Reports."
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
  }
];

export const RESEARCH_PROJECTS: Project[] = [
  {
    id: "ziqa-os-project",
    slug: "ziqa-kernel",
    title: "نواة Ziqa التشغيلية",
    titleEn: "Ziqa Microkernel",
    description: "مشروع بناء نواة تشغيل سيادية خفيفة وآمنة من الصفر بلغة Rust لضمان السيادة الرقمية والحوسبة عالية الاعتمادية.",
    fullDescription: "نواة Ziqa هي مشروع مفتوح المصدر طُور داخل JEMO LABS بالكامل بهدف تقديم نواة آمنة، سريعة، ومتحققة رسمياً لخدمة الأجهزة المدمجة والخوادم عالية الأمان.",
    status: "Active",
    team: [
      { name: "م. أحمد الفراتي", slug: "ahmed-al-furati", role: "مطور النواة الرئيسي" },
      { name: "د. علي الجمو", slug: "ali-jemo", role: "مستشار المعمارية" }
    ],
    techStack: ["Rust", "Assembly", "C", "QEMU", "RISC-V"],
    labSlug: "os-lab",
    githubUrl: "https://github.com/Ali-Jemo/ziqa-kernal",
    image: "/departments-bg.png",
    featured: true
  },
  {
    id: "baghdad-ai-project",
    slug: "baghdad-ai",
    title: "نموذج الذكاء الاصطناعي بغداد",
    titleEn: "Baghdad LLM Initiative",
    description: "نموذج لغوي مفتوح المصدر مدرب على أكبر مدونة نصية أكاديمية وعلمية باللغة العربية.",
    fullDescription: "مبادرة لبناء نموذج ذكاء اصطناعي عربي مفتوح المصدر يتفوق في معالجة المصطلحات العلمية والتقنية وتلبية احتجيات المؤسسات البحثية.",
    status: "Research",
    team: [
      { name: "د. علي الجمو", slug: "ali-jemo", role: "قائد الفريق" },
      { name: "د. سارة الحسيني", slug: "sara-al-hussaini", role: "باحث بيانات" }
    ],
    techStack: ["Python", "PyTorch", "Transformers", "CUDA", "FlashAttention"],
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
  }
];

export const INITIATIVES: Initiative[] = [
  {
    id: "open-iraq-ai",
    slug: "open-iraq-ai",
    title: "مبادرة الذكاء الاصطناعي العراقي المفتوح",
    description: "توفير النماذج والبيانات والأدوات الأساسية لجميع الباحثين والطلاب مجاناً ودون قيود تجارية.",
    vision: "ضمان عدم احتكار التكنولوجيا وتكين أي باحث عراقي من بناء وتطوير نماذج ذكاء اصطناعي سيادية.",
    progress: 75,
    lead: "د. علي الجمو",
    deliverables: ["مجموعة بيانات شاملة", "نماذج أوزان مفتوحة", "دليل الباحث العربي"]
  },
  {
    id: "open-datasets-iraq",
    slug: "open-datasets-iraq",
    title: "بيانات العراق المفتوحة",
    description: "تجميع وأرشفة البيانات الجغرافية، البيئية، والتاريخية العراقية في مستودعات أكاديمية سهلة الاستخدام.",
    vision: "توفير أرضية صلبة للأبحاث التطبيقية المبنية على واقع البيئة والمجتمع العراقي.",
    progress: 90,
    lead: "د. سارة الحسيني",
    deliverables: ["منصة أرشفة مفتوحة", "واجهة برمجية API مجانية", "دليل النشر الرقمي"]
  },
  {
    id: "arabic-nlp-initiative",
    slug: "arabic-nlp",
    title: "مبادرة معالجة اللغة العربية العلمية",
    description: "تطوير أدوات ومكتبات برمجية متخصصة في فهم النصوص الطبية والأكاديمية باللغة العربية.",
    vision: "سد الفجوة المعرفية بين المحتوى الأكاديمي العالمي والمحتوى المتاح باللغة العربية.",
    progress: 60,
    lead: "د. علي الجمو",
    deliverables: ["مكتبة تقطيع النصوص", "معجم المصطلحات التقنية", "مقيم الاستدلال العربي"]
  },
  {
    id: "digital-house-of-wisdom",
    slug: "digital-house-of-wisdom",
    title: "مبادرة بيت الحكمة الرقمي",
    description: "إعادة بناء التراث العلمي لبغداد برؤية رقمية حديثة تدمج الأبحاث، المخطوطات، والتعليم المفتوح.",
    vision: "جعل JEMO LABS المنارة الرقمية الحديثة لبيت الحكمة العريق.",
    progress: 85,
    lead: "م. أحمد الفراتي",
    deliverables: ["متحف العلوم الرقمي", "أرشيف الأوراق المفتوحة", "دليل الباحث المستقل"]
  },
  {
    id: "100-iraqi-researchers",
    slug: "100-iraqi-researchers",
    title: "مبادرة 100 باحث عراقي",
    description: "برنامج زمالة ودعم لـ 100 عقل عراقي شاب لتأهيلهم لنشر أبحاث عالمية المستوى.",
    vision: "بناء الرصيد البشري العلمي الذي سيقود التحول التكنولوجي في المنطقة.",
    progress: 50,
    lead: "د. مريم البابلية",
    deliverables: ["برنامج توجيه أكاديمي", "تمويل نشر الأوراق", "توفير الموارد الحاسوبية"]
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
