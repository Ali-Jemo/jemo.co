import type { MetadataRoute } from "next";
import { RESEARCH_PAPERS } from "@/lib/data/research-data";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
}> = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/research", changeFrequency: "daily", priority: 0.9 },
  { path: "/labs", changeFrequency: "weekly", priority: 0.8 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.8 },
  { path: "/researchers", changeFrequency: "weekly", priority: 0.7 },
  { path: "/initiatives", changeFrequency: "weekly", priority: 0.7 },
  { path: "/news", changeFrequency: "daily", priority: 0.7 },
  { path: "/benchmarks", changeFrequency: "weekly", priority: 0.6 },
  { path: "/infrastructure", changeFrequency: "monthly", priority: 0.5 },
  { path: "/open-source", changeFrequency: "weekly", priority: 0.6 },
  { path: "/publications", changeFrequency: "weekly", priority: 0.7 },
  { path: "/events", changeFrequency: "weekly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/support", changeFrequency: "monthly", priority: 0.6 },
  { path: "/partners", changeFrequency: "monthly", priority: 0.4 },
  { path: "/timeline", changeFrequency: "monthly", priority: 0.5 },
  { path: "/newsletter", changeFrequency: "weekly", priority: 0.6 },
  { path: "/gallery", changeFrequency: "weekly", priority: 0.8 },
  { path: "/applications", changeFrequency: "daily", priority: 0.9 },
  { path: "/apply", changeFrequency: "monthly", priority: 0.9 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://jemo.co";

  const staticUrls: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: new Date("2026-09-01"),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const paperUrls: MetadataRoute.Sitemap = RESEARCH_PAPERS.map((p) => ({
    url: `${baseUrl}/research/${p.slug}`,
    lastModified: new Date(p.publishDate),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticUrls, ...paperUrls];
}
