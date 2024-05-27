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
  /** トップ */
  top: <RouteConstModel>{ title: "トップ", path: "/" },
  /** チャットルーム */
  chatRoom: <RouteConstModel>{ title: "チャットルーム", path: "/chat-room" },
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
      path: RouteConsts.top.path,
      component: () => import("@/views/Top.vue"),
    },
    {
      path: `${RouteConsts.chatRoom.path}/:chatRoomId(\\d+)`,
      component: () => import("@/views/ChatRoom.vue"),
      props: true,
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

  // セッションユーザー情報未設定ガード
  if (globalStore.sessionUserInfo === null && to.path !== "/") {
    // セッションユーザー情報未設定時はトップ画面以外はトップ画面に遷移
    next({ path: RouteConsts.top.path });
    return;
  }

  // TODO:管理機能は未実装なので未ログインガード不要
  // // 未ログインガード
  // if (to.path.includes(RouteConsts.login.path) === false && globalStore.isLogin === false) {
  //   // Login画面に遷移予定でなく、未ログインの場合にLogin画面に遷移

  //   // ログイン画面に遷移させる
  //   next({ path: RouteConsts.login.path });
  // }

  // 通常遷移
  next();
});

export default router;
