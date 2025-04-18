import axios from "axios";
import { Markup, Telegraf } from "telegraf";
import { Add, Inbound, Response } from "./models";
import { InlineKeyboardButton } from "telegraf/types";

export const webhookConfig: Telegraf.LaunchOptions["webhook"] = {
  domain: process.env.DOMAIN,
  port: 4321,
};

export function concatKey(
  protocol: string,
  id: string,
  port: number,
  remark: string
): string {
  const host = protocol + "://" + id + "@" + process.env.HOST + ":" + port;
  const key = host + "?type=tcp&security=none#" + remark;
  return key;
}

export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

export function showError(e: object): [string, object] {
  return [
    "```json\n" + JSON.stringify(e).slice(0, 150) + "... \n```",
    // "```json\n" + JSON.stringify(e) + "\n```",
    {
      parse_mode: "Markdown",
    },
  ];
}

export function reduceFn(
  buttons: InlineKeyboardButton.CallbackButton[][],
  user: Inbound,
  i: number
) {
  const row = Math.round(i / 3);
  if (!buttons[row]) {
    buttons[row] = [];
  }
  buttons[row].push(Markup.button.callback(user.remark, "delete_" + user.id));
  return buttons;
}

export function deleteClientButtons(
  users: Inbound[]
): InlineKeyboardButton.CallbackButton[][] {
  const buttons: InlineKeyboardButton.CallbackButton[][] = users.reduce(
    (buttons, user, i) => reduceFn(buttons, user, i),
    []
  );
  buttons.push([Markup.button.callback("Никого не удаляем", "delete_cancel")]);
  return buttons;
}

export const url = "http://" + process.env.HOST + ":" + process.env.PORT;
