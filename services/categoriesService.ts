import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { UserRoles } from '~/assets/types/user'
import type { UsersCategory } from '~/assets/types/usersCategories'
import { useApi } from '~/composables/useApi'

export const categoriesService = {

  getCategories() {
    return useApi<UsersCategory[]>('/categories')
  },
  getAllCategories(queries: { type?: CategoryType['id'], role?: UserRoles, userId?: string, sort?: 'ASC' | 'DESC', folder?: string | number }) {
    return useApi<UsersCategory[]>(`/categories/all?type=${queries.type || ''}&role=${queries.role || ''}&userId=${queries.userId || ''}&sort=${queries.sort || ''}&folder=${queries.folder || ''}`)
  },
  getByType(typeId: string, name: string) {
    return useApi<Record<string, { id: string, items: (UsersCategory & { averageRate: number })[] }>>(`/categories/by-type?typeId=${typeId}&name=${name}`)
  },
}
