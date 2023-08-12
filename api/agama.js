import request from "utils/request";

export function createAgama(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/agama`,
    method: "POST",
    data,
  });
}

export function updateAgama(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/agama`,
    method: "PATCH",
    data,
  });
}

export function deleteAgama(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/agama`,
    method: "DELETE",
    data,
  });
}

export function getListAgama(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/agama`,
    method: "GET",
    params,
  });
}

export function getDetailAgama(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/agama/show`,
    method: "GET",
    params,
  });
}
