import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://jemo.co";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/admin/", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
