import { useFetch, useRuntimeConfig } from '#app'

export const useCustomFetch: typeof useFetch = (path, options = {}) => {
  const config = useRuntimeConfig()
  options.baseURL = config.public.baseURL
  options.onRequest = ({ options }) => {
    console.log(`ON REQUEST ${options.baseURL}`)
  }
  options.onResponse = ({ response }) => {
    console.log(`ON RESPONSE ${JSON.stringify(response._data)}`)
  }

  return useFetch(path, options)
}
