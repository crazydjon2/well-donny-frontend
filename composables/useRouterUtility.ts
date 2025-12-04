import { useRouter } from 'vue-router'
import { useGlobalStore } from '~/stores/global'

export function useRouterUtility() {
  const router = useRouter()
  const store = useGlobalStore()

  function goBack() {
    if (store.backUrl) {
      router.push(store.backUrl)
      store.clear() // опционально
    }
    else {
      router.push('/') // или router.back()
    }
  }

  function goHome() {
    router.push('/')
  }

  return { goBack, goHome }
}
