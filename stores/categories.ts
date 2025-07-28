import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { UsersCategories } from '~/assets/types/usersCategories'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCategories } from '~/api/categories/getCategories'

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

  const refetchCategories = async () => {
    const { data } = await getCategories()
    if (data.value) {
      setCategories(data.value)
    }
  }

  return { categories, setCategories, categoriesTypes, refetchCategories }
})
