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

  return { isLightHouse, setLightHouseState, setMenuVisibility, isMenuVisible, loader, setLoader }
})
