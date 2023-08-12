import request from "utils/request";

export function createPoliklinik(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/poliklinik`,
    method: "POST",
    data,
  });
}

export function updatePoliklinik(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/poliklinik`,
    method: "PATCH",
    data,
  });
}

export function deletePoliklinik(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/poliklinik`,
    method: "DELETE",
    data,
  });
}

export function getListPoliklinik(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/poliklinik`,
    method: "GET",
    params,
  });
}

export function getDetailPoliklinik(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/poliklinik/show`,
    method: "GET",
    params,
  });
}

export function searchPoliklinik(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/poliklinik/search`,
    method: "GET",
    params,
  });
}

export function getListOptionPoliklinik(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/poliklinik/list`,
    method: "GET",
    params,
  });
}
