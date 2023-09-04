import request from "utils/request";

export function getInventory(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/inventory`,
    method: "GET",
    params,
  });
}

export function getPosInventory(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/pos-inventory`,
    method: "GET",
    params,
  });
}