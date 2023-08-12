import request from "utils/request";

export function createPendidikan(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pendidikan`,
    method: "POST",
    data,
  });
}

export function updatePendidikan(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pendidikan`,
    method: "PATCH",
    data,
  });
}

export function deletePendidikan(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pendidikan`,
    method: "DELETE",
    data,
  });
}

export function getListPendidikan(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pendidikan`,
    method: "GET",
    params,
  });
}

export function getDetailPendidikan(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pendidikan/show`,
    method: "GET",
    params,
  });
}
