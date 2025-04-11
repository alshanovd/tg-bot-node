import { type Context } from "telegraf";
import type { Update } from "telegraf/types";

export interface AddResponse {
  success: boolean;
  msg: string;
  obj: {
    id: number;
    up: number;
    down: number;
    total: number;
    remark: string;
    enable: boolean;
    expiryTime: number;
    clientStats: null;
    listen: string;
    port: number;
    protocol: string;
    settings: string;
    streamSettings: string;
    tag: string;
    sniffing: string;
  };
}

export interface MyContext<U extends Update = Update> extends Context<U> {
  session: {
    cookie: string;
  };
}
