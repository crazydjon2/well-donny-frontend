import { defineStore } from "pinia";
import { ref } from "vue";

export const useGlobalStore = defineStore('global', () => {
  const isLightHouse = ref(false);

  const setLightHouseState = (bool: boolean) => {
    isLightHouse.value = bool
  }

  return { isLightHouse, setLightHouseState }
})