/**
 * JEMO CONTENT REGISTRY — the single source of truth for everything the
 * dashboard can edit.
 *
 * Each entry describes one editable unit of site content:
 *   - `defaults`  the committed values that ship with the repo (also the
 *                 fallback whenever Supabase is unreachable)
 *   - `fields`    the schema the dashboard renders its editor from and the
 *                 shape the API validates against
 *   - `key`       the row in the Supabase `templates` table that holds the
 *                 dashboard's edits (`templates.key` / `templates.responses`)
 *
 * Adding a new editable collection is a data-only change: append an entry here,
 * and both the dashboard and the site-side reader pick it up. No new UI code.
 *
 * Server-only: this module imports the full static dataset and must never end
 * up in a client bundle.
 */

import {
  ABOUT_INFO,
  BENCHMARKS,
  EVENTS,
  FAQ_ITEMS,
  FINANCIAL_SUPPORTS,
  INFRASTRUCTURE,
  INITIATIVES,
  INSTITUTION_STATS,
  NEWS_ITEMS,
  OPEN_QUESTIONS,
  OPEN_SOURCE_REPOS,
  PARTNERS,
  PEER_REVIEW_POLICY,
  RESEARCHERS,
  RESEARCH_LABS,
  RESEARCH_PAPERS,
  RESEARCH_PROJECTS,
  TIMELINE_EVENTS,
} from "@/lib/data/research-data";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "url"
  | "email"
  | "select"
  | "boolean"
  | "tags"
  | "ref"
  | "group"
  | "repeater";

export interface FieldSpec {
  key: string;
  /** Arabic label shown in the dashboard. */
  label: string;
  type: FieldType;
  /** Help text / example value rendered under the input. */
  hint?: string;
  required?: boolean;
  /** Allowed values for `select`. */
  options?: readonly string[];
  /** Sub-fields for `group` and `repeater`. */
  fields?: readonly FieldSpec[];
  /** For `repeater`: which sub-field names a row in the collapsed list. */
  itemLabel?: string;
  /** For `ref`: the collection to pick from, and which fields to use. */
  ref?: string;
  refValue?: string;
  refLabel?: string;
}

export type ContentKind = "collection" | "document" | "string-list";

export interface CollectionSpec {
  key: string;
  label: string;
  labelEn: string;
  group: string;
  kind: ContentKind;
  description: string;
  fields: readonly FieldSpec[];
  defaults: readonly unknown[];
  /**
   * True when the site reads this through the live store today. Unwired
   * collections are still editable, but the dashboard shows them as pending so
   * an edit is never mistaken for a live change.
   */
  wired: boolean;
  /** Field holding an item's identity. Defaults to `id`. */
  idField?: string;
  /** Composite identity for items that have no id field. */
  identityFields?: readonly string[];
  /** Legacy companion key that hides deleted default items. */
  deletedKey?: string;
}

const PAPER_FIELDS: readonly FieldSpec[] = [
  { key: "id", label: "المعرّف", type: "text", required: true, hint: "ziqa-kernel-paper" },
  { key: "slug", label: "الرابط المختصر", type: "text", required: true, hint: "ziqa-kernel-architecture" },
  { key: "title", label: "العنوان", type: "text", required: true },
  { key: "titleEn", label: "العنوان (إنجليزي)", type: "text" },
  { key: "abstract", label: "الملخص", type: "textarea", required: true },
  {
    key: "authors",
    label: "المؤلفون",
    type: "repeater",
    itemLabel: "name",
    fields: [
      { key: "name", label: "الاسم", type: "text", required: true },
      { key: "slug", label: "المعرّف", type: "text", required: true },
      { key: "role", label: "الدور", type: "text" },
    ],
  },
  { key: "publishDate", label: "تاريخ النشر", type: "date", required: true },
  { key: "field", label: "المجال", type: "text", hint: "هندسة النظم" },
  { key: "labSlug", label: "المختبر", type: "ref", ref: "research_labs", refValue: "slug", refLabel: "name" },
  { key: "doi", label: "DOI", type: "text" },
  { key: "pdfUrl", label: "رابط PDF", type: "text" },
  { key: "datasetUrl", label: "رابط البيانات", type: "url" },
  { key: "codeUrl", label: "رابط الشيفرة", type: "url" },
  { key: "keywords", label: "الكلمات المفتاحية", type: "tags" },
  {
    key: "citation",
    label: "الاقتباس",
    type: "group",
    fields: [
      { key: "bibtex", label: "BibTeX", type: "textarea" },
      { key: "apa", label: "APA", type: "textarea" },
    ],
  },
  { key: "featured", label: "مميّز في الصفحة الرئيسية", type: "boolean" },
  {
    key: "researchType",
    label: "نوع البحث",
    type: "select",
    options: ["Experiment", "Quick Investigation", "Full Research", "Research Note", "Discovery", "Replication"],
  },
  {
    key: "evidenceStatus",
    label: "حالة الدليل",
    type: "select",
    options: ["Evidence-backed", "Reproduced", "Under Review", "Disputed", "Expert Reviewed"],
  },
  { key: "question", label: "السؤال البحثي", type: "textarea" },
  { key: "toolsUsed", label: "الأدوات المستخدمة", type: "tags" },
  { key: "promptWorkflow", label: "مسار التوجيه", type: "textarea" },
  { key: "methodology", label: "المنهجية", type: "textarea" },
  { key: "findings", label: "النتائج", type: "textarea" },
  {
    key: "humanVerification",
    label: "التحقق البشري",
    type: "group",
    fields: [
      { key: "accuracyCheck", label: "فحص الدقة", type: "textarea" },
      { key: "hallucinationCorrected", label: "الهلوسة المصححة", type: "textarea" },
      {
        key: "confidence",
        label: "مستوى الثقة",
        type: "select",
        options: ["مرتفعة - تم التكرار بنجاح", "متوسطة - قيد المراجعة", "استكشافية / أولية"],
      },
    ],
  },
  {
    key: "researchTrail",
    label: "مسار البحث",
    type: "repeater",
    itemLabel: "step",
    fields: [
      { key: "step", label: "الخطوة", type: "text", required: true },
      { key: "note", label: "الملاحظة", type: "textarea" },
    ],
  },
  { key: "limitations", label: "القيود", type: "textarea" },
  {
    key: "metrics",
    label: "المؤشرات",
    type: "group",
    fields: [
      { key: "reproducedCount", label: "مرات التكرار", type: "number" },
      { key: "evidenceBackedCount", label: "مدعوم بالدليل", type: "number" },
      { key: "disputedCount", label: "قيد الجدل", type: "number" },
      { key: "insightfulCount", label: "قيّم كمفيد", type: "number" },
    ],
  },
  {
    key: "lineage",
    label: "سلسلة السبق",
    type: "group",
    fields: [
      { key: "replicationsCount", label: "عدد التكرارات", type: "number" },
      { key: "challengesCount", label: "عدد التحديات", type: "number" },
      { key: "extensionsCount", label: "عدد التوسعات", type: "number" },
      { key: "forkedFrom", label: "متفرّع من", type: "text" },
    ],
  },
];

const PROJECT_FIELDS: readonly FieldSpec[] = [
  { key: "id", label: "المعرّف", type: "text", required: true },
  { key: "slug", label: "الرابط المختصر", type: "text", required: true },
  { key: "title", label: "العنوان", type: "text", required: true },
  { key: "titleEn", label: "العنوان (إنجليزي)", type: "text" },
  { key: "description", label: "الوصف المختصر", type: "textarea", required: true },
  { key: "fullDescription", label: "الوصف الكامل", type: "textarea" },
  {
    key: "status",
    label: "الحالة",
    type: "select",
    options: ["Research", "Prototype", "Active", "Completed"],
    required: true,
  },
  {
    key: "team",
    label: "الفريق",
    type: "repeater",
    itemLabel: "name",
    fields: [
      { key: "name", label: "الاسم", type: "text", required: true },
      { key: "slug", label: "المعرّف", type: "text", required: true },
      { key: "role", label: "الدور", type: "text" },
    ],
  },
  { key: "techStack", label: "التقنيات", type: "tags" },
  { key: "labSlug", label: "المختبر", type: "ref", ref: "research_labs", refValue: "slug", refLabel: "name" },
  { key: "githubUrl", label: "GitHub", type: "url" },
  { key: "demoUrl", label: "العرض الحي", type: "url" },
  { key: "videoUrl", label: "الفيديو", type: "url" },
  { key: "image", label: "الصورة", type: "text", hint: "/departments-bg.png" },
  { key: "featured", label: "مميّز", type: "boolean" },
];

const NEWS_FIELDS: readonly FieldSpec[] = [
  { key: "id", label: "المعرّف", type: "text", required: true },
  { key: "slug", label: "الرابط المختصر", type: "text" },
  { key: "title", label: "العنوان", type: "text", required: true },
  {
    key: "category",
    label: "التصنيف",
    type: "select",
    options: ["أخبار المؤسسة", "أخبار المشاريع", "المؤتمرات", "الجوائز", "التعاونات"],
    required: true,
  },
  { key: "date", label: "التاريخ", type: "date", required: true },
  { key: "summary", label: "الملخص", type: "textarea", required: true },
  { key: "content", label: "المحتوى", type: "textarea" },
  { key: "image", label: "الصورة", type: "text" },
];

const LAB_FIELDS: readonly FieldSpec[] = [
  { key: "id", label: "المعرّف", type: "text", required: true },
  { key: "slug", label: "الرابط المختصر", type: "text", required: true },
  { key: "name", label: "الاسم", type: "text", required: true },
  { key: "nameEn", label: "الاسم (إنجليزي)", type: "text" },
  { key: "description", label: "الوصف", type: "textarea", required: true },
  { key: "leadName", label: "اسم القائد", type: "text" },
  { key: "leadSlug", label: "معرّف القائد", type: "text" },
  { key: "researchersCount", label: "عدد الباحثين", type: "number" },
  { key: "activeProjectsCount", label: "المشاريع النشطة", type: "number" },
  { key: "publishedPapersCount", label: "الأوراق المنشورة", type: "number" },
  { key: "focusAreas", label: "مجالات التركيز", type: "tags" },
  { key: "iconName", label: "الأيقونة", type: "text", hint: "brain-circuit" },
];

const RESEARCHER_FIELDS: readonly FieldSpec[] = [
  { key: "id", label: "المعرّف", type: "text", required: true },
  { key: "slug", label: "الرابط المختصر", type: "text", required: true },
  { key: "name", label: "الاسم", type: "text", required: true },
  { key: "role", label: "المسمى الوظيفي", type: "text", required: true },
  { key: "bio", label: "السيرة", type: "textarea" },
  { key: "avatar", label: "الصورة", type: "text", hint: "/team/ali.jpg" },
  { key: "labSlug", label: "المختبر", type: "ref", ref: "research_labs", refValue: "slug", refLabel: "name" },
  { key: "orcid", label: "ORCID", type: "text" },
  { key: "github", label: "GitHub", type: "url" },
  { key: "linkedin", label: "LinkedIn", type: "url" },
  { key: "scholar", label: "Google Scholar", type: "url" },
  { key: "website", label: "الموقع الشخصي", type: "url" },
  { key: "telegram", label: "تيليغرام", type: "text" },
  { key: "email", label: "البريد الإلكتروني", type: "email", required: true },
  { key: "papersCount", label: "عدد الأوراق", type: "number" },
  { key: "projectsCount", label: "عدد المشاريع", type: "number" },
];

const INITIATIVE_FIELDS: readonly FieldSpec[] = [
  { key: "id", label: "المعرّف", type: "text", required: true },
  { key: "slug", label: "الرابط المختصر", type: "text", required: true },
  { key: "title", label: "العنوان", type: "text", required: true },
  { key: "description", label: "الوصف المختصر", type: "textarea", required: true },
  { key: "fullDescription", label: "الوصف الكامل", type: "textarea" },
  { key: "vision", label: "الرؤية", type: "textarea" },
  { key: "progress", label: "نسبة الإنجاز %", type: "number" },
  {
    key: "status",
    label: "الحالة",
    type: "select",
    options: ["Research", "Active", "Scaling", "Completed"],
    required: true,
  },
  { key: "lead", label: "القائد", type: "text" },
  { key: "leadSlug", label: "معرّف القائد", type: "text" },
  { key: "team", label: "الفريق", type: "tags" },
  { key: "deliverables", label: "المخرجات", type: "tags" },
  {
    key: "milestones",
    label: "المعالم",
    type: "repeater",
    itemLabel: "title",
    fields: [
      { key: "title", label: "العنوان", type: "text", required: true },
      { key: "date", label: "التاريخ", type: "text" },
      { key: "done", label: "منجز", type: "boolean" },
    ],
  },
  { key: "link", label: "الرابط", type: "url" },
  { key: "tags", label: "الوسوم", type: "tags" },
  { key: "image", label: "الصورة", type: "text" },
  { key: "gallery", label: "معرض الصور", type: "tags" },
];

const EVENT_FIELDS: readonly FieldSpec[] = [
  { key: "id", label: "المعرّف", type: "text", required: true },
  { key: "title", label: "العنوان", type: "text", required: true },
  { key: "date", label: "التاريخ", type: "date", required: true },
  { key: "location", label: "المكان", type: "text" },
  {
    key: "type",
    label: "النوع",
    type: "select",
    options: ["ورشة عمل", "ندوة علمية", "هاكاثون", "مؤتمر"],
    required: true,
  },
  { key: "description", label: "الوصف", type: "textarea" },
  { key: "speakers", label: "المتحدثون", type: "tags" },
];

const PARTNER_FIELDS: readonly FieldSpec[] = [
  { key: "name", label: "الاسم", type: "text", required: true },
  {
    key: "type",
    label: "النوع",
    type: "select",
    options: ["جامعات", "شركات", "مؤسسات أبحاث", "مراكز دولية"],
    required: true,
  },
  { key: "country", label: "الدولة", type: "text" },
  { key: "logoUrl", label: "الشعار", type: "text" },
  { key: "website", label: "الموقع", type: "text" },
];

const TIMELINE_FIELDS: readonly FieldSpec[] = [
  { key: "year", label: "السنة", type: "text", required: true },
  { key: "title", label: "العنوان", type: "text", required: true },
  { key: "subtitle", label: "العنوان الفرعي", type: "text" },
  { key: "description", label: "الوصف", type: "textarea" },
  { key: "highlight", label: "محطة بارزة", type: "boolean" },
];

const OPEN_QUESTION_FIELDS: readonly FieldSpec[] = [
  { key: "id", label: "المعرّف", type: "text", required: true },
  { key: "slug", label: "الرابط المختصر", type: "text", required: true },
  { key: "title", label: "السؤال", type: "text", required: true },
  { key: "titleEn", label: "السؤال (إنجليزي)", type: "text" },
  { key: "field", label: "المجال", type: "text" },
  {
    key: "status",
    label: "الحالة",
    type: "select",
    options: ["مفتوح للنقاش والبحث", "قيد التجارب والتكرار", "غير محسوم بعد", "محلول جزئياً"],
    required: true,
  },
  { key: "description", label: "الوصف", type: "textarea" },
  { key: "researchCount", label: "عدد الأبحاث", type: "number" },
  { key: "experimentsCount", label: "عدد التجارب", type: "number" },
  { key: "replicationsCount", label: "عدد التكرارات", type: "number" },
  { key: "consensus", label: "خلاصة الإجماع", type: "textarea" },
  { key: "tags", label: "الوسوم", type: "tags" },
];

const REPO_FIELDS: readonly FieldSpec[] = [
  { key: "name", label: "الاسم", type: "text", required: true },
  { key: "description", label: "الوصف", type: "textarea" },
  { key: "url", label: "الرابط", type: "url", required: true },
  { key: "license", label: "الرخصة", type: "text" },
  { key: "stars", label: "النجوم", type: "number" },
  { key: "forks", label: "التفريعات", type: "number" },
  { key: "language", label: "اللغة", type: "text" },
];

const FAQ_FIELDS: readonly FieldSpec[] = [
  {
    key: "category",
    label: "التصنيف",
    type: "select",
    options: ["النشر العلمي", "الانضمام", "التمويل والمنح", "الملكية الفكرية"],
    required: true,
  },
  { key: "question", label: "السؤال", type: "text", required: true },
  { key: "answer", label: "الجواب", type: "textarea", required: true },
];

const BENCHMARK_FIELDS: readonly FieldSpec[] = [
  { key: "id", label: "المعرّف", type: "text", required: true },
  { key: "name", label: "الاسم", type: "text", required: true },
  { key: "category", label: "التصنيف", type: "text" },
  { key: "description", label: "الوصف", type: "textarea" },
  { key: "metricName", label: "اسم المقياس", type: "text" },
  { key: "jemoScore", label: "نتيجة JEMO", type: "text" },
  { key: "baselineScore", label: "خط الأساس", type: "text" },
  { key: "sotaScore", label: "أفضل نتيجة معروفة", type: "text" },
  { key: "paperSlug", label: "الورقة المرتبطة", type: "text" },
  { key: "datasetUrl", label: "رابط البيانات", type: "url" },
];

const INFRA_FIELDS: readonly FieldSpec[] = [
  { key: "id", label: "المعرّف", type: "text", required: true },
  { key: "name", label: "الاسم", type: "text", required: true },
  { key: "category", label: "التصنيف", type: "text" },
  { key: "specs", label: "المواصفات", type: "textarea" },
  { key: "purpose", label: "الغرض", type: "textarea" },
  { key: "location", label: "الموقع", type: "text" },
  { key: "status", label: "الحالة", type: "select", options: ["Online", "Expanding", "Planned"], required: true },
];

export const CONTENT_REGISTRY: readonly CollectionSpec[] = [
  // ── الأبحاث ────────────────────────────────────────────────────────────
  {
    key: "published_papers",
    label: "الأوراق والأبحاث",
    labelEn: "Published papers",
    group: "الأبحاث",
    kind: "collection",
    description: "سجل الأوراق البحثية وسجلات الاكتشاف المنشورة.",
    fields: PAPER_FIELDS,
    defaults: RESEARCH_PAPERS,
    wired: true,
    deletedKey: "deleted_paper_ids",
  },
  {
    key: "research_projects",
    label: "المشاريع التقنية",
    labelEn: "Research projects",
    group: "الأبحاث",
    kind: "collection",
    description: "المشاريع الهندسية والأنظمة المفتوحة المصدر.",
    fields: PROJECT_FIELDS,
    defaults: RESEARCH_PROJECTS,
    wired: true,
    deletedKey: "deleted_project_ids",
  },
  {
    key: "news_items",
    label: "المركز الإعلامي",
    labelEn: "Newsroom",
    group: "الأبحاث",
    kind: "collection",
    description: "الأخبار والبيانات الصحفية وإعلانات المؤتمرات.",
    fields: NEWS_FIELDS,
    defaults: NEWS_ITEMS,
    wired: true,
    deletedKey: "deleted_news_ids",
  },
  {
    key: "benchmarks",
    label: "المعايير القياسية",
    labelEn: "Benchmarks",
    group: "الأبحاث",
    kind: "collection",
    description: "لوحات القياس ومقارنة النتائج مع خط الأساس وأفضل نتيجة معروفة.",
    fields: BENCHMARK_FIELDS,
    defaults: BENCHMARKS,
    wired: true,
  },

  // ── المنظومة الأكاديمية ───────────────────────────────────────────────
  {
    key: "research_labs",
    label: "المختبرات",
    labelEn: "Research labs",
    group: "المنظومة الأكاديمية",
    kind: "collection",
    description: "المختبرات البحثية المتخصصة وقيادتها ومجالات تركيزها.",
    fields: LAB_FIELDS,
    defaults: RESEARCH_LABS,
    wired: true,
  },
  {
    key: "researchers",
    label: "الباحثون",
    labelEn: "Researchers",
    group: "المنظومة الأكاديمية",
    kind: "collection",
    description: "الهيئة البحثية: السير الذاتية والروابط الأكاديمية.",
    fields: RESEARCHER_FIELDS,
    defaults: RESEARCHERS,
    wired: true,
  },
  {
    key: "initiatives",
    label: "المبادرات",
    labelEn: "Initiatives",
    group: "المنظومة الأكاديمية",
    kind: "collection",
    description: "المبادرات الوطنية والمعالم ونسب الإنجاز.",
    fields: INITIATIVE_FIELDS,
    defaults: INITIATIVES,
    wired: true,
  },
  {
    key: "open_questions",
    label: "الأسئلة المفتوحة",
    labelEn: "Open questions",
    group: "المنظومة الأكاديمية",
    kind: "collection",
    description: "الأسئلة البحثية غير المحسومة وحالة الإجماع حولها.",
    fields: OPEN_QUESTION_FIELDS,
    defaults: OPEN_QUESTIONS,
    wired: true,
  },
  {
    key: "open_source_repos",
    label: "المستودعات المفتوحة",
    labelEn: "Open source",
    group: "المنظومة الأكاديمية",
    kind: "collection",
    description: "المستودعات والشيفرات المتاحة للعموم.",
    fields: REPO_FIELDS,
    defaults: OPEN_SOURCE_REPOS,
    wired: true,
    identityFields: ["name"],
  },

  // ── المؤسسة ───────────────────────────────────────────────────────────
  {
    key: "partners",
    label: "الشركاء",
    labelEn: "Partners",
    group: "المؤسسة",
    kind: "collection",
    description: "الجامعات والمراكز البحثية المتعاونة.",
    fields: PARTNER_FIELDS,
    defaults: PARTNERS,
    wired: true,
    identityFields: ["name"],
  },
  {
    key: "events",
    label: "الفعاليات",
    labelEn: "Events",
    group: "المؤسسة",
    kind: "collection",
    description: "الورش والندوات والمؤتمرات والهاكاثونات.",
    fields: EVENT_FIELDS,
    defaults: EVENTS,
    wired: true,
  },
  {
    key: "timeline_events",
    label: "الخط الزمني",
    labelEn: "Timeline",
    group: "المؤسسة",
    kind: "collection",
    description: "محطات مسيرة المنصة سنة بسنة.",
    fields: TIMELINE_FIELDS,
    defaults: TIMELINE_EVENTS,
    wired: true,
    identityFields: ["year", "title"],
  },
  {
    key: "faq_items",
    label: "الأسئلة الشائعة",
    labelEn: "FAQ",
    group: "المؤسسة",
    kind: "collection",
    description: "أسئلة النشر والانضمام والتمويل والملكية الفكرية.",
    fields: FAQ_FIELDS,
    defaults: FAQ_ITEMS,
    wired: true,
    identityFields: ["question"],
  },
  {
    key: "infrastructure",
    label: "البنية التحتية",
    labelEn: "Infrastructure",
    group: "المؤسسة",
    kind: "collection",
    description: "العتاد والخوادم والمعدات المخبرية.",
    fields: INFRA_FIELDS,
    defaults: INFRASTRUCTURE,
    wired: true,
  },

  // ── الأقسام الثابتة ───────────────────────────────────────────────────
  {
    key: "about_info",
    label: "عن المنصة",
    labelEn: "About",
    group: "الأقسام الثابتة",
    kind: "document",
    description: "المهمة والرؤية والقيم ومعنى الاسم.",
    fields: [
      { key: "nameMeaning", label: "معنى الاسم", type: "textarea" },
      { key: "whyCreated", label: "لماذا أُسست", type: "textarea" },
      { key: "coreQuote", label: "الاقتباس المحوري", type: "textarea" },
      { key: "mission", label: "المهمة", type: "textarea" },
      { key: "vision", label: "الرؤية", type: "textarea" },
      { key: "researchPhilosophy", label: "فلسفة البحث", type: "textarea" },
      {
        key: "values",
        label: "القيم",
        type: "repeater",
        itemLabel: "title",
        fields: [
          { key: "title", label: "العنوان", type: "text", required: true },
          { key: "desc", label: "الوصف", type: "textarea" },
        ],
      },
    ],
    defaults: [ABOUT_INFO],
    wired: true,
  },
  {
    key: "institution_stats",
    label: "مؤشرات المؤسسة",
    labelEn: "Institution stats",
    group: "الأقسام الثابتة",
    kind: "document",
    description: "أرقام عامة عن المؤسسة (أوراق، مشاريع، باحثون، مجالات، سنة التأسيس). لا صفحة تقرأها بعد.",
    fields: [
      { key: "papers", label: "أوراق", type: "number" },
      { key: "projects", label: "مشاريع", type: "number" },
      { key: "researchers", label: "باحثون", type: "number" },
      { key: "fields", label: "مجالات", type: "number" },
      { key: "founded", label: "سنة التأسيس", type: "number" },
    ],
    defaults: [INSTITUTION_STATS],
    wired: false,
  },
  {
    key: "financial_supports",
    label: "الشفافية المالية",
    labelEn: "Financial transparency",
    group: "الأقسام الثابتة",
    kind: "document",
    description: "بيان توزيع التمويل والالتزامات المالية.",
    fields: [
      { key: "quote", label: "الاقتباس", type: "textarea" },
      {
        key: "breakdown",
        label: "توزيع التمويل",
        type: "repeater",
        itemLabel: "title",
        fields: [
          { key: "title", label: "البند", type: "text", required: true },
          { key: "percentage", label: "النسبة %", type: "number" },
          { key: "desc", label: "الوصف", type: "text" },
        ],
      },
      { key: "commitments", label: "الالتزامات", type: "tags" },
    ],
    defaults: [FINANCIAL_SUPPORTS],
    wired: true,
  },
  {
    key: "peer_review_policy",
    label: "سياسة المراجعة",
    labelEn: "Peer review policy",
    group: "الأقسام الثابتة",
    kind: "document",
    description: "ضوابط التحكيم والتحقق البشري.",
    fields: [
      { key: "title", label: "العنوان", type: "text" },
      { key: "summary", label: "الملخص", type: "textarea" },
      { key: "guidelines", label: "الضوابط", type: "tags" },
    ],    defaults: [PEER_REVIEW_POLICY],
    wired: true,
  },
];

export function getSpec(key: string): CollectionSpec | undefined {
  return CONTENT_REGISTRY.find((c) => c.key === key);
}

/** Stable identity for an item, used to dedupe edits against the defaults. */
export function itemId(spec: CollectionSpec, item: unknown, index = 0): string {
  if (spec.kind === "string-list") return String(item);
  const obj = (item ?? {}) as Record<string, unknown>;
  const idValue = obj[spec.idField ?? "id"];
  if (idValue !== undefined && idValue !== null && String(idValue) !== "") {
    return String(idValue);
  }
  const identity = spec.identityFields ?? [];
  if (identity.length > 0) {
    const parts = identity.map((k) => String(obj[k] ?? "").trim());
    if (parts.some(Boolean)) return parts.join("::");
  }
  return `_item-${index}`;
}

/** Groups in registry order, for the dashboard navigation. */
export function registryGroups(): { group: string; collections: CollectionSpec[] }[] {
  const groups: { group: string; collections: CollectionSpec[] }[] = [];
  for (const spec of CONTENT_REGISTRY) {
    const found = groups.find((g) => g.group === spec.group);
    if (found) found.collections.push(spec as CollectionSpec);
    else groups.push({ group: spec.group, collections: [spec as CollectionSpec] });
  }
  return groups;
}
