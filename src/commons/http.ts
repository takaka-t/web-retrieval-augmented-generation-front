import axios from "axios";

/**
 * api呼び出し用
 */
export const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_FOR_WEB_API,
  timeout: 10000,
});

// request 共通処理
http.interceptors.request.use((request) => {
  return request;
});

// response 共通処理
http.interceptors.response.use(
  // 成功
  (response) => {
    return response;
  },
  // 失敗
  (error) => {
    return Promise.reject(error);
  }
);
