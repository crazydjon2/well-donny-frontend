import { defineNuxtPlugin, useCookie } from '#app'
import { useGlobalStore, useUserStore } from '#imports'
import { useRouter } from 'vue-router'
import { authService } from '~/services/authService'

export default defineNuxtPlugin(async () => {
  // const router = useRouter()
  // const token = useCookie('token')
  // const userStore = useUserStore()
  // const { setLoader } = useGlobalStore()
  // const { userTgId } = await $fetch<{ baseURL: string, userTgId: string }>('/api/config')
  // const tgIdLc = localStorage.getItem('tgId')

  // setLoader(true)
  // const { data: signInData, status, refresh } = await authService.signIn()
  // if (status.value === 'error') {
  //   token.value = ''
  //   const { data: user } = await authService.createUser({

  //     tgId: tgIdLc || userTgId,
  //     name: 'ИИИ',
  //   })

  //   if (user.value) {
  //     userStore.setUser(user.value)
  //   }
  //   setLoader(false)
  //   refresh()
  //   router.go(0)
  // }
  // if (signInData.value?.token) {
  //   token.value = signInData.value.token

  //   const { data: user } = await authService.getUser()
  //   setLoader(false)
  //   if (user.value) {
  //     userStore.setUser(user.value)
  //   }
  // }
})
