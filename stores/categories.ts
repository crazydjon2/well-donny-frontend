import type { UsersCategory } from '~/assets/types/usersCategories'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoriesService } from '~/services/categoriesService'
import { useGlobalStore } from './global'

export const useCategoriesStore = defineStore('categories', () => {
  const { setLoader } = useGlobalStore()

  const categories = ref<UsersCategory[]>([])
  const loading = ref<boolean>(false)

  // const fetchCategories = async () => {
  //   const categoriesData: Category[] = await getCategories()

  //   categories.value = categoriesData
  // }

  const setCategories = (data: UsersCategory[]) => {
    categories.value = data
  }

  const getCategories = async () => {
    loading.value = true
    const { data, error } = await categoriesService.getCategories()
    if (data.value) {
      setCategories(data.value)
    }
    else if (!data.value && !error.value) {
      setCategories([])
    }
    loading.value = false
    setLoader(false)
  }

  return { categories, setCategories, getCategories, loading }
})
