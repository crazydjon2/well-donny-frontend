import type { UseFetchOptions } from '#app'
import { useCookie, useFetch, useRuntimeConfig } from '#imports'
import { defu } from 'defu'
import { ref } from 'vue'

type FetchOptions<T> = UseFetchOptions<T> & { timeout?: number }

export async function useApi<T = unknown>(
  url: string | (() => string),
  userOptions: FetchOptions<T> = {},
) {
  const config = useRuntimeConfig()
  const token = useCookie('token').value
  const locale = useCookie('locale').value
  const tgIdLc = process.client ? localStorage.getItem('tgId') : null

  let tgUserData = null
  if (process.client) {
    try {
      // @ts-expect-error
      tgUserData = Telegram?.WebApp?.initDataUnsafe?.user || null
    }
    catch {
      tgUserData = null
    }
  }

  const defaultOptions: FetchOptions<T> = {
    baseURL: config.public.baseUrl,
    method: 'GET',
    retry: 3,
    onRequest({ options }) {
      if (token) {
        options.headers = {
          ...options.headers,
          'Authorization': token,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-lang': locale,
          'x-tg-id': tgUserData?.id || tgIdLc || 1,
        } as Headers
      }
    },
  }

  const options = defu(userOptions, defaultOptions) as FetchOptions<T>

  // Общие реактивные поля
  const data = ref<T | null>(null)
  const pending = ref(true)
  const error = ref<any>(null)

  // Функция для запроса
  const refresh = async () => {
    pending.value = true
    error.value = null
    try {
      const response = process.server
        ? (await useFetch<T>(url, options)).data.value
        : await $fetch<T>(typeof url === 'function' ? url() : url, options)
      data.value = response as T
    }
    catch (err) {
      error.value = err
    }
    finally {
      pending.value = false
    }
  }

  // Выполним сразу
  await refresh()

  // Возвращаем как `useFetch`
  return {
    data,
    pending,
    error,
    refresh,
  }
}
