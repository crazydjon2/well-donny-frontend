import type { UsersCategory } from '~/assets/types/usersCategories'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoriesService } from '~/services/categoriesService'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<UsersCategory[]>([])

  // const fetchCategories = async () => {
  //   const categoriesData: Category[] = await getCategories()

  //   categories.value = categoriesData
  // }

  const setCategories = (data: UsersCategory[]) => {
    categories.value = data
  }

  const refetchCategories = async () => {
    const { data } = await categoriesService.getCategories()
    if (data.value) {
      setCategories(data.value)
    }
  }

  return { categories, setCategories, refetchCategories }
})
