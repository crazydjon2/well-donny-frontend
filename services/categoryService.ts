import type { Card } from '~/assets/types/card'
import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { Category, CreateCategoryDTO, EditCategoryDTO } from '~/assets/types/category'
import type { User } from '~/assets/types/user'
import { useApi } from '~/composables/useApi'

export const categoryService = {
  getCategory(id: string) {
    return useApi<Category>(`/categories/${id}`)
  },
  getCategoryCards(id: string) {
    return useApi<Card[]>(`/cards/by-category/${id}`)
  },
  createCategory(data: CreateCategoryDTO) {
    return useApi<Category>('/categories/create', {
      method: 'POST',
      body: data,
    })
  },
  editCategory(categoryId: string, data: EditCategoryDTO) {
    return useApi<Category>(`categories/${categoryId}`, {
      method: 'PUT',
      body: data,
    })
  },
  addUserToCategory({ user, categoryId }: { user: User, categoryId: string }) {
    return useApi('/user-categories/add', {
      method: 'POST',
      body: {
        userId: user.id,
        categoryId,
      },
    })
  },
  removeUserFromCategory(userId: string, categoryId: string) {
    return useApi('/user-categories/remove', {
      method: 'POST',
      body: {
        userId,
        categoryId,
      },
    })
  },
  getCategoriesTypes(id?: string) {
    return useApi<CategoryType[]>(`/categories-types?typeId=${id || ''}`)
  },
  deleteCategory(id: string) {
    return useApi<any>(`/categories/${id}`, {
      method: 'DELETE',
    })
  },
  markAsDone(categoryId: string) {
    return useApi('/user-categories/mark-as-done', {
      method: 'PUT',
      body: {
        categoryId,
      },
    })
  },
  rateCategory(categoryId: string, rate: number) {
    return useApi('/user-categories/rate', {
      method: 'PUT',
      body: {
        categoryId,
        rate,
      },
    })
  },
}
