import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import BioPartnersGrid, { PEER_INSTITUTIONS } from "@/components/BioPartnersGrid";

describe("BioPartnersGrid data hygiene", () => {
  it("has no placeholder tokens in metrics", () => {
    for (const item of PEER_INSTITUTIONS) {
      expect(item.metrics, `${item.id} metrics`).not.toMatch(/XXX|TODO|FIXME|TBD/i);
    }
  });

  it("has no CJK mojibake in metrics", () => {
    // Catches regressions like Hマト-01 (katakana slipped into latin code).
    // Arabic block U+0600–U+06FF is allowed; CJK / hiragana / katakana are not.
    const cjk = /[぀-ヿ㐀-䶿一-鿿豈-﫿]/;
    for (const item of PEER_INSTITUTIONS) {
      expect(item.metrics, `${item.id} metrics`).not.toMatch(cjk);
    }
  });

  it("has unique ids and codes plus valid websites", () => {
    const ids = PEER_INSTITUTIONS.map((i) => i.id);
    const codes = PEER_INSTITUTIONS.map((i) => i.code);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(codes).size).toBe(codes.length);
    for (const item of PEER_INSTITUTIONS) {
      expect(() => new URL(item.website), `${item.id} website`).not.toThrow();
      expect(item.metrics).toContain("·");
    }
  });

  it("renders outreach disclosure with no signed partnerships", () => {
    const w = window as unknown as Record<string, unknown>;
    const original = w.matchMedia;
    delete w.matchMedia;
    try {
      const html = renderToStaticMarkup(React.createElement(BioPartnersGrid));
      // Outreach page: no signed MoUs, institutions list emptied until proof.
      expect(html).toContain("لا توجد شراكات موقعة");
      expect(html).not.toContain("XXX");
    } finally {
      if (original) w.matchMedia = original;
    }
  });
});
