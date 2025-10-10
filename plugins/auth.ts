import { defineNuxtPlugin, useCookie } from '#app'
import { nextTick } from 'vue'
import { authService } from '~/services/authService'
import { useGlobalStore } from '~/stores/global'
import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin(async () => {
  const token = useCookie('token')
  const userStore = useUserStore()
  const { setLoader } = useGlobalStore()

  setLoader(true)

  try {
    const { userTgId } = await $fetch<{ baseURL: string, userTgId: string }>('/api/config')
    const tgIdLc = localStorage.getItem('tgId')
    const tgUserData = Telegram?.WebApp.initDataUnsafe.user

    const { data: signInData, status } = await authService.signIn()

    if (status.value === 'error') {
      token.value = ''
      const { data: user } = await authService.createUser({
        tgId: tgUserData?.id || tgIdLc || userTgId,
        name: tgUserData?.username || Math.random().toString(36).substring(2, 8),
      })
      if (user.value)
        userStore.setUser(user.value)
    }
    else if (signInData.value?.token) {
      await nextTick()
      token.value = signInData.value.token
      const { data: user } = await authService.getUser()
      if (user.value)
        userStore.setUser(user.value)
    }
  }
  catch (e) {
    console.error('[auth plugin]', e)
  }
  finally {
    setLoader(false)
  }
})
