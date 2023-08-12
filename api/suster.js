import request from "utils/request";

export function createSuster(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/suster`,
    method: "POST",
    data,
  });
}

export function updateSuster(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/suster`,
    method: "PATCH",
    data,
  });
}

export function deleteSuster(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/suster`,
    method: "DELETE",
    data,
  });
}

export function getListSuster(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/suster`,
    method: "GET",
    params,
  });
}

export function getDetailSuster(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/suster/show`,
    method: "GET",
    params,
  });
}

export function searchSuster(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/suster/search`,
    method: "GET",
    params,
  });
}
