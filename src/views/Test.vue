<script setup lang="ts">
import { onMounted } from "vue";
import { useGlobalStore } from "@/stores/global";
const globalStore = useGlobalStore();

onMounted(() => {
  try {
    // ローディング開始
    globalStore.isLoading = true;
  } finally {
    // ローディング解除
    globalStore.isLoading = false;
  }
});
</script>

<template>
  <v-container> テスト画面 </v-container>
</template>
