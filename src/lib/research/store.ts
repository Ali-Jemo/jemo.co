import { RESEARCH_PAPERS, type Paper, type ResearchResponse } from "@/lib/data/research-data";
import { safeCompare } from "@/lib/security";

export interface PublishResearchInput {
  title: string;
  titleEn?: string;
  field?: string;
  researchType?: Paper["researchType"];
  research_type?: Paper["researchType"];
  question?: string;
  findings?: string;
  abstract?: string;
  methodology?: string;
  tools?: string[];
  toolsUsed?: string[];
  confidence?: string;
  accuracyCheck?: string;
  pdfUrl?: string;
  codeUrl?: string;
  datasetUrl?: string;
  authorName?: string;
  author_name?: string;
}

export interface ReplicationInput {
  type?: "replication" | "challenge" | "evidence" | "correction" | "extension";
  findings: string;
  methodology?: string;
  confidence?: string;
  reproducedAccuracy?: number;
  evidenceUrl?: string;
  author?: string;
}

export interface QueryResearchOptions {
  q?: string;
  field?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

// Known researcher API keys for demo and core team
const KNOWN_KEYS: Record<string, { name: string; handle: string; id: string; role: string }> = {
  "jemo_live_res_89fa41c09b2e817d": {
    name: "عمر الكرخي",
    handle: "@omar_karkhi",
    id: "karkhi",
    role: "باحث مواطن مستقل",
  },
  "jemo_live_res_44189b2e817d0aa1": {
    name: "د. مريم الهاشمي",
    handle: "@mariam_hashemi",
    id: "hashemi",
    role: "باحثة أولى في النظم الموزعة",
  },
};

// In-memory dynamic store of API-published papers
const dynamicPapers: Paper[] = [];

/**
 * Validates inbound API keys from headers.
 * Accepts `Authorization: Bearer <key>` or `X-API-Key: <key>`.
 */
export function validateApiKey(authHeader?: string | null, xApiKey?: string | null): {
  valid: boolean;
  researcher?: { name: string; handle: string; id: string; role: string };
  error?: string;
} {
  let key = (authHeader || "").trim();
  if (key.toLowerCase().startsWith("bearer ")) {
    key = key.slice(7).trim();
  }
  if (!key && xApiKey) {
    key = xApiKey.trim();
  }

  if (!key) {
    return {
      valid: false,
      error: "Missing API key. Provide 'Authorization: Bearer <api_key>' or 'X-API-Key: <key>'.",
    };
  }

  // Check master admin key if configured in environment
  const adminSecret = process.env.CONTENT_ADMIN_SECRET || process.env.JEMO_API_KEY;
  if (adminSecret && safeCompare(key, adminSecret)) {
    return {
      valid: true,
      researcher: {
        name: "JEMO Admin",
        handle: "@jemo_admin",
        id: "admin",
        role: "System Administrator",
      },
    };
  }

  // Check known demo profiles
  if (KNOWN_KEYS[key]) {
    return {
      valid: true,
      researcher: KNOWN_KEYS[key],
    };
  }

  // General format validation: jemo_live_res_[alphanumeric_or_underscore]{8,}
  const keyPattern = /^jemo_live_res_[a-zA-Z0-9_-]{8,}$/;
  if (keyPattern.test(key)) {
    const keyId = key.slice(-8);
    return {
      valid: true,
      researcher: {
        name: "باحث معتمد",
        handle: `@res_${keyId}`,
        id: `user_${keyId}`,
        role: "باحث مستقل مسجل",
      },
    };
  }

  return {
    valid: false,
    error: "Invalid API key format. Expected 'jemo_live_res_...'.",
  };
}

/**
 * Normalizes title into a URL-friendly slug.
 */
export function generateSlug(title: string, id: string): string {
  const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^\u0621-\u064Aa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40);
  return `${cleanTitle || "research"}-${id.toLowerCase()}`;
}

/**
 * Publishes a new Research Object via the API.
 */
export function publishResearchObject(
  input: PublishResearchInput,
  authorOverride?: { name?: string; handle?: string; id?: string; role?: string }
): Paper {
  if (!input.title || typeof input.title !== "string" || !input.title.trim()) {
    throw new Error("Field 'title' is required and must be a non-empty string.");
  }

  const title = input.title.trim();
  const titleEn = input.titleEn?.trim() || title;
  const rawType = input.researchType || input.research_type || "Experiment";
  const field = input.field?.trim() || "الذكاء الاصطناعي وهندسة الاستدلال";
  const findings = input.findings?.trim() || input.abstract?.trim() || "تم توثيق كائن البحث آلياً عبر JEMO API.";
  const question = input.question?.trim();
  const tools = input.tools || input.toolsUsed || [];

  const timestamp = Date.now();
  const id = `JEMO-OBJ-${timestamp.toString().slice(-6)}`;
  const slug = generateSlug(title, id);
  const publishDate = new Date().toISOString().split("T")[0];

  const authorName = authorOverride?.name || input.authorName || input.author_name || "باحث مستقل";
  const authorHandle = authorOverride?.handle || "@independent_researcher";
  const authorRole = authorOverride?.role || "باحث مساهم";

  const newPaper: Paper = {
    id,
    slug,
    title,
    titleEn,
    abstract: findings,
    findings,
    question,
    methodology: input.methodology?.trim(),
    toolsUsed: tools,
    authors: [
      {
        name: authorName,
        slug: authorHandle.replace(/^@/, ""),
        role: authorRole,
      },
    ],
    publishDate,
    pdfUrl: input.pdfUrl || "#",
    codeUrl: input.codeUrl,
    datasetUrl: input.datasetUrl,
    field,
    labSlug: "systems",
    keywords: ["JEMO API", "Research Object", field],
    researchType: rawType,
    evidenceStatus: "Evidence-backed",
    humanVerification: {
      accuracyCheck: input.accuracyCheck || "تم التحقق من المخرجات عبر الـ API.",
      confidence: (input.confidence as NonNullable<Paper["humanVerification"]>["confidence"]) || "مرتفعة - تم التكرار بنجاح",
    },
    citation: {
      bibtex: `@article{${slug},\n  title={${title}},\n  author={${authorName}},\n  year={${publishDate.slice(0, 4)}},\n  publisher={JEMO Discovery Registry}\n}`,
      apa: `${authorName} (${publishDate.slice(0, 4)}). ${title}. JEMO Discovery Registry.`,
    },
    lineage: {
      replicationsCount: 0,
      challengesCount: 0,
      extensionsCount: 0,
    },
    metrics: {
      reproducedCount: 1,
      evidenceBackedCount: 1,
      disputedCount: 0,
      insightfulCount: 1,
    },
    responses: [],
  };

  // Prepend to live store
  dynamicPapers.unshift(newPaper);
  return newPaper;
}

/**
 * Queries and searches across both default and dynamic research objects.
 */
export function listResearchObjects(options: QueryResearchOptions = {}): {
  items: Paper[];
  total: number;
  limit: number;
  offset: number;
} {
  const { q, field, type, limit = 20, offset = 0 } = options;

  // Deduplicate by ID
  const seenIds = new Set<string>();
  const allPapers: Paper[] = [];

  for (const p of [...dynamicPapers, ...RESEARCH_PAPERS]) {
    if (!p || !p.id || seenIds.has(p.id)) continue;
    seenIds.add(p.id);
    allPapers.push(p);
  }

  let filtered = allPapers;

  if (type && type !== "all") {
    filtered = filtered.filter((p) => p.researchType?.toLowerCase() === type.toLowerCase());
  }

  if (field && field !== "all") {
    filtered = filtered.filter((p) => (p.field || "").toLowerCase().includes(field.toLowerCase()));
  }

  if (q && q.trim()) {
    const query = q.toLowerCase().trim();
    filtered = filtered.filter((p) => {
      const inTitle = (p.title || "").toLowerCase().includes(query);
      const inTitleEn = (p.titleEn || "").toLowerCase().includes(query);
      const inAbstract = (p.abstract || "").toLowerCase().includes(query);
      const inQuestion = (p.question || "").toLowerCase().includes(query);
      const inFindings = (p.findings || "").toLowerCase().includes(query);
      const inField = (p.field || "").toLowerCase().includes(query);
      const inAuthor = (p.authors || []).some((a) => (a.name || "").toLowerCase().includes(query));
      return inTitle || inTitleEn || inAbstract || inQuestion || inFindings || inField || inAuthor;
    });
  }

  const safeLimit = Math.max(1, Math.min(100, Number(limit) || 20));
  const safeOffset = Math.max(0, Number(offset) || 0);
  const items = filtered.slice(safeOffset, safeOffset + safeLimit);

  return {
    items,
    total: filtered.length,
    limit: safeLimit,
    offset: safeOffset,
  };
}

/**
 * Retrieves a single Research Object by slug or ID.
 */
export function getResearchObject(slugOrId: string): Paper | null {
  if (!slugOrId) return null;
  const clean = slugOrId.trim();

  // Search dynamic first, then base
  const found =
    dynamicPapers.find((p) => p.slug === clean || p.id === clean) ||
    RESEARCH_PAPERS.find((p) => p.slug === clean || p.id === clean);

  return found || null;
}

/**
 * Adds a peer replication response to a research object.
 */
export function replicateResearchObject(
  slugOrId: string,
  rep: ReplicationInput
): { success: boolean; paper?: Paper; error?: string } {
  const paper = getResearchObject(slugOrId);
  if (!paper) {
    return { success: false, error: `Research object '${slugOrId}' not found.` };
  }

  if (!rep.findings || !rep.findings.trim()) {
    return { success: false, error: "Field 'findings' is required for replication." };
  }

  const responseItem: ResearchResponse = {
    id: `rep_${Date.now()}`,
    type: rep.type || "replication",
    author: rep.author || "مدقق نظير (Peer Auditor)",
    date: new Date().toISOString().split("T")[0],
    content: rep.findings.trim(),
    verified: rep.type !== "challenge",
  };

  if (!paper.responses) {
    paper.responses = [];
  }
  paper.responses.push(responseItem);

  if (!paper.lineage) {
    paper.lineage = { replicationsCount: 0, challengesCount: 0, extensionsCount: 0 };
  }

  if (rep.type === "challenge") {
    paper.lineage.challengesCount = (paper.lineage.challengesCount || 0) + 1;
  } else if (rep.type === "extension") {
    paper.lineage.extensionsCount = (paper.lineage.extensionsCount || 0) + 1;
  } else {
    paper.lineage.replicationsCount = (paper.lineage.replicationsCount || 0) + 1;
  }

  return { success: true, paper };
}
