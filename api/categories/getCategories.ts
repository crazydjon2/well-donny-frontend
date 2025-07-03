import type { Category } from '~/assets/types/category'
import { useCustomFetch } from '#imports'

export async function getCategories() {
  return useCustomFetch<Category[]>('/categories')
}
