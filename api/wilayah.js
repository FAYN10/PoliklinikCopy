import request from "utils/request";

export function getProvince() {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/wilayah/provinsi`,
    method: "GET",
  });
}

export function getCity(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/wilayah/kabkot`,
    method: "GET",
    params,
  });
}

export function getDistrict(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/wilayah/kecamatan`,
    method: "GET",
    params,
  });
}

export function getVillage(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/sdm-service/wilayah/keldes`,
    method: "GET",
    params,
  });
}
