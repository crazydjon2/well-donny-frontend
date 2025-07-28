import { useCustomFetch } from '~/composables/useApi'

export async function deleteCategoryApi(id: string) {
  return useCustomFetch<any>(`/categories/${id}`, {
    method: 'DELETE',
  })
}
