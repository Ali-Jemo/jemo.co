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
import SupportPage from "../src/app/support/page";
import DashboardHeader from "../src/components/dashboard/DashboardHeader";
import DashboardMetrics from "../src/components/dashboard/DashboardMetrics";
import ResearchObjectsTab from "../src/components/dashboard/ResearchObjectsTab";
import ReplicationsTab from "../src/components/dashboard/ReplicationsTab";
import BookmarksTab from "../src/components/dashboard/BookmarksTab";
import ApiHubTab from "../src/components/dashboard/ApiHubTab";
import ProfileSettingsTab from "../src/components/dashboard/ProfileSettingsTab";

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

  it("renders enhanced SupportPage with tiers, payment options, and allocation", async () => {
    const page = await SupportPage();
    const html = renderToStaticMarkup(page);
    expect(html).toContain("استثمر في استقلال العقول وتطوير النظم المفتوحة");
    expect(html).toContain("برامج الرعاية والمساهمة");
    expect(html).toContain("طرق ووسائل الدعم المتاحة");
    expect(html).toContain("طرق أخرى للمساهمة في نهضة البحث");
    expect(html).toContain("أين يذهب كل دولار يتلقاه المختبر؟");
    expect(html).toContain("ميثاق الشفافية والاستقلالية العلمية");
    expect(html).toContain("لوحة الشرف وتقدير المساهمين");
  });

  it("renders modular Dashboard components for logged in researcher", () => {
    const mockProfile = {
      id: "test-researcher",
      email: "researcher@jemo.co",
      name: "د. سامي البغدادي",
      handle: "@sami_ai",
      role: "باحث ذكاء اصطناعي",
      domain: "هندسة النظم والاستدلال",
      avatar: "/jemo-logo.svg",
      researchId: "JEMO-RES-5001",
      institution: "مختبر بغداد للأنظمة",
      bio: "أبحاث متقدمة في الاستدلال الرياضي والسيادة الرقمية.",
      orcidId: "0000-0001-2345-6789",
      githubHandle: "https://github.com/sami-baghdadi",
      stats: {
        publishedCount: 4,
        replicationsCount: 6,
        contributionsCount: 5,
        evidenceScore: 95,
      },
    };

    console.log("Component Types:", {
      DashboardHeader: typeof DashboardHeader,
      DashboardMetrics: typeof DashboardMetrics,
      ApiHubTab: typeof ApiHubTab,
      ProfileSettingsTab: typeof ProfileSettingsTab,
    });

    console.log("Rendering DashboardHeader...");
    const headerHtml = renderToStaticMarkup(
      React.createElement(DashboardHeader, {
        profile: mockProfile,
        onEditProfile: () => {},
        onLogout: () => {},
      })
    );
    console.log("DashboardHeader OK");
    expect(headerHtml).toContain("د. سامي البغدادي");
    expect(headerHtml).toContain("JEMO-RES-5001");
    expect(headerHtml).toContain("باحث معتمد (Proof of Work Tier 1)");

    console.log("Rendering DashboardMetrics...");
    const metricsHtml = renderToStaticMarkup(
      React.createElement(DashboardMetrics, {
        profile: mockProfile,
        publishedCount: 4,
        replicationsCount: 6,
        onSelectTab: () => {},
      })
    );
    console.log("DashboardMetrics OK");
    expect(metricsHtml).toContain("كائنات البحث الموثقة");
    expect(metricsHtml).toContain("إعادات التجارب المحققة");
    expect(metricsHtml).toContain("درجة الإثبات (Proof Score)");
    expect(metricsHtml).toContain("95%");

    console.log("Rendering ApiHubTab...");
    const apiHtml = renderToStaticMarkup(
      React.createElement(ApiHubTab, {
        profile: mockProfile,
      })
    );
    console.log("ApiHubTab OK");
    // Keys are minted server-side, so nothing exists at render time: the
    // snippets carry a placeholder and the management surface shows its
    // empty state.
    expect(apiHtml).toContain("jemo_live_res_xxxxxxxxxxxxxxxx");
    expect(apiHtml).toContain("المفاتيح النشطة");
    expect(apiHtml).toContain("حزمة بايثون (JEMO Python SDK)");
    expect(apiHtml).toContain("curl -X POST https://jemo.co/api/content/schema");

    console.log("Rendering ProfileSettingsTab...");
    const settingsHtml = renderToStaticMarkup(
      React.createElement(ProfileSettingsTab, {
        profile: mockProfile,
        onUpdateProfile: () => {},
      })
    );
    console.log("ProfileSettingsTab OK");
    expect(settingsHtml).toContain("الملف الأكاديمي والبحثي (Research Profile)");
    expect(settingsHtml).toContain("إدارة الحساب والأمان (Clerk Account Suite)");
    expect(settingsHtml).toContain("تعديل الهوية البحثية والأكاديمية");
    expect(settingsHtml).toContain("مستوى التحقق (Proof of Work Tier 2)");
  });
});
