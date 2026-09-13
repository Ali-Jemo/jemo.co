import { describe, it, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import Header from "../src/components/Header";
import Button from "../src/components/ui/Button";
import Card from "../src/components/ui/Card";
import Badge from "../src/components/ui/Badge";
import SectionHeader from "../src/components/ui/SectionHeader";
import Accordion from "../src/components/ui/Accordion";
import TermsPage from "../src/app/terms/page";
import PrivacyPage from "../src/app/privacy/page";
import NewsletterPage from "../src/app/newsletter/page";
import SignInPage from "../src/app/sign-in/[[...sign-in]]/page";
import SignUpPage from "../src/app/sign-up/[[...sign-up]]/page";
import DashboardPage from "../src/app/dashboard/page";
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

  it("renders redesigned TermsPage with sections and FAQ", () => {
    const html = renderToStaticMarkup(React.createElement(TermsPage));
    expect(html).toContain("الشروط والأحكام والسياسات العامة");
    expect(html).toContain("الخصوصية وحماية البيانات الشخصية");
    expect(html).toContain("الملكية الفكرية والحقوق الرقمية");
    expect(html).toContain("اتفاقية مستوى الخدمة (SLA)");
    expect(html).toContain("legal@jemo.co");
  });

  it("renders PrivacyPage with pillars and sections", () => {
    const html = renderToStaticMarkup(React.createElement(PrivacyPage));
    expect(html).toContain("سياسة الخصوصية وحماية البيانات");
    expect(html).toContain("المبادئ الأساسية لحوكمة الخصوصية");
    expect(html).toContain("البيانات التي نجمعها وكيفية جمعها");
    expect(html).toContain("privacy@jemo.co");
  });

  it("renders NewsletterPage with dispatch archive", () => {
    const html = renderToStaticMarkup(React.createElement(NewsletterPage));
    expect(html).toContain("النشرة الإخبارية والعلمية للشركة");
    expect(html).toContain("أرشيف الأعداد السابقة");
    expect(html).toContain("اشترك");
  });

  it("renders SignInPage with Clerk sign in component", () => {
    const html = renderToStaticMarkup(React.createElement(SignInPage));
    expect(html).toContain("تسجيل الدخول عبر Clerk");
  });

  it("renders SignUpPage with Clerk sign up component", () => {
    const html = renderToStaticMarkup(React.createElement(SignUpPage));
    expect(html).toContain("إنشاء حساب عبر Clerk");
  });

  it("renders DashboardPage with researcher portal", () => {
    const html = renderToStaticMarkup(React.createElement(DashboardPage));
    expect(html).toContain("لوحة تحكم الباحث");
  });
});
