import type { Category } from '~/assets/types/category'
import { useCustomFetch } from '#imports'

export async function getCategoryApi(id: string): Promise<Category | null> {
  const { data } = await useCustomFetch<Category>(`/categories/${id}`)
  return data.value
}
