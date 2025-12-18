import type { Card } from '~/assets/types/card'
import type { CategoryType } from '~/assets/types/categoriesTypes'
import type { Category, CreateCategoryDTO, EditCategoryDTO } from '~/assets/types/category'
import type { UserCategory } from '~/assets/types/usersCategories'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoryService } from '~/services/categoryService'

export const useCategoryStore = defineStore('category', () => {
  const category = ref<Category | null>(null)
  const cards = ref<Card[] | null>(null)
  const userCategory = ref<UserCategory | null>(null)
  const categoryTypes = ref<CategoryType[]>([])
  const loading = ref<boolean>(false)

  const setCategory = (data: Category) => {
    category.value = data
  }

  const setCategoryCards = (data: Card[]) => {
    cards.value = data
  }

  const setUserCategory = (data: UserCategory | null) => {
    userCategory.value = data
  }

  const createCategory = async (data: CreateCategoryDTO) => {
    return await categoryService.createCategory(data)
  }

  const editWord = async (data: EditCategoryDTO) => {
    return await categoryService.editCategory(data.id, data)
  }

  const deleteCategory = async (id: string) => {
    return await categoryService.deleteCategory(id)
  }

  const removeUserFromCategory = async (userId: string, categoryId: string) => {
    return await categoryService.removeUserFromCategory(userId, categoryId)
  }

  const getCategoryTypes = async () => {
    const { data: types } = await categoryService.getCategoriesTypes()
    if (types.value) {
      categoryTypes.value = types.value
    }
  }

  const changeWordFavorite = (wordId: string, isFavorite: boolean) => {
    const word = cards.value?.find((c: Card) => c.word.id === wordId)
    if (word) {
      word.word.isFavorite = isFavorite
    }
  }

  const getCategory = async (id: string) => {
    loading.value = true
    const { data } = await categoryService.getCategory(id)
    if (data.value) {
      setCategory(data.value)
      loading.value = false
    }
  }

  const getCategoryCards = async (id: string) => {
    const { data } = await categoryService.getCategoryCards(id)

    if (data.value) {
      setCategoryCards(data.value)
    }
  }

  return { category, setCategory, cards, setCategoryCards, createCategory, getCategoryTypes, deleteCategory, categoryTypes, getCategory, removeUserFromCategory, getCategoryCards, editWord, setUserCategory, userCategory, changeWordFavorite }
})
