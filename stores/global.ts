import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('global', () => {
  const isLightHouse = ref(false)
  const isMenuVisible = ref(true)
  const loader = ref(false)

  const setLightHouseState = (bool: boolean) => {
    isLightHouse.value = bool
  }

  const setMenuVisibility = (bool: boolean) => {
    isMenuVisible.value = bool
  }

  const setLoader = (bool: boolean) => {
    loader.value = bool
  }

  const backUrl = ref<string[]>([])

  let timer: number
  const pushBackUrl = (url: string) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      backUrl.value.push(url)
    }, 100)
  }

  const clear = () => {
    if (backUrl.value.length) {
      backUrl.value.length = backUrl.value.length - 1
    }
  }

  return { isLightHouse, setLightHouseState, setMenuVisibility, isMenuVisible, loader, setLoader, backUrl, pushBackUrl, clear }
})
