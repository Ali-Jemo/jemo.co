import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { escapeHtml, escapeMarkdown, generateContractId, maskEmail, safeCompare, checkRateLimit, sanitizeInput, readJsonBody } from "@/lib/security";
import { isSafeHttpUrl } from "@/lib/security-client";
import { signActionLink, verifyActionLink } from "@/lib/link-tokens";
describe("Security Utilities", () => {
  describe("escapeHtml", () => {
    it("should escape dangerous HTML characters to prevent XSS", () => {
      const malicious = '<script>alert("XSS")</script>&foo=\'bar\'/baz';
      const escaped = escapeHtml(malicious);
      expect(escaped).not.toContain("<script>");
      expect(escaped).not.toContain("</script>");
      expect(escaped).toBe(
        "&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;&amp;foo=&#039;bar&#039;&#x2F;baz"
      );
    });

    it("should handle empty or invalid input safely", () => {
      expect(escapeHtml("")).toBe("");
      expect(escapeHtml(null as unknown as string)).toBe("");
      expect(escapeHtml(undefined as unknown as string)).toBe("");
    });
  });

  describe("maskEmail", () => {
    it("should mask email addresses on the server side", () => {
      expect(maskEmail("admin@jemo.co")).toBe("a***n@jemo.co");
      expect(maskEmail("researcher@jemo.co")).toBe("r***r@jemo.co");
      expect(maskEmail("me@test.com")).toBe("m***@test.com");
    });

    it("should handle invalid emails safely", () => {
      expect(maskEmail("invalid-email")).toBe("***");
      expect(maskEmail("")).toBe("***");
    });
  });

  describe("safeCompare", () => {
    it("should correctly compare matching strings", () => {
      expect(safeCompare("secret-token-123", "secret-token-123")).toBe(true);
    });

    it("should return false for mismatched strings or lengths without timing leaks", () => {
      expect(safeCompare("secret-token-123", "wrong-token")).toBe(false);
      expect(safeCompare("short", "longer-string")).toBe(false);
      expect(safeCompare(null, "secret")).toBe(false);
      expect(safeCompare("secret", undefined)).toBe(false);
    });
  });

  describe("checkRateLimit", () => {
    it("should allow requests up to the configured limit and reject excess", () => {
      const id = "test-rate-limit-" + Date.now();
      const limit = 3;
      const windowMs = 5000;

      const r1 = checkRateLimit(id, limit, windowMs);
      expect(r1.allowed).toBe(true);
      expect(r1.remaining).toBe(2);

      const r2 = checkRateLimit(id, limit, windowMs);
      expect(r2.allowed).toBe(true);
      expect(r2.remaining).toBe(1);

      const r3 = checkRateLimit(id, limit, windowMs);
      expect(r3.allowed).toBe(true);
      expect(r3.remaining).toBe(0);

      // Exceeded limit
      const r4 = checkRateLimit(id, limit, windowMs);
      expect(r4.allowed).toBe(false);
      expect(r4.remaining).toBe(0);
    });
  });

  describe("sanitizeInput", () => {
    it("should remove null bytes and truncate to max length", () => {
      const malicious = "hello\0world" + "a".repeat(100);
      const clean = sanitizeInput(malicious, 10);
      expect(clean).not.toContain("\0");
      expect(clean.length).toBeLessThanOrEqual(10);
      expect(clean).toBe("helloworld");
    });
  });

  describe("escapeMarkdown", () => {
    it("should escape special markdown characters", () => {
      expect(escapeMarkdown("*bold* and _italic_ `code`")).toBe("\\*bold\\* and \\_italic\\_ \\`code\\`");
      expect(escapeMarkdown("[link](url)")).toBe("\\[link\\]\\(url\\)");
    });

    it("should handle empty strings safely", () => {
      expect(escapeMarkdown("")).toBe("");
      expect(escapeMarkdown(null as unknown as string)).toBe("");
    });
  });

  describe("generateContractId", () => {
    it("should generate cryptographically strong contract IDs matching expected pattern", () => {
      const id1 = generateContractId();
      const id2 = generateContractId();
      expect(id1).toMatch(/^IJL-2026-[0-9A-F]{8}$/);
      expect(id2).toMatch(/^IJL-2026-[0-9A-F]{8}$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe("isSafeHttpUrl", () => {
    it("should allow valid http and https URLs", () => {
      expect(isSafeHttpUrl("https://example.com/path")).toBe(true);
      expect(isSafeHttpUrl("http://localhost:3000")).toBe(true);
      expect(isSafeHttpUrl("https://uomosul.edu.iq")).toBe(true);
    });

    it("should reject dangerous schemes, relative paths, and non-urls", () => {
      expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
      expect(isSafeHttpUrl("data:text/html,<script>")).toBe(false);
      expect(isSafeHttpUrl("vbscript:msgbox(1)")).toBe(false);
      expect(isSafeHttpUrl("file:///etc/passwd")).toBe(false);
      expect(isSafeHttpUrl("blob:https://evil.com")).toBe(false);
      expect(isSafeHttpUrl("#")).toBe(false);
      expect(isSafeHttpUrl("")).toBe(false);
      expect(isSafeHttpUrl("not a url")).toBe(false);
    });
  });

  describe("readJsonBody", () => {
    it("should read and parse valid JSON within byte limit", async () => {
      const req = new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ hello: "world" }),
      });
      const parsed = await readJsonBody(req, 1000);
      expect(parsed).toEqual({ hello: "world" });
    });

    it("should return null when body exceeds maxBytes", async () => {
      const bigPayload = JSON.stringify({ data: "x".repeat(200) });
      const req = new Request("http://localhost", {
        method: "POST",
        body: bigPayload,
      });
      const parsed = await readJsonBody(req, 50);
      expect(parsed).toBeNull();
    });
  });

  describe("link tokens (HMAC)", () => {
    const originalSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    beforeEach(() => {
      process.env.TELEGRAM_WEBHOOK_SECRET = "test-webhook-secret-32-chars-long!";
    });
    afterEach(() => {
      process.env.TELEGRAM_WEBHOOK_SECRET = originalSecret;
    });

    it("should sign and verify roundtrip correctly", async () => {
      const token = await signActionLink("accepted", "IJL-2026-A1B2C3D4_research");
      const verified = await verifyActionLink(token, "accepted");
      expect(verified).toBe("IJL-2026-A1B2C3D4_research");
    });

    it("should reject tampered signature", async () => {
      const token = await signActionLink("accepted", "IJL-2026-A1B2C3D4_research");
      const tampered = token.slice(0, -1) + (token.slice(-1) === "0" ? "1" : "0");
      const verified = await verifyActionLink(tampered, "accepted");
      expect(verified).toBeNull();
    });

    it("should reject kind mismatch", async () => {
      const token = await signActionLink("accepted", "data");
      const verified = await verifyActionLink(token, "link");
      expect(verified).toBeNull();
    });
  });
});
