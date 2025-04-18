import axios from "axios";
import { CtxFunc } from "./models";
import { url } from "./utls";
import { Markup } from "telegraf";

const authButtons = Markup.inlineKeyboard([
  [Markup.button.callback("Показать всех", "all_users")],
  [Markup.button.callback("Добавить пользователя", "add_user")],
  [Markup.button.callback("Удалить пользователя", "delete_user")],
]);

export function startCommand(): [string, CtxFunc] {
  return [
    "start",
    async (ctx) => {
      await ctx.reply("Введи пин-код");
    },
  ];
}

export function authCommand(): [string, CtxFunc] {
  return [
    `${process.env.PIN}`,
    async (ctx) => {
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
        await ctx.reply("Что делаем?", authButtons);
      } catch (e) {
        await ctx.reply(JSON.stringify(e));
      }
    },
  ];
}
