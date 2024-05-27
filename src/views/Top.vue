<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useGlobalStore } from "@/stores/global";
const globalStore = useGlobalStore();

onMounted(async (): Promise<void> => {
  try {
    // ローディング開始
    globalStore.isLoading = true;
  } finally {
    // ローディング解除
    globalStore.isLoading = false;
  }
});
</script>

<template></template>
