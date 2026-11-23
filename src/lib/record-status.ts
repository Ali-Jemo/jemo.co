/** Honest public status. Counts are never invented here. */
export function recordStatusLabel(paper: {
  humanVerification?: { confidence?: string };
  codeUrl?: string;
}): "أولية" | "مدعومة بكود" | "أُعيدت تجربتها" {
  if (paper.humanVerification?.confidence === "مرتفعة - تم التكرار بنجاح") {
    return "أُعيدت تجربتها";
  }
  if (typeof paper.codeUrl === "string" && paper.codeUrl.startsWith("https://")) {
    return "مدعومة بكود";
  }
  return "أولية";
}

export const FEATURED_RECORD_SLUGS = [
  "ai-assisted-rafidain-calendar",
  "ai-assisted-arabic-texts-analysis",
  "ai-debug-memory-leak-investigation",
] as const;

export const RETIRED_PROJECT_SLUGS = new Set(["iraq-plus-plus", "labpoint-ashurix"]);

/** Records that leave the platform entirely. */
export const RETIRED_RECORD_SLUGS = new Set(["ashurix-academic-currency-tokenomics"]);
