<template>
  <div class="bg-primary-2 border-primary border-2 py-5 px-3 gap-1 rounded-xl card relative">
    <AppInput v-model="original" label="термин" white :error="error?.original && error?.original[0]" />
    <AppInput v-model="translated" label="определение" white :error="error?.translated && error?.translated[0]" />

    <AppIcon icon="trash" color="text-white" :width="16" :height="16" class="cursor-pointer ml-3 mt-1" @click="$emit('onDelete')" />
  </div>
</template>

<script setup lang="ts">
import { AppIcon, AppInput } from './ui'

defineProps<{ error?: { original?: string[], translated?: string[] } }>()

defineEmits(['onDelete'])
const original = defineModel('original')
const translated = defineModel('translated')
</script>

<style scoped>
.card {
  box-shadow: 0px 0px 4px 4px var(--color-primary) inset;
}
</style>
