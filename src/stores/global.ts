import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { ApiSessionUser } from "@/webapi/apiSessionUser";

export const useGlobalStore = defineStore(
  "global",
  () => {
    /** ローディング表示用 */
    const isLoading = ref(false);

    /** ログインユーザーID */
    const loginUserId = ref<string | null>(null);
    /** ログインユーザー名 */
    const loginUserName = ref<string | null>(null);
    /** ログインしているか */
    const isLogin = computed((): boolean => {
      return loginUserId.value !== null;
    });

    /**
     * ログイン処理
     * @param id
     * @param pass
     * @returns ログイン成功か
     */
    const login = async (id: string, pass: string): Promise<boolean> => {
      // ログイン
      loginUserId.value = id;
      loginUserName.value = "TODO:テスト用ユーザー名設定";
      return true;
    };

    /**
     * ログアウト処理
     * ※未ログイン時は何もしない
     */
    const logout = async (): Promise<void> => {
      // 未ログイン時は処理を抜ける
      if (isLogin.value === false) return;
      // ログアウト
      loginUserId.value = null;
      loginUserName.value = null;
    };

    /**
     * セッションユーザー情報
     */
    const sessionUserInfo = ref<{ sessionUserName: string } | null>(null);
    /**
     * セッションユーザー情報設定
     * @param argument
     */
    const setSessionUserInfo = async (argument: { newSessionUserName: string }): Promise<void> => {
      // セッションユーザー情報設定
      await ApiSessionUser.setSessionUserInfo(argument);
      // ストアにも設定
      sessionUserInfo.value = { sessionUserName: argument.newSessionUserName };
    };
    /**
     * セッションユーザー情報取得
     */
    const getSessionUserInfo = async (): Promise<void> => {
      // セッションユーザー情報取得してストアに設定
      sessionUserInfo.value = await ApiSessionUser.getSessionUserInfo();
    };

    return {
      isLoading,
      loginUserId,
      loginUserName,
      isLogin,
      login,
      logout,
      sessionUserInfo,
      setSessionUserInfo,
      getSessionUserInfo,
    };
  },
  { persist: true }
);
