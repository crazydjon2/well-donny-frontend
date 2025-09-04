import type { User } from '~/assets/types/user'
import { useRuntimeConfig } from '#app'
import { useApi } from '~/composables/useApi'

export const authService = {
  signIn() {
    const config = useRuntimeConfig()
    return useApi<{ token: string }>('/signIn', {
      headers: {
        'x-tg-id': config.public.userTgId,
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
