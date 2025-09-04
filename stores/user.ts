import type { User } from '~/assets/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  function setUser(userData: User) {
    user.value = userData
  }

  return { user, setUser }
})
