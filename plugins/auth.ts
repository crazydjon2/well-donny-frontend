import { defineNuxtPlugin, useCookie } from '#app'
import { useTelegramAuth } from '#imports'
import { nextTick } from 'vue'

import { authService } from '~/services/userService'
import { useGlobalStore } from '~/stores/global'
import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin(async () => {
  const token = useCookie('token')
  const localeCookie = useCookie('locale')
  const userStore = useUserStore()
  const { setLoader } = useGlobalStore()

  setLoader(true)

  try {
    const tgIdLc = localStorage.getItem('tgId')
    await useTelegramAuth().init(3000)
    // eslint-disable-next-line no-restricted-globals
    const tgUserData = global.Telegram.WebApp.initDataUnsafe?.user

    const { data: signInData, error, refresh } = await authService.signIn()

    if (error.value) {
      token.value = ''
      await nextTick()
      const { data: user } = await authService.createUser({
        tgId: tgUserData?.id || tgIdLc || 1,
        name: tgUserData?.username || Math.random().toString(36).substring(2, 8),
        language: tgUserData?.language_code === 'en' ? 'en' : 'ru',
      })
      if (user.value) {
        localeCookie.value = user.value.language
        userStore.setUser(user.value)
      }
      await refresh()
      token.value = signInData?.value?.token
      await nextTick()
    }
    else if (signInData.value?.token) {
      token.value = signInData.value.token
      await nextTick()
      const { data: user } = await authService.getUser()
      if (user.value) {
        if (localeCookie.value !== user.value.language) {
          setTimeout(() => {
            window.location.reload()
          })
        }
        localeCookie.value = user.value.language
        userStore.setUser(user.value)
      }
    }
  }
  catch (e) {
    console.error('[auth plugin]', e)
  }
  finally {
    setLoader(false)
  }
})
