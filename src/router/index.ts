import { useGlobalStore } from "@/stores/global";
import { createRouter, createWebHistory } from "vue-router";

/** Route定数Model */
export interface RouteConstModel {
  /** タイトル */
  title: string;
  /** パス */
  path: string;
}

/** Route定数 */
export const RouteConsts = {
  /** ログイン */
  login: <RouteConstModel>{ title: "ログイン", path: "/login" },
  /** テスト */
  test: <RouteConstModel>{ title: "テスト", path: "/test" },
} as const;
export type RouteConsts = (typeof RouteConsts)[keyof typeof RouteConsts];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/views/NotFound.vue"),
    },
    {
      path: RouteConsts.login.path,
      component: () => import("@/views/Login.vue"),
    },
    {
      path: RouteConsts.test.path,
      component: () => import("@/views/Test.vue"),
    },
  ],
});

/** 未ログインガード */
router.beforeEach((to, from, next) => {
  const globalStore = useGlobalStore();

  // Login画面に遷移予定の場合はログアウトする
  if (to.path.includes(RouteConsts.login.path)) {
    globalStore.logout();
  }

  // 未ログインガード
  if (to.path.includes(RouteConsts.login.path) === false && globalStore.isLogin === false) {
    // Login画面に遷移予定でなく、未ログインの場合にLogin画面に遷移

    // ログイン画面に遷移させる
    next({ path: RouteConsts.login.path });
  } else {
    // 通常遷移

    // 画面タイトルを設定する
    const target = Object.values(RouteConsts).find((route) => to.path.includes(route.path));
    if (target !== undefined) {
      globalStore.currentPageTitle = target.title;
    }

    next();
  }
});

export default router;
