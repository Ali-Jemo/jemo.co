import { getClientIp, safeCompare } from "./security";
import { reportSecurityEvent } from "./security-audit";

/**
 * High-Performance Edge Firewall & Web Application Firewall (WAF)
 * Protects against automated attack tools, vulnerability scanners,
 * AI content scrapers, DoS floods, SQLi, LFI, XSS, and CSRF attacks.
 */

interface BanRecord {
  ip: string;
  reason: string;
  bannedAt: number;
  expiresAt: number;
}

interface StrikeRecord {
  strikes: number;
  lastStrike: number;
}

// In-memory ban & strike stores
const banStore = new Map<string, BanRecord>();
const strikeStore = new Map<string, StrikeRecord>();
const edgeRateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Periodic garbage collection every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of banStore.entries()) {
      if (now > record.expiresAt) {
        banStore.delete(ip);
      }
    }
    for (const [ip, record] of strikeStore.entries()) {
      // Expire strikes older than 10 minutes
      if (now - record.lastStrike > 600_000) {
        strikeStore.delete(ip);
      }
    }
    for (const [ip, record] of edgeRateLimitStore.entries()) {
      if (now > record.resetAt) {
        edgeRateLimitStore.delete(ip);
      }
    }
  }, 300_000);
}

/**
 * Check if an IP address is currently banned.
 */
export function isIpBanned(ip: string): { banned: boolean; reason?: string; expiresAt?: number } {
  if (!ip) return { banned: false };
  const record = banStore.get(ip);
  if (!record) return { banned: false };

  if (Date.now() > record.expiresAt) {
    banStore.delete(ip);
    return { banned: false };
  }

  return {
    banned: true,
    reason: record.reason,
    expiresAt: record.expiresAt,
  };
}

/**
 * Ban an IP address for a designated period (default: 1 hour).
 *
 * Every ban (honeypot, exploit probe, attack tool, flood) funnels through
 * here, so it is the single audit point: each ban is reported as a structured
 * log event and, for the actively-hostile categories, pushed to the admin
 * Telegram chat via reportSecurityEvent. Reporting is fire-and-forget and
 * can never influence the ban decision.
 */
export function banIp(ip: string, reason: string, durationMs = 3_600_000): void {
  if (!ip) return;
  const now = Date.now();
  banStore.set(ip, {
    ip,
    reason,
    bannedAt: now,
    expiresAt: now + durationMs,
  });

  void reportSecurityEvent({
    event: "security.ban",
    title: "تم حظر عنوان IP بسبب نشاط خبيث",
    details: {
      ip,
      reason: reason.slice(0, 120),
      duration_minutes: Math.round(durationMs / 60_000),
    },
  });
}

/**
 * Remove an IP from the ban list.
 */
export function unbanIp(ip: string): void {
  if (!ip) return;
  banStore.delete(ip);
  strikeStore.delete(ip);
}

/**
 * Reset all bans and strikes (used in testing).
 */
export function clearAllBans(): void {
  banStore.clear();
  strikeStore.clear();
  edgeRateLimitStore.clear();
}

/**
 * Record a security offense against an IP. Once strikes reach threshold, auto-ban.
 */
export function recordOffense(
  ip: string,
  reason: string,
  threshold = 3,
  banDurationMs = 1_800_000 // 30 minutes
): { banned: boolean; strikes: number } {
  if (!ip) return { banned: false, strikes: 0 };
  const now = Date.now();
  const record = strikeStore.get(ip) || { strikes: 0, lastStrike: now };

  // Reset strikes if last strike was more than 10 minutes ago
  if (now - record.lastStrike > 600_000) {
    record.strikes = 1;
  } else {
    record.strikes += 1;
  }
  record.lastStrike = now;
  strikeStore.set(ip, record);

  if (record.strikes >= threshold) {
    banIp(ip, `Excessive security violations (${reason})`, banDurationMs);
    return { banned: true, strikes: record.strikes };
  }

  return { banned: false, strikes: record.strikes };
}

// --------------------------------------------------------------------------
// 1. Malicious Attack Tool Signatures
// --------------------------------------------------------------------------
const MALICIOUS_TOOLS_REGEX =
  /\b(sqlmap|nikto|dirbuster|gobuster|ffuf|feroxbuster|wfuzz|wpscan|nuclei|acunetix|nessus|openvas|nmap|masscan|zgrab|havij|hydra|medusa|metasploit|burpcollaborator|whatweb|arachni|qualys|morfeus)\b/i;

export function isMaliciousTool(userAgent?: string | null): { malicious: boolean; tool?: string } {
  if (!userAgent || typeof userAgent !== "string") {
    return { malicious: false };
  }
  const match = userAgent.match(MALICIOUS_TOOLS_REGEX);
  if (match) {
    return { malicious: true, tool: match[0] };
  }
  return { malicious: false };
}

// --------------------------------------------------------------------------
// 2. Unauthorized AI & Content Scraping Harvesters
// --------------------------------------------------------------------------
const SCRAPER_TOOLS_REGEX =
  /\b(bytespider|gptbot|chatgpt-user|claudebot|anthropic-ai|ccbot|perplexitybot|diffbot|facebookbot|cohere-ai|omgilibot|imagesiftbot|turnitinbot|scrapy|webreaper|amazonbot)\b/i;

export function isScraperTool(userAgent?: string | null): { scraper: boolean; bot?: string } {
  if (!userAgent || typeof userAgent !== "string") {
    return { scraper: false };
  }
  const match = userAgent.match(SCRAPER_TOOLS_REGEX);
  if (match) {
    return { scraper: true, bot: match[0] };
  }
  return { scraper: false };
}

// --------------------------------------------------------------------------
// 3. Known Vulnerability / Exploit Probe Paths
// --------------------------------------------------------------------------
const EXPLOIT_PROBE_REGEX =
  /(?:^\/(?:\.env|\.git|\.svn|\.aws|\.ssh|\.ds_store|wp-admin|wp-login|wp-content|wp-includes|xmlrpc\.php|phpmyadmin|pma|mysql|myadmin|actuator|eval-stdin\.php|solr|telescope|autodiscover|shell\.php|c99\.php|r57\.php|alfa\.php|dump\.sql|backup\.sql|database\.sql|config\.json|server-status|server-info|cgi-bin|phpinfo\.php|info\.php|vendor\/phpunit|web\.config))/i;
export function isExploitProbe(pathname: string): { probe: boolean; target?: string } {
  if (!pathname || typeof pathname !== "string") return { probe: false };
  const match = pathname.match(EXPLOIT_PROBE_REGEX);
  if (match) {
    return { probe: true, target: match[0] };
  }
  return { probe: false };
}

// --------------------------------------------------------------------------
// 4. Honeypot Traps for Automated Crawlers
// --------------------------------------------------------------------------
export const HONEYPOT_PATHS = new Set([
  "/api/security/honeypot-trap",
  "/api/v1/telemetry-ping",
  "/api/v1/internal-sync",
]);

// --------------------------------------------------------------------------
// 5. WAF Injection Inspection (SQLi, LFI, XSS, RCE, Null-byte)
// --------------------------------------------------------------------------
const INJECTION_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  // SQL Injection
  { name: "SQLi_UnionSelect", regex: /\bunion\b\s+(?:all\s+)?\bselect\b/i },
  { name: "SQLi_SelectFrom", regex: /\bselect\b\s+[\s\S]{0,512}?\s+\bfrom\b/i },
  { name: "SQLi_DropTable", regex: /\b(?:drop|alter|truncate)\b\s+\btable\b/i },
  { name: "SQLi_BenchmarkOrSleep", regex: /\b(?:benchmark|sleep|waitfor\s+delay)\s*\(/i },
  { name: "SQLi_InfoSchema", regex: /\binformation_schema\b/i },
  { name: "SQLi_BooleanAuthBypass", regex: /\b(?:or|and)\b\s+(?:'|")?[0-9a-zA-Z]+['"]?\s*=\s*['"]?[0-9a-zA-Z]+/i },
  { name: "SQLi_Tautology", regex: /(?:'|\")?\s*\b(?:or|and)\b\s+['"]?1['"]?\s*=\s*['"]?1/i },

  // Path Traversal / LFI
  { name: "LFI_DotDotSlash", regex: /(?:\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\/|\.\.%2f)/i },
  { name: "LFI_Passwd", regex: /(?:\/etc\/passwd|\/windows\/win\.ini)/i },

  // XSS in URL
  { name: "XSS_ScriptTag", regex: /<\s*script/i },
  { name: "XSS_JavascriptUri", regex: /javascript\s*:/i },
  { name: "XSS_EventHandler", regex: /\bon(?:error|load|click|mouseover|focus)\s*=/i },

  // RCE / Shell Injection
  { name: "RCE_Log4Shell", regex: /\$\{jndi:/i },
  { name: "RCE_CommandChaining", regex: /(?:;|\||`)\s*(?:cat|ls|whoami|curl|wget|bash|sh|powershell|nc|netcat)\b/i },

  // Null byte
  { name: "NullByte", regex: /(?:%00|\0|\\x00)/ },
];

export function detectInjection(urlStr: string): { detected: boolean; type?: string } {
  if (!urlStr || typeof urlStr !== "string") return { detected: false };

  let decoded = urlStr;
  try {
    decoded = decodeURIComponent(urlStr);
    // Double decoding check to catch nested encoding tricks like %252e%252e
    try {
      decoded = decodeURIComponent(decoded);
    } catch {
      // Ignored if not double encoded
    }
  } catch {
    // Malformed URI encoding is suspicious in itself
    return { detected: true, type: "Malformed_URI_Encoding" };
  }

  // Bound WAF input: pattern-scan only the first 8KB so a crafted
  // multi-megabyte URL can't turn regex evaluation into a CPU DoS.
  const hayRaw = urlStr.length > 8192 ? urlStr.slice(0, 8192) : urlStr;
  const hayDecoded = decoded.length > 8192 ? decoded.slice(0, 8192) : decoded;

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.regex.test(hayRaw) || pattern.regex.test(hayDecoded)) {
      return { detected: true, type: pattern.name };
    }
  }

  return { detected: false };
}

// --------------------------------------------------------------------------
// 6. CSRF & Mutation Origin Validation
// --------------------------------------------------------------------------
const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const ALLOWED_MUTATION_HOSTS = new Set(["jemo.co", "localhost", "127.0.0.1"]);

function isAllowedMutationOrigin(target: string): boolean {
  try {
    const hostname = new URL(target).hostname.toLowerCase();
    // localhost is only a valid mutation origin in dev/test. In production
    // Origin is attacker-forgeable, so allowing it would neuter CSRF checks.
    const isDevEnv = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
    return (
      hostname === "jemo.co" ||
      hostname.endsWith(".jemo.co") ||
      ((hostname === "localhost" || hostname === "127.0.0.1") && isDevEnv)
    );
  } catch {
    return false;
  }
}

/**
 * CSRF gate for state-changing requests.
 *
 * Two independent signals, checked in order:
 *   1. `Sec-Fetch-Site` — every evergreen browser stamps it on fetch/XHR/
 *      form submissions. `cross-site`/`same-site` on a mutation is a CSRF
 *      attempt and is rejected outright, no matter what Origin says (Origin
 *      is forgeable by non-browser clients; Sec-Fetch-Site is set by the
 *      browser and stripped from incoming requests by modern proxies).
 *   2. `Origin`/`Referer` allowlist for anything else that DOES present one.
 *
 * A mutation with NO browser signal at all (no Sec-Fetch-Site, no Origin, no
 * Referer) is stateless API traffic — curl, the Python SDK, server-to-server
 * webhooks. These routes authenticate via bearer keys / admin secrets rather
 * than ambient cookies, so CSRF does not apply to them; rejecting the
 * missing-header case previously broke the documented cURL/SDK workflow in
 * production. The one cookie-authenticated surface (/api/admin/*) still
 * rejects cross-site calls at check 1, so the ambient-cookie risk is closed.
 */
export function validateMutationOrigin(req: Request): { valid: boolean; reason?: string } {
  if (!MUTATION_METHODS.has(req.method.toUpperCase())) {
    return { valid: true };
  }

  // Exempt webhooks ONLY on the designated webhook route when properly authenticated
  try {
    const reqUrl = new URL(req.url);
    if (reqUrl.pathname === "/api/telegram/webhook") {
      const receivedToken = req.headers.get("x-telegram-bot-api-secret-token");
      const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
      if (webhookSecret && receivedToken && safeCompare(receivedToken, webhookSecret)) {
        return { valid: true };
      }
    }
  } catch {
    // Ignore URL parse error and proceed to origin validation
  }

  // 1. Browser-stamped fetch metadata: authoritative for CSRF decisions.
  const site = req.headers.get("sec-fetch-site");
  if (site !== null) {
    if (site === "same-origin" || site === "none") return { valid: true };
    return {
      valid: false,
      reason: `Cross-site mutation blocked (Sec-Fetch-Site: ${site})`,
    };
  }

  // 2. Legacy browsers / intermediaries: fall back to Origin/Referer.
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const target = origin || referer;

  if (!target) {
    // No browser signals present at all => non-browser client. Stateless API
    // callers authenticate with explicit credentials, so there is no ambient
    // cookie to abuse. Allowed in every environment.
    return { valid: true };
  }

  if (!isAllowedMutationOrigin(target)) {
    const hostname = (() => {
      try {
        return new URL(target).hostname.toLowerCase();
      } catch {
        return target.slice(0, 64);
      }
    })();
    return { valid: false, reason: `Unauthorized cross-origin request from ${hostname}` };
  }
  return { valid: true };
}

// --------------------------------------------------------------------------
// 7. Payload Size Guard (Anti-DoS / Buffer Protection)
// Advisory Content-Length pre-check. Edge middleware cannot read the stream
// without consuming it for downstream handlers. Unauthenticated endpoints enforce
// actual byte counts via readJsonBody, and Cloudflare Workers acts as a backstop.
// --------------------------------------------------------------------------
export function validatePayloadSize(req: Request, maxBytes = 1_048_576): { valid: boolean } {
  const lengthHeader = req.headers.get("content-length");
  if (!lengthHeader) return { valid: true };

  const bytes = parseInt(lengthHeader, 10);
  if (isNaN(bytes)) return { valid: true };

  return { valid: bytes <= maxBytes };
}

// --------------------------------------------------------------------------
// 8. Global Edge Rate Limiting & DoS Shield
// --------------------------------------------------------------------------
export function checkEdgeRateLimit(
  ip: string,
  isApi: boolean
): { allowed: boolean; remaining: number; banned: boolean } {
  const now = Date.now();
  const limit = isApi ? 60 : 120; // 60 req/min for APIs, 120 req/min for general browsing
  const floodThreshold = limit * 2.5; // > 150 (API) or > 300 (web) is an aggressive flood
  const key = `edge:${ip}`;

  const record = edgeRateLimitStore.get(key);
  if (!record || now > record.resetAt) {
    edgeRateLimitStore.set(key, { count: 1, resetAt: now + 60_000 });
    return { allowed: true, remaining: limit - 1, banned: false };
  }

  record.count += 1;

  if (record.count > floodThreshold) {
    banIp(ip, "Layer 7 HTTP request flood (DoS attempt)", 900_000); // 15-minute ban
    return { allowed: false, remaining: 0, banned: true };
  }

  if (record.count > limit) {
    return { allowed: false, remaining: 0, banned: false };
  }

  return { allowed: true, remaining: limit - record.count, banned: false };
}

// --------------------------------------------------------------------------
// 9. Unified Firewall Evaluation
// --------------------------------------------------------------------------
export interface FirewallEvaluation {
  action: "ALLOW" | "BLOCK";
  status?: number;
  reason?: string;
  code?: string;
}

export function evaluateFirewall(req: Request): FirewallEvaluation {
  const ip = getClientIp(req);

  let url: URL;
  try {
    url = new URL(req.url);
  } catch {
    return {
      action: "BLOCK",
      status: 400,
      reason: "Malformed URL",
      code: "INVALID_URL",
    };
  }

  const isTelegram = url.pathname === "/api/telegram/webhook";

  // 1. IP Blacklist check (skip for Telegram webhook: Cloudflare egress IPs must not brick bot traffic)
  if (!isTelegram) {
    const banStatus = isIpBanned(ip);
    if (banStatus.banned) {
      return {
        action: "BLOCK",
        status: 403,
        reason: `Access Denied: Your IP is blacklisted (${banStatus.reason})`,
        code: "IP_BANNED",
      };
    }
  }
  // 2. Honeypot trap check (trailing-slash normalized so
  // /api/v1/telemetry-ping/ can't dodge the exact-match Set)
  const normPath =
    url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname;
  if (HONEYPOT_PATHS.has(normPath)) {
    banIp(ip, "Honeypot trap triggered by automated crawler", 86_400_000); // 24 hour ban
    return {
      action: "BLOCK",
      status: 403,
      reason: "Security violation: Malicious automated bot detected and blacklisted.",
      code: "HONEYPOT_TRIGGERED",
    };
  }

  // 3. Exploit probe path check
  const probe = isExploitProbe(url.pathname);
  if (probe.probe) {
    banIp(ip, `Exploit probe attempt on ${url.pathname}`, 3_600_000); // 1 hour ban
    return {
      action: "BLOCK",
      status: 403,
      reason: "Access Denied: Vulnerability scanner probe detected and blocked.",
      code: "EXPLOIT_PROBE_BLOCKED",
    };
  }

  // 4. Malicious attack tool detection
  const userAgent = req.headers.get("user-agent");
  const toolCheck = isMaliciousTool(userAgent);
  if (toolCheck.malicious) {
    banIp(ip, `Automated attack tool detected: ${toolCheck.tool}`, 3_600_000);
    return {
      action: "BLOCK",
      status: 403,
      reason: `Access Denied: Automated attack tool blocked (${toolCheck.tool}).`,
      code: "MALICIOUS_TOOL_BLOCKED",
    };
  }

  // 5. Unauthorized AI & Content Scraper detection
  const scraperCheck = isScraperTool(userAgent);
  if (scraperCheck.scraper) {
    return {
      action: "BLOCK",
      status: 403,
      reason: `Access Denied: Automated content scraping is prohibited (${scraperCheck.bot}).`,
      code: "SCRAPER_BLOCKED",
    };
  }

  // 6. WAF Injection Detection (SQLi, LFI, XSS, RCE, Null byte)
  const nextUrl = (req as { nextUrl?: { href: string; pathname: string; search: string } }).nextUrl;
  const urlToCheck = nextUrl?.href || req.url;
  const queryToCheck = nextUrl ? `${nextUrl.pathname}${nextUrl.search}` : req.url;

  const injection = detectInjection(urlToCheck) || detectInjection(queryToCheck);
  if (injection && injection.detected) {
    recordOffense(ip, `Injection attack: ${injection.type}`);
    return {
      action: "BLOCK",
      status: 400,
      reason: `Bad Request: Malformed or malicious payload detected (${injection.type}).`,
      code: "INJECTION_BLOCKED",
    };
  }

  // 7. Payload size guard
  if (!validatePayloadSize(req, 1_048_576)) {
    return {
      action: "BLOCK",
      status: 413,
      reason: "Payload Too Large: Maximum request size is 1MB.",
      code: "PAYLOAD_TOO_LARGE",
    };
  }

  // 8. CSRF / Origin check on state-changing API requests
  if (url.pathname.startsWith("/api/")) {
    const originCheck = validateMutationOrigin(req);
    if (!originCheck.valid) {
      return {
        action: "BLOCK",
        status: 403,
        reason: `Forbidden: ${originCheck.reason}`,
        code: "CSRF_BLOCKED",
      };
    }
  }

  // 9. Edge Rate Limiting & DoS Shield (skip for Telegram webhook: app-level secret + fromId rate limit gate it)
  if (!isTelegram) {
    const isApi = url.pathname.startsWith("/api/");
    const edgeRate = checkEdgeRateLimit(ip, isApi);
    if (!edgeRate.allowed) {
      if (edgeRate.banned) {
        return {
          action: "BLOCK",
          status: 429,
          reason: "Too Many Requests: Traffic flood detected. Your IP has been temporarily banned.",
          code: "FLOOD_BANNED",
        };
      }
      return {
        action: "BLOCK",
        status: 429,
        reason: "Too Many Requests: Rate limit exceeded. Please slow down.",
        code: "RATE_LIMITED",
      };
    }
  }

  return { action: "ALLOW" };
}
