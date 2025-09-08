import { defineNuxtPlugin, useCookie } from '#app'
import { useUserStore } from '#imports'
import { authService } from '~/services/authService'

export default defineNuxtPlugin(async () => {
  const token = useCookie('token')
  const userStore = useUserStore()
  const { userTgId } = await $fetch<{ baseURL: string, userTgId: string }>('/api/config')
  // const config = useRuntimeConfig()

  const { data: signInData, status, refresh } = await authService.signIn()
  if (status.value === 'error') {
    const { data: user } = await authService.createUser({

      tgId: userTgId,
      name: 'ИИИ',
    })

    if (user.value) {
      userStore.setUser(user.value)
    }
    refresh()
  }
  if (signInData.value?.token) {
    token.value = signInData.value.token

    const { data: user } = await authService.getUser()
    if (user.value) {
      userStore.setUser(user.value)
    }
  }
})
