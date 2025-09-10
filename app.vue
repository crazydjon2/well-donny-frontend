<template>
  <NuxtLayout name="mobile">
    <NuxtPage />
    <AppLoader />
    <LightHouseLoading />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useCookie } from '#app'
import { useRouter } from 'vue-router'
import AppLoader from './components/AppLoader.vue'
import LightHouseLoading from './components/LightHouseLoading.vue'
import { authService } from './services/authService'
import { useGlobalStore } from './stores/global'
import { useUserStore } from './stores/user'

const router = useRouter()
const token = useCookie('token')
const userStore = useUserStore()
const { setLoader } = useGlobalStore()
const { userTgId } = await $fetch<{ baseURL: string, userTgId: string }>('/api/config')
const tgIdLc = localStorage.getItem('tgId')
// const config = useRuntimeConfig()

setLoader(true)
const { data: signInData, status, refresh } = await authService.signIn()
if (status.value === 'error') {
  token.value = ''
  const { data: user } = await authService.createUser({

    tgId: tgIdLc || userTgId,
    name: 'ИИИ',
  })

  if (user.value) {
    userStore.setUser(user.value)
  }
  setLoader(false)
  refresh()
  router.go(0)
}
if (signInData.value?.token) {
  token.value = signInData.value.token

  const { data: user } = await authService.getUser()
  setTimeout(() => {
    setLoader(false)
  }, 300)
  if (user.value) {
    userStore.setUser(user.value)
  }
}
</script>
