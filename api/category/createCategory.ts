import type { CreateCategoryDTO } from '~/assets/types/category'
import { useCustomFetch } from '#imports'

export async function createCategoriesApi(data: CreateCategoryDTO) {
  return useCustomFetch<any>('/categories/create', {
    method: 'POST',
    body: data,
  })
}
