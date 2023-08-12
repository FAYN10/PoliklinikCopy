import request from "utils/request";

export function createDoctor(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/doctor`,
    method: "POST",
    data,
  });
}

export function updateDoctor(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/doctor`,
    method: "PATCH",
    data,
  });
}

export function deleteDoctor(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/doctor`,
    method: "DELETE",
    data,
  });
}

export function getListDoctor(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/doctor`,
    method: "GET",
    params,
  });
}

export function getDetailDoctor(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/doctor/show`,
    method: "GET",
    params,
  });
}

export function searchDoctor(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/doctor/search`,
    method: "GET",
    params,
  });
}


export function getListOptionDoctor(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/temp/dokter/list`,
    method: "GET",
    params,
  });
}
