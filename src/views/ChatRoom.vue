<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { mdiSendVariantOutline } from "@mdi/js";
import { useGlobalStore } from "@/stores/global";
import { ApiChatRoom } from "@/webapi/apiChatRoom";
import { ApiChatRoomMessage } from "@/webapi/apiChatRoomMessage";
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

/** チャットルームメッセージを表示するdiv */
const chatRoomMessagesDiv = ref<HTMLDivElement | null>(null);

/** チャットルーム名 */
const chatRoomName = ref<string>("");
/** チャットルーム作成日時 */
const chatRoomCreateDateTime = ref<Date | null>(null);

/** チャットルームメッセージのリスト */
const chatRoomMessageList = ref<
  {
    chatRoomId: number;
    chatRoomMessageId: number;
    isSenderBot: boolean;
    messageContent: string;
    sendDatetime: Date;
  }[]
>([]);

/** チャットルームメッセージ入力値 */
const inputChatRoomMessage = ref<string | null>(null);
/** チャットルームメッセージが送信可能かどうか */
const isChatRoomMessageSendable = computed((): boolean => {
  return inputChatRoomMessage.value !== null && inputChatRoomMessage.value.trim() !== "";
});

/**
 * チャットルームメッセージ 読み込み
 */
const fetchChatRoomMessages = async (): Promise<void> => {
  // チャットルームメッセージを読み込む
  chatRoomMessageList.value = await ApiChatRoomMessage.getAll({
    targetChatRoomId: chatRoomId.value,
  });

  // チャットルームメッセージを表示するdivを一番下までスクロール
  // ※描写後に動作するように処理を遅延させる
  setTimeout(() => {
    chatRoomMessagesDiv.value?.scrollTo({ top: chatRoomMessagesDiv.value.scrollHeight, behavior: "smooth" });
  }, 500);
};

/**
 * チャットルーム初期化
 */
const initializeChatRoom = async (): Promise<void> => {
  /** 対象チャットルーム */
  const targetChatRoom = await ApiChatRoom.getTarget({ targetChatRoomId: chatRoomId.value });

  // チャットルーム名 設定
  chatRoomName.value = targetChatRoom.chatRoomName;
  // チャットルーム作成日時 設定
  chatRoomCreateDateTime.value = targetChatRoom.createDatetime;

  // チャットルームメッセージ入力値 初期化
  // TODO:入力値保持
  inputChatRoomMessage.value = null;

  // チャットルームメッセージ 読み込み
  await fetchChatRoomMessages();
};

/**
 * チャットルームメッセージを送信する
 */
const sendChatRoomMessage = async (): Promise<void> => {
  // 送信可能でない場合は処理を抜ける
  if (isChatRoomMessageSendable.value === false) {
    return;
  }

  try {
    // ローディング開始
    globalStore.isLoading = true;

    // チャットルームメッセージ送信
    await ApiChatRoomMessage.sendNew({
      targetChatRoomId: chatRoomId.value,
      newChatRoomMessage: inputChatRoomMessage.value!.trim(),
    });

    // チャットルームメッセージ入力値 初期化
    inputChatRoomMessage.value = null;

    // チャットルームメッセージ 読み込み
    await fetchChatRoomMessages();
  } finally {
    // ローディング解除
    globalStore.isLoading = false;
  }
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

    // チャットルーム初期化
    await initializeChatRoom();
  } finally {
    // ローディング解除
    globalStore.isLoading = false;
  }
});

onMounted(async (): Promise<void> => {
  try {
    // ローディング開始
    globalStore.isLoading = true;

    // チャットルーム初期化
    await initializeChatRoom();
  } finally {
    // ローディング解除
    globalStore.isLoading = false;
  }
});
</script>

<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <div>
      <h2>{{ chatRoomName }}</h2>
      <v-label>{{ chatRoomCreateDateTime === null ? "" : chatRoomCreateDateTime.toLocaleString() }}</v-label>
    </div>
    <div ref="chatRoomMessagesDiv" style="width: 100%; max-width: 750px; flex-grow: 1; overflow-y: auto; margin: 0 auto">
      <v-container v-for="(item, key) of chatRoomMessageList" :key="item.chatRoomMessageId">
        <div style="display: flex; align-items: center">
          <img :src="item.isSenderBot ? '/images/chat-bot.png' : '/images/chat-user.png'" style="width: 32px; height: 32px" />
          <span style="padding-left: 4px; font-size: large; font-weight: bold">{{ item.isSenderBot ? "AI" : "あなた" }}</span>
        </div>
        <div style="padding: 4px 16px; white-space: pre-wrap">
          {{ item.messageContent }}
        </div>
      </v-container>
    </div>
    <div style="padding-top: 6px">
      <v-textarea
        v-model="inputChatRoomMessage"
        label="質問を入力してください"
        hint="ctrl + enter で送信"
        variant="outlined"
        rows="1"
        max-rows="3"
        auto-grow
        style="max-width: 800px; margin: 0 auto"
        @keydown.enter.ctrl="sendChatRoomMessage()"
      >
        <template v-slot:append-inner>
          <div style="height: 100%; display: flex; align-items: end">
            <v-btn :icon="mdiSendVariantOutline" variant="text" :disabled="isChatRoomMessageSendable === false" @click="sendChatRoomMessage()"></v-btn>
          </div>
        </template>
      </v-textarea>
    </div>
  </div>
</template>
