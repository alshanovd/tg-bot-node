import axios from "axios";
import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { getFormData } from "./formdata";
import { addClientRequest, concatKey, webhookConfig } from "./utls";
import { MyContext } from "./models";

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN, {
  telegram: { webhookReply: false },
});
bot.use(session({ defaultSession: () => ({ cookie: "" }) }));
const url = "http://" + process.env.HOST + ":" + process.env.PORT;

bot.command("start", async (ctx) => {
  await ctx.reply("Введи пин-код");
});

bot.hears(process.env.PIN, async (ctx) => {
  await ctx.reply("Пробуем авторизоваться...");
  const form = new FormData();
  form.append("username", process.env.LOGIN);
  form.append("password", process.env.PASSWORD);

  try {
    const respond = await axios.post(url + "/login", form);
    ctx.session.cookie = respond.headers["set-cookie"][0];
    await ctx.reply("Успешная авторизация!");
    await ctx.reply("Кому выдать ключик? Напиши имя:");
  } catch (e) {
    await ctx.reply("Не удалось авторизоваться. Ошибка - " + JSON.stringify(e));
  }
});

bot.on(message("text"), async (ctx) => {
  const {
    message: { text },
  } = ctx;
  await ctx.reply("Пробуем выдать ключик для " + text);
  try {
    if (!text.trim()) throw Error();
    const { formdata, id } = getFormData(text);

    const response = await addClientRequest(url, formdata, ctx.session.cookie);
    if (!response.data.success) throw Error();
    const {
      data: {
        obj: { protocol, port, remark },
      },
    } = response;
    const key = concatKey(protocol, id, port, remark);
    await ctx.reply(`Ключик для ${remark}:`);
    await ctx.reply("`" + key + "`", { parse_mode: "Markdown" });
  } catch (e) {
    await ctx.reply(
      "Ошибка выдачи ключа. Либо авторизация кончилась, либо порт был уже занят, либо что то еще. Попробуй снова."
    );
    await ctx.reply("`" + JSON.stringify(e) + "`", {
      parse_mode: "Markdown",
    });
  }
});

bot.launch({ webhook: webhookConfig });
