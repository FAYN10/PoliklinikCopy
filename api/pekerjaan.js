import request from "utils/request";

export function createPekerjaan(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pekerjaan`,
    method: "POST",
    data,
  });
}

export function updatePekerjaan(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pekerjaan`,
    method: "PATCH",
    data,
  });
}

export function deletePekerjaan(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pekerjaan`,
    method: "DELETE",
    data,
  });
}

export function getListPekerjaan(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pekerjaan`,
    method: "GET",
    params,
  });
}

export function getDetailPekerjaan(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pekerjaan/show`,
    method: "GET",
    params,
  });
}
