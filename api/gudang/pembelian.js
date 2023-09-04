import request from "utils/request";

export function getPembelian(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/receive`,
    method: "GET",
    params,
  });
}

export function getDetailPembelian(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/receive/show`,
    method: "GET",
    params,
  });
}

export function createPembelian(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/receive`,
    method: "POST",
    data,
  });
}