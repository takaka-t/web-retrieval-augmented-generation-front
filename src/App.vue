<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterView, useRouter } from "vue-router";
import { RouteConsts } from "@/router/index";
import { useGlobalStore } from "@/stores/global";
import { mdiLogout, mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import { CommonDialog } from "@/commons/commonDialog";
import { ApiChatRoom } from "./webapi/apiChatRoom";
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

/** ナビゲーション表示 */
const drawer = ref(true);

/** チャットルームリストの項目 */
const chatRoomListItems = ref<
  {
    chatRoomId: number;
    chatRoomName: string;
    createDatetime: Date;
  }[]
>([]);
/**
 * チャットルームリストの項目を再読み込み
 */
const reloadChatRoomList = async (): Promise<void> => {
  // チャットルームリストの項目を取得
  chatRoomListItems.value = await ApiChatRoom.getAllNotLogicalDeleted();
  // 作成日時の降順にソート
  chatRoomListItems.value.sort((a, b) => {
    return a.createDatetime < b.createDatetime ? 1 : -1;
  });
};

/**
 * 新規チャット作成
 */
const createNewChatRoom = async (): Promise<void> => {
  try {
    // ローディング開始
    globalStore.isLoading = true;

    // チャットルーム作成
    const newChatRoomId = (await ApiChatRoom.createNew()).newId;

    // チャットルームリストの項目を読み込み
    await reloadChatRoomList();

    // 作成したチャットルームに遷移
    router.push({ path: `${RouteConsts.chatRoom.path}/${newChatRoomId}` });
    // ※遷移先でローディングを終了するのでここでは対応不要
  } catch (e) {
    // 遷移前の処理でエラーが発生した場合を考慮してローディング終了対応
    // ローディング終了
    globalStore.isLoading = false;

    throw e;
  }
};

/**
 * チャットルーム選択
 */
const selectChatRoom = (chatRoomId: number): void => {
  // ローディング開始
  globalStore.isLoading = true;

  // 選択したチャットルームに遷移
  router.push({ path: `${RouteConsts.chatRoom.path}/${chatRoomId}` });
  // ※遷移先でローディングを終了するのでここでは対応不要
};

/**
 * 対象のチャットルームを削除
 */
const deleteTargetChatRoom = async (targetChatRoomId: number): Promise<void> => {
  try {
    // ローディング開始
    globalStore.isLoading = true;

    // 確認
    if (CommonDialog.confirmProcess("チャットルームを削除します") === false) return;

    // チャットルーム削除
    await ApiChatRoom.logicalDeleteTarget({ targetChatRoomId: targetChatRoomId });

    // チャットルームリストの項目を読み込み
    await reloadChatRoomList();
  } finally {
    // ローディング終了
    globalStore.isLoading = false;
  }
};

onMounted(async (): Promise<void> => {
  try {
    // ローディング開始
    globalStore.isLoading = true;

    // チャットルームリストの項目を読み込み
    await reloadChatRoomList();
  } finally {
    // ローディング終了
    globalStore.isLoading = false;
  }
});
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
      <v-container>
        <v-btn :prepend-icon="mdiPlus" color="primary" @click="createNewChatRoom()">新規チャット作成</v-btn>
      </v-container>
      <v-list>
        <v-list-item v-for="(item, key) of chatRoomListItems" :key="key" :title="item.chatRoomName" :subtitle="item.createDatetime.toLocaleString()" @click="selectChatRoom(item.chatRoomId)">
          <!-- <template v-slot:prepend>
              <v-icon :icon=""></v-icon><span style="margin-left: 8px">{{ item.route.title }}</span>
            </template> -->
          <template v-slot:append>
            <v-icon :icon="mdiTrashCanOutline" @click="deleteTargetChatRoom(item.chatRoomId)"></v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- メイン -->
    <v-main>
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
