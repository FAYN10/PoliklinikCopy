import request from "utils/request";

export function createBahasa(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/bahasa`,
    method: "POST",
    data,
  });
}

export function updateBahasa(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/bahasa`,
    method: "PATCH",
    data,
  });
}

export function deleteBahasa(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/bahasa`,
    method: "DELETE",
    data,
  });
}

export function getListBahasa(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/bahasa/list`,
    method: "GET",
    params,
  });
}

export function getDetailBahasa(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/bahasa/show`,
    method: "GET",
    params,
  });
}
