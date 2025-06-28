import { useCustomFetch } from "#imports";
import type { Category } from "~/assets/types/category";

export const getCategories = async () => {
  return useCustomFetch<Category[]>("/categories")
};
