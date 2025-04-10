import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters";

const bot = new Telegraf(process.env.BOT_TOKEN);
const webhook: Telegraf.LaunchOptions["webhook"] = {
  domain: "https://tg-bot-node.vercel.app/",
  port: 4321,
};

const messageIds = [];

const buttons = Markup.inlineKeyboard([
  [
    { hide: false, text: "test1", callback_data: "callback_data" },
    { hide: false, text: "none", callback_data: "cal123" },
  ],
  [{ hide: false, text: "test2", callback_data: "callback_data222" }],
]);

bot.action("cal123", async (ctx) => {
  Markup.removeKeyboard();
  return await ctx.reply("cal123");
});

bot.command("one", async (ctx) => {
  const ctx2 = await ctx.reply("inline Keyboard", buttons);
  messageIds.push(ctx2.message_id);
});

bot.hears("button1", async (ctx) => {
  await ctx.reply(
    "button1 is heard!",
    Markup.keyboard([["one11", "two222", "three33"]]).oneTime()
  );
});

bot.action("callback_data", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("triggereeeed");
});

bot.action("callback_data222", async (ctx) => {
  await bot.telegram.deleteMessages(ctx.chat.id, messageIds);
  await ctx.reply("delete invoked");
  await ctx.reply(
    "one time buttons",
    Markup.keyboard([
      ["button1", "button2"],
      ["button3", "button4", "button5"],
    ])
      .oneTime()
      .resize()
  );
});

bot.launch({ webhook });
