import request from "utils/request";

export function login(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/login`,
    method: "POST",
    data,
  });
}
export function twoFactor(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/two-factor`,
    method: "POST",
    data,
  });
}