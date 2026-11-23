import { visiblePapers } from "@/lib/samples";
import { SITE_URL } from "@/lib/site";

const SITE = SITE_URL;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const papers = [...visiblePapers()].sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
  const items = papers
    .map(
      (paper) => `    <item>
      <title>${escapeXml(paper.title)}</title>
      <link>${SITE}/research/${paper.slug}</link>
      <guid isPermaLink="true">${SITE}/research/${paper.slug}</guid>
      <pubDate>${new Date(`${paper.publishDate}T08:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(paper.abstract)}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml("سجلات JEMO")}</title>
    <link>${SITE}/research</link>
    <description>${escapeXml("السجلات المنشورة في JEMO: النظم، والبرمجة، وتقييم النماذج.")}</description>
    <language>ar</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
