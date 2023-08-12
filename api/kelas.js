import request from "utils/request";

export function getListKelasRawatInapForm(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/temp/kelas/list`,
    method: "GET",
    params,
  });
}
