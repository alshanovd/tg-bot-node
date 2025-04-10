import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters";

const bot = new Telegraf(process.env.BOT_TOKEN);
const webhook: Telegraf.LaunchOptions["webhook"] = {
  domain: "https://tg-bot-node.vercel.app/",
  port: 4321,
};

bot.use(Telegraf.log());

const buttons = Markup.inlineKeyboard([
  [{ hide: false, text: "test1", callback_data: "callback_data" }],
  [{ hide: false, text: "test2", callback_data: "callback_data222" }],
]);

bot.command("onetime", async ({ reply }) => {
  await reply(
    "one time keyboard",
    Markup.keyboard([
      ["/one", "/two", "/three"],
      ["test", "test2"],
    ])
      .oneTime()
      .resize()
  );
});

bot.command("one", async ({ reply }) => {
  await reply("inline Keyboard", buttons);
});

bot.hears("test", ({ reply }) => reply("test is heard!"));

bot.action("callback_data", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("triggereeeed");
});

// bot.on(message("text"), async (ctx) => {
//   await ctx.reply("Hello " + ctx.chat.id);
//   await bot.telegram.setChatMenuButton({
//     chatId: ctx.chat.id,
//     menuButton: { type: "default" },
//   });
// });

bot.action("start", async (ctx) => {
  await bot.telegram.deleteMessages(ctx.chat.id, [1, 2, 3, 4, 5, 10]);
  await ctx.reply("start invoked");
});

bot.launch({ webhook });
