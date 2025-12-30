import { defineNuxtRouteMiddleware } from '#app'
import { useGlobalStore } from '~/stores/global'

export default defineNuxtRouteMiddleware((to, from) => {
  if (!to.path.includes('/test') && !to.path.includes('/cards') && !from.path.includes('/test') && !from.path.includes('/cards') && to.path !== from.path) {
    const store = useGlobalStore()
    store.pushBackUrl(from.fullPath)
  }
})
