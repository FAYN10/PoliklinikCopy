// utils/api/radiologi.js
import request from "utils/request";

export function getListRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/antrianradiologi`,
    method: "GET",
    params,
  });
}

export function getListBMHPRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/bmhpradiologi`,
    method: "GET",
    params,
  });
}

export function getListPermintaanPemeriksaanRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/permintaanpemeriksaanradiologi`,
    method: "GET",
    params,
  });
}

export function getListHasilPemeriksaanRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/hasilpemeriksaanradiologi`,
    method: "GET",
    params,
  });
}

export function getListAsesmenPasienRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/asesmenpasienradiologi`,
    method: "GET",
    params,
  });
}

export function getListAsesmenPemeriksaanRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/asesmenpemeriksaanradiologi`,
    method: "GET",
    params,
  });
}