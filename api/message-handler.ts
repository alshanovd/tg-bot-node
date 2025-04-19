import { message } from "telegraf/filters";
import { getFormData } from "./formdata";
import { addClientRequest } from "./requests";
import { concatKey, showError } from "./utls";
import { url } from "./config";

export function messageHandler(): [any, (ctx: any) => Promise<any>] {
  return [
    message("text"),
    async (ctx) => {
      const {
        message: { text },
      } = ctx;
      const title = await ctx.reply(
        "Пробуем выдать ключик для " + text + "..."
      );
      ctx.session.deleteMsgs.push(title.message_id);
      try {
        if (!text.trim()) throw Error();
        const { formdata, id } = getFormData(text);
        const response = await addClientRequest(formdata, ctx.session.cookie);

        if (!response.data.success) {
          throw Error("response.data.success = false");
        }

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
    },
  ];
}
