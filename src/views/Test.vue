<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useGlobalStore } from "@/stores/global";
import { http } from "@/commons/http";
import { ApiTest } from "@/webapi/apiTest";
const globalStore = useGlobalStore();

const axiosResultString = ref<string>("初期値");

onMounted(async (): Promise<void> => {
  try {
    // ローディング開始
    globalStore.isLoading = true;

    axiosResultString.value = (await ApiTest.getTest()).result;

    http;
  } finally {
    // ローディング解除
    globalStore.isLoading = false;
  }
});
</script>

<template>
  <v-container>
    テスト画面
    <div>axios -> {{ axiosResultString }}</div>
  </v-container>
</template>
