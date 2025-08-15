import { useCookie, useFetch, useRuntimeConfig } from '#app'

export async function useCustomFetch<T>(
  path: string,
  options: any = {}
) {
  options.onResponse = ({ response }) => {
    console.log(`ON RESPONSE ${path}`)
    console.log(`${JSON.stringify(response._data)}`)
  }

  options.onRequest = ({ options }) => {
    const config = useRuntimeConfig()
    options.baseURL = config.public.baseURL
    const token = useCookie('token')
    console.log(token.value, path)
    if (token.value) {
      options.headers.set('Authorization', token.value as string)
    }
  }

  // immediate только на сервере
  const fetchResult = await useFetch<T>(path, {
    immediate: process.server,
    ...options
  })

  if (process.client) {
    await fetchResult.execute()
  }

  return fetchResult
}
