import { useCustomFetch } from '#imports'

export async function getCategoryById(id: string) {
  return useCustomFetch<unknown>(`/categories/${id}/cards`)
}
