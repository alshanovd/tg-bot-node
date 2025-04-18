import { Markup } from "telegraf";
import { deleteClientButtons, showError, url } from "./utls";
import { CtxFunc } from "./models";
import { deleteClient, getClinetsRequest } from "./requests";

export function deleteUserAction(): [RegExp, CtxFunc] {
  return [
    /^delete_(\d+)$/,
    async (ctx) => {
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
    },
  ];
}

export function showAllClientsAction(): [string, CtxFunc] {
  return [
    "all_users",
    async (ctx) => {
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
    },
  ];
}

export function deleteCancelAction(): [string, CtxFunc] {
  return [
    "delete_cancel",
    async (ctx) => {
      if (ctx.session.deleteMsgs.length) {
        await ctx.deleteMessages(ctx.session.deleteMsgs);
      }
    },
  ];
}

export function deleteClientAction(): [string, CtxFunc] {
  return [
    "delete_user",
    async (ctx) => {
      if (ctx.session.deleteMsgs.length) {
        await ctx.deleteMessages(ctx.session.deleteMsgs);
      }
      const title = await ctx.reply("Запрашиваем список пользователей...");
      ctx.session.deleteMsgs.push(title.message_id);
      try {
        const respond = await getClinetsRequest(url, ctx.session.cookie);
        const buttons = deleteClientButtons(respond.data.obj);
        const list = await ctx.reply(
          "Кого удаляем?",
          Markup.inlineKeyboard(buttons)
        );
        ctx.session.deleteMsgs.push(list.message_id);
      } catch (e) {
        await ctx.reply("Ошибка получения списка пользователей.");
        await ctx.reply(...showError(e));
      }
    },
  ];
}

export function addClientAction(): [string, CtxFunc] {
  return [
    "add_user",
    async (ctx) => {
      if (ctx.session.deleteMsgs.length) {
        await ctx.deleteMessages(ctx.session.deleteMsgs);
      }
      const title = await ctx.reply("Кому выдать ключик? Напиши имя:");
      ctx.session.deleteMsgs.push(title.message_id);
    },
  ];
}
