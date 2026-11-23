import { NEWS_ITEMS, RESEARCH_PAPERS, type NewsItem, type Paper } from "@/lib/data/research-data";
import { showUnverifiedSamples } from "@/lib/site";

const SAMPLE_PAPER_IDS = new Set(RESEARCH_PAPERS.map((paper) => paper.id));
const SAMPLE_NEWS_IDS = new Set(NEWS_ITEMS.map((item) => item.id));

export function paperIsUnverifiedSample(paper: { id?: string; unverifiedSample?: boolean }): boolean {
  if (paper.unverifiedSample === false) return false;
  if (paper.unverifiedSample === true) return true;
  return Boolean(paper.id && SAMPLE_PAPER_IDS.has(paper.id));
}

export function newsIsUnverifiedSample(item: { id?: string; unverifiedSample?: boolean }): boolean {
  if (item.unverifiedSample === false) return false;
  if (item.unverifiedSample === true) return true;
  return Boolean(item.id && SAMPLE_NEWS_IDS.has(item.id));
}

export function filterPapers<T extends { id?: string; unverifiedSample?: boolean }>(papers: T[]): T[] {
  if (showUnverifiedSamples()) return papers;
  return papers.filter((paper) => !paperIsUnverifiedSample(paper));
}

export function filterNews<T extends { id?: string; unverifiedSample?: boolean }>(items: T[]): T[] {
  if (showUnverifiedSamples()) return items;
  return items.filter((item) => !newsIsUnverifiedSample(item));
}

export function visiblePapers(): Paper[] {
  return filterPapers(RESEARCH_PAPERS);
}

export function visiblePaperCountFor(slug: string, name: string): number {
  return visiblePapers().filter((paper) =>
    (paper.authors ?? []).some((author: unknown) => {
      if (typeof author === "string") return author.includes(name);
      const row = author as { slug?: string; name?: string };
      return row.slug === slug || row.name === name;
    })
  ).length;
}

export function visibleNews(): NewsItem[] {
  return filterNews(NEWS_ITEMS);
}
