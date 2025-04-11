import { uuidv4 } from "./utls";

export function getFormData(remark: string): {
  formdata: FormData;
  id: string;
} {
  let port = Math.round(Math.random() * 65535);
  do {
    port = Math.round(Math.random() * 65535);
  } while (port.toString() === process.env.PORT);

  let settings = {
    clients: [
      {
        id: "84a41128-dbb2-4ff6-96e7-d89d9104674e",
        flow: "xtls-rprx-direct",
        email: "",
        limitIp: 2,
        totalGB: 0,
        expiryTime: "",
      },
    ],
    decryption: "none",
    fallbacks: [],
  };
  const id = uuidv4();
  settings.clients[0].id = id;
  let streamSettings = {
    network: "tcp",
    security: "none",
    tcpSettings: { acceptProxyProtocol: false, header: { type: "none" } },
  };
  let sniffing = { enabled: true, destOverride: ["http", "tls"] };

  const formdata = new FormData();
  formdata.append("up", "0");
  formdata.append("down", "0");
  formdata.append("total", "0");
  formdata.append("remark", remark);
  formdata.append("enable", "true");
  formdata.append("expiryTime", "0");
  formdata.append("listen", "");
  formdata.append("port", port.toString());
  formdata.append("protocol", "vless");
  formdata.append("settings", JSON.stringify(settings));
  formdata.append("streamSettings", JSON.stringify(streamSettings));
  formdata.append("sniffing", JSON.stringify(sniffing));
  return { formdata, id };
}
