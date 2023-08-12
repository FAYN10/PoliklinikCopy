import request from "utils/request";

export function getListRawatInap(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/rawat/inap`,
    method: "GET",
    params,
  });
}

export function createRawatInap(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/rawat/inap`,
    method: "POST",
    data,
  });
}
