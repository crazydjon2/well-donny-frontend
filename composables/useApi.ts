import { useCookie, useFetch, useRuntimeConfig } from '#app'

export const useCustomFetch: typeof useFetch = (path, options = {}) => {
  // options.onResponse = ({ response }) => {

  // console.log(`ON RESPONSE ${path}`)

  // console.log(`${JSON.stringify(response._data)}`)
  // }
  options.onRequest = ({ options }) => {
    const config = useRuntimeConfig()
    options.baseURL = config.public.baseURL
    const token = useCookie('token')
    if (token) {
      options.headers.set('Authorization', token.value as string)
    }
  }

  return useFetch(path, options)
}
