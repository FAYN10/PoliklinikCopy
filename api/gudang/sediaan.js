import request from "utils/request";

export function getSediaan(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_MOCK_BASE_URL}/sediaan`,
    method: "GET",
    params,
  });
}
