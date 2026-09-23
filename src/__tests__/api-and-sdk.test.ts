import { describe, it, expect, beforeEach } from "vitest";
import { GET as getResearch, POST as postResearch } from "@/app/api/research/route";
import { GET as getResearchSlug, POST as postResearchSlug } from "@/app/api/research/[slug]/route";
import { POST as postContentSchema } from "@/app/api/content/schema/route";
import { ResearchRegistry, JemoApiError } from "@/lib/sdk";
import { validateApiKey, listResearchObjects, getResearchObject } from "@/lib/research/store";

describe("JEMO Research API & Store", () => {
  const validApiKey = "test_researcher_key_1234567890";

  beforeEach(() => {
    // A key is only valid when it is registered in the server-side registry.
    process.env.JEMO_API_KEYS = `${validApiKey}|عمر الكرخي|@omar_karkhi|باحث مواطن مستقل`;
    delete process.env.CONTENT_ADMIN_SECRET;
    delete process.env.JEMO_API_KEY;
  });

  describe("API Key Authentication", () => {
    it("accepts valid Bearer token", async () => {
      const res = await validateApiKey(`Bearer ${validApiKey}`);
      expect(res.valid).toBe(true);
      expect(res.researcher?.name).toBe("عمر الكرخي");
    });

    it("accepts valid X-API-Key header", async () => {
      const res = await validateApiKey(null, validApiKey);
      expect(res.valid).toBe(true);
      expect(res.researcher?.name).toBe("عمر الكرخي");
    });

    it("rejects missing or malformed keys", async () => {
      expect((await validateApiKey(null)).valid).toBe(false);
      expect((await validateApiKey("")).valid).toBe(false);
      expect((await validateApiKey("invalid_prefix_12345678")).valid).toBe(false);
    });

    it("rejects a well-formed but unregistered key", async () => {
      // Regression guard: this used to authenticate on format alone.
      const res = await validateApiKey("Bearer jemo_live_res_abcdef1234567890");
      expect(res.valid).toBe(false);
    });
  });

  describe("GET /api/research", () => {
    it("returns paginated research objects list", async () => {
      const req = new Request("http://localhost:3000/api/research?limit=5&offset=0");
      const res = await getResearch(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.items)).toBe(true);
      expect(json.items.length).toBeLessThanOrEqual(5);
      expect(json.total).toBeGreaterThan(0);
    });

    it("filters by query keyword", async () => {
      const req = new Request("http://localhost:3000/api/research?q=نماذج");
      const res = await getResearch(req);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.items.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/research", () => {
    it("rejects request without authorization header", async () => {
      const req = new Request("http://localhost:3000/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Test Paper" }),
      });
      const res = await postResearch(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe("Unauthorized");
    });

    it("rejects request with missing title", async () => {
      const req = new Request("http://localhost:3000/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${validApiKey}`,
        },
        body: JSON.stringify({ field: "AI" }),
      });
      const res = await postResearch(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("Missing required field");
    });

    it("successfully creates and returns a new research object", async () => {
      const req = new Request("http://localhost:3000/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${validApiKey}`,
        },
        body: JSON.stringify({
          title: "فحص استدلال رياضي عبر نماذج التفكير المفتوحة",
          field: "الاستدلال الآلي",
          research_type: "Experiment",
          question: "هل تدعم سلاسل التفكير تفكيك المعضلات المعقدة؟",
          tools: ["Claude 3.7 Sonnet", "DeepSeek-R1"],
          findings: "تحقيق نسبة دقة 91% في الحلول البرمجية.",
          confidence: "مرتفعة - تم التكرار بنجاح",
        }),
      });

      const res = await postResearch(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.id).toMatch(/^JEMO-OBJ-/);
      expect(json.slug).toContain("فحص-استدلال-رياضي");
      expect(json.data.authors[0].name).toBe("عمر الكرخي");
      expect(json.data.citation.bibtex).toContain("@article");

      // Verify it can be retrieved via GET /api/research/[slug]
      const getReq = new Request(`http://localhost:3000/api/research/${json.slug}`);
      const getRes = await getResearchSlug(getReq, { params: Promise.resolve({ slug: json.slug }) });
      expect(getRes.status).toBe(200);
      const getJson = await getRes.json();
      expect(getJson.success).toBe(true);
      expect(getJson.data.id).toBe(json.id);

      // Verify replication submission via POST /api/research/[slug]
      const repReq = new Request(`http://localhost:3000/api/research/${json.slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${validApiKey}`,
        },
        body: JSON.stringify({
          type: "replication",
          findings: "أعدت التجربة وحصلت على نفس النتيجة بدقة 90%.",
          confidence: "عالي",
        }),
      });
      const repRes = await postResearchSlug(repReq, { params: Promise.resolve({ slug: json.slug }) });
      expect(repRes.status).toBe(201);
      const repJson = await repRes.json();
      expect(repJson.success).toBe(true);
      expect(repJson.data.lineage.replicationsCount).toBeGreaterThanOrEqual(1);
      const lastResponse = repJson.data.responses?.[repJson.data.responses.length - 1];
      if (lastResponse) {
        expect(lastResponse.verified).toBe(false);
      }
    });
  });

  describe("POST /api/content/schema (Compatibility route)", () => {
    it("handles research_object registration via content schema", async () => {
      const req = new Request("http://localhost:3000/api/content/schema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${validApiKey}`,
        },
        body: JSON.stringify({
          type: "research_object",
          title: "Automated Verification Test",
          field: "Systems & AI",
        }),
      });

      const res = await postContentSchema(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.id).toMatch(/^JEMO-OBJ-/);
    });
  });
});

describe("JEMO TypeScript SDK", () => {
  it("initializes client and handles basic configuration", () => {
    const client = new ResearchRegistry({
      // Obvious placeholder — the jemo_live_res_ prefix belongs only to real
      // issued tokens, so secret scanners don't flag this file as a leak.
      apiKey: "test_placeholder_key_not_a_credential",
      endpoint: "https://jemo.co/api",
    });

    expect(client).toBeInstanceOf(ResearchRegistry);
  });

  it("throws error when initialized with invalid API key", () => {
    expect(() => new ResearchRegistry({ apiKey: "" })).toThrow(/requires a valid 'apiKey'/);
  });

  it("formats JemoApiError with status code and details", () => {
    const err = new JemoApiError("Not authorized", 401, { code: "expired" });
    expect(err.status).toBe(401);
    expect(err.message).toBe("Not authorized");
    expect(err.name).toBe("JemoApiError");
  });

  it("queries the direct store via listResearchObjects and getResearchObject", () => {
    const list = listResearchObjects({ limit: 5 });
    expect(list.items.length).toBeGreaterThan(0);
    const first = list.items[0];
    const fetched = getResearchObject(first.slug);
    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe(first.id);
  });
});
