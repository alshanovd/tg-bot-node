import { type Context } from "telegraf";
import type { Update } from "telegraf/types";

export type Response<T> = {
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

export interface Inbound {
  clientStats: ClinetStats[];
  down: number;
  enable: boolean;
  expiryTime: number;
  id: number;
  listen: string;
  port: number;
  protocol: string;
  remark: string;
  settings: string;
  sniffing: string;
  streamSettings: string;
  tag: string;
  total: number;
  up: number;
}

export interface ClinetStats {
  id: 1;
  inboundId: 1;
  enable: true;
  email: "tallinv2";
  up: 3745590308;
  down: 38486199109;
}
