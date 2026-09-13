import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://jemo.co";

  return {
    rules: [
      {
        // Block aggressive AI models and data harvesters from scraping proprietary research and content
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
          "/sign-in/",
          "/sign-up/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
