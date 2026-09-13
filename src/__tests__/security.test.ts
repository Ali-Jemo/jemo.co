import { describe, it, expect } from "vitest";
import { escapeHtml, maskEmail, safeCompare, checkRateLimit, sanitizeInput } from "@/lib/security";

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
      expect(maskEmail("ali.jemo1.9@gmail.com")).toBe("a***9@gmail.com");
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
});
