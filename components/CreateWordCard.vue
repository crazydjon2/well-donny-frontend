<template>
  <div class="bg-primary-2 border-primary border-2 py-5 px-3 gap-1 rounded-xl card relative">
    <AppInput v-model="original" label="термин" white />
    <AppInput v-model="translated" label="определение" white />

    <AppIcon icon="close" color="text-white" :width="16" :height="16" class="absolute top-4 right-4 cursor-pointer" @click="$emit('onDelete')" />
  </div>
</template>

<script setup lang="ts">
import { AppIcon, AppInput } from './ui'

defineEmits(['onDelete'])
const original = defineModel('original')
const translated = defineModel('translated')
</script>

<style scoped>
.card {
  box-shadow: 0px 0px 4px 4px var(--color-primary) inset;
}
</style>
