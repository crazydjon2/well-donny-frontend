<template>
  <NuxtLayout name="mobile">
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts">
import { useCookie } from '#app'
import { useI18n } from 'vue-i18n'
import { signIn } from './api/auth/signIn'

export default {
  async setup() {
    const { locale } = useI18n()
    const token = useCookie('token')

    const { data } = await signIn()
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
