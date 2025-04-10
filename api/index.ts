import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

const bot = new Telegraf(process.env.BOT_TOKEN);
const webhook: Telegraf.LaunchOptions["webhook"] = {
  domain: "https://tg-bot-node.vercel.app/",
  port: 4321,
};

bot.on(message("text"), async (ctx) => {
  await ctx.reply("Hello " + ctx.chat.id);
  await bot.telegram.setChatMenuButton({
    chatId: ctx.chat.id,
    menuButton: { type: "default" },
  });
});

bot.command("start", async (ctx) => {
  await bot.telegram.deleteMessages(ctx.chat.id, [1, 2, 3, 4, 5, 10]);
  await ctx.reply("start invoked");
});

bot.launch({ webhook });
