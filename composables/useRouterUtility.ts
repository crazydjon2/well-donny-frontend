import { useRouter } from 'vue-router'

export function useRouterUtility() {
  const router = useRouter()

  function goBack() {
    if (window.history.state.back) {
      router.back()
    }
    else {
      router.push('/')
    }
  }

  function goHome() {
    router.push('/')
  }

  return { goBack, goHome }
}
