import request from "utils/request";

export function createUserRegister(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/register`,
    method: "POST",
    data,
  });
}

export function createUser(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/user`,
    method: "POST",
    data,
  });
}

export function updateUser(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/user`,
    method: "PATCH",
    data,
  });
}

export function deleteUser(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/user`,
    method: "DELETE",
    data,
  });
}

export function getListUser(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/users`,
    method: "GET",
    params,
  });
}

// export function getDetailUser(params) {
//   return request({
//     url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/show`,
//     method: "GET",
//     params,
//   });
// }

export function searchUser(params) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/user/search`,
    method: "GET",
    params,
  });
}

export function getUserProfile() {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/profile`,
    method: "GET",
  });
}

export function updateUserPassword(data) {
  return request({
    url: `${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/auth-service/api/user/change-password`,
    method: "POST",
    data,
  });
}
