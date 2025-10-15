import type { User, UserProfile } from '~/assets/types/user'
// import { useRuntimeConfig } from '#app'
import { useApi } from '~/composables/useApi'

export const authService = {
  async signIn() {
    const tgIdLc = localStorage.getItem('tgId')
    const tgUserData = Telegram.WebApp.initDataUnsafe.user
    // const config = useRuntimeConfig()

    return useApi<{ token: string }>('/signIn', {
      headers: {
        'x-tg-id': tgUserData?.id || tgIdLc || 1 || '',
      },
    })
  },
  getUser() {
    return useApi<User>('/user')
  },
  getProfile(id: string) {
    return useApi<UserProfile>(`/user/${id}`)
  },
  createUser({ name, tgId }: { name: string, tgId: string }) {
    return useApi<User>('/user', {
      method: 'POST',
      body: {
        name,
        tg_id: +tgId,
      },
    })
  },
}
