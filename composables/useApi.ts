import type { UseFetchOptions } from '#app'

import { createError, useCookie, useFetch, useRuntimeConfig } from '#imports'
import { defu } from 'defu'

interface ErrorType {
  errors: Record<string, string[]>
}

type FetchOptions<T> = UseFetchOptions<T> & { timeout?: number }

export async function useApi<T = unknown>(url: string | (() => string), userOptions: FetchOptions<T> = {}) {
  const config = useRuntimeConfig()
  const token = useCookie('token').value
  const tgIdLc = localStorage.getItem('tgId')
  let tgUserData = null
  try {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    tgUserData = Telegram?.WebApp?.initDataUnsafe?.user || null
  }
  catch {
    tgUserData = null
  }

  const defaultOptions: FetchOptions<T> = {
    baseURL: `${config.public.baseUrl}`,
    method: 'GET',
    retry: 3,

    // TODO
    // resolve cache problem (need to check body and query)

    onRequest({ options }) {
      const hasToken = !!token

      if (hasToken) {
        options.headers = {
          ...options.headers,
          'Authorization': token,
          'Accept': 'application/json',
          'Content-type': 'application/json',

          'x-tg-id': tgUserData?.id || tgIdLc || 1,
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
