import "server-only";

/**
 * Security audit trail: structured logs + urgent admin notification.
 *
 * Every security-relevant event is already console-logged in JSON form, but
 * worker logs are ephemeral and nobody tails them at 3am. This module makes
 * the highest-severity events *push* — they land in the same Telegram admin
 * chat the application/contact forms already use, so the on-call human sees
 * an active attack while it is happening.
 *
 * Design constraints:
 *  - NEVER let notification failures affect the security decision. Alerting
 *    is fire-and-forget; the caller's block/ban has already been applied.
 *  - NEVER leak user PII into the alert channel. Only IPs, event codes, and
 *    counters — the same fields the existing audit logs already carry.
 *  - Rate-limited per event type. An attacker who can trigger events must not
 *    be able to turn this into a Telegram flood (or an SMS-bill DoS against
 *    the admin). Default: 5 notifications per event type per 10 minutes;
 *    events beyond the budget are still logged, just not pushed.
 *
 * Server-only: uses TELEGRAM_BOT_TOKEN; never import from a client component.
 */

const TELEGRAM_API = "https://api.telegram.org";

/**
 * Events that warrant an urgent push. Anything not listed here is logged
 * only. Severity ordering reflects how much they matter to a human: bans and
 * admin-brute-force are active attacks; the rest are telemetry.
 */
const ALERTABLE_EVENTS = new Set([
  "security.ban",
  "security.honeypot",
  "security.admin_brute_force",
  "security.webhook_rejected",
]);

/** Notification budget: max pushes per event type per window. */
const ALERT_LIMIT = 5;
const ALERT_WINDOW_MS = 10 * 60_000;

interface AlertCounter {
  count: number;
  windowStart: number;
}

const alertCounters = new Map<string, AlertCounter>();

// Periodic GC so the counter map cannot grow unbounded.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, counter] of alertCounters.entries()) {
      if (now - counter.windowStart > ALERT_WINDOW_MS) {
        alertCounters.delete(key);
      }
    }
  }, 300_000);
}

export interface SecurityEvent {
  /** Stable dot-namespaced event code, e.g. "security.ban". */
  event: string;
  /** Short human-readable summary for the Telegram message. */
  title: string;
  /** Non-PII detail fields (IP, code, path prefix, counters). */
  details?: Record<string, string | number | boolean | null>;
}

/** True when the event type still has notification budget in its window. */
export function alertBudgetAvailable(event: string): boolean {
  const now = Date.now();
  const counter = alertCounters.get(event);
  if (!counter || now - counter.windowStart > ALERT_WINDOW_MS) return true;
  return counter.count < ALERT_LIMIT;
}

/** Records one alert against the event-type budget. */
function consumeAlertBudget(event: string): void {
  const now = Date.now();
  const counter = alertCounters.get(event);
  if (!counter || now - counter.windowStart > ALERT_WINDOW_MS) {
    alertCounters.set(event, { count: 1, windowStart: now });
    return;
  }
  counter.count += 1;
}

/**
 * Emits a security event: structured log line always, Telegram push when the
 * event is alertable, budget allows, and the bot is configured.
 *
 * Resolves quickly and never throws — callers run inside request handling and
 * must not block or fail on the notification path.
 */
export async function reportSecurityEvent(evt: SecurityEvent): Promise<void> {
  // 1. Structured log line — always, regardless of alertability. This is the
  // durable record; log drains can alert on it too.
  console.info(
    JSON.stringify({
      audit: evt.event,
      at: new Date().toISOString(),
      ...evt.details,
    })
  );

  // 2. Urgent push for the events a human must know about now.
  if (!ALERTABLE_EVENTS.has(evt.event)) return;
  if (!alertBudgetAvailable(evt.event)) {
    // Budget exhausted: log the suppression so the gap is visible in drains.
    console.info(
      JSON.stringify({
        audit: "security.alert_suppressed",
        at: new Date().toISOString(),
        event: evt.event,
      })
    );
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !chatId) return;
  consumeAlertBudget(evt.event);

  const detailLines = Object.entries(evt.details ?? {})
    .map(([key, value]) => `${escapeMarkdownLite(key)}: \`${String(value).slice(0, 120)}\``)
    .join("\n");

  const text = `🛡 *تنبيه أمني*\n${escapeMarkdownLite(evt.title)}${
    detailLines ? `\n\n${detailLines}` : ""
  }`;

  // Fire-and-forget: bounded by the platform's request lifetime, never awaited
  // by security-critical paths, and failures only ever mean a missed push.
  try {
    await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
      signal: AbortSignal.timeout(5_000),
    });
  } catch {
    // Notification failure must never surface to the caller.
  }
}

/** Minimal Telegram-Markdown escaping for labels we control. */
function escapeMarkdownLite(text: string): string {
  return text.replace(/[*_`[\]]/g, "\\$&");
}

/** Test hook: clears the notification budget state. */
export function resetSecurityAlertState(): void {
  alertCounters.clear();
}
