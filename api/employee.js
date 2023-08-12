import request from "utils/request";

export function createEmployee(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/employee`,
    method: "POST",
    data,
  });
}

export function updateEmployee(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/employee`,
    method: "PATCH",
    data,
  });
}

export function deleteEmployee(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/employee`,
    method: "DELETE",
    data,
  });
}

export function getListEmployee(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/employee`,
    method: "GET",
    params,
  });
}

export function getDetailEmployee(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/employee/show`,
    method: "GET",
    params,
  });
}

export function searchEmployee(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/employee/search`,
    method: "GET",
    params,
  });
}

export function getListOptionEmployee(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/employee/list`,
    method: "GET",
    params,
  });
}
