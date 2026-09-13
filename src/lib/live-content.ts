import { liveDocument, liveItems } from "@/lib/content/server";
import type {
  ABOUT_INFO,
  Benchmark,
  EventItem,
  FAQItem,
  FINANCIAL_SUPPORTS,
  InfrastructureItem,
  Initiative,
  INSTITUTION_STATS,
  Lab,
  NewsItem,
  OpenQuestion,
  OpenSourceRepo,
  Paper,
  Partner,
  PEER_REVIEW_POLICY,
  Project,
  Researcher,
  TimelineEvent,
} from "@/lib/data/research-data";

/** The `research-data` singletons, typed off their committed defaults. */
export type AboutInfo = typeof ABOUT_INFO;
export type InstitutionStats = typeof INSTITUTION_STATS;
export type FinancialSupports = typeof FINANCIAL_SUPPORTS;
export type PeerReviewPolicy = typeof PEER_REVIEW_POLICY;

/**
 * Site-side readers for content edited in the JEMO dashboard.
 *
 * Each one returns the committed defaults merged with whatever the dashboard has
 * published, so the site keeps working (with the shipped content) if Supabase is
 * unreachable or unconfigured. The merge, the identity rules and the
 * deleted-default handling all live in `@/lib/content/server`.
 */

export function normalizePaper(paper: Paper): Paper {
  if (!paper) return paper;
  const rawAuthors = Array.isArray(paper.authors) ? (paper.authors as unknown[]) : [];
  const normalizedAuthors = rawAuthors.map((a, idx) => {
    if (typeof a === "string") {
      const trimmed = a.trim();
      const slug = trimmed.toLowerCase().replace(/[^\w\u0621-\u064A]+/g, "-") || `author-${idx}`;
      return { name: trimmed, slug, role: "مؤلف" };
    }
    if (a && typeof a === "object") {
      const obj = a as { name?: string; slug?: string; role?: string; title?: string };
      const name = obj.name || obj.title || "باحث";
      const slug = obj.slug || name.trim().toLowerCase().replace(/[^\w\u0621-\u064A]+/g, "-") || `author-${idx}`;
      return { ...obj, name, slug };
    }
    return { name: "باحث", slug: `author-${idx}` };
  });

  return {
    ...paper,
    title: paper.title || "",
    titleEn: paper.titleEn || "",
    abstract: paper.abstract || "",
    field: paper.field || "هندسة النظم",
    keywords: Array.isArray(paper.keywords) ? paper.keywords : [],
    authors: normalizedAuthors,
  };
}

export async function getLiveResearchPapers(): Promise<Paper[]> {
  const papers = await liveItems<Paper>("published_papers");
  return papers.map(normalizePaper);
}

export function getLiveProjects(): Promise<Project[]> {
  return liveItems<Project>("research_projects");
}

export function getLiveNews(): Promise<NewsItem[]> {
  return liveItems<NewsItem>("news_items");
}

export function getLiveLabs(): Promise<Lab[]> {
  return liveItems<Lab>("research_labs");
}

export function getLiveResearchers(): Promise<Researcher[]> {
  return liveItems<Researcher>("researchers");
}

export function getLiveInitiatives(): Promise<Initiative[]> {
  return liveItems<Initiative>("initiatives");
}

export function getLiveBenchmarks(): Promise<Benchmark[]> {
  return liveItems<Benchmark>("benchmarks");
}

export function getLiveOpenQuestions(): Promise<OpenQuestion[]> {
  return liveItems<OpenQuestion>("open_questions");
}

export function getLiveOpenSourceRepos(): Promise<OpenSourceRepo[]> {
  return liveItems<OpenSourceRepo>("open_source_repos");
}

export function getLivePartners(): Promise<Partner[]> {
  return liveItems<Partner>("partners");
}

export function getLiveEvents(): Promise<EventItem[]> {
  return liveItems<EventItem>("events");
}

export function getLiveTimeline(): Promise<TimelineEvent[]> {
  return liveItems<TimelineEvent>("timeline_events");
}

export function getLiveFaq(): Promise<FAQItem[]> {
  return liveItems<FAQItem>("faq_items");
}

export function getLiveInfrastructure(): Promise<InfrastructureItem[]> {
  return liveItems<InfrastructureItem>("infrastructure");
}

export function getLiveAboutInfo(): Promise<AboutInfo> {
  return liveDocument<AboutInfo>("about_info");
}

export function getLiveInstitutionStats(): Promise<InstitutionStats> {
  return liveDocument<InstitutionStats>("institution_stats");
}

export function getLiveFinancialSupports(): Promise<FinancialSupports> {
  return liveDocument<FinancialSupports>("financial_supports");
}

export function getLivePeerReviewPolicy(): Promise<PeerReviewPolicy> {
  return liveDocument<PeerReviewPolicy>("peer_review_policy");
}
