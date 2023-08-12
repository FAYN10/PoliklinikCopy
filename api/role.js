import request from "utils/request";

export function createRole(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/role`,
    method: "POST",
    data,
  });
}

export function updateRole(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/role`,
    method: "PATCH",
    data,
  });
}

export function deleteRole(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/role`,
    method: "DELETE",
    data,
  });
}

export function getListRole(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/roles`,
    method: "GET",
    params,
  });
}

export function getDetailRole(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/role`,
    method: "GET",
    params,
  });
}

export function searchRole(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/role/search`,
    method: "GET",
    params,
  });
}
