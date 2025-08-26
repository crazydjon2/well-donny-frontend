import type { Card } from '~/assets/types/card'
import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { Category, CreateCategoryDTO } from '~/assets/types/category'
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
  getCategoriesTypes() {
    return useApi<CategoryType[]>('/categories-types')
  },
  deleteCategory(id: string) {
    return useApi<any>(`/categories/${id}`, {
      method: 'DELETE',
    })
  },
}
