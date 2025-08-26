import type { UsersCategory } from '~/assets/types/usersCategories'
import { useApi } from '~/composables/useApi'

export const categoriesService = {
  getCategories() {
    return useApi<UsersCategory[]>('/categories')
  },
}
