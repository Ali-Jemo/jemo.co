import "server-only";

import { RESEARCH_PAPERS, type Paper, type ResearchResponse } from "@/lib/data/research-data";
import { isStrongSecret, safeCompare } from "@/lib/security";
import { normalizeSafeHttpUrl } from "@/lib/security-client";
import { resolveApiKey } from "@/lib/api-keys";

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

interface ApiKeyProfile {
  name: string;
  handle: string;
  id: string;
  role: string;
}

/**
 * Server-side registry of valid researcher API keys.
 *
 * Keys come exclusively from the `JEMO_API_KEYS` environment variable — never
 * from source. Entries are comma-separated and formatted
 * `<token>|<name>|<handle>|<role>`; only the token is required, the rest are
 * optional profile metadata.
 *
 * There is deliberately NO format-based fallback. Previously any string
 * matching /^jemo_live_res_[a-zA-Z0-9_-]{8,}$/ authenticated, so an
 * unauthenticated caller could publish and mutate research objects. A key that
 * merely *looks* like a credential must never be treated as one.
 */
let cachedKeysRaw: string | null = null;
let cachedKeys = new Map<string, ApiKeyProfile>();

function configuredKeys(): Map<string, ApiKeyProfile> {
  const raw = process.env.JEMO_API_KEYS ?? "";
  if (raw === cachedKeysRaw) return cachedKeys;

  const parsed = new Map<string, ApiKeyProfile>();
  for (const entry of raw.split(",")) {
    const [token, name, handle, role] = entry.split("|").map((part) => part.trim());
    if (!token || parsed.has(token)) continue;
    const suffix = token.slice(-8);
    parsed.set(token, {
      name: name || "باحث معتمد",
      handle: handle || `@res_${suffix}`,
      id: `user_${suffix}`,
      role: role || "باحث مستقل مسجل",
    });
  }

  cachedKeysRaw = raw;
  cachedKeys = parsed;
  return parsed;
}

// In-memory dynamic store of API-published papers
const dynamicPapers: Paper[] = [];

/**
 * Validates inbound API keys from headers.
 * Accepts `Authorization: Bearer <key>` or `X-API-Key: <key>`.
 *
 * Async because dashboard-issued keys are resolved from the database, which is
 * what makes them revocable without a redeploy.
 */
export async function validateApiKey(
  authHeader?: string | null,
  xApiKey?: string | null
): Promise<{
  valid: boolean;
  researcher?: ApiKeyProfile;
  error?: string;
}> {
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

  // Check master admin key if configured in environment. Gated through
  // isStrongSecret like every other admin path (see verifyAdminSecret), so a
  // weak/short master key can never authenticate against the publish API.
  const adminSecret = process.env.CONTENT_ADMIN_SECRET || process.env.JEMO_API_KEY;
  if (isStrongSecret(adminSecret) && safeCompare(key, adminSecret)) {
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

  // Static allowlist for service accounts and CI. Compared in constant time so
  // a mismatch does not leak the stored token via timing. Rotating one requires
  // a redeploy, which is why interactive keys use the database path below.
  for (const [token, profile] of configuredKeys()) {
    if (safeCompare(key, token)) {
      return { valid: true, researcher: profile };
    }
  }

  // Dashboard-issued keys: hashed at rest, revocable instantly.
  const resolved = await resolveApiKey(key);
  if (resolved) {
    return { valid: true, researcher: resolved };
  }

  // Fail closed: an unregistered key is never a credential, however it looks.
  return {
    valid: false,
    error: "Invalid or unrecognized API key.",
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

  // SECURITY: reject javascript:/data:/vbscript: URLs at write time.
  // Relative /papers/*.pdf legacy values resolve to undefined (hidden in UI until re-upload).
  for (const [key, val] of [
    ["pdfUrl", input.pdfUrl],
    ["codeUrl", input.codeUrl],
    ["datasetUrl", input.datasetUrl],
  ] as const) {
    if (typeof val === "string" && val.trim() && val.trim() !== "#") {
      const lower = val.trim().toLowerCase();
      if (
        lower.startsWith("javascript:") ||
        lower.startsWith("data:") ||
        lower.startsWith("vbscript:") ||
        lower.startsWith("file:")
      ) {
        throw new Error(`Field '${key}' must be an http(s) URL.`);
      }
    }
  }

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
    pdfUrl: normalizeSafeHttpUrl(input.pdfUrl) ?? "#",
    codeUrl: normalizeSafeHttpUrl(input.codeUrl),
    datasetUrl: normalizeSafeHttpUrl(input.datasetUrl),
    field,
    labSlug: "systems",
    keywords: ["JEMO API", "Research Object", field],
    researchType: rawType,
    evidenceStatus: "Under Review",
    humanVerification: {
      accuracyCheck: input.accuracyCheck || "بانتظار التحقق من المخرجات عبر الـ API.",
      confidence: (input.confidence as NonNullable<Paper["humanVerification"]>["confidence"]) || "استكشافية / أولية",
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

  // ponytail: background Jev audit fire-and-forget without adding request latency
  void triggerBackgroundJevAudit(newPaper);

  return newPaper;
}

/**
 * Background evaluation of newly registered research objects using Jev (TypeSafe System One).
 */
export async function triggerBackgroundJevAudit(paper: Paper): Promise<void> {
  try {
    const VERCEL_KEY = process.env.AI_GATEWAY_API_KEY || process.env.TYPESAFE_API_KEY || "";
    const state = JSON.stringify({
      title: paper.title,
      abstract: paper.abstract,
      question: paper.question || "",
      findings: paper.findings || "",
      field: paper.field,
    });

    const questions = {
      rigor: {
        type: "score",
        instructions: "Rate empirical rigor and methodological validity of this research",
        criteria: [
          "Preliminary / unverified hypothesis",
          "Sound methodology with empirical evidence",
          "High rigor, benchmarked, reproducible proofs",
        ],
      },
      reproducibility: {
        type: "boolean",
        instructions: "Is this research object clearly structured for independent replication?",
        criteria: {
          true: "Transparent methodology and replicable parameters",
          false: "Missing critical experimental or implementation details",
        },
      },
      contribution: {
        type: "choice",
        instructions: "Classify the primary contribution category of this research object",
        criteria: {
          empirical: "Empirical experiment, evaluation, or replication benchmark",
          theoretical: "Theoretical model, theorem, or mathematical proof",
          applied: "Practical implementation, tool, or engineering dataset",
        },
      },
    };

    let evalData: Paper["jevEvaluation"] | null = null;

    if (VERCEL_KEY) {
      const isDirect = Boolean(process.env.TYPESAFE_API_KEY && !process.env.AI_GATEWAY_API_KEY);
      const endpoint = isDirect
        ? (process.env.TYPESAFE_BASE_URL || "https://api.typesafe.ai/v1/systemone")
        : "https://ai-gateway.vercel.sh/v4/ai/evaluation-model";

      const directQuestions: Record<string, unknown> = isDirect
        ? {
            ...questions,
            reproducibility: { ...questions.reproducibility, type: "noul" },
          }
        : questions;

      const headers: Record<string, string> = {
        Authorization: `Bearer ${VERCEL_KEY}`,
        "Content-Type": "application/json",
      };
      if (!isDirect) {
        headers["ai-gateway-protocol-version"] = "0.0.1";
        headers["ai-evaluation-model-specification-version"] = "4";
        headers["ai-model-id"] = "typesafe-ai/jev";
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...(isDirect ? { model: "jev-latest" } : {}),
          state,
          questions: directQuestions,
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        const data = await res.json();
        const answers = data.answers || {};
        const conf = data.providerMetadata?.typesafe?.confidence || {};
        const rawRigor = typeof answers.rigor?.score === "number" ? answers.rigor.score : null;
        const rawRepro = typeof answers.reproducibility?.noul === "number"
          ? answers.reproducibility.noul
          : typeof answers.reproducibility?.probability === "number"
          ? answers.reproducibility.probability
          : null;

        if (rawRigor !== null && rawRepro !== null) {
          evalData = {
            status: "completed",
            rigorScore: Number(rawRigor.toFixed(2)),
            rigorNormalized: Math.min(100, Math.round((rawRigor / 2) * 100)),
            reproducibilityProbability: Number(rawRepro.toFixed(2)),
            reproducibilityPercent: Math.round(rawRepro * 100),
            contribution: answers.contribution?.choice || "empirical",
            confidence: { rigor: conf.rigor ?? 0.85, contribution: conf.contribution ?? 0.8 },
            evaluatedAt: new Date().toISOString(),
          };
        }
      }
    }

    if (!evalData) {
      evalData = {
        status: "failed",
        rigorScore: null,
        rigorNormalized: null,
        reproducibilityProbability: null,
        reproducibilityPercent: null,
        contribution: null,
        confidence: null,
        evaluatedAt: new Date().toISOString(),
      };
    }

    paper.jevEvaluation = evalData;
  } catch (err) {
    console.error(`[Background Jev] Evaluation error on ${paper.id}:`, err);
    paper.jevEvaluation = {
      status: "failed",
      rigorScore: null,
      rigorNormalized: null,
      reproducibilityProbability: null,
      reproducibilityPercent: null,
      contribution: null,
      confidence: null,
      evaluatedAt: new Date().toISOString(),
    };
  }
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
    verified: false,
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
