import type { User, UserProfile } from '~/assets/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '~/services/userService'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const profile = ref<UserProfile>()

  function setUser(userData: User) {
    user.value = userData
  }

  function setProfile(profileData: UserProfile) {
    profile.value = profileData
  }

  async function getUser() {
    const { data: user } = await authService.getUser()
    if (user.value) {
      setUser(user.value)
    }
  }

  return { user, setUser, profile, setProfile, getUser }
})
