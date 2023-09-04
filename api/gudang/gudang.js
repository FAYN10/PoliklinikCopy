import request from "utils/request";

export function getGudang(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/gudang`,
    method: "GET",
    params,
  });
}