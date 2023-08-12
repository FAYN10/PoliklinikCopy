import request from "utils/request";

export function createPasien(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pasien`,
    method: "POST",
    data,
  });
}

export function updatePasien(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pasien`,
    method: "PATCH",
    data,
  });
}

export function deletePasien(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pasien`,
    method: "DELETE",
    data,
  });
}

export function getListPasien(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pasien`,
    method: "GET",
    params,
  });
}

export function getDetailPasien(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pasien/show`,
    method: "GET",
    params,
  });
}

export function searchPasien(params) {
  return request({
    // url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pasien/search`,
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pasien`,
    method: "GET",
    params,
  });
}

export function getPasienByNoRm(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/temp/search/pasien/no-rm`,
    method: "GET",
    params,
  });
}

export function createRawatJalan(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/rawat/jalan`,
    method: "POST",
    data,
  });
}
