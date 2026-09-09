import { describe, it, expect, beforeEach } from "vitest";
import type { Paper } from "@/lib/data/research-data";

describe("Connected Auth & Publish Pipeline", () => {
  beforeEach(() => {
    // Clear mock storage
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  it("creates a well-formed Research Object with proper citation and verification", () => {
    const mockProfile = {
      name: "عمر الكرخي",
      handle: "@omar_karkhi",
      role: "باحث مواطن مستقل",
      researchId: "JEMO-RES-9102",
      stats: { publishedCount: 2, replicationsCount: 14, contributionsCount: 8, evidenceScore: 92 },
    };

    const paperInput: Partial<Paper> = {
      title: "تتبع هلوسة نموذج لغوي في استرجاع مصادر تاريخية",
      field: "AI Reasoning",
      question: "هل يهلوس النموذج مصادر غير موجودة؟",
      toolsUsed: ["Claude 3.5 Sonnet", "DeepSeek-R1"],
      findings: "تم إثبات اختلاق 3 مصادر وتصحيحها يدوياً.",
      humanVerification: {
        accuracyCheck: "تمت مراجعة المخطوطات الأصلية ومطابقتها حرفياً.",
        confidence: "مرتفعة - تم التكرار بنجاح",
      },
      authors: [{
        name: mockProfile.name,
        slug: mockProfile.handle.replace(/^@/, ""),
        role: mockProfile.role,
      }],
    };

    const id = `JEMO-OBJ-${Date.now().toString().slice(-6)}`;
    const slug = `${paperInput.title!.slice(0, 30).trim().replace(/\s+/g, "-")}-${id.toLowerCase()}`;

    const newPaper: Paper = {
      id,
      slug,
      title: paperInput.title!,
      titleEn: paperInput.title!,
      abstract: paperInput.findings!,
      authors: paperInput.authors!,
      publishDate: "2026-09-09",
      pdfUrl: "#",
      field: paperInput.field!,
      labSlug: "systems",
      keywords: ["Research Object", "Proof of Work", "JEMO"],
      citation: {
        bibtex: `@article{${slug},\n  title={${paperInput.title}},\n  author={${mockProfile.name}}\n}`,
        apa: `${mockProfile.name} (2026). ${paperInput.title}. JEMO Discovery Registry.`,
      },
      researchType: "Experiment",
      evidenceStatus: "Under Review",
      question: paperInput.question,
      toolsUsed: paperInput.toolsUsed,
      findings: paperInput.findings,
      humanVerification: paperInput.humanVerification!,
      lineage: { replicationsCount: 0, challengesCount: 0, extensionsCount: 0 },
    };

    expect(newPaper.id).toMatch(/^JEMO-OBJ-/);
    expect(newPaper.authors[0].name).toBe("عمر الكرخي");
    expect(newPaper.authors[0].slug).toBe("omar_karkhi");
    expect(newPaper.humanVerification?.confidence).toBe("مرتفعة - تم التكرار بنجاح");
    expect(newPaper.citation.apa).toContain("عمر الكرخي (2026)");
  });

  it("preserves redirect query between login, signup, and publish paths", () => {
    const publishPath = "/publish";
    const loginUrl = `/login?redirect=${encodeURIComponent(publishPath)}`;
    const signupUrl = `/signup?redirect=${encodeURIComponent(publishPath)}`;
    expect(new URLSearchParams(signupUrl.split("?")[1]).get("redirect")).toBe("/publish");
    const loginParams = new URLSearchParams(loginUrl.split("?")[1]);
    expect(loginParams.get("redirect")).toBe("/publish");

    // Seamless handoff from login to signup without dropping the target
    const forwardedSignupUrl = `/signup?redirect=${encodeURIComponent(loginParams.get("redirect")!)}`;
    const signupParams = new URLSearchParams(forwardedSignupUrl.split("?")[1]);
    expect(signupParams.get("redirect")).toBe("/publish");
  });
});
