import request from "utils/request";

export function createSuku(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/suku`,
    method: "POST",
    data,
  });
}

export function updateSuku(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/suku`,
    method: "PATCH",
    data,
  });
}

export function deleteSuku(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/suku`,
    method: "DELETE",
    data,
  });
}

export function getListSuku(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/suku/list`,
    method: "GET",
    params,
  });
}

export function getDetailSuku(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/suku/show`,
    method: "GET",
    params,
  });
}
