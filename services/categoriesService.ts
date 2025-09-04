import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { UsersCategory } from '~/assets/types/usersCategories'
import { useApi } from '~/composables/useApi'

export const categoriesService = {
  getCategories() {
    return useApi<UsersCategory[]>('/categories')
  },
  getAllCategories(queries: { type: CategoryType['id'] }) {
    return useApi<UsersCategory[]>(`/categories/all?type=${queries.type}`)
  },
}
