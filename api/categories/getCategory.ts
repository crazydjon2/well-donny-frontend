import { useCustomFetch } from "#imports";

export const getCategoryById = async (id: string) => {
  return useCustomFetch<unknown>(`/categories/${id}/cards`)
};
