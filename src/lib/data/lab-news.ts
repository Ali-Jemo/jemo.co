import { NEWS_ITEMS, type NewsItem } from "@/lib/data/research-data";

export function getLabNews(labSlug: string): NewsItem[] {
  return NEWS_ITEMS.filter((item) => item.labSlug === labSlug).sort((a, b) => b.date.localeCompare(a.date));
}
