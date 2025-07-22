import { useCustomFetch, useRuntimeConfig } from '#imports'

export async function signIn() {
  const config = useRuntimeConfig()
  return useCustomFetch<{ token: string }>('/signIn', {
    headers: {
      'x-tg-id': config.public.userTgId,
    },
  })
}
