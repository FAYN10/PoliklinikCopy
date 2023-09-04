import request from "utils/request";

export function getMutasi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/mutation`,
    method: "GET",
    params,
  });
}

export function getDetailMutasi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/mutation/show`,
    method: "GET",
    params,
  });
}

export function deleteMutasi(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/mutation`,
    method: "DELETE",
    data,
  });
}