import type { UseFetchOptions } from '#app'

import { createError, useCookie, useFetch, useRuntimeConfig } from '#imports'
import { defu } from 'defu'

interface ErrorType {
  errors: Record<string, string[]>
}

type FetchOptions<T> = UseFetchOptions<T> & { timeout?: number }

export function useApi<T = unknown>(url: string | (() => string), userOptions: FetchOptions<T> = {}) {
  const config = useRuntimeConfig()
  const token = useCookie('token').value

  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort(createError({ statusCode: 408, statusMessage: 'aborted', message: 'This request has been automatically aborted.' }))
  }, userOptions.timeout)

  const defaultOptions: FetchOptions<T> = {
    baseURL: `${config.public.baseURL}`,
    method: 'GET',
    retry: 3,
    signal: userOptions.timeout ? controller.signal : undefined,

    // cache request
    key: typeof url === 'string' ? url : url(),

    onRequest({ options }) {
      const hasToken = !!token

      if (hasToken) {
        options.headers = {
          ...options.headers,
          'Authorization': token,
          'Accept': 'application/json',
          'Content-type': 'application/json',
          'x-tg-id': config.public.userTgId,
        } as Headers
      }
    },

    onResponse({ response }) {
      // const token = response._data?.user?.token
      const hasError = !response.status.toString().startsWith('2') || response._data.status === 'error'

      if (hasError) {
        throw createError({
          statusCode: response.status,
          statusMessage: response._data.status,
          message: response._data?.message || JSON.stringify(response._data?.errors),
        })
      }

      // if (token) {
      //   userToken.set(token)
      // }
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

  return useFetch(url, { ...options }).finally(() => {
    if (userOptions.timeout && timeoutId) {
      clearTimeout(timeoutId)
    }
  })
}
