import request from 'utils/request';

export function getUnit(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/unit`,
    method: 'GET',
    params,
  });
}
