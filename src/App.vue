<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterView, useRouter } from "vue-router";
import { RouteConsts } from "@/router/index";
import type { VForm } from "vuetify/components";
import { useGlobalStore } from "@/stores/global";
import { mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import { TextInputRule } from "@/commons/rules/textInputRule";
import { CommonDialog } from "@/commons/commonDialog";
import { ApiChatRoom } from "./webapi/apiChatRoom";
const router = useRouter();
const globalStore = useGlobalStore();

/** ナビゲーション表示 */
const drawer = ref(true);

/** セッションユーザー情報の入力フォームのダイアログを表示するか */
const isShowInputSessionUserFormDialog = ref(false);
/** セッションユーザー情報の入力フォーム */
const inputSessionUserForm = ref<VForm>();
/** セッションユーザー名の入力値 */
const inputSessionUserName = ref<string | null>(null);
/** セッションユーザー情報の入力フォームの送信処理 */
const submitInputSessionUserFor = async (): Promise<void> => {
  // 入力値の検証
  const validateResult = await inputSessionUserForm.value!.validate();
  if (validateResult.valid === false) {
    CommonDialog.alertValidationError();
    return;
  }

  try {
    // ローディング開始
    globalStore.isLoading = true;

    // セッションユーザー情報登録
    await globalStore.setSessionUserInfo({ newSessionUserName: inputSessionUserName.value! });

    // セッションユーザー情報の入力フォームのダイアログを非表示
    isShowInputSessionUserFormDialog.value = false;

    // チャットルームリストの項目を読み込み
    await reloadChatRoomList();
  } finally {
    // ローディング終了
    globalStore.isLoading = false;
  }
};

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
  chatRoomListItems.value = await ApiChatRoom.getAll();
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
    const newChatRoomId = (await ApiChatRoom.createNew()).newChatRoomId;

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
  // 選択したチャットルームに遷移
  router.push({ path: `${RouteConsts.chatRoom.path}/${chatRoomId}` });
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

    // セッションユーザー情報取得
    await globalStore.getSessionUserInfo();
    // セッションユーザー情報の入力フォームのダイアログを表示するか
    isShowInputSessionUserFormDialog.value = globalStore.sessionUserInfo === null;
    // セッションユーザー情報の入力フォームのダイアログを表示する場合は、以降の初期化処理が不要なので処理中断
    if (isShowInputSessionUserFormDialog.value === true) {
      return;
    }

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
    <!-- ローディング -->
    <v-dialog v-model="globalStore.isLoading" persistent style="width: 100%; height: 100%; z-index: 10000">
      <v-progress-circular :indeterminate="globalStore.isLoading" :size="100" color="primary" class="mx-auto"></v-progress-circular>
    </v-dialog>

    <!-- セッションユーザー情報の入力フォームのダイアログ -->
    <v-dialog v-model="isShowInputSessionUserFormDialog" persistent style="width: 100%; height: 100%; z-index: 9999">
      <v-card style="width: 380px; margin: 64px auto">
        <v-toolbar color="primary">
          <v-toolbar-title>入力してください</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-form ref="inputSessionUserForm" @submit.prevent="submitInputSessionUserFor()">
              <v-text-field v-model="inputSessionUserName" :rules="[TextInputRule.required]" clearable label="所属 + 名前" variant="underlined"></v-text-field>
              <div style="margin-top: 12px; text-align: center">
                <v-btn color="primary" size="large" type="submit" variant="elevated">OK</v-btn>
              </div>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- アプリケーションバー -->
    <v-app-bar app color="primary" prominent>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title v-if="globalStore.sessionUserInfo !== null">
        <strong>{{ globalStore.sessionUserInfo.sessionUserName }}</strong>
      </v-app-bar-title>
    </v-app-bar>

    <!-- ナビゲーションバー -->
    <v-navigation-drawer app v-model="drawer" color="secondary">
      <template v-slot:prepend>
        <v-container>
          <v-btn :prepend-icon="mdiPlus" color="primary" @click="createNewChatRoom()">新規チャット作成</v-btn>
        </v-container>
        <v-divider></v-divider>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) of chatRoomListItems"
          :key="item.chatRoomId"
          :title="item.chatRoomName"
          :subtitle="item.createDatetime.toLocaleString()"
          @click="selectChatRoom(item.chatRoomId)"
        >
          <template v-slot:append>
            <v-icon :icon="mdiTrashCanOutline" @click="deleteTargetChatRoom(item.chatRoomId)"></v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- メイン -->
    <v-main>
      <!-- アプリケーションバー と フッター を除いた高さ -->
      <v-container style="height: calc(100vh - 64px - 40px)">
        <RouterView />
      </v-container>
    </v-main>

    <!-- フッター -->
    <v-footer app>
      <v-label style="margin-left: auto"><strong>Web RAG</strong></v-label>
    </v-footer>
  </v-app>
</template>
