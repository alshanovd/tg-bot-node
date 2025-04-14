import axios from "axios";
import { Telegraf } from "telegraf";
import { Add, Inbound, Response } from "./models";

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

export async function addClientRequest(
  url: string,
  formdata: FormData,
  cookie: string
) {
  return axios.post<Response<Add>>(url + "/xui/inbound/add", formdata, {
    headers: { Cookie: cookie },
  });
}

export async function getClinetsRequest(url: string, cookie: string) {
  const listUrl = url + "/xui/inbound/list";
  return axios.post<Response<Inbound[]>>(
    listUrl,
    {},
    {
      headers: { Cookie: cookie },
    }
  );
}

export const webhookConfig: Telegraf.LaunchOptions["webhook"] = {
  domain: process.env.DOMAIN,
  port: 4321,
};

export const handleError = async (e: object, ctx: any) => {
  return await ctx.reply(
    "```json\n" + JSON.stringify(e).slice(0, 150) + "... \n```",
    {
      parse_mode: "Markdown",
    }
  );
};
