/**
 * Jemo — Telegram Onboarding Bot
 * Bot Username: @jemo_bot
 *
 * Usage:
 *   npm install node-telegram-bot-api dotenv
 *   BOT_TOKEN=your_token node bot.js
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
if (!token) { console.error('BOT_TOKEN not set'); process.exit(1); }

const bot = new TelegramBot(token, { polling: true });

const MAIN_CHANNEL = 'https://t.me/jemo_channel';

const DEPT_CHANNELS = {
  research: { name: '📢 قناة الأبحاث العلمية',    link: 'https://t.me/jemo_research' },
  code:     { name: '💻 قناة البرمجة والتقنية',   link: 'https://t.me/jemo_code' },
  design:   { name: '🎨 قناة التصميم والهوية',    link: 'https://t.me/jemo_design' },
  media:    { name: '🎬 قناة المحتوى والألعاب',   link: 'https://t.me/jemo_media' },
};

// /start [accepted_CONTRACTID_DEPTKEY]
bot.onText(/\/start(?:\s+(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const param = match[1]; // e.g. "accepted_IJL-2026-1234_research"

  if (param && param.startsWith('accepted_')) {
    // parse: accepted_<contractId>_<deptKey>
    const parts = param.slice('accepted_'.length).split('_');
    // contractId may contain dashes: IJL-2026-XXXX — last segment is deptKey
    const deptKey = parts[parts.length - 1];
    const contractId = parts.slice(0, -1).join('_');

    const dept = DEPT_CHANNELS[deptKey] ?? DEPT_CHANNELS.research;

    return bot.sendMessage(
      chatId,
      `🎉 *مبروك! تم التحقق من انضمامك.*\n\nرقمك المرجعي: \`${contractId}\`\n\nأنت الآن عضو رسمي في *Jemo*.\nانضم لقناة قسمك الآن:`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: dept.name, url: dept.link }],
            [{ text: '📢 القناة الرئيسية', url: MAIN_CHANNEL }],
            [{ text: '📋 دليل البدء والقوانين', callback_data: 'view_rules' }],
          ],
        },
      }
    );
  }

  // Generic welcome
  bot.sendMessage(
    chatId,
    `🤖 *أهلاً بك في Jemo!*\n\nأنا البوت الرسمي للفرع البحثي.\nاختر من القائمة أدناه:`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📢 القناة الرئيسية', url: MAIN_CHANNEL }],
          [
            { text: '🔬 الأبحاث', url: DEPT_CHANNELS.research.link },
            { text: '💻 البرمجة', url: DEPT_CHANNELS.code.link },
          ],
          [
            { text: '🎨 التصميم', url: DEPT_CHANNELS.design.link },
            { text: '🎬 المحتوى', url: DEPT_CHANNELS.media.link },
          ],
          [{ text: '📋 دليل البدء والقوانين', callback_data: 'view_rules' }],
        ],
      },
    }
  );
});

// /mydept — show all department channels
bot.onText(/\/mydept/, (msg) => {
  bot.sendMessage(msg.chat.id, '📂 *اختر قسمك للوصول المباشر:*', {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: Object.values(DEPT_CHANNELS).map(d => [{ text: d.name, url: d.link }]),
    },
  });
});

// /rules
bot.onText(/\/rules/, (msg) => sendRules(msg.chat.id));

// /help
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `⚙️ *الأوامر المتاحة:*\n\n/start — الرئيسية\n/mydept — قناة قسمك\n/rules — القوانين\n/help — المساعدة\n\n💬 الدعم: @jemo_admin`,
    { parse_mode: 'Markdown' }
  );
});

bot.on('callback_query', (query) => {
  if (query.data === 'view_rules') sendRules(query.message.chat.id);
  bot.answerCallbackQuery(query.id);
});

function sendRules(chatId) {
  bot.sendMessage(
    chatId,
    `📋 *قوانين Jemo:*\n\n` +
    `1️⃣ جميع المخرجات البحثية ملك للفرع.\n` +
    `2️⃣ الالتزام بالساعات الأسبوعية المتفق عليها.\n` +
    `3️⃣ سرية البيانات الداخلية.\n` +
    `4️⃣ التواصل باحترام ضمن القنوات المخصصة.`,
    { parse_mode: 'Markdown' }
  );
}

console.log('🤖 Jemo Bot running…');
