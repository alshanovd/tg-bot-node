import axios from "axios";
import { Markup, Telegraf, session, type Context } from "telegraf";
import type { Update } from "telegraf/types";
import { message } from "telegraf/filters";
// import { getFormData } from "./formdata";

interface MyContext<U extends Update = Update> extends Context<U> {
  session: {
    cookie: string;
  };
}

axios.defaults.withCredentials = true;

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN, {
  telegram: { webhookReply: false },
});
bot.use(session({ defaultSession: () => ({ cookie: "" }) }));
const webhook: Telegraf.LaunchOptions["webhook"] = {
  domain: process.env.DOMAIN,
  port: 4321,
};
const url = process.env.URL;

// bot.use(async (ctx, next) => {
//   await ctx.reply("inside use");
//   await ctx.reply(ctx.cookie);
//   await next();
// });

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
    ctx.session.cookie = respond.headers["set-cookie"][0];
    await ctx.reply("Авторизация успешна." + ctx.session.cookie);
    await ctx.reply("Кому выдать ключик? Имя:");
  } catch (e) {
    await ctx.reply("Не удалось авторизоваться. Ошибка - " + JSON.stringify(e));
  }
});

bot.hears("test", async (ctx) => {
  await ctx.reply("Пробуем выдать ключик для " + ctx.message.text);
  await ctx.reply(ctx.session.cookie);

  // const form = getFormData(ctx.message.text);
  // let port = Math.round(Math.random() * 65535);
  // do {
  //   port = Math.round(Math.random() * 65535);
  // } while (port.toString() !== process.env.PORT);

  const formdata = new FormData();
  formdata.append("up", "0");
  formdata.append("down", "0");
  formdata.append("total", "0");
  formdata.append("remark", "test");
  formdata.append("enable", "true");
  formdata.append("expiryTime", "0");
  formdata.append("listen", "");
  formdata.append("port", "8888");
  formdata.append("protocol", "vless");
  formdata.append(
    "settings",
    '{  "clients": [    {      "id": "84a41128-dbb2-4ff6-96e7-d89d9104674e",      "flow": "xtls-rprx-direct",      "email": "",      "limitIp": 0,      "totalGB": 0,      "expiryTime": ""    }  ],  "decryption": "none",  "fallbacks": []}'
  );
  formdata.append(
    "streamSettings",
    '{  "network": "tcp",  "security": "none",  "tcpSettings": {    "acceptProxyProtocol": false,    "header": {      "type": "none"    }  }}'
  );
  formdata.append(
    "sniffing",
    '{  "enabled": true,  "destOverride": [    "http",    "tls"  ]}'
  );
  try {
    const response = await axios.post(url + "/xui/inbound/add", formdata, {
      headers: { Cookie: ctx.session.cookie },
    });
    await ctx.reply(JSON.stringify(response.data));
  } catch (e) {
    await ctx.reply(
      "Ошибка выдачи ключа. Либо авторизация кончилась, либо порт был уже занят. Попробуй снова. Ошибка - " +
        JSON.stringify(e)
    );
  }
});

// bot.on(message("text"), async (ctx) => {
// });

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
