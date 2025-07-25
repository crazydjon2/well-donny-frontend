import type { ResultType } from '../resultType'
import { useRuntimeConfig } from '#app'
import { useCustomFetch } from '~/composables/useApi'

export async function signIn(): Promise<ResultType<{ token: string }>> {
  const config = useRuntimeConfig()
  const { data, status, error } = await useCustomFetch<{ token: string }>('/signIn', {
    headers: {
      'x-tg-id': config.public.userTgId,
    },
  })

  return { data, status, error }
}
