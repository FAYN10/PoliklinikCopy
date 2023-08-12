import axios from "axios";
import { getItem } from "utils/cookies";

// const tempBaseUrl = "http://192.168.0.121:8000";
// create an axios instance
const REQUEST = axios.create({
  // baseURL: tempBaseUrl, // api
  timeout: 60 * 1000, // ms request timeout
});

// request interceptor
REQUEST.interceptors.request.use(
  (config) => {
    const tokenClient = getItem("client");
    if (tokenClient !== null) {
      config.headers["Authorization"] = `Bearer ${tokenClient}`;
    }
    return config;
  },
  (error) => {
    console.log("interceptors request error", error);
    Promise.reject(error);
  }
);

// response interceptor
REQUEST.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    // unformatted error data
    console.log("interceptors response error", error);
    const fallbackMessage = "Request failed, please try again";
    let statusCode = 500;
    let message = fallbackMessage;
    let errorValidationObj = {};
    if (error.response) {
      console.log("interceptors response error obj", error.response);
      if (error.response.data.message) {
        message = error.response.data.message;
      }
      if (error.response.data.code) {
        statusCode = error.response.data.code;
      }
      if (error.response.data?.errors) {
        if (Object.keys(error.response.data.errors).length >= 1) {
          errorValidationObj = error.response.data.errors;
        }
      }
    }
    return Promise.reject({
      error,
      message,
      statusCode,
      errorValidationObj,
    });
  }
);

export default REQUEST;
