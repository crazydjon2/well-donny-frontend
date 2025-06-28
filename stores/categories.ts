import { defineStore } from "pinia";
import { ref } from "vue";
import type { Category } from "~/assets/types/category";

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])

  // const fetchCategories = async () => {
  //   const categoriesData: Category[] = await getCategories()

  //   categories.value = categoriesData
  // }

  const setCategories = (data: Category[]) => {
    categories.value = data
  }

  return { categories, setCategories }
})