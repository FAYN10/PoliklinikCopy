// utils/api/radiologi.js
import request from "utils/request";

export function getListRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/antrianradiologi`,
    method: "GET",
    params,
  });
}

export function getListBmhpRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/bmhpradiologi`,
    method: "GET",
    params,
  });
}