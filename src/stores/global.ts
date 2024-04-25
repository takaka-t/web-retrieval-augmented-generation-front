import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useGlobalStore = defineStore(
  "global",
  () => {
    /** ローディング表示用 */
    const isLoading = ref(false);

    /** 現在ページタイトル */
    const currentPageTitle = ref<string | null>(null);

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
      currentPageTitle.value = null;
    };

    return {
      isLoading,
      currentPageTitle,
      loginUserId,
      loginUserName,
      isLogin,
      login,
      logout,
    };
  },
  { persist: true }
);
