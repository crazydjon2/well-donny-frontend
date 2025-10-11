import type { UseFetchOptions } from '#app'

import { createError, useCookie, useFetch } from '#imports'
import { defu } from 'defu'

interface ErrorType {
  errors: Record<string, string[]>
}

type FetchOptions<T> = UseFetchOptions<T> & { timeout?: number }

export async function useApi<T = unknown>(url: string | (() => string), userOptions: FetchOptions<T> = {}) {
  // const config = useRuntimeConfig()
  const token = useCookie('token').value
  const { baseURL, userTgId } = await $fetch<{ baseURL: string, userTgId: string }>('/api/config')
  const tgIdLc = localStorage.getItem('tgId')
  const tgUserData = await initTelegramAuth()

  const defaultOptions: FetchOptions<T> = {

    baseURL: `${baseURL}`,
    method: 'GET',
    retry: 3,
    cache: 'no-cache',

    // TODO
    // resolve cache problem (need to check body and query)
    key: String(Math.random()),

    onRequest({ options }) {
      const hasToken = !!token

      if (hasToken) {
        options.headers = {
          ...options.headers,
          'Authorization': token,
          'Accept': 'application/json',
          'Content-type': 'application/json',

          'x-tg-id': tgUserData?.id || tgIdLc || userTgId,
        } as Headers
      }
    },

    onResponse({ response }) {
      const hasError = !response.status.toString().startsWith('2') || response._data.status === 'error'

      if (hasError) {
        throw createError({
          statusCode: response.status,
          statusMessage: response._data.status,
          message: response._data?.message || JSON.stringify(response._data?.errors),
        })
      }
    },

    onResponseError({ response }) {
      const statusCode = response.status || 500
      const statusMessage = response.statusText || ''
      const errorsMsg = (response._data || {}) as ErrorType

      const errorEntries = Object.entries(errorsMsg.errors)

      const message = errorEntries.reduce((acc: string[], [key, value]) => {
        return [...acc, ...value.map(item => `${key} ${item}`)]
      }, [])

      throw createError({ statusCode, statusMessage, message: message.join(' ') })
    },
  }

  const options = defu(userOptions, defaultOptions) as UseFetchOptions<T>

  return useFetch(url, options)
}

function initTelegramAuth(): Promise<any> {
  return new Promise((resolve) => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      resolve(Telegram.WebApp.initDataUnsafe.user)
      return
    }

    // Ждём события готовности Telegram WebApp
    if (window.Telegram?.WebApp?.ready) {
      Telegram.WebApp.ready()
      // Даём время на инициализацию
      setTimeout(() => {
        resolve(Telegram.WebApp.initDataUnsafe?.user || null)
      }, 500)
    }
    else {
      // Если Telegram API не загружен, ждём немного
      setTimeout(() => {
        resolve(Telegram?.WebApp?.initDataUnsafe?.user || null)
      }, 1000)
    }
  })
}
