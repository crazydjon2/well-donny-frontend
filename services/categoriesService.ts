import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { UserRoles } from '~/assets/types/user'
import type { UsersCategory } from '~/assets/types/usersCategories'
import { useApi } from '~/composables/useApi'

export const categoriesService = {

  getCategories() {
    return useApi<UsersCategory[]>('/categories')
  },
  getAllCategories(queries: { type?: CategoryType['id'], role?: UserRoles, userId?: string, sort?: 'ASC' | 'DESC', folder?: string | number, size?: number, page?: number }) {
    return useApi<UsersCategory[]>('/categories/all', {
      query: {
        type: queries.type,
        role: queries.role,
        userId: queries.userId,
        sort: queries.sort,
        folder: queries.folder,
        // page: queries.page,
        // size: queries.size,
      },
    })
  },
  getByType(typeId: string, name: string, page?: number, size?: number) {
    const query: Record<string, any> = { typeId }

    if (name && name.trim() !== '') {
      query.name = name
    }

    if (page !== undefined && size !== undefined) {
      // query.page = page
      // query.size = size
    }

    return useApi<{ type: { name: string, id: string, type: string }, items: (UsersCategory & { averageRate: number })[] }[]>('/categories/by-type', {
      query,
    })
  },
}
