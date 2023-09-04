import request from "utils/request";

export function getListItem(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/item`,
    method: "GET",
    params,
  });
}
