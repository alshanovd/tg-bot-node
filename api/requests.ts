import axios from "axios";
import { Add, Response, Inbound } from "./models";
import { url } from "./config";

export async function addClientRequest(formdata: FormData, cookie: string) {
  return axios.post<Response<Add>>(url + "/xui/inbound/add", formdata, {
    headers: { Cookie: cookie },
  });
}

export async function getClinetsRequest(cookie: string) {
  const listUrl = url + "/xui/inbound/list";
  return axios.post<Response<Inbound[]>>(listUrl, new FormData(), {
    headers: { Cookie: cookie },
  });
}

export async function deleteClient(id: string, cookie: string) {
  const deleteUrl = url + "/xui/inbound/del/" + id;
  return axios.post<Response<number>>(
    deleteUrl,
    {},
    { headers: { Cookie: cookie } }
  );
}
