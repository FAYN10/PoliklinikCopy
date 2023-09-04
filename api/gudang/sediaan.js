import request from "utils/request";

export function getSediaan(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sediaan/list`,
    method: "GET",
    params,
  });
}
