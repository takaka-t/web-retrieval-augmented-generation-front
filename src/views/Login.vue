<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouteConsts } from "@/router";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";
import { mdiLogin } from "@mdi/js";
import { useGlobalStore } from "@/stores/global";
import { TextInputRule } from "@/commons/rules/textInputRule";
import { CommonDialog } from "@/commons/commonDialog";
const router = useRouter();
const globalStore = useGlobalStore();

/** 入力Form */
const inputForm = ref<VForm>();
/** ID */
const id = ref<string | null>(null);
/** パスワード */
const pass = ref<string | null>(null);
/** エラーメッセージ */
const errorMessage = ref<string | null>(null);

/**
 * ログイン処理
 */
const inputFormOnSubmit = async (): Promise<void> => {
  // 入力値の検証
  const validateResult = await inputForm.value!.validate();
  if (validateResult.valid === false) {
    CommonDialog.alertValidationError();
    return;
  }

  try {
    // ローディング開始
    globalStore.isLoading = true;

    // ログイン
    const result = await globalStore.login(id.value!, pass.value!);

    // ログインが成功したかで処理分岐
    if (result) {
      // 初期画面に遷移

      // なぜか一瞬(1ms以上)待ってからpushしないと動作しない
      setTimeout(() => {
        // ↑なぜかのついでにローディング開始を挟む(これでfinallyで解除された後に開始できるので遷移にローディングを入れることができる)
        globalStore.isLoading = true;
        // テスト画面に遷移
        router.push({ path: `${RouteConsts.test.path}` });
      }, 1);
    } else {
      // ログイン失敗
      errorMessage.value = "IDかパスワードが間違っています。";
    }
  } finally {
    // ローディング解除
    globalStore.isLoading = false;
  }
};

onMounted(() => {
  // ローディング解除
  globalStore.isLoading = false;
});
</script>

<template>
  <v-card style="width: 380px; margin: 64px auto">
    <v-toolbar color="primary">
      <v-icon :icon="mdiLogin" style="margin-left: 12px"></v-icon>
      <v-toolbar-title>ログイン</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-container>
        <v-form ref="inputForm" @submit.prevent="inputFormOnSubmit">
          <v-text-field v-model="id" :rules="[TextInputRule.required]" clearable label="ID*" variant="underlined"></v-text-field>
          <v-text-field v-model="pass" :rules="[TextInputRule.required]" clearable label="パスワード*" variant="underlined"></v-text-field>
          <div style="margin-top: 12px; text-align: center">
            <v-label v-if="errorMessage !== null" style="color: red">{{ errorMessage }}</v-label>
          </div>
          <div style="margin-top: 12px; text-align: center">
            <v-btn text="送信" color="primary" size="large" type="submit" variant="elevated"></v-btn>
          </div>
        </v-form>
      </v-container>
    </v-card-text>
  </v-card>
</template>
