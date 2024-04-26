<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useGlobalStore } from "@/stores/global";
import { ApiChatRoom } from "@/webapi/apiChatRoom";
const globalStore = useGlobalStore();

const props = defineProps<{
  /**
   * チャットルームID
   * ※URLパラメータ受取専用
   */
  chatRoomId: string;
}>();

/** チャットルームID */
const chatRoomId = computed((): number => Number(props.chatRoomId));

/** チャットルーム名 */
const chatRoomName = ref<string>("");
/** チャットルーム作成日時 */
const chatRoomCreateDateTime = ref<Date | null>(null);

/**
 * チャットルーム初期化
 */
const initializeChatRoom = async (targetChatRoomId: number): Promise<void> => {
  /** 対象チャットルーム */
  const targetChatRoom = await ApiChatRoom.getTarget({ targetChatRoomId: targetChatRoomId });

  // チャットルーム名 設定
  chatRoomName.value = targetChatRoom.chatRoomName;
  // チャットルーム作成日時 設定
  chatRoomCreateDateTime.value = targetChatRoom.createDatetime;

  /** 対象チャットルームのメッセージ全件 */
  // const targetChatRoomAllMessages = TODO
};

/**
 * watch と onMounted について
 * チャットルームIDはURLパラメータから取得して props に反映されるためか、
 * 既にチャットルーム画面にいる状態で、ナビゲーションバーなどから router.push で遷移してきた場合は、
 * 値が変更されただけということで onMounted が実行されないので、watch で監視して初期化処理を行う
 * 逆にチャットルーム画面以外から router.push で遷移してきた場合や、URLで直接遷移してきた場合は onMounted だけが実行される
 */

watch(chatRoomId, async (): Promise<void> => {
  try {
    // ローディング開始
    globalStore.isLoading = true;

    console.log("watch", "chatRoomId", chatRoomId.value);
    // チャットルーム初期化
    await initializeChatRoom(chatRoomId.value);
  } finally {
    // ローディング解除
    globalStore.isLoading = false;
  }
});

onMounted(async (): Promise<void> => {
  try {
    // ローディング開始
    globalStore.isLoading = true;

    console.log("onMounted", "chatRoomId", chatRoomId.value);
    // チャットルーム初期化
    await initializeChatRoom(chatRoomId.value);
  } finally {
    // ローディング解除
    globalStore.isLoading = false;
  }
});
</script>

<template>
  <v-container>
    <h2>{{ chatRoomName }}</h2>
    <v-label>{{ chatRoomCreateDateTime === null ? "" : chatRoomCreateDateTime.toLocaleString() }}</v-label>
  </v-container>
</template>
