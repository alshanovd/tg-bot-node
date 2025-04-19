import { Telegraf } from "telegraf";

export const webhookConfig: Telegraf.LaunchOptions["webhook"] = {
  domain: process.env.DOMAIN,
  port: 4321,
};

export const url = "http://" + process.env.HOST + ":" + process.env.PORT;
