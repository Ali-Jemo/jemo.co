import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
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
    expect(html).toContain("card--hover");
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
    expect(html).toContain("section-head");
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

});
