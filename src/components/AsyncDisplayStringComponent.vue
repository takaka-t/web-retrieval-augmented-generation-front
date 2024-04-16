<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
  /** 表示文字列を返す関数 */
  returnDisplayString: () => Promise<string>;
}>();

/** 表示文字列 */
const displayString = ref<string | null>(null);

/** 描画完了後 */
onMounted(async () => {
  // 表示
  displayString.value = await props.returnDisplayString();
});
</script>

<template>
  {{ displayString }}
</template>
