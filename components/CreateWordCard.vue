<template>
  <div class="border-primary border-2 py-5 px-3 gap-1 rounded-xl">
    <AppInput v-model="original" />
    <AppInput v-model="translated" />
  </div>
</template>

<script setup lang="ts">
import { AppInput } from './ui'

const original = defineModel('original')
const translated = defineModel('translated')
</script>
