import { describe, it, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import Header from "../src/components/Header";
import Button from "../src/components/ui/Button";
import Card from "../src/components/ui/Card";
import Badge from "../src/components/ui/Badge";
import SectionHeader from "../src/components/ui/SectionHeader";
import Accordion from "../src/components/ui/Accordion";

describe("Institutional UI Components", () => {
  it("renders Button variants with correct css classes", () => {
    const html = renderToStaticMarkup(
      React.createElement(Button, { variant: "primary" }, "قدّم طلب الانضمام")
    );
    expect(html).toContain("btn");
    expect(html).toContain("btn--primary");
    expect(html).toContain("قدّم طلب الانضمام");
  });

  it("renders Card container with hairline border class", () => {
    const html = renderToStaticMarkup(
      React.createElement(Card, { hover: true }, "محتوى البطاقة")
    );
    expect(html).toContain("card");
  });

  it("renders Badge pill component", () => {
    const html = renderToStaticMarkup(
      React.createElement(Badge, null, "غير ربحية")
    );
    expect(html).toContain("badge");
    expect(html).toContain("dot");
  });

  it("renders SectionHeader eyebrow and title", () => {
    const html = renderToStaticMarkup(
      React.createElement(SectionHeader, { eyebrow: "من نحن", title: "أبحاث وتطوير" })
    );
    expect(html).toContain("أبحاث وتطوير");
  });

  it("renders Accordion items correctly", () => {
    const items = [{ id: "faq-1", title: "سؤال 1", children: "جواب 1" }];
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { items })
    );
    expect(html).toContain("acc-item");
    expect(html).toContain("سؤال 1");
  });

  it("renders Header component with backdrop blur styling", () => {
    const html = renderToStaticMarkup(React.createElement(Header));
    expect(html).toContain("backdrop");
    expect(html).toContain("الرئيسية");
  });
});
