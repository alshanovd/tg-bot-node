export function getFormData(remark: string): FormData {
  let port = Math.round(Math.random() * 65535).toString();
  do {
    port = Math.round(Math.random() * 65535).toString();
  } while (port !== process.env.PORT);

  const formdata = new FormData();
  formdata.append("up", "0");
  formdata.append("down", "0");
  formdata.append("total", "0");
  formdata.append("remark", remark);
  formdata.append("enable", "true");
  formdata.append("expiryTime", "0");
  formdata.append("listen", "");
  formdata.append("port", port);
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
  return formdata;
}
