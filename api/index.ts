import axios from "axios";
import { Markup, Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { getFormData } from "./formdata";
import {
  addClientRequest,
  concatKey,
  deleteButtons,
  deleteClient,
  getClinetsRequest,
  reduceFn,
  showError,
  webhookConfig,
} from "./utls";
import { MyContext } from "./models";
import { InlineKeyboardButton, InlineKeyboardMarkup } from "telegraf/types";

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN, {
  telegram: { webhookReply: false },
});
bot.use(session({ defaultSession: () => ({ cookie: "", deleteMsgs: [] }) }));

const url = "http://" + process.env.HOST + ":" + process.env.PORT;

bot.command("start", async (ctx) => {
  await ctx.reply("Введи пин-код");
});

bot.command(`${process.env.PIN}`, async (ctx) => {
  await ctx.reply("Пробуем авторизоваться...");
  const form = new FormData();
  form.append("username", process.env.LOGIN);
  form.append("password", process.env.PASSWORD);

  try {
    const respond = await axios.post(url + "/login", form);
    if (respond.data.success) {
      ctx.session.cookie = respond.headers["set-cookie"][0];
    } else {
      throw new Error("success: false");
    }
    await ctx.reply("Успешная авторизация!");
    await ctx.reply(
      "Что делаем?",
      Markup.inlineKeyboard([
        [Markup.button.callback("Показать всех", "all_users")],
        [Markup.button.callback("Добавить пользователя", "add_user")],
        [Markup.button.callback("Удалить пользователя", "delete_user")],
      ])
    );
  } catch (e) {
    await ctx.reply(JSON.stringify(e));
  }
});

bot.action("add_user", async (ctx) => {
  await ctx.reply("Кому выдать ключик? Напиши имя:");
});

bot.action("all_users", async (ctx) => {
  if (ctx.session.deleteMsgs.length) {
    await ctx.deleteMessages(ctx.session.deleteMsgs);
  }
  const title = await ctx.reply("Запрашиваем список пользователей...");
  ctx.session.deleteMsgs.push(title.message_id);
  try {
    const respond = await getClinetsRequest(url, ctx.session.cookie);
    const list = await ctx.reply(
      respond.data.obj.map((o) => o.remark).join("\n")
    );
    ctx.session.deleteMsgs.push(list.message_id);
  } catch (e) {
    await ctx.reply(...showError(e));
  }
});

bot.action(/^delete_(\d+)$/, async (ctx) => {
  if (ctx.session.deleteMsgs.length) {
    await ctx.deleteMessages(ctx.session.deleteMsgs);
  }
  const id = ctx.match[1];
  const cookie = ctx.session.cookie;
  await ctx.reply("Удаляем пользователя с ID - " + id + "...");
  try {
    const respond = await deleteClient(url, id, cookie);
    if (respond.data.success) {
      await ctx.reply("Пользователь удален!");
    }
  } catch (e) {
    await ctx.reply(...showError(e));
  }
});

bot.action("delete_cancel", async (ctx) => {
  if (ctx.session.deleteMsgs.length) {
    await ctx.deleteMessages(ctx.session.deleteMsgs);
  }
});

bot.action("delete_user", async (ctx) => {
  if (ctx.session.deleteMsgs.length) {
    await ctx.deleteMessages(ctx.session.deleteMsgs);
  }
  const title = await ctx.reply("Запрашиваем список пользователей...");
  ctx.session.deleteMsgs.push(title.message_id);
  try {
    const respond = await getClinetsRequest(url, ctx.session.cookie);
    const buttons = deleteButtons(respond.data.obj);
    const list = await ctx.reply(
      "Кого удаляем?",
      Markup.inlineKeyboard(buttons)
    );
    ctx.session.deleteMsgs.push(list.message_id);
  } catch (e) {
    await ctx.reply("Ошибка получения списка пользователей.");
    await ctx.reply(...showError(e));
  }
});

bot.on(message("text"), async (ctx) => {
  const {
    message: { text },
  } = ctx;
  await ctx.reply("Пробуем выдать ключик для " + text + "...");
  try {
    if (!text.trim()) throw Error();
    const { formdata, id } = getFormData(text);
    const response = await addClientRequest(url, formdata, ctx.session.cookie);
    if (!response.data.success) throw Error("response.data.success = false");

    const {
      data: {
        obj: { protocol, port, remark },
      },
    } = response;
    const key = concatKey(protocol, id, port, remark);

    await ctx.reply(`Ключик для ${remark}:`);
    await ctx.reply("`" + key + "`", { parse_mode: "Markdown" });
  } catch (e) {
    await ctx.reply("Ошибка выдачи ключа. Попробуй снова ввести пин-код.");
    await ctx.reply(...showError(e));
  }
});

bot.launch({ webhook: webhookConfig });
console.info("Launch successful!");
