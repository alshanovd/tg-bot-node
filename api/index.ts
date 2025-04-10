import axios from "axios";
import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { getFormData } from "./form";

axios.defaults.withCredentials = true;

const bot = new Telegraf(process.env.BOT_TOKEN);
const webhook: Telegraf.LaunchOptions["webhook"] = {
  domain: process.env.DOMAIN,
  port: 4321,
};
const url = process.env.URL;

// const messageIds = [];

// const buttons = Markup.inlineKeyboard([
//   [
//     { hide: false, text: "test1", callback_data: "callback_data" },
//     { hide: false, text: "none", callback_data: "cal123" },
//   ],
//   [{ hide: false, text: "test2", callback_data: "callback_data222" }],
// ]);

bot.command("start", async (ctx) => {
  await ctx.reply("Введи пин-код");
});

bot.hears(process.env.PIN, async (ctx) => {
  await ctx.reply("Пробуем авторизоваться");
  const form = new FormData();
  form.append("username", process.env.LOGIN);
  form.append("password", process.env.PASSWORD);

  try {
    const respond = await axios.post(url + "/login", form);
    await ctx.reply("Авторизация успешна. Кому выдать ключик?");
  } catch (e) {
    console.log(e);
    await ctx.reply("Не удалось авторизоваться");
  }
});

bot.on(message("text"), async (ctx) => {
  await ctx.reply("Пробуем выдать ключик для " + ctx.message.text);

  const form = getFormData(ctx.message.text);
  try {
    const response = await axios.post(url + "/xui/inbound/add", form);
    await ctx.reply(JSON.stringify(response.data));
  } catch (e) {
    await ctx.reply(
      "Ошибка выдачи ключа. Либо авторизация кончилась, либо порт был уже занят. Попробуй снова."
    );
  }
});

// bot.action("cal123", async (ctx) => {
//   Markup.removeKeyboard();
//   return await ctx.reply("cal123");
// });

// bot.command("one", async (ctx) => {
//   const ctx2 = await ctx.reply("inline Keyboard", buttons);
//   messageIds.push(ctx2.message_id);
// });

// bot.hears("button1", async (ctx) => {
//   await ctx.reply(
//     "button1 is heard!",
//     Markup.keyboard([["one11", "two222", "three33"]]).oneTime()
//   );
// });

// bot.action("callback_data", async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply("triggereeeed");
// });

// bot.action("callback_data222", async (ctx) => {
//   await bot.telegram.deleteMessages(ctx.chat.id, messageIds);
//   await ctx.reply("delete invoked");
//   await ctx.reply(
//     "one time buttons",
//     Markup.keyboard([
//       ["button1", "button2"],
//       ["button3", "button4", "button5"],
//     ])
//       .oneTime()
//       .resize()
//   );
// });

bot.launch({ webhook });
