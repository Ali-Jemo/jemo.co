import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;

  return {
    rules: [
      {
        // AI harvesters: blocked sitewide except public research content,
        // which we want cited by AI search. Everything else stays closed.
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "ClaudeBot",
          "anthropic-ai",
          "Bytespider",
          "PerplexityBot",
          "Diffbot",
          "FacebookBot",
          "cohere-ai",
          "Omgilibot",
          "ImagesiftBot",
          "TurnitinBot",
          "Scrapy",
          "Amazonbot",
          "Applebot-Extended",
        ],
        allow: ["/research/", "/labs/", "/news/", "/projects/"],
        disallow: ["/"],
      },
      {
        // Standard search engines (Googlebot, Bingbot, etc.)
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/publish",
          "/sign-in/",
          "/sign-up/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
