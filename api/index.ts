import { Telegraf, session } from "telegraf";
import {
  addClientAction,
  deleteCancelAction,
  deleteClientAction,
  deleteUserAction as deleteClientByIdAction,
  showAllClientsAction,
} from "./actions";
import { authCommand, startCommand } from "./commands";
import { messageHandler } from "./message-handler";
import { MyContext } from "./models";
import { webhookConfig } from "./utls";

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN, {
  telegram: { webhookReply: false },
});

bot.use(session({ defaultSession: () => ({ cookie: "", deleteMsgs: [] }) }));

bot.command(...startCommand());

bot.command(...authCommand());

bot.action(...addClientAction());

bot.action(...showAllClientsAction());

bot.action(...deleteClientByIdAction());

bot.action(...deleteCancelAction());

bot.action(...deleteClientAction());

bot.on(...messageHandler());

bot.launch({ webhook: webhookConfig });

console.info("Launch successful!");
