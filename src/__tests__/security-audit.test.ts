import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  alertBudgetAvailable,
  reportSecurityEvent,
  resetSecurityAlertState,
} from "@/lib/security-audit";
import { banIp, isIpBanned, clearAllBans } from "@/lib/firewall";

describe("Security Audit & Alerting", () => {
  beforeEach(() => {
    resetSecurityAlertState();
    clearAllBans();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
    );
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_ADMIN_CHAT_ID = "12345";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_ADMIN_CHAT_ID;
  });

  describe("alert budget", () => {
    it("starts with budget available and exhausts after ALERT_LIMIT events", () => {
      expect(alertBudgetAvailable("security.ban")).toBe(true);

      // Default budget is 5 per window.
      for (let i = 0; i < 5; i++) {
        expect(alertBudgetAvailable("security.ban")).toBe(true);
        // Consume without performing a real fetch: use a non-alertable event
        // name to avoid network, then manually consume via budget internals —
        // instead, drive the budget through reportSecurityEvent below.
        consumeForTest("security.ban");
      }
      expect(alertBudgetAvailable("security.ban")).toBe(false);
    });

    it("tracks budgets independently per event type", () => {
      consumeForTest("security.ban");
      consumeForTest("security.ban");
      expect(alertBudgetAvailable("security.honeypot")).toBe(true);
      expect(alertBudgetAvailable("security.ban")).toBe(true);
    });
  });

  describe("reportSecurityEvent", () => {
    it("always logs a structured audit line, even for non-alertable events", async () => {
      const logSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      await reportSecurityEvent({
        event: "security.custom_telemetry",
        title: "Not pushable",
        details: { ip: "203.0.113.5" },
      });
      expect(logSpy).toHaveBeenCalledTimes(1);
      const line = JSON.parse(logSpy.mock.calls[0]?.[0] as string);
      expect(line.audit).toBe("security.custom_telemetry");
      expect(line.ip).toBe("203.0.113.5");
    });

    it("pushes alertable events to Telegram when configured", async () => {
      const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
      vi.stubGlobal("fetch", fetchMock);

      await reportSecurityEvent({
        event: "security.ban",
        title: "Test ban",
        details: { ip: "192.0.2.1", reason: "unit test" },
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
      expect(url).toContain("api.telegram.org");
      const body = JSON.parse(String(init.body));
      expect(body.chat_id).toBe("12345");
      expect(body.text).toContain("192.0.2.1");
      expect(body.parse_mode).toBe("Markdown");
    });

    it("never fetches when bot credentials are absent (fail-silent)", async () => {
      delete process.env.TELEGRAM_BOT_TOKEN;
      const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
      vi.stubGlobal("fetch", fetchMock);

      await expect(
        reportSecurityEvent({ event: "security.ban", title: "No creds" })
      ).resolves.toBeUndefined();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("suppresses pushes beyond the budget but keeps logging", async () => {
      const logSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
      vi.stubGlobal("fetch", fetchMock);

      // Burn the budget (5 pushes) then send 3 more.
      for (let i = 0; i < 8; i++) {
        await reportSecurityEvent({
          event: "security.honeypot",
          title: `Honeypot hit ${i}`,
          details: { ip: `198.51.100.${i}` },
        });
      }

      expect(fetchMock).toHaveBeenCalledTimes(5);
      const suppressionLines = logSpy.mock.calls
        .map((call) => String(call[0]))
        .filter((line) => {
          try {
            return JSON.parse(line).audit === "security.alert_suppressed";
          } catch {
            return false;
          }
        });
      expect(suppressionLines).toHaveLength(3);
    });

    it("swallows fetch failures so callers never see them", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(async () => {
          throw new Error("network down");
        })
      );

      await expect(
        reportSecurityEvent({ event: "security.ban", title: "Failing transport" })
      ).resolves.toBeUndefined();
    });

    it("truncates oversized detail values to keep messages bounded", async () => {
      const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
      vi.stubGlobal("fetch", fetchMock);

      await reportSecurityEvent({
        event: "security.ban",
        title: "Long reason",
        details: { reason: "x".repeat(10_000) },
      });

      const body = JSON.parse(
        String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body)
      );
      expect(body.text.length).toBeLessThan(4_096); // Telegram message cap
    });
  });

  describe("firewall integration", () => {
    it("banIp reports a structured security.ban event with IP and reason", async () => {
      const logSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
      vi.stubGlobal("fetch", fetchMock);

      banIp("203.0.113.77", "Unit test ban", 60_000);

      expect(isIpBanned("203.0.113.77").banned).toBe(true);

      // banIp is sync but the report is async; flush microtasks.
      await new Promise((resolve) => setTimeout(resolve, 0));

      const banLine = logSpy.mock.calls
        .map((call) => String(call[0]))
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .find((parsed) => parsed?.audit === "security.ban");
      expect(banLine).toBeTruthy();
      expect(banLine.ip).toBe("203.0.113.77");
      expect(banLine.reason).toBe("Unit test ban");

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});

/** Test helper: drives the internal budget through the public surface. */
function consumeForTest(event: string): void {
  void reportSecurityEvent({ event, title: "budget probe" });
}
