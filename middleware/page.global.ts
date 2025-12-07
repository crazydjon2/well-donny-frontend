import { defineNuxtRouteMiddleware } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
  const getDepth = (path: string) => {
    return path.split('/').filter(seg => seg.length > 0).length
  }
  // Exclude cases when rediraction heapens 2 times
  document.body.classList.add('page-transition-lock')
  setTimeout(() => {
    document.body.classList.remove('page-transition-lock')
  }, 600)

  const toDepth = getDepth(to.path)
  const fromDepth = getDepth(from.path)

  if (toDepth > fromDepth) {
    to.meta.pageTransition = { name: 'page-left' }
    from.meta.pageTransition = { name: 'page-left' }
  }
  else {
    to.meta.pageTransition = { name: 'page-right' }
    from.meta.pageTransition = { name: 'page-right' }
  }
})
