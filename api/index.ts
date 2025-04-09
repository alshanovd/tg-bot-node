import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

const bot = new Telegraf(process.env.BOT_TOKEN);
const webhook = {};

bot.on(message("text"), (ctx) => ctx.reply("Hello"));

// Start webhook via launch method (preferred)
bot.launch({
  webhook: {
    // Public domain for webhook; e.g.: example.com
    domain: "https://tg-bot-node.vercel.app/",

    // Port to listen on; e.g.: 8080
    port: 80,
  },
});
