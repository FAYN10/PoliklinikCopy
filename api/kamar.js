import request from "utils/request";

export function getListKamarRawatInapForm(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/temp/kamar/list`,
    method: "GET",
    params,
  });
}
