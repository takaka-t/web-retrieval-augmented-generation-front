import axios from "axios";
import { useGlobalStore } from "@/stores/global";
import { useTemporaryStore } from "@/stores/temporary";

/**
 * api呼び出し用
 */
export const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_FOR_WEB_API,
  timeout: 30000,
});

// request 共通処理
http.interceptors.request.use((request) => {
  return request;
});

// response 共通処理
http.interceptors.response.use(
  // 成功
  (response) => {
    const globalStore = useGlobalStore();
    const temporaryStore = useTemporaryStore();

    // レスポンスヘッダーからフロントアプリバージョンを取得
    const frontAppVersion = response.headers["front-app-version"];
    // 保持しているフロントアプリバージョンと異なる場合
    if (frontAppVersion !== undefined && String(frontAppVersion) !== globalStore.frontAppVersion) {
      // フロントアプリバージョンを更新
      globalStore.frontAppVersion = String(frontAppVersion);
      // リロードが必要
      temporaryStore.isNeedReload = true;
    }

    return response;
  },
  // 失敗
  (error) => {
    return Promise.reject(error);
  }
);
