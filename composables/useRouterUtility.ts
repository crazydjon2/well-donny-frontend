import { useRouter } from 'vue-router'

export function useRouterUtility() {
  const router = useRouter()

  function goBack() {
    router.back()
  }

  return { goBack }
}
