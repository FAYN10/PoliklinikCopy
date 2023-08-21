// utils/api/radiologi.js
import request from "utils/request";

export function getListRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/radiologi`,
    method: "GET",
    params,
  });
}

export function getDetailRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/radiologi/show`,
    method: "GET",
    params,
  });
}

export function searchRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/radiologi/search`,
    method: "GET",
    params,
  });
}

export function getListOptionRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/radiologi/list`,
    method: "GET",
    params,
  });
}