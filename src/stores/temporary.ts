import { ref } from "vue";
import { defineStore } from "pinia";

/**
 * Temporary Store
 * ※画面リロード時に値がリセットされる
 */
export const useTemporaryStore = defineStore("global", () => {
  /**
   * リロードが必要かどうか
   * ※アプリ更新でリロードが必要な場合に使用
   */
  const isNeedReload = ref<boolean>(false);

  return {
    isNeedReload,
  };
});
