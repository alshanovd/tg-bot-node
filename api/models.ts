import { type Context } from "telegraf";
import type { Update } from "telegraf/types";

export type Reponse<T> = {
  success: boolean;
  msg: string;
  obj: T;
};

export interface Add {
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
}

export interface MyContext<U extends Update = Update> extends Context<U> {
  session: {
    cookie: string;
  };
}
