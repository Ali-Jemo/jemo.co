import { ISSUES, escapeXml } from "@/lib/dispatch-data";

const SITE = "https://jemo.co";
const FEED_TITLE = "JEMO LABS Research Dispatch • نشرة الشركة";
const FEED_DESC =
  "النشرة الإخبارية والعلمية لمؤسسة ومختبرات JEMO: إيداعات الأوراق المسبقة، الشفرات المصدرية، تحليلات النظم ونوى الذكاء الاصطناعي.";

export async function GET() {
  const items = [...ISSUES]
    .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1))
    .map(
      (issue) => `    <item>
      <title>${escapeXml(`${issue.number}: ${issue.title}`)}</title>
      <link>${SITE}/newsletter#${issue.id}</link>
      <guid isPermaLink="false">jemo-dispatch-${issue.id}</guid>
      <pubDate>${new Date(`${issue.isoDate}T08:00:00Z`).toUTCString()}</pubDate>
      <author>${escapeXml(issue.leadAuthor)} — ${escapeXml(issue.labName)}</author>
      <category>${escapeXml(issue.categoryLabel)}</category>
      <description>${escapeXml(
        `${issue.summary} النتائج الجوهرية: ${issue.takeaways.join(" ")}`
      )}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE}/newsletter</link>
    <description>${escapeXml(FEED_DESC)}</description>
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
