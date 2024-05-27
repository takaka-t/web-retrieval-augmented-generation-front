import { http } from "@/commons/http";

/**
 * API SessionUser
 */
export namespace ApiSessionUser {
  /**
   * セッションユーザー情報取得
   */
  export const getSessionUserInfo = async (): Promise<{
    sessionUserName: string;
  } | null> => {
    const response = await http.get("/session-user/get-session-user-info");

    if (response.data !== null) {
      return { sessionUserName: String(response.data.sessionUserName) };
    } else {
      return null;
    }
  };

  /**
   * セッションユーザー情報設定
   */
  export const setSessionUserInfo = async (argument: { newSessionUserName: string }): Promise<void> => {
    await http.post("/session-user/set-session-user-info", argument);
  };
}
