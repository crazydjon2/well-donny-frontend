<template>
  <div>
    <slot />
    <div>
      <p>API URL: {{ apiUrl }}</p>
      <p>TG ID: {{ tgId }}</p>
      {{ apiKey }}
    </div>
    <MobileMenu />
    <ModalsContainer />
  </div>
</template>

<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal'
import MobileMenu from '~/components/MobileMenu.vue'

const config: { baseURL: string, userTgId: string } = await $fetch('/api/config')
const apiUrl = config.baseURL
const tgId = config.userTgId
const apiKey = import.meta.env.VITE_API_KEY
// eslint-disable-next-line no-console
console.log(apiKey)
// eslint-disable-next-line no-console
console.log('AAAAAAAAAAAAAAAAAAAA')
// eslint-disable-next-line no-console
console.log('Runtime config:', apiUrl)
</script>
