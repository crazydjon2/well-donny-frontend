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
}
