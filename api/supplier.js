import request from 'utils/request';

export function getSupplier(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/rs-service/supplier`,
    method: 'GET',
    params,
  });
}
