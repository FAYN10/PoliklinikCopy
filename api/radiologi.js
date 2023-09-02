// utils/api/radiologi.js
import request from "utils/request";

//Antrian Radiologi
export function getListRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/antrianradiologi`,
    method: "GET",
    params,
  });
}

export function searchRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/antrianradiologi/search`,
    method: "GET",
    params,
  });
}

export function showRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/antrianradiologi/show`,
    method: "GET",
    params,
  });
}

//BMHP Radiologi
export function getListBMHPRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/bmhpradiologi`,
    method: "GET",
    params,
  });
}

export function getDetailBMHPRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/bmhpradiologi/show`,
    method: "GET",
    params,
  });
}

export function createBMHPRadiologi(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/bmhpradiologi`,
    method: "POST",
    data,
  });
}

export function updateBMHPRadiologi(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/bmhpradiologi`,
    method: "PATCH",
    data,
  });
}

export function deleteBmhpRadiologi(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/bmhpradiologi`,
    method: "DELETE",
    data,
  });
}

export function searchBmhpRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/bmhpradiologi/search`,
    method: "GET",
    params,
  });
}

//Permintaan Pemeriksaan Radiologi
export function getListPermintaanPemeriksaanRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/permintaanpemeriksaanradiologi`,
    method: "GET",
    params,
  });
}

export function getDetailPermintaanPemeriksaanRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/permintaanpemeriksaanradiologi/show`,
    method: "GET",
    params,
  });
}

//Hasil Pemeriksaan Radiologi
export function getListHasilPemeriksaanRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/hasilpemeriksaanradiologi`,
    method: "GET",
    params,
  });
}

export function getDetailHasilPemeriksaanRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/hasilpemeriksaanradiologi/show`,
    method: "GET",
    params,
  });
}

//Asesmen Pasien Radiologi
export function getListAsesmenPasienRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/asesmenpasienradiologi`,
    method: "GET",
    params,
  });
}

export function getDetailAsesmenPasienRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/asesmenpasienradiologi/show`,
    method: "GET",
    params,
  });
}

export function createAsesmenPasienRadiologi(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/asesmenpasienradiologi`,
    method: "POST",
    data,
  });
}

export function updateAsesmenPasienRadiologi(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/asesmenpasienradiologi`,
    method: "PATCH",
    data,
  });
}

//Asesmen Pemeriksaan Radiologi
export function getListAsesmenPemeriksaanRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/asesmenpemeriksaanradiologi`,
    method: "GET",
    params,
  });
}

export function getDetailAsesmenPemeriksaanRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/asesmenpemeriksaanradiologi/show`,
    method: "GET",
    params,
  });
}

export function createAsesmenPemeriksaanRadiologi(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/asesmenpemeriksaanradiologi`,
    method: "POST",
    data,
  });
}

export function updateAsesmenPemeriksaanRadiologi(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/asesmenpemeriksaanradiologi`,
    method: "PATCH",
    data,
  });
}

//Prioritas Pemeriksaan Radiologi
export function getListOptionPrioritas(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/prioritaspemeriksaanradiologi/list`,
    method: "GET",
    params,
  });
}

//Grouping Pemeriksaan Radiologi
export function getDetailGroupingPemeriksaanRadiologi(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/groupingpemeriksaanradiologi/show`,
    method: "GET",
    params,
  });
}
