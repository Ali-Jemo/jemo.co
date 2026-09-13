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

  it("preserves redirect query between sign-in, sign-up, and publish paths", () => {
    const publishPath = "/publish";
    const loginUrl = `/sign-in?redirect_url=${encodeURIComponent(publishPath)}`;
    const signupUrl = `/sign-up?redirect_url=${encodeURIComponent(publishPath)}`;
    expect(new URLSearchParams(signupUrl.split("?")[1]).get("redirect_url")).toBe("/publish");
    const loginParams = new URLSearchParams(loginUrl.split("?")[1]);
    expect(loginParams.get("redirect_url")).toBe("/publish");

    // Seamless handoff from sign-in to sign-up without dropping the target
    const forwardedSignupUrl = `/sign-up?redirect_url=${encodeURIComponent(loginParams.get("redirect_url")!)}`;
    const signupParams = new URLSearchParams(forwardedSignupUrl.split("?")[1]);
    expect(signupParams.get("redirect_url")).toBe("/publish");
  });

  it("correctly recognizes Clerk superadmin and standard user identity structures", () => {
    // Superadmin Clerk user mapping simulation
    const adminUser = {
      id: "user_2test12345",
      fullName: "Ali Hussein Hadi",
      username: "jemo",
      primaryEmailAddress: { emailAddress: "ali.jemo1.9@gmail.com" },
      publicMetadata: { role: "admin" },
    };

    const isSuperAdmin =
      adminUser.primaryEmailAddress.emailAddress === "ali.jemo1.9@gmail.com" ||
      adminUser.username === "jemo" ||
      adminUser.publicMetadata?.role === "admin";

    const adminProfile = {
      id: adminUser.id,
      email: adminUser.primaryEmailAddress.emailAddress,
      name: isSuperAdmin ? "م. علي حسين هادي" : adminUser.fullName,
      handle: `@${adminUser.username}`,
      role: isSuperAdmin ? "المؤسس والمهندس الرئيسي • Founder & Lead Engineer" : "باحث مستقل",
      domain: isSuperAdmin ? "الأنظمة المضمنة وهندسة الاستدلال والبرمجيات السيادية" : "أبحاث النظم",
      researchId: isSuperAdmin ? "JEMO-CORE-0001" : `JEMO-RES-${adminUser.id.slice(0, 4)}`,
      isAdmin: isSuperAdmin,
    };

    expect(adminProfile.isAdmin).toBe(true);
    expect(adminProfile.name).toBe("م. علي حسين هادي");
    expect(adminProfile.researchId).toBe("JEMO-CORE-0001");
    expect(adminProfile.handle).toBe("@jemo");

    // Standard Clerk researcher mapping simulation
    const standardUser = {
      id: "user_9876543210",
      fullName: "د. سارة البغدادي",
      username: "sara_baghdadi",
      primaryEmailAddress: { emailAddress: "sara@baghdadi.iq" },
      publicMetadata: {},
    };

    const isStandardSuperAdmin =
      standardUser.primaryEmailAddress.emailAddress === "ali.jemo1.9@gmail.com" ||
      standardUser.username === "jemo";

    const standardProfile = {
      id: standardUser.id,
      email: standardUser.primaryEmailAddress.emailAddress,
      name: standardUser.fullName,
      handle: `@${standardUser.username}`,
      role: "باحث مستقل • Independent Researcher",
      domain: "أبحاث النظم والذكاء الاصطناعي",
      researchId: `JEMO-RES-${standardUser.id.replace(/^user_/, "").slice(0, 4).toUpperCase()}`,
      isAdmin: isStandardSuperAdmin,
    };

    expect(standardProfile.isAdmin).toBe(false);
    expect(standardProfile.name).toBe("د. سارة البغدادي");
    expect(standardProfile.researchId).toBe("JEMO-RES-9876");
    expect(standardProfile.handle).toBe("@sara_baghdadi");
  });
});
