import { useCookie, useFetch, useRuntimeConfig } from '#app'

export const useCustomFetch: typeof useFetch = (path, options = {}) => {
  const config = useRuntimeConfig()
  options.baseURL = config.public.baseURL
  options.onRequest = () => {
    // console.log(`ON REQUEST ${options.baseURL}`)
  }
  options.onResponse = ({ response }) => {
    // eslint-disable-next-line no-console
    console.log(`ON RESPONSE ${path}`)
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(response._data)}`)
  }
  options.onRequest = ({ options }) => {
    const token = useCookie('token')
    if (token) {
      options.headers.set('Authorization', token.value as string)
    }
  }

  return useFetch(path, options)
}
