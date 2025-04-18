import { message } from "telegraf/filters";
import { getFormData } from "./formdata";
import { CtxFunc } from "./models";
import { concatKey, showError, url } from "./utls";
import { addClientRequest } from "./requests";

export function messageHandler(): [any, CtxFunc] {
  return [
    message("text"),
    async (ctx) => {
      const {
        message: { text },
      } = ctx;
      await ctx.reply("Пробуем выдать ключик для " + text + "...");
      try {
        if (!text.trim()) throw Error();
        const { formdata, id } = getFormData(text);
        const response = await addClientRequest(
          url,
          formdata,
          ctx.session.cookie
        );

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
