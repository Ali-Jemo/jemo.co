import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { DEPT_CHANNELS } from "@/lib/departments";
import {
  checkRateLimit,
  enforceBodySize,
  getClientIp,
  isKnownTelegramIp,
  safeCompare,
} from "@/lib/security";

export async function POST(req: NextRequest) {
  // Rate limit: max 60 webhook events per minute
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`telegram_webhook:${ip}`, 60, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  // This webhook mutates application records (links Telegram chats, fires
  // acceptance flows). It MUST be authenticated. Telegram sends a secret
  // token in `x-telegram-bot-api-secret-token` once one is configured via
  // setWebhook. Fail closed: if no secret is configured we still require the
  // request to originate from Telegram's published webhook IP ranges, so an
  // anonymous caller cannot drive the webhook.
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (webhookSecret) {
    const receivedToken = req.headers.get("x-telegram-bot-api-secret-token");
    if (!receivedToken || !safeCompare(receivedToken, webhookSecret)) {
      console.warn("Unauthorized Telegram webhook request from:", ip);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (!isKnownTelegramIp(ip)) {
    console.warn(
      "Telegram webhook rejected — no secret configured and IP not in Telegram range:",
      ip
    );
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Bound the body before JSON.parse to prevent memory-bomb DoS.
  if (!enforceBodySize(req, 64_000)) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  try {
    const update = await req.json();
    const message = update?.message;

    if (!message || !message.text || typeof message.text !== "string") {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat?.id;
    if (!chatId) return NextResponse.json({ ok: true });

    const text: string = message.text.trim();
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) return NextResponse.json({ ok: true });

    // Handle /start deep link: /start accepted_IJL-2026-1234_code
    if (text.startsWith("/start")) {
      const parts = text.split(" ");
      const payload = parts[1] || "";
      const username = message.chat?.username ? `@${message.chat.username}` : "";
      const db = supabaseAdmin();

      // Handle link_EMAIL deep link: /start link_email@domain.com
      if (payload.startsWith("link_")) {
        const rawEmail = decodeURIComponent(payload.replace("link_", "")).toLowerCase().trim();
        const { data: matchedApp } = await db
          .from("applications")
          .select("*")
          .eq("email", rawEmail)
          .single();

        if (matchedApp) {
          await db
            .from("applications")
            .update({ telegram_chat_id: String(chatId), telegram_username: username || matchedApp.telegram_username })
            .eq("id", matchedApp.id);

          const linkedText = `✅ *تم ربط حسابك في التليجرام بنجاح!*\n\nعزيزنا *${matchedApp.name}*، تم تسليم معرف التليجرام الخاص بك لقاعدة البيانات.\n\nستصلك إشعارات حالة طلبك (قبول / رفض) مباشرة هنا عبر البوت! 🤖`;
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

      // Handle accepted_CONTRACT_ID deep link
      if (payload.startsWith("accepted_")) {
        const contractId = payload.split("_")[1] || "";

        const { data: app } = await db
          .from("applications")
          .select("*")
          .eq("contract_id", contractId)
          .single();

        if (app) {
          await db
            .from("applications")
            .update({ telegram_chat_id: String(chatId) })
            .eq("id", app.id);

          const deptChannel = DEPT_CHANNELS[app.section] ?? "https://t.me/iraqjemo";
          const replyText = `🎉 *مبروك أستاذ/ة ${app.name}!*\n\nتم قبولك رسمياً في قسم *${app.section}* ضمن منظومة iraqjemo labs.\n\n📄 *الرقم المرجعي (العقد):* \`${app.contract_id}\`\n⏳ *ساعات التفرغ:* ${app.hours}\n\n📢 *قناة قسمك الرسمية على التليجرام:*\n${deptChannel}\n\nنرحب بك في المنظومة الرقمية!`;

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
      }

      // If user has a username, try matching application by username
      if (username) {
        const { data: matchedUser } = await db
          .from("applications")
          .select("*")
          .eq("telegram_username", username)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (matchedUser) {
          await db
            .from("applications")
            .update({ telegram_chat_id: String(chatId) })
            .eq("id", matchedUser.id);

          const autoLinkedText = `✅ *مرحباً ${matchedUser.name}!*\n\nتم التعرف على حسابك وتأكيد ربطه بالطلب المقدم لـ *${matchedUser.section}*.\nستصلك تحديثات الطلب هنا مباشرة.`;
          await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: autoLinkedText,
              parse_mode: "Markdown",
            }),
          });
          return NextResponse.json({ ok: true });
        }
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
