import type { UseFetchOptions } from '#app'
import { useCookie, useFetch } from '#imports'
import { defu } from 'defu'
import { ref } from 'vue'

type FetchOptions<T> = UseFetchOptions<T> & { timeout?: number }

export async function useApi<T = unknown>(
  url: string | (() => string),
  userOptions: FetchOptions<T> = {},
) {
  // const config = useRuntimeConfig()
  const token = useCookie('token').value
  const locale = useCookie('locale').value
  // eslint-disable-next-line node/prefer-global/process
  const tgIdLc = process.client ? localStorage.getItem('tgId') : null

  let tgUserData = null
  // eslint-disable-next-line node/prefer-global/process
  if (process.client) {
    try {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      tgUserData = Telegram?.WebApp?.initDataUnsafe?.user || null
    }
    catch {
      tgUserData = null
    }
  }

  const { baseURL } = await $fetch('/api/config')
  // console.log(config.public.baseUrl, baseURL)

  const defaultOptions: FetchOptions<T> = {
    baseURL,
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
      // eslint-disable-next-line node/prefer-global/process
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
