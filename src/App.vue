<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { RouterView, useRouter } from "vue-router";
import { RouteConsts, type RouteConstModel } from "@/router/index";
import { useGlobalStore } from "@/stores/global";
import { mdiMagnify, mdiLogout, mdiCheckboxBlank } from "@mdi/js";
import { CommonDialog } from "@/commons/commonDialog";
const router = useRouter();
const globalStore = useGlobalStore();

/** ログアウト */
const logout = async (): Promise<void> => {
  // 確認
  if (CommonDialog.confirmProcess("ログアウトします") === false) return;

  // ローディング開始
  globalStore.isLoading = true;

  // ログイン画面に遷移(遷移時にログアウト処理している)
  router.push({ path: RouteConsts.login.path });
};

/** ナビゲーションアイテムModel */
interface navigationItem {
  icon: string;
  route: RouteConstModel;
}
/** ナビゲーションアイテム配列 */
const navigationItems = computed<navigationItem[]>(() => {
  return [
    // テスト
    { icon: mdiMagnify, route: RouteConsts.test },
    { icon: mdiMagnify, route: RouteConsts.login },
  ];
});

/** ナビゲーション表示 */
const drawer = ref(true);

/**
 * ナビゲーションアイテムクリック時
 * @param title 遷移先タイトル
 */
const clickNavigationItem = (title: string): void => {
  // 変更された場合のみ
  if (title !== globalStore.currentPageTitle) {
    // ローディング開始
    globalStore.isLoading = true;
  }
};

onMounted(async () => {});
</script>

<template>
  <v-app>
    <!-- ローデイング -->
    <v-dialog v-model="globalStore.isLoading" persistent style="width: 100%; height: 100%; z-index: 10000">
      <v-progress-circular :indeterminate="globalStore.isLoading" :size="100" color="primary" class="mx-auto"></v-progress-circular>
    </v-dialog>

    <!-- アプリケーションバー -->
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon v-if="globalStore.isLogin" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title v-if="globalStore.isLogin">
        <strong>{{ globalStore.loginUserName }}</strong>
      </v-app-bar-title>
      <v-btn v-if="globalStore.isLogin" :icon="mdiLogout" @click="logout"></v-btn>
    </v-app-bar>

    <v-footer color="secondary" style="position: fixed; left: 0; bottom: 0; width: 100%; z-index: 10000">
      <v-label style="margin-left: auto"><strong>Web RAG</strong></v-label>
    </v-footer>

    <!-- ナビゲーションバー -->
    <v-navigation-drawer v-if="globalStore.isLogin" v-model="drawer" color="secondary">
        <v-list>
          <v-list-item v-for="(item, key) in navigationItems" :key="key" :to="{ path: item.route.path }" @click="clickNavigationItem(item.route.title)">
            <template v-slot:prepend>
              <v-icon :icon="mdiCheckboxBlank"></v-icon><span style="margin-left: 8px">{{ item.route.title }}</span>
            </template>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

    <!-- メイン -->
      <v-main>
        <v-container>
          <v-label style="font-size: x-large">{{ globalStore.currentPageTitle }}</v-label>
          <v-container>
            <RouterView />
          </v-container>
        </v-container>
      </v-main>
  </v-app>
</template>
