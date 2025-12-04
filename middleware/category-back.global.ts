import { defineNuxtRouteMiddleware } from '#app'
import { useGlobalStore } from '~/stores/global'

// middleware/category-back.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith('/category/') && !from.path.startsWith('/category/')) {
    // Мы впервые зашли на категорию извне → сохраняем откуда пришли
    const store = useGlobalStore()
    store.setBackUrl(from.fullPath)
  }
})
