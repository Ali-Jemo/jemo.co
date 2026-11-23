import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import HomeView from "../src/components/home/HomeView";
import { publicRedirects } from "../src/lib/public-redirects";
import { RESEARCH_PAPERS } from "../src/lib/data/research-data";

const FEATURED = [
  {
    slug: "ai-assisted-rafidain-calendar",
    title: "التقويم الرافديني",
    summary: "ما نجح في الكود، وما لم يُحسم فلكياً.",
    author: "علي حسين هادي",
    publishDate: "2026-04-12",
    codeUrl: "https://example.com/rafidain",
    humanVerification: { confidence: "استكشافية / أولية" },
  },
  {
    slug: "ai-assisted-arabic-texts-analysis",
    title: "مقارنة نماذج على نصوص تراثية",
    summary: "أين اختلقت النماذج مصادر.",
    author: "علي حسين هادي",
    publishDate: "2026-04-20",
    humanVerification: { confidence: "استكشافية / أولية" },
  },
  {
    slug: "ai-debug-memory-leak-investigation",
    title: "تسريب ذاكرة في Node.js",
    summary: "ما ثبّته الاختبار.",
    author: "علي حسين هادي",
    publishDate: "2026-05-02",
    humanVerification: { confidence: "استكشافية / أولية" },
  },
];

function words(html: string): number {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text ? text.split(" ").length : 0;
}

describe("homepage information architecture", () => {
  it("renders the six-section homepage with one visible heading and one primary label", () => {
    const html = renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(Header),
        React.createElement("main", null, React.createElement(HomeView, { papers: FEATURED })),
        React.createElement(Footer)
      )
    );
    expect(html).toContain("وثّق ما اكتشفته مع الذكاء الاصطناعي");
    expect(html.match(/<h1/g)?.length).toBe(1);
    expect(html).toContain("انشر أول سجل");
    expect(html).toContain("شاهد مثالاً حقيقياً");
    expect(html).toContain("/research/ai-assisted-rafidain-calendar");
    expect(html).not.toContain("نخبوي");
    expect(html).not.toContain("صارم");
    expect(html).not.toContain("بيت الحكمة");
    const count = words(html);
    expect(count).toBeGreaterThan(280);
    expect(count).toBeLessThan(380);
  });

  it("keeps permanent redirects for removed and merged routes", () => {
    const bySource = new Map(publicRedirects.map((item) => [item.source, item]));
    expect(bySource.get("/publications")?.destination).toBe("/research");
    expect(bySource.get("/questions")?.destination).toBe("/research?tab=questions");
    expect(bySource.get("/labs")?.destination).toBe("/projects");
    expect(bySource.get("/faq")?.destination).toBe("/explain#faq");
    expect(bySource.get("/news")?.destination).toBe("/");
    expect(bySource.get("/newsletter")?.destination).toBe("/#newsletter");
    expect(bySource.get("/applications")?.destination).toBe("/publish");
    expect(bySource.get("/gallery")?.destination).toBe("/");
    expect(bySource.get("/initiatives/iraq-plus-plus")?.destination).toBe("https://ali.lxds.org/");
    expect(bySource.get("/research/ashurix-academic-currency-tokenomics")?.destination).toBe("https://ali.lxds.org/");
    expect(publicRedirects.every((item) => item.statusCode === 301)).toBe(true);
  });

  it("does not repeat the Ziqa summary across question, findings, and abstract", () => {
    const ziqa = RESEARCH_PAPERS.find((paper) => paper.slug === "ziqa-kernel-architecture");
    expect(ziqa).toBeTruthy();
    expect(ziqa?.question).not.toBe(ziqa?.abstract);
    expect(ziqa?.findings).not.toBe(ziqa?.abstract);
    expect(ziqa?.methodology).not.toBe(ziqa?.findings);
    expect(ziqa?.unverifiedSample).toBe(false);
    expect(ziqa?.humanVerification?.confidence).not.toContain("تم التحقق");
  });
});
