import type { Card } from '~/assets/types/card'
import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { Category, CreateCategoryDTO } from '~/assets/types/category'
import { useCategoriesStore } from '#imports'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoryService } from '~/services/categoryService'

export const useCategoryStore = defineStore('category', () => {
  const category = ref<Category | null>(null)
  const cards = ref<Card[] | null>(null)
  const categoriesTypes = ref<CategoryType[]>([])
  const { refetchCategories } = useCategoriesStore()

  // const fetchCategories = async () => {
  //   const categoriesData: Category[] = await getCategories()

  //   categories.value = categoriesData
  // }

  const setCategory = (data: Category) => {
    category.value = data
  }

  const setCategoryCards = (data: Card[]) => {
    cards.value = data
  }

  const createCategory = (data: CreateCategoryDTO) => {
    categoryService.createCategory(data)
  }

  const deleteCategory = async (id: string) => {
    return await categoryService.deleteCategory(id)
      .then(() => {
        refetchCategories()
      })
  }

  const getCategoriesTypes = async () => {
    const { data: types } = await categoryService.getCategoriesTypes()
    if (types.value) {
      categoriesTypes.value = types.value
    }
  }

  return { category, setCategory, cards, setCategoryCards, createCategory, getCategoriesTypes, deleteCategory, categoriesTypes }
})
