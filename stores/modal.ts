// stores/useModalStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

let idCounter = 0

export const useModalStore = defineStore('modal', () => {
  const modals = ref<
    {
      id: number
      component: string
      props: Record<string, any>
    }[]
  >([])

  function open(component: string, props: Record<string, any> = {}) {
    const id = ++idCounter
    modals.value.push({ id, component, props })
    return id
  }

  function close(id?: number) {
    if (id != null) {
      modals.value = modals.value.filter(m => m.id !== id)
    } else {
      modals.value.pop()
    }
  }

  return { modals, open, close }
})
