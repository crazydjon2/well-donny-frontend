import type { Card } from '~/assets/types/card'
import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { Category, CreateCategoryDTO } from '~/assets/types/category'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createCategoriesApi } from '~/api/category/createCategory'
import { getCategoriesTypesApi } from '~/api/category/getCategoriesTypes'

export const useCategoryStore = defineStore('category', () => {
  const category = ref<Category | null>(null)
  const cards = ref<Card | null>(null)
  const categoriesTypes = ref<CategoryType[]>([])

  // const fetchCategories = async () => {
  //   const categoriesData: Category[] = await getCategories()

  //   categories.value = categoriesData
  // }

  const setCategory = (data: Category) => {
    category.value = data
  }

  const setCategoryCards = (data: Card) => {
    cards.value = data
  }

  const createCategory = (data: CreateCategoryDTO) => {
    createCategoriesApi(data)
  }

  const getCategoriesTypes = async () => {
    const types = await getCategoriesTypesApi()
    if (types) {
      categoriesTypes.value = types
    }
  }

  return { category, setCategory, cards, setCategoryCards, createCategory, getCategoriesTypes }
})
