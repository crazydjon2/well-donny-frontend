import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { UsersCategories } from '~/assets/types/usersCategories'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCategoriesTypesApi } from '~/api/categories/getCategoriesTypes'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<UsersCategories[]>([])
  const categoriesTypes = ref<CategoryType[]>([])

  // const fetchCategories = async () => {
  //   const categoriesData: Category[] = await getCategories()

  //   categories.value = categoriesData
  // }

  const setCategories = (data: UsersCategories[]) => {
    categories.value = data
  }

  const getCategoriesTypes = async () => {
    const { data } = await getCategoriesTypesApi()
    categoriesTypes.value = data
  }

  return { categories, setCategories, getCategoriesTypes, categoriesTypes }
})
