<template>
  <div class="border-primary border-2 py-5 px-3 gap-1 rounded-xl">
    <AppInput v-model="props.word.original"></AppInput>
    <AppInput v-model="props.word.translated"></AppInput>
  </div>
</template>

<script setup lang="ts">
import { AppInput } from './ui';
const props = defineProps<{
  word: { original: string, translated: string }
}>()
</script>

<style scoped>
.card {
  
}
</style>