import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const isOpen = ref(false)
  const modalData = ref<{ text: string, img?: string }>({
    text: '',
    img: '',
  })

  function open(text: string, img?: string) {
    modalData.value = {
      text,
      img,
    }
    isOpen.value = true
  }

  function close() {
    modalData.value = {
      text: '',
      img: '',
    }
    isOpen.value = false
  }

  return { isOpen, modalData, open, close }
})
