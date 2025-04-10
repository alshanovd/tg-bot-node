import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

const bot = new Telegraf(process.env.BOT_TOKEN);
const webhook: Telegraf.LaunchOptions["webhook"] = {
  domain: "https://tg-bot-node.vercel.app/",
  port: 4321,
};

bot.on(message("text"), (ctx) => {
  ctx.reply("Hello " + ctx.chat.id);
  bot.telegram.setChatMenuButton({
    chatId: ctx.chat.id,
    menuButton: { type: "default" },
  });
});

bot.launch({ webhook });
