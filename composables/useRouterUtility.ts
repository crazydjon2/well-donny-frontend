import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '~/stores/global'

export function useRouterUtility() {
  const router = useRouter()
  const { backUrl } = storeToRefs(useGlobalStore())

  function goBack() {
    if (backUrl.value.length) {
      router.push(backUrl.value[backUrl.value.length - 1])
    }
    else {
      goHome()
    }
    useGlobalStore().clear()
  }

  function goHome() {
    router.push('/')
  }

  return { goBack, goHome }
}
