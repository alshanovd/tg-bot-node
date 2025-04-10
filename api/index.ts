import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters";

const bot = new Telegraf(process.env.BOT_TOKEN);
const webhook: Telegraf.LaunchOptions["webhook"] = {
  domain: "https://tg-bot-node.vercel.app/",
  port: 4321,
};

bot.command("buttons", async ({ reply }) => {
  return await reply(
    "some text",
    Markup.keyboard([
      ["button1", "button2"],
      ["button3", "button4", "button5"],
    ])
      .oneTime()
      .resize()
  );
});

// bot.use(Telegraf.log());

// const buttons = Markup.inlineKeyboard([
//   [{ hide: false, text: "test1", callback_data: "callback_data" }],
//   [{ hide: false, text: "test2", callback_data: "callback_data222" }],
// ]);

// bot.command("onetime", async ({ reply }) => {
//   await reply(
//     "one time keyboard",
//     Markup.keyboard([
//       ["/one", "/two", "/three"],
//       ["test", "test2"],
//     ])
//   );
// });

// bot.command("one", async ({ reply }) => {
//   await reply("inline Keyboard", buttons);
// });

// bot.command("buttons", async ({ reply }) => {
//   await reply("inline Keyboard", buttons);
// });

// bot.hears("test", async ({ reply }) => {
//   await reply(
//     "test is heard!",
//     Markup.keyboard([["one11", "two222", "three33"]])
//   );
// });

// bot.action("callback_data", async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply("triggereeeed");
// });

// bot.on(message("text"), async (ctx) => {
//   await ctx.reply("Hello " + ctx.chat.id);
//   await bot.telegram.setChatMenuButton({
//     chatId: ctx.chat.id,
//     menuButton: { type: "default" },
//   });
// });

// bot.action("callback_data222", async (ctx) => {
//   await bot.telegram.deleteMessages(ctx.chat.id, [1, 2, 3, 4, 5, 10]);
//   await ctx.reply("start invoked");
// });

bot.launch({ webhook });
