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
