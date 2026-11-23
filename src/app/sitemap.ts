import type { MetadataRoute } from "next";
import { visiblePapers } from "@/lib/samples";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
}> = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/research", changeFrequency: "daily", priority: 0.9 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.8 },
  { path: "/explain", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/publish", changeFrequency: "weekly", priority: 0.6 },
  { path: "/researchers/ali-jemo", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const staticUrls: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date("2026-11-23"),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const paperUrls: MetadataRoute.Sitemap = visiblePapers().map((paper) => ({
    url: `${baseUrl}/research/${paper.slug}`,
    lastModified: new Date(paper.publishDate),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticUrls, ...paperUrls];
}
