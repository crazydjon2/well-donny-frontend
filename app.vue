<template>
  <NuxtLayout name="mobile">
    <NuxtPage />
    <LightHouseLoading />
  </NuxtLayout>
</template>

<script lang="ts">
import { useCookie } from '#app'
import { useI18n } from 'vue-i18n'
import LightHouseLoading from './components/LightHouseLoading.vue'
import { authService } from './services/authService'

export default {
  async setup() {
    const { locale } = useI18n()
    const token = useCookie('token')

    const { data } = await authService.signIn()
    if (data.value && data.value.token) {
      token.value = data.value.token
    }

    const onClick = () => {
      locale.value = locale.value === 'ru' ? 'en' : 'ru'
    }

    return { locale, onClick }
  },
}
</script>
