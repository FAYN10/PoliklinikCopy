import request from "utils/request";

export function getReligion() {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/agama`,
    method: "GET",
  });
}

export function getEducation() {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pendidikan/list`,
    method: "GET",
  });
}

export function getProfession() {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/pekerjaan/list`,
    method: "GET",
  });
}

export function getInsurance() {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/asuransi/list`,
    method: "GET",
  });
}
export function getOptionInsurance(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/asuransi/list`,
    method: "GET",
  });
}

export function getVclaim(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/vclaim/peserta/nik`,
    method: "POST",
    data,
  });
}
