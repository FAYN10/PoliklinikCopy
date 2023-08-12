import request from "utils/request";

export function getListRawatJalan(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/rawat/jalan`,
    method: "GET",
    params,
  });
}

export function getListRawatJalanDataForm(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/rawat/jalan/list`,
    method: "GET",
    params,
  });
}
