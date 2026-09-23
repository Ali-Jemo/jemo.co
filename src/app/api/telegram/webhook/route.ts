import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { DEPT_CHANNELS } from "@/lib/departments";
import {
  checkRateLimit,
  escapeMarkdown,
  getClientIp,
  readJsonBody,
  safeCompare,
} from "@/lib/security";
import { verifyActionLink } from "@/lib/link-tokens";
import { reportSecurityEvent } from "@/lib/security-audit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Gate 1: Secret verification. Telegram sends secret token in header.
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CRITICAL: TELEGRAM_WEBHOOK_SECRET is not configured. Webhook disabled.");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }
  const receivedToken = req.headers.get("x-telegram-bot-api-secret-token");
  if (!receivedToken || !safeCompare(receivedToken, webhookSecret)) {
    void reportSecurityEvent({
      event: "security.webhook_rejected",
      title: "طلب webhook تليجرام غير مصرح به",
      details: { ip },
    });
    console.warn("Unauthorized Telegram webhook request from:", ip);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Gate 2: Read and bound body by actual bytes
  const update = (await readJsonBody(req, 64_000)) as Record<string, unknown> | null;
  if (update === null) {
    return NextResponse.json({ error: "Payload too large or malformed" }, { status: 413 });
  }

  // Gate 3: Rate limit keyed on telegram user ID (or IP as fallback)
  const message = update?.message as Record<string, unknown> | undefined;
  const callbackQuery = update?.callback_query as Record<string, unknown> | undefined;
  const fromObj = (message?.from ?? callbackQuery?.from) as Record<string, unknown> | undefined;
  const fromId = fromObj?.id;
  const rateLimit = checkRateLimit(`telegram_webhook:${fromId ?? ip}`, 60, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    if (!message || !message.text || typeof message.text !== "string") {
      return NextResponse.json({ ok: true });
    }

    const chatId = (message.chat as { id?: unknown } | undefined)?.id;
    if (!chatId) return NextResponse.json({ ok: true });

    const text: string = message.text.trim();
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) return NextResponse.json({ ok: true });

    // Handle /start deep link: /start accepted_IJL-2026-1234_code
    if (text.startsWith("/start")) {
      const parts = text.split(" ");
      const payload = parts[1] || "";
      const chatUsername = (message.chat as { username?: unknown } | undefined)?.username;
      const username = typeof chatUsername === "string" && chatUsername ? `@${chatUsername}` : "";
      const db = supabaseAdmin();

      // Handle link_TOKEN deep link: /start link_EMAIL.SIG
      if (payload.startsWith("link_")) {
        const tokenParam = payload.replace("link_", "");
        const rawEmail = await verifyActionLink(tokenParam, "link");
        if (!rawEmail) {
          await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: "⚠️ رابط غير صالح أو منتهي.",
            }),
          });
          return NextResponse.json({ ok: true });
        }

        const { data: matchedApp } = await db
          .from("applications")
          .select("id, name, section, contract_id, hours, telegram_chat_id, telegram_username, email")
          .eq("email", rawEmail.toLowerCase().trim())
          .single();

        if (matchedApp) {
          // Prevent account takeover: never overwrite an already-linked chat ID
          if (matchedApp.telegram_chat_id && matchedApp.telegram_chat_id !== String(chatId)) {
            return NextResponse.json({ ok: true });
          }

          await db
            .from("applications")
            .update({ telegram_chat_id: String(chatId), telegram_username: username || matchedApp.telegram_username })
            .eq("id", matchedApp.id);

          const safeName = escapeMarkdown(matchedApp.name);
          const linkedText = `✅ *تم ربط حسابك في التليجرام بنجاح!*\n\nعزيزنا *${safeName}*، تم تسليم معرف التليجرام الخاص بك لقاعدة البيانات.\n\nستصلك إشعارات حالة طلبك (قبول / رفض) مباشرة هنا عبر البوت! 🤖`;
          await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: linkedText,
              parse_mode: "Markdown",
            }),
          });
          return NextResponse.json({ ok: true });
        }
      }

      // Handle accepted_TOKEN deep link: /start accepted_CID_DEPT.SIG
      if (payload.startsWith("accepted_")) {
        const tokenParam = payload.replace("accepted_", "");
        const value = await verifyActionLink(tokenParam, "accepted");
        if (!value) {
          await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: "⚠️ رابط القبول غير صالح أو منتهي.",
            }),
          });
          return NextResponse.json({ ok: true });
        }

        const contractId = value.split("_")[0] || "";

        const { data: app } = await db
          .from("applications")
          .select("id, name, section, contract_id, hours, telegram_chat_id, telegram_username, email")
          .eq("contract_id", contractId)
          .single();

        if (!app) {
          await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: "⚠️ عقد غير موجود في المنظومة.",
            }),
          });
          return NextResponse.json({ ok: true });
        }

        // Prevent hijacking: if already linked to another chat, do not reassign
        if (app.telegram_chat_id && app.telegram_chat_id !== String(chatId)) {
          return NextResponse.json({ ok: true });
        }

        await db
          .from("applications")
          .update({ telegram_chat_id: String(chatId) })
          .eq("id", app.id);

        const safeName = escapeMarkdown(app.name || "");
        const safeSection = escapeMarkdown(app.section || "");
        const safeContract = escapeMarkdown(app.contract_id || "");
        const safeHours = escapeMarkdown(app.hours || "");
        const deptChannel = DEPT_CHANNELS[app.section] ?? "https://t.me/iraqjemo";
        const replyText = `🎉 *مبروك أستاذ/ة ${safeName}!*\n\nتم قبولك رسمياً في قسم *${safeSection}* ضمن منظومة iraqjemo labs.\n\n📄 *الرقم المرجعي (العقد):* \`${safeContract}\`\n⏳ *ساعات التفرغ:* ${safeHours}\n\n📢 *قناة قسمك الرسمية على التليجرام:*\n${deptChannel}\n\nنرحب بك في المنظومة الرقمية!`;

        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: replyText,
            parse_mode: "Markdown",
          }),
        });
        return NextResponse.json({ ok: true });
      }
      // Generic welcome message
      const defaultText = `مرحباً بك في بوت منظومة iraqjemo labs الرقمية 🤖\n\nتم تسجيل معرف التليجرام الخاص بك (\`${chatId}\`). عند مراجعة طلبك من قبل لجنة الإدارة، ستصلك التحديثات ورسالة القبول/الرفض هنا مباشرة!`;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: defaultText,
          parse_mode: "Markdown",
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({ ok: true });
  }
}
