import type { User } from '~/assets/types/user'
// import { useRuntimeConfig } from '#app'
import { useApi } from '~/composables/useApi'

export const authService = {
  async signIn() {
    const { userTgId } = await $fetch<{ baseURL: string, userTgId: string }>('/api/config')
    // const config = useRuntimeConfig()

    return useApi<{ token: string }>('/signIn', {
      headers: {

        'x-tg-id': userTgId || '',
      },
    })
  },
  getUser() {
    return useApi<User>('/user')
  },
  createUser({ name, tgId }: { name: string, tgId: string }) {
    return useApi<User>('/user', {
      method: 'POST',
      body: {
        name,
        tg_id: tgId,
      },
    })
  },
}
