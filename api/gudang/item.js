import request from "utils/request";

export function getItem(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/item/list`,
    method: "GET",
    params,
  });
}
